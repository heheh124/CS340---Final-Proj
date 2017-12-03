function deleteAccessory(id){
    $.ajax({
        url: '/accessories/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};