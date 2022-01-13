(function() {
    setupNextBackButtons();

    var ventilationButtons = $('.presetBtn');
    
    function setActiveByCode(code) {
        ventilationButtons.each(function() {
            if (this.dataset.code == code) {
                $(this).removeClass('bg-dirty-white').addClass('bg-beige');
            } else {
                $(this).addClass('bg-dirty-white').removeClass('bg-beige');
            }
        });
        allowNextButton();
    }

    ventilationButtons.each(function() {
        $(this).click(function(event) {
            var ventilationCode = this.dataset.code;
            storeAnswer('room-ventilation-code', ventilationCode);
            setActiveByCode(ventilationCode);
        }.bind(this));
    });

    var currentVentilationCode = getAnswer('room-ventilation-code');
    if (currentVentilationCode) {
        setActiveByCode(currentVentilationCode);
        allowNextButton();
    }

})();

