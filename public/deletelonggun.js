function deleteLonggun(id){
    $.ajax({
        url: '/rifles/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};