$(document).foundation();

$(function(){
    $('#submit').click(function(){
        $.ajax({
            url:'/create',
            method: 'POST',
            data: getFormData('#submit-form')
        }).done(function(d){
            console.warn(d);
        });
    });
});

function getFormData(selector){
    var $form = $(selector);
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
