$(document).ready(function() {

    var timeUnit = $('#id_t_unit')
    var minBtn = $('#minBtn')
    var hrsBtn = $('#hrsBtn')

    var form = $('#TimeAndPeopleForm')
    var formSubmitBtn = $('#submit_btn')

    var timeField = $('#id_time')
    var peopleField = $('#id_people')

    var timeInput = $('#time_input')
    var peopleInput = $('#people_input')

    timeUnit.val('hours');

    hrsBtn.click( function() {
        switchBtnState($(this), minBtn);
        timeUnit.val($(this).val());
    });

    minBtn.click( function() {
        switchBtnState($(this), hrsBtn);
        timeUnit.val($(this).val());
    });

    $(":input").on('edit change', function() {
      timeField.val(timeInput.val())
      peopleField.val(peopleInput.val())

      if (timeField.val() && peopleField.val()) {
        toggleNextButton($("#submit_btn"))
      };
    });

    formSubmitBtn.click(function() {

        form.submit()

    });
});

function switchBtnState(btn1, btn2) {

    if (btn1.hasClass('inactive')) {
            activateBtn(btn1);
            deactivateBtn(btn2);
        };

    function activateBtn(inactiveBtn) {
        inactiveBtn.switchClass('inactive', 'active')
        inactiveBtn.switchClass('bg-transparent', 'bg-dirty-white')
        inactiveBtn.switchClass('text-gray-400', 'text-charlotte-blue')
    };

    function deactivateBtn(activeBtn) {
        activeBtn.switchClass('active', 'inactive')
        activeBtn.switchClass('bg-dirty-white', 'bg-transparent')
        activeBtn.switchClass('text-charlotte-blue','text-gray-400')
    };

};

function updateFormField(input, formField) {
    formField.val(input.val())
};
