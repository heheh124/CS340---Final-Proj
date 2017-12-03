function updateRound(id){
    $.ajax({
        url: '/ammunition/' + id,
        type: 'PUT',
        data: $('#update-round').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};