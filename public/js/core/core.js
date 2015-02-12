$(document).ready(function(){
    // TODO: merge code
});

function loadModule(elm, module) {
    $('#navbar-main a').removeClass("active-module");
    $(elm).addClass("active-module");
    $(this).addClass('active-link');
    $.ajax({ url: "/module/" + module })
        .done(function( data ) {
            $('#main-content-container').html(data);
        });
}

