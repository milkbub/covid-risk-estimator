var rootContent = $('#root-content-loader'); 
var isLoading = false; // this is used to prevent too many function calls when a link is clicked several times
var hasJavascript = false;
var dataStore = {};
var isDeviceIOS = false;
var language = localStorage.getItem("language");

// function to load and execute a javascript file
// with the loadAjax function below, one can figure out
// that the loader only gets hidden when the JS is fully run
// if there is JS otherwise a timeout delay works instead
function loadJavascriptFile(path) {
    $.getScript(path).done(function() {
        hideLoader();

        setTimeout(function() {
            rootContent.removeClass('hidden');
            hideLoader();
        }, 300);
    });
}

// loadAjax made for loading a page's important values
// such as title, html content, and javascript file directory
function loadAjax(path, callback) {
    $.ajax({
        url: '/get-ajax-values?url=' + path,
        cache: false
    }).done(function(data) {
        isLoading = false;

        if (data.content) {    
            document.title = data.title;
            rootContent.html(data.content);

            // the hasJavascript variable is used to figure out
            // when the content is shown, it is generally as long as the 
            // corresponding JS file has executed if there is any
            if (data.javascript) {
                hasJavascript = true;
                loadJavascriptFile(data.javascript);
            }
 
            if (!hasJavascript) {
                setTimeout(function() {
                    rootContent.removeClass('hidden');
                    hideLoader();
                }, 300);
            }
        }

        callback();
    });
}

// this is used to go to a specified path via ajax
// and history API
function goTo(path) {
    isLoading = true;
    rootContent.addClass('hidden');
    showLoader();

    loadAjax(path, function() {
        history.pushState({}, document.title, path);
        bindSeamlessLinks();
        language ? setLanguage(language) : setLanguage('english');
    });
}

// seamless links refer to links
// that do not reload the page everytime
function bindSeamlessLinks() {
    $('a').each(function() {
        // jquery click function does not honor
        // the disabled attribute
        // also the off method is to prevent this seamless link function from being applied all the time
        $(this).off('click').on('click', (function(event) {
            event.preventDefault();
            var path = this.attributes.href.value;

            // this is a way to honor the disabled attribute
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

// this is only used under /estimate/ pages
// to make the next button interactive
function allowNextButton() {
    var nextButton = $('#estimate-next');
    nextButton.removeAttr("disabled");
    nextButton.switchClass("text-gray-500", "text-white");
    nextButton.switchClass("bg-gray-600", "bg-charlotte-green");
    nextButton.switchClass("cursor-not-allowed", "cursor-pointer");
}

// this is self-explanatory and so is the other piece below it
// but is mainly used as a hack for the carousel to let it slide
// to the chosen value
function disablePageInteractivity() {
    rootContent.css('pointer-events', 'none');
}

function enablePageInteractivity() {
    rootContent.removeAttr('style');
}

// self-explanatory again
function showLoader() {
    $('#loader-wrapper').removeClass('hidden');
}

function hideLoader() {
    $('#loader-wrapper').addClass('hidden');
}

// this is how we store our answers
// this is written as a function to easily
// change how it works without having to change
// the code in every page
function storeAnswer(key, value) {
    dataStore[key] = value;
}

// this is how we get an answer we stored
function getAnswer(key) {
    return dataStore[key] ? dataStore[key] : null;
}

// self-explanatory
function deleteAnswer(key) {
    delete dataStore[key];
}

function packAnswers() {
    return dataStore;
}

function clearAnswers() {
    dataStore = {};
}

// returns true or false according to whether device is ios
isDeviceIOS = (function(){
    // return true; // for development purposes only
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
})();

// this is triggered when the browser backed/forward button is tapped
window.onpopstate = function(event) {
    var path = document.location.pathname;
    var hash = document.location.hash;

    if (path[0] == '/' && hash.length == 0) {
        goTo(path);
    } 
}


function setLanguage(language) {
    $('.' + language +'-text').each(function() {
        $(this).addClass('is-active');
    });
}

bindSeamlessLinks();
goTo(window.location.pathname); // this is to make the page load the javascript files also loads the right page
