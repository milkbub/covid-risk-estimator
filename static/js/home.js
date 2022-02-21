(function() {
  var inputObj = $('input[name="chk[]"]');
  var consentBtn = $('#consent_btn');

  inputObj.click(function() {

    var checkedInputObj = $('input[name="chk[]"]:checked');

    if (checkedInputObj.length == inputObj.length) {
      consentBtn.attr('disabled', false)
    } else {
      if (consentBtn.attr('disabled', false)) {
        consentBtn.attr('disabled', true);
      };
    };
  });

  bindToTopScroll();
})();
