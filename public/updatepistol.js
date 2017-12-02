function updatePistol(id){
    $.ajax({
        url: '/handguns/' + id,
        type: 'PUT',
        data: $('#update-pistol').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};