(function() {
    setupNextBackButtons();

    var inputFields = $('#room_width, #room_height, #room_length');
    var roomWidthAnswer = getAnswer('room-width');
    var roomHeightAnswer = getAnswer('room-height');
    var roomLengthAnswer = getAnswer('room-length');

    function checkInputs() {
        var isValid = true;
        inputFields.each(function() {
            if ($(this).val().length == 0) isValid = false;
        });
        return isValid;
    }

    inputFields.each(function() {
        $(this).change(function(event) {
            var keyForStorage = 'room-' + this.id.split('_')[1]; // room-width, room-height, or room-length;
            storeAnswer(keyForStorage, this.value);
            if (checkInputs()) allowNextButton();
        }.bind(this));
    });
    
    if (roomWidthAnswer) $('#room_width').val(roomWidthAnswer);
    if (roomHeightAnswer) $('#room_height').val(roomHeightAnswer);
    if (roomLengthAnswer) $('#room_length').val(roomLengthAnswer);
    if (checkInputs()) allowNextButton();
})();

