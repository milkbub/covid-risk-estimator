(function() {
    setupNextBackButtons();
    var presetChoices = $('.presetBtn');

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
            deleteAnswer('activity-level-code');
            storeAnswer('activity-planned-preset', presetCode);
            setActiveByCode(presetCode);
        }.bind(this));
    });

    var currentPresetCode = getAnswer('activity-planned-preset');
    if (currentPresetCode) {
        setActiveByCode(currentPresetCode);
        allowNextButton();
    }
})();
