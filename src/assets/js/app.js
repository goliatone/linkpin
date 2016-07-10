$(function(){
    $('#submit-link').click(function(){
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

    $('#submit-note').click(function(e){
        e.preventDefault();
        var $form = $(this).closest('form');
        $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            data: getFormData($form)
        }).done(function(d){
            console.warn(d);
            location.href = location.href;
        }).fail(function(e){
            console.error(e);
        });
    });

    $(document).keyup(function(e){
        var edit = $('#modal-submit-link-form').hasClass('active');
        //s
        if(!edit && e.keyCode === 83){
            $('#search-input').focus();
        }

        //enter inside search
        if($('#search-input:focus') && e.keyCode === 13){
            var term = $('input[name=search]').val();
            location.href = '/site/search?q=' + encodeURIComponent(term);
        }
        //a
        if(e.keyCode === 65){
            $('#modal-submit-link-form').addClass('active');
            $('input[name=url]').focus();
        }
        //esc or c
        if(e.keyCode === 27 /*|| e.keyCode === 67*/){
            $('#modal-submit-link-form').removeClass('active');
        }
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

//////////////////////////////
    $('a[name=modal]').click(function(e) {
        //Cancel the link behavior
        e.preventDefault();
        var id = $(this).data('target');
        $('#'+id).addClass('active');
    });

    //if close button is clicked
    $('.close-modal').click(function (e) {
        //Cancel the link behavior
        e.preventDefault();
        $(this).closest('.modal').removeClass('active');
    });

    //if mask is clicked
    $('.js-toast-btn').click(function () {
        $(this).closest('.toast').fadeOut();
    });
    $('.js-chip-btn').click(function () {
        $(this).closest('.chip-sm').fadeOut();
    });
});



function getFormData(selector){
    var $form = typeof selector === 'string' ? $(selector) : selector;
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
