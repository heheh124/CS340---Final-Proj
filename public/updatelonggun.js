function updateLonggun(id){
    $.ajax({
        url: '/rifles/' + id,
        type: 'PUT',
        data: $('#update-longgun').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};