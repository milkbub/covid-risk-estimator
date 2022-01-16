(function() {
    setupNextBackButtons();
    allowNextButton();

    var background = $('#background');
    var image = $('#image');
    var name = $('#name');
    var description = $('#description');
    var textColor = $('#text-color');
    var newRiskButton = $('#new-risk');

    $.ajax({
        type: 'POST',
        url: '/post-result',
        data: JSON.stringify( packAnswers() ),
        contentType: 'application/json',
        cache: false
    }).done(function(data) {
        background.removeClass('hidden').addClass(data.code +'_bg');
        textColor.addClass(data.code + '_txt');

        image.attr('src', '/static/images/results/' + data.code + '.svg');

        name.text(data.name);
        description.text(data.description);

    }).fail(function(error) {
        // in case error

    });

    newRiskButton.click(function() {
        clearAnswers();
    });
})();
