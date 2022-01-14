(function() {
    setupNextBackButtons();

    var timeInput = $('#time_input');
    var peopleInput = $('#people_input');
    var unitButtons = $('#hrsBtn, #minBtn');
    var timeUnitAnswer = getAnswer('time-unit');
    var timeValueAnswer = getAnswer('time-value');
    var peopleCountAnswer = getAnswer('people-count');

    if (!getAnswer('activity-planned-code')) {
        $('#estimate-previous').attr('href', '/estimate/2.3');
    }

    function setActiveButton(id) {
        unitButtons.each(function() {
            var button = $(this);
            if (button.attr('id') == id) { 
                button.removeClass('inactive').addClass('active');
                button.removeClass('bg-transparent').addClass('bg-dirty-white');
                button.removeClass('text-gray-400').addClass('text-charlotte-blue');
            } else {
                button.removeClass('active').addClass('inactive');
                button.removeClass('bg-dirty-white').addClass('bg-transparent');
                button.removeClass('text-charlotte-blue').addClass('text-gray-400');
            }
        });
        storeAnswer('time-unit', id == 'minBtn' ? 'minutes' : 'hours');
    }

    function checkIfDone() {
        if (getAnswer('time-unit') && getAnswer('time-value') && getAnswer('people-count')) return true;
    }

    unitButtons.each(function() {
        $(this).click(function() {
            setActiveButton($(this).attr('id'));
            if (checkIfDone()) allowNextButton();
        }.bind(this));
    });    

    timeInput.change(function(event) {
        storeAnswer('time-value', this.val());
        if (checkIfDone()) allowNextButton();
    }.bind(timeInput));

    peopleInput.change(function(event) {
        storeAnswer('people-count', this.val());
        if (checkIfDone()) allowNextButton();
    }.bind(peopleInput));

    if (timeUnitAnswer) {
        setActiveButton(timeUnitAnswer == 'minutes' ? 'minBtn' : 'hrsBtn');
    } else {
        // default answer
        setActiveButton('hrsBtn');
        storeAnswer('time-unit', 'hours'); 
    }
    if (timeValueAnswer) timeInput.val(timeValueAnswer);
    if (peopleCountAnswer) peopleInput.val(peopleCountAnswer);
    if (checkIfDone()) allowNextButton();
})();

