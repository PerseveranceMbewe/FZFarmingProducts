(function(){
    
    document.getElementById(`convert`).addEventListener(`click`,()=>{
        let to  = $(`#to`).find(`:selected`).val()
        let fr =  $(`#fr`).find(`:selected`).val();
        console.log('getting data from the dropdownlist'); 
    })
})()

