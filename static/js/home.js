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

  $(".collapsible").on('click', function() {
      var content = $(this).children('.collapse-content')
      if (content.hasClass('content-hide')) {
          content.removeClass('content-hide');
          content.addClass('content-show');
      } else {
          content.removeClass('content-show');
          content.addClass('content-hide');
      };
  });

})();
