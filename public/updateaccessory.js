function updateAccessory(id){
    $.ajax({
        url: '/accessories/' + id,
        type: 'PUT',
        data: $('#update-accessory').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};