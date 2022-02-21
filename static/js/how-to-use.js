(function() {

  var extraBtn = $('#extraDivBtn');
  var extraDiv = $('#extraDiv');

  extraBtn.click(function() {

    extraDiv.toggleClass('closed open')
    extraDiv.toggleClass('h-0 h-full')
    extraDiv.children().toggleClass('h-0 h-full')

  });

  bindToTopScroll();
})();
