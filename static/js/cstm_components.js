(function() {

    var to_top_btn = $('#to_top_btn');

    // detect scroll distance for toggling to_top_button
    $(window).scroll(function() {
        if ($(window).scrollTop() > 20) {
            to_top_btn.addClass('show');
        } else {
            to_top_btn.removeClass('show');
        };
    });

    to_top_btn.on('click', function(e) {
        e.preventDefault();
        back_to_top();
    });

})();

function back_to_top() {
    $('html, body').animate({scrollTop:0}, '300');
};
