$(document).foundation();

$(function(){
    $('#submit').click(function(){
        $.ajax({
            url:'/create',
            method: 'POST',
            data: getFormData('#submit-form')
        }).done(function(d){
            console.warn(d);
            location.href = '/site';
        }).fail(function(e){
            console.error(e);
        });
    });

    $('#search-btn').click(function(){
        var term = $('input[name=search]').val();
        location.href = '/site/search?q=' + encodeURIComponent(term);
    });

    $('input[name=url]', '#submit-form').blur(function() {
        console.log('out', $(this).val());
        $.ajax({
            url:'/site/describe',
            method: 'GET',
            data:{
                url: $(this).val()
            }
        }).done(function(d){
            console.warn(d);
            if(!d || !d.success) return;
            if(d.value.description){
                $('textarea[name=description]', '#submit-form').text(d.value.description);
            }
            if(d.value.title){
                $('input[name=title]', '#submit-form').val(d.value.description);
            }

            if(d.value.tags){
                if(d.value.tags.length) $('input[name=tags]', '#submit-form').val(d.value.tags.join(','));
                else $('input[name=tags]', '#submit-form').focus();
            }



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
