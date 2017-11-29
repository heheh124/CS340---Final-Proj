function updateHandguns(id){
    $.ajax({
        url: '/handguns/' + id,
        type: 'PUT',
        data: $('#update-handguns').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};