 // this is our idb script


 (function () {
    'use strict';
    const currencyconverterapiURL = `https://free.currencyconverterapi.com/api/v5/currencies`
    const idbPromise = _openDatabase();
    addCurrencyItemtoList();
    document.getElementById(`convert`).addEventListener(`click`, () => {
        
        $(`#val`).html(' ')
        let to = $(`#to`).find(`:selected`).val()
        let fr = $(`#fr`).find(`:selected`).val();
        const mulplier = $(`#multipler`).val() || 1.0;
        console.log('val', mulplier);
        console.log('')
        if(navigator.onLine){
             storeConvertedCurrency(to,fr).then(val=>{
                const conversion = Object.values(Object.values(val)[1])[0].val;
                 $(`#val`).html(mulplier * parseFloat(conversion).toFixed(4))
             });
         }
         else{
            idbPromise.then(db=>{
                const tx  = db.transaction('conversion');
                const offlineObjectStore = tx.objectStore('conversion');
                const currencyConversionIndex = offlineObjectStore.index(`val`);
                currencyConversionIndex.getAll().then(results =>{
                        for(const frto of results){
                            if(frto.id.includes(`${fr}_${to}`)){
                              $(`#val`).html(parseFloat(mulplier * frto.val).toFixed(4))
                            }
                            // currencies are swapped now - just perform an inverse to get the results
                            else if((frto.fr ===`${to}` & frto.to ==`${fr}`)){
                                $(`#val`).html(parseFloat(mulplier*(1/frto.val)).toFixed(4))
                            }
                        } 
                })
            })   
         }
        
    })
    
    if(navigator.onLine){
        fetch(currencyconverterapiURL).then(response => {
            response.json().then(data => {
               idbPromise.then(db => {
                   const currencies = data.results;
                   console.log(`fetching the data from the api ${currencies}`)
                   // create currency transaction
                   const tx = db.transaction(`currencies`, `readwrite`);
                   // currency objectstore
                   const store = tx.objectStore(`currencies`);
                   for (const currency in currencies) {
                   // save all the data
                   store.put(currencies[currency])
               }
                   return tx.complete
               }).catch(error=>console.log('Something went wrong', error))
           })
        })
    }
    // The following function stores all the conversions that we have made previously
    function storeConvertedCurrency(to, fr) {
        // call the function that converstes the results
        const BASE_API_URL = `https://free.currencyconverterapi.com/api/v5/convert?q=${fr}_${to}`
        const conversionPromise = fetch(BASE_API_URL).then(response => response.json().then(data => {
            return data
        }))
        const storedValPromise = conversionPromise.then(data => {
            idbPromise.then(db => {
                // access the database
                const tx = db.transaction(`conversion`, `readwrite`);
                const store = tx.objectStore('conversion');
                // save api results on the idbstore for offline use.
                const apiConvetedCurrency = data.results;
                store.put(Object.entries(apiConvetedCurrency)[0][1]);
                return tx.complete;
            }).catch(error => console.log('Something went wrong could not save api results', error))
        })
        return conversionPromise;
    }
     
    function _openDatabase() {
        if (!navigator.serviceWorker) {
             return Promise.resconversionolve();
        }
        return idb.open('currencydb', 2, upgradeDb => {
            const store = upgradeDb.createObjectStore('currencies', {keyPath: 'id' });
            const conversionStore = upgradeDb.createObjectStore('conversion', {keyPath: 'id'})
            const curreyIndex = store.createIndex('currency','id');
            const currencyConversionIndex = conversionStore.createIndex('val','id');
        });
     }
    function addCurrencyItemtoList(){
        idbPromise.then(db=>{
            const tx  = db.transaction('currencies');
            const currencyIndexStore = tx.objectStore('currencies');
            const curreyIndex = currencyIndexStore.index('currency');
            // read all the data out
            return curreyIndex.getAll();
         }).then(currencies =>{
            $(document).ready(()=>{
                let currencyItems =``;
                for(const currency of currencies){
                    currencyItems+=`<option value=${currency.id}>${currency.id}</option>`;
                }
                 // add items to the dropdownlist
                $(`#fr`).html(currencyItems);
                $('#to').html(currencyItems);
            });
        });
    }
    function defaultInputValue(mulplier =1){
        return mulplier = mulplier || 1
    }
    function getValfromIndexPromiseDB(){
        const _getvalPromise = idbPromise.then(db=>{
            const tx = db.transaction(`conversion`);
            const currencyObjectStore = tx.objectStore(`conversion`);
            const currencyConversionIndex = currencyObjectStore.index(`val`);
            return currencyConversionIndex.getAll();
        })
        return _getvalPromise;
    }  
})();