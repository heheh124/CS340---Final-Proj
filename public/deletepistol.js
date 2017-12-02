function deletePistol(id){
    $.ajax({
        url: '/handguns/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};