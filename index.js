const fs = require('fs');
const express = require('express');
const pug = require('pug');
const datapoints = require('./data/all.json');
const app = express();

// these values are always important
// and should be adjusted accordingly

// for page routes, /:page
let titles = {
    'home': 'Welcome to ASPIRE',
    'how-to-use': 'How to Use'
}

// for /estimates/:key routes
let estimatesTitle = {
    '1': 'Step 1: Activity Location',
    '2': 'Step 2: Activity Planned',
    '2.1': 'Step 2.1: Activity Level',
    '2.2': 'Step 2.2: Ventilation',
    '2.3': 'Step 2.3: Room Size',
    '3': 'Step 3: Time and People',
    '4': 'Step 4: Masks',
    '5': 'Step 5: Summary',
    'results': 'Your Results'
}

let estimatesPage = {
    '1': 'activity-location',
    '2': 'activity-planned',
    '2.1': 'activity-level',
    '2.2': 'room-ventilation',
    '2.3': 'room-size',
    '3': 'time-and-people',
    '4': 'masks',
    '5': 'summary',
    'results': 'activity-location'
}

// to get static files use route: /static/<path here>
app.use('/static', express.static('static'));

app.use('/data', express.static('data'));

// pug is the template engine in place
app.set('view engine', 'pug');

// this is for the ajax endpoint
// can be called with ?url=<url here>
// and returns a JSON with all those values
app.get('/get-ajax-values', function(request, response) {
    response.setHeader('content-type', 'application/json');
    response.set('Cache-Control', 'no-store');

    let values = { title: null, content: null, javascript: null }

    if (request.query.url) {
        let { url }  = request.query;
        if (url == '/') url = '/home';
        let lastItemInPath = url.substring(url.lastIndexOf('/') + 1);

        // this gets the corresponding title and names of the url if it exists
        let title = lastItemInPath in titles ? titles[lastItemInPath] : null;
        let searchFor = lastItemInPath;
        
        if (lastItemInPath in estimatesPage) {
            title = estimatesTitle[lastItemInPath];
            searchFor = estimatesPage[lastItemInPath];
        }

        values.title = title;

        let jsPath = `/static/js/${searchFor}.js`;
        let pugPath = `./views/content/${searchFor}.pug`;
        
        // asynchronous to prevent blocking when there are multiple
        // clients requesting different stuff
        fs.readFile(pugPath, function(error, data) {
            if (error)  return response.send(JSON.stringify(values));
            
            let content = pug.compile(data.toString('utf8'), {filename: pugPath})({ data: datapoints });
            values.content = content;

            fs.access(`.${jsPath}`, function(error) { 
                values.javascript = error ? null : jsPath;
                response.send(JSON.stringify(values));
            });
            
        });

    } else {
        // obviously there is no url specified for the endpoint here
        response.send(JSON.stringify(values));
    }
    
});

// this handles existing or should-be-existing pages
app.get(['/', '/:page', '/estimate/:key'], function(request, response) {
    // by the default this uses title is titles['home']
    // to figure out the 404, a should be non-existent page the title is the title for home:
    // but the page isn't home itself or there is an existing key meaning estimate/<key
    let { page, key } = request.params;
    if (!page && !key) page = 'home'; // default value hack

    let title = page in titles ? titles[page] : titles['home'];
    title = key in estimatesTitle ? estimatesTitle[key] : title;
    
    if (title == titles['home'] && (page != 'home' || key)) {
        response.render('404');
    } else {
        response.render('index.pug', { title, url: page, data: datapoints }); 
    }
});

// handle all unhandled pages as 404
app.get('*', function(request, response) {
    response.render('404');
});

app.listen(process.env.PORT || 8000, function() {
    console.log('Running');
});

