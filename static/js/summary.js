(function() {
    setupNextBackButtons();

    var summaryContainer = $('.summary-container');
    var summaryItem = $('.summary-item');

    // time total in minutes
    var multiplier = getAnswer('time-unit') == 'hours' ? 60 : 1;
    var totalTime = parseInt(getAnswer('time-value')) * multiplier + " minutes";
    storeAnswer('time-total', totalTime);

    var userData = packAnswers();
    var showFields = {
        // format is key of the field that was set using storeAnswer, then array of label, href, and optional suffix
        'region-name': ['Location', '/estimate/1'],
        'activity-planned-name': ['Activity', '/estimate/2'],
        'activity-level-name': ['Intensity', '/estimate/2.1'],
        'room-ventilation-name': ['Ventilation', '/estimate/2.2'],
        'room-length': ['Room Length', '/estimate/2.3', 'meters'],
        'room-width': ['Room Width', '/estimate/2.3', 'meters'],
        'room-height': ['Room Height', '/estimate/2.3', 'meters'],
        'people-count': ['Number of People', '/estimate/3'],
        'time-total': ['Duration', '/estimate/3'],
        'mask-name': ['Mask Type', '/estimate/4'],
        'mask-percentage': ['Mask Percentage', '/estimate/4']
    }
    
    function createSummaryItem(label, value, href) {
        var item = summaryItem.clone().removeClass('hidden');
        item.find('.summary-key').text(label)
        item.find('.summary-value').text(value)
        item.find('.summary-link').attr('href', href);
        return item;
    }

    var keys = Object.keys(showFields);
    for (var index = 0; index < keys.length; ++index) {
        var currentKey = keys[index];
        var currentField = showFields[currentKey];

        var label = currentField[0];
        var suffix = currentField.hasOwnProperty(2) ? currentField[2] : '';
        var value = userData[currentKey];
        var href = currentField[1];

        if (currentKey == 'activity-planned-name' && !value) value = 'Custom';
        if (value) summaryContainer.append(createSummaryItem(label, value + ' ' + suffix, href));
    }
    bindSeamlessLinks();
    allowNextButton();
})();
