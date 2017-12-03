function deleteRound(id){
    $.ajax({
        url: '/ammunition/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};