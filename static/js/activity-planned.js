(function() {
    setupNextBackButtons();
    var presetChoices = $('.presetBtn');
    var currentPresetCode = getAnswer('activity-planned-code');

    function setActiveByCode(code) {
        presetChoices.each(function() {
            if (this.dataset.code == code) {
                $(this).removeClass('bg-dirty-white').addClass('bg-beige');
            } else {
                $(this).addClass('bg-dirty-white').removeClass('bg-beige');
            }
        });
        allowNextButton();
    }

    presetChoices.each(function() {
        $(this).click(function(event) {
            var presetCode = this.dataset.code;

            deleteAnswer('activity-level-name');
            deleteAnswer('activity-level-code');

            deleteAnswer('room-ventilation-name');
            deleteAnswer('room-ventilation-code');

            deleteAnswer('room-width');
            deleteAnswer('room-height');
            deleteAnswer('room-length');

            storeAnswer('activity-planned-name', this.dataset.name);
            storeAnswer('activity-planned-code', presetCode);
            setActiveByCode(presetCode);
        }.bind(this));
    });

    if (currentPresetCode) {
        setActiveByCode(currentPresetCode);
        allowNextButton();
    }
})();
