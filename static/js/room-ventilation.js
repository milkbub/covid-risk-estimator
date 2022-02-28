(function() {
    setupNextBackButtons();

    var ventilationButtons = $('.presetBtn');
    var currentVentilationCode = getAnswer('room-ventilation-code');   

    function setActiveByCode(code) {
        ventilationButtons.each(function() {
            if (this.dataset.code == code) {
                $(this).removeClass('bg-dirty-white').addClass('bg-beige');
            } else {
                $(this).addClass('bg-dirty-white').removeClass('bg-beige');
            }
        });
    }

    ventilationButtons.each(function() {
        $(this).click(function(event) {
            var ventilationCode = this.dataset.code;
            storeAnswer('room-ventilation-name', this.dataset.name);
            storeAnswer('room-ventilation-code', ventilationCode);
            setActiveByCode(ventilationCode);
            allowNextButton();
        }.bind(this));
    });

    if (currentVentilationCode) {
        setActiveByCode(currentVentilationCode);
        allowNextButton();
    }

})();

