var rootContent = $('#root-content-loader'); 
var isLoading = false; // this is used to prevent too many function calls when a link is clicked several times
var dataStore = {};

function loadJavascriptFile(path) {
    $.getScript(path);
}

function loadAjax(path, callback) {
    $.ajax({
        url: '/get-ajax-values?url=' + path,
        cache: false
    }).done(function(data) {
        if (data.content) {
            isLoading = false;
            rootContent.html(data.content);
            document.title = data.title;
            if (data.javascript) loadJavascriptFile(data.javascript);

            setTimeout(function() {
                rootContent.removeClass('hidden');
                hideLoader();
            }, 300);
        }
        callback();
    });
}

function goTo(path) {
    // show loader here
    isLoading = true;
    rootContent.addClass('hidden');
    showLoader();

    loadAjax(path, function() {
        history.pushState({}, document.title, path);
        bindSeamlessLinks();
    });
}

//
//
function bindSeamlessLinks() {
    $('a').each(function() {
        // jquery click function does not honor
        // the disabled attribute
        // also the off method is to prevent this seamless link function from being applied all the time
        $(this).off('click').on('click', (function(event) {
            event.preventDefault(); 
            var path = this.attributes.href.value;

            // this is a way to do honor the disabled attribute
            if ( this.hasAttribute('disabled') ) return;

            if (path[0] == '/') {
                if (!isLoading) goTo(path);
            } else if (path[0] == '#') {
                window.location = path;
            } else {
                window.open(path, '_blank').focus();
            }
        }.bind(this) ));
    });
}

// these following functions are for estimate pages, aka the test
// call this only on estimate pages
function setupNextBackButtons() {
    var nextButton = $('#estimate-next');
    var previousButton = $('#estimate-previous');
    var indexLinks = ['1', '2', '3', '4', '5', 'result'];

    var pathname = document.location.pathname.substring(1);
    var numberInURL = pathname.split('/')[1];

    var index = indexLinks.indexOf(numberInURL);
    
    var isSubsetIndex = false;
    var subsetIndexLinks = ['2.1', '2.2', '2.3'];
    if (index == -1) {
        index = subsetIndexLinks.indexOf(numberInURL);
        isSubsetIndex = true;
    }

    var nextPath;
    var previousPath;

    if (isSubsetIndex) {
        nextPath = index < subsetIndexLinks.length - 1 ? '/estimate/' + subsetIndexLinks[index + 1] : '/estimate/3';
        previousPath = index > 0 ? '/estimate/' + subsetIndexLinks[index - 1] : '/estimate/2';
    } else {
        nextPath = index < indexLinks.length - 1 ? '/estimate/' + indexLinks[index + 1] : '/';
        previousPath = index > 0 ? '/estimate/' + indexLinks[index - 1] : '/';
    }

    nextButton.attr('href', nextPath);
    previousButton.attr('href', previousPath);
}

function allowNextButton() {
    var nextButton = $('#estimate-next');
    nextButton.removeAttr("disabled");
    nextButton.switchClass("text-gray-500", "text-white");
    nextButton.switchClass("bg-gray-600", "bg-charlotte-green");
    nextButton.switchClass("cursor-not-allowed", "cursor-pointer");
}

function disablePageInteractivity() {
    rootContent.css('pointer-events', 'none');
}

function enablePageInteractivity() {
    rootContent.removeAttr('style');
}

function showLoader() {
    $('#loader-wrapper').removeClass('hidden');
}

function hideLoader() {
    $('#loader-wrapper').addClass('hidden');
}

function storeAnswer(key, value) {
    dataStore[key] = value;
}

function getAnswer(key) {
    return dataStore[key] ? dataStore[key] : null;
}

function deleteAnswer(key) {
    delete dataStore[key];
}

function packAnswers() {
    return dataStore;
}

function clearAnswers() {
    dataStore = {};
}

window.onpopstate = function(event) {
    var path = document.location.pathname;
    var hash = document.location.hash;

    if (path[0] == '/' && hash.length == 0) {
        goTo(path);
    } 
}

bindSeamlessLinks();
goTo(window.location.pathname); // this is to make the page load the javascript files also loads the right page
