// environment file support
const dotenv = require('dotenv');
dotenv.config();

// native node modules
const fs = require('fs');

// external modules
const express = require('express');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const pug = require('pug');

const { MongoClient } = require('mongodb');

const datapoints = require('./data/all.json');
const { findByProperty, findByCondition } = require('./datapoint-utility.js');
const { probabilityInfection } = require('./estimator-math.js');
const app = express();

// these values are always important
// and should be adjusted accordingly
let port = process.env.PORT || 8000;
let logServerComputation = (process.env.LOG_SERVER_COMPUTATION === 'true') || false;
let atlasURL;

// this sets the URL for the Atlas Database
if (process.env.CONNECT_TO_ATLAS === 'true') {
    atlasURL = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_CLUSTER_URL}/${process.env.ATLAS_DB_NAME}?retryWrites=true&w=majority`;
}

// use this to connect to atlas database obviously
async function connectToAtlas(url) {
    let mongoClient = new MongoClient(url);
    try {
        await mongoClient.connect();
        return mongoClient;
    } catch(error) {
        console.error(error);
    }
}

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
    'result': 'Your Results'
}

// the key refers to the page number in /estimates/:key
// while the value refers to the pug file inside the views directory
let estimatesPage = {
    '1': 'activity-location',
    '2': 'activity-planned',
    '2.1': 'activity-level',
    '2.2': 'room-ventilation',
    '2.3': 'room-size',
    '3': 'time-and-people',
    '4': 'masks',
    '5': 'summary',
    'result': 'result'
}

// to get static files use route: /static/<path here>
app.use('/static', express.static('static'));
app.use('/data', express.static('data'));

// this is to retrieve the POST body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// user agent middleware for device info
app.use(useragent.express());

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
                response.json(values);
            });
            
        });

    } else {
        // obviously there is no url specified for the endpoint here
        response.json(values);
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

/* sample POST request bodies:
 *
 * - when chosen from preset
 * {
 *  'region-name': 'Region 3: Central Luzon',
 *  'region-code': 'R3',
 *  'activity-planned-name': 'Staying in a hotel',
 *  'activity-planned-code': 'SH',
 *  'time-unit': 'hours',
 *  'time-value': '1',
 *  'people-count': '2',
 *  'mask-percentage': '50%',
 *  'mask-name': 'Face shield w/o mask',
 *  'mask-code': 'FSM',
 *  'time-total': '60 minutes'
 * }
 *
 * - when custom activity instead of preset
 * {
 *  'region-name': 'Region 3: Central Luzon',
 *  'region-code': 'R3',
 *  'activity-level-name': 'Mostly Standing',
 *  'activity-level-code': 'MS LS',
 *  'room-ventilation-name': 'Recreational',
 *  'room-ventilation-code': 'G',
 *  'room-height': '1',
 *  'room-length': '3',
 *  'room-width': '5',
 *  'time-unit': 'hours',
 *  'time-value': '1',
 *  'people-count': '2',
 *  'mask-percentage': '67%',
 *  'mask-name': 'Cloth mask',
 *  'mask-code': 'CM',
 *  'time-total': '60 minutes'
 * }
 */

// just used on validation
function isItNumber(string) {
    return !isNaN(parseFloat(string));
}

// this is used on the POST request body
// in order to validate it
function validateFields(object) {
    if (!findByProperty('activityLocation', 'Code', object['region-code']) ) return false;
    
    if (!findByProperty('activityPlanned', 'Code', object['activity-planned-code']) ) {
        let customActivityLevelCode = object['activity-level-code'];
        let [activityLevel, activityLevelClass] = customActivityLevelCode.split(' ');
        if (!findByProperty('activityLevels', 'Code', activityLevel) ||
            ['OB', 'S', 'LS'].indexOf(activityLevelClass) == -1 ||
            !findByProperty('ventilationRates', 'Code', object['room-ventilation-code']) ||
            !isItNumber(object['room-width']) || !isItNumber(object['room-height']) || !isItNumber(object['room-length']) ) {
                return false;
        }
    }
    
    if (!isItNumber(object['time-value']) || !isItNumber(object['people-count']) || !isItNumber(object['mask-percentage']) ) return false;
    if (!findByProperty('maskTypes', 'Code', object['mask-code'])) return false

    return true;
}

// this triggers server-side computation if the client sent a complete and valid body
app.post('/post-result', async function(request, response) {
    response.setHeader('content-type', 'application/json');
    response.set('Cache-Control', 'no-store');
    let { body } = request; 

    // in case the user somehow sends invalid values
    if (!validateFields(body)) return response.status(400).json({ error: 'Invalid form fields' });

    let isCustom = !body['activity-planned-code'];

    // these variables are ordered alphabetically
    // can be computed directly from body through datapoints
    let areaOutdoorRate;
    let breathingRate;
    let cases;

    // default values
    let controlMeasure = 0;
    let decayRate = 0.62;

    // can be computed directly from body
    let eventDuration = parseInt(body['time-value']) * (body['time-unit'] == 'hours' ? 60 : 1);
    
    let exhalationMaskEfficiency;
    let floorArea;

    // default value
    let fractionImmune = 0;

    // can be computed directly from body through datapoints
    let numberOfPeople = parseInt(body['people-count']);
    let peopleWithMask = numberOfPeople * (parseFloat(body['mask-percentage']) / 100);

    // defined from code below
    let inhalationMaskEfficiency;
    let infectivePeople = 1;
    let peopleOutdoorRate;
    let population;
    let quantaExhalationRate;
    let roomHeight;
    let roomVolume;
    let occupantDensity; 

    // default value
    let virusDeposition = 0.3;

    // this is just es6 destructuring
    ({ 'Population': population, 'Cases': cases } = findByProperty('activityLocation', 'Code', body['region-code']));

    ({ 
        'InhalationMaskEfficiency': inhalationMaskEfficiency, 
        'ExhalationMaskEfficiency': exhalationMaskEfficiency 
    } = findByProperty('maskTypes', 'Code', body['mask-code']));

    if (!isCustom) {
         ({
             'Area Outdoor Air Rate': areaOutdoorRate, 
             'People Outdoor Air Rate' : peopleOutdoorRate, 
             'Occupant Density' : occupantDensity
         } = findByProperty('ventilationRates', 'Code', body['activity-planned-code']));
        
        ({
            'Floor Area': floorArea,
            'Room Height': roomHeight
        } = findByProperty('activityPlanned', 'Code', body['activity-planned-code']));

        let presetActivityLevel = findByProperty('activityPlanned', 'Code', body['activity-planned-code'])['Activity Level'];
        ({ 'Oral breathing': breathingRate, 'QuantaExhalationRate': quantaExhalationRate } = findByProperty('activityLevels', 'Name', presetActivityLevel));

        roomVolume = parseFloat(floorArea) * parseFloat(roomHeight);
    } else {
        ({
             'Area Outdoor Air Rate': areaOutdoorRate, 
             'People Outdoor Air Rate' : peopleOutdoorRate, 
             'Occupant Density' : occupantDensity
         } = findByProperty('ventilationRates', 'Code', body['room-ventilation-code']));

        let activityLevelClassKeys = { 'OB': 'Oral breathing', 'S': 'Speaking', 'LS': 'Loudly speaking' };
        let [activityLevel, activityLevelClass] = body['activity-level-code'].split(' ');
        
        let activityLevelEntry = findByProperty('activityLevels', 'Code', activityLevel);
        breathingRate = activityLevelEntry[activityLevelClassKeys[activityLevelClass]];
        quantaExhalationRate = activityLevelEntry['QuantaExhalationRate'];

        floorArea = parseFloat(body['room-width']) * parseFloat(body['room-length']);
        roomVolume = floorArea * parseFloat(body['room-height']);
    }

    // uncomment for easy logging
    // console.log({areaOutdoorRate, breathingRate, cases, controlMeasure, decayRate, eventDuration, exhalationMaskEfficiency, floorArea, fractionImmune, infectivePeople, inhalationMaskEfficiency, numberOfPeople, occupantDensity, peopleOutdoorRate, peopleWithMask, population, quantaExhalationRate, roomVolume, virusDeposition});      
    let probabilityInfectionValue = probabilityInfection(areaOutdoorRate, breathingRate, cases, controlMeasure, decayRate, eventDuration, exhalationMaskEfficiency, floorArea, fractionImmune, infectivePeople, inhalationMaskEfficiency, numberOfPeople, occupantDensity, peopleOutdoorRate, peopleWithMask, population, quantaExhalationRate, roomVolume, virusDeposition);
    let clampedProbabilityInfectionValue = Math.min(Math.max(probabilityInfectionValue, 0), 1); // limit probability infection value from 0 to 1

    // this tries to find the result according to their ranges
    let result = findByCondition('results', function(entry) {
        if (clampedProbabilityInfectionValue >= entry['Lower value'] && clampedProbabilityInfectionValue <= entry['Upper value']) return true;
        return false;
    });

    // send these values to the client
    response.json({ 
                    name: result['Name'], 
                    description: result['Desc'], 
                    code: result['Code'], 
                    probabilityInfectionValue,
                    clampedProbabilityInfectionValue
                  });

    // extra code
    let log = { userInput: null, computation: null, userAgent: null, createdAt: null }

    log.userInput = body;
    log.createdAt = new Date().toUTCString();
    log.userAgent = request.useragent;

    // x: wow this is so damn long 
    // y: that's what she said
    log.computation = { areaOutdoorRate, breathingRate, cases, controlMeasure, decayRate, eventDuration, exhalationMaskEfficiency, floorArea, fractionImmune, infectivePeople, inhalationMaskEfficiency, numberOfPeople, occupantDensity, peopleOutdoorRate, peopleWithMask, population, quantaExhalationRate, roomVolume, virusDeposition, probabilityInfectionValue, clampedProbabilityInfectionValue };
    if (logServerComputation) console.log(log);

    if (atlasURL) {
        let client;
        try {
            client = await connectToAtlas(atlasURL);
            let collection = await client.db(process.env.ATLAS_DB_NAME).collection('results');
            await collection.insertOne(log);
        } catch(error) {
            console.error(error);
        } finally {
            await client.close();
        }
    }

});

// handle all unhandled pages as 404
app.get('*', function(request, response) {
    response.render('404');
});

app.listen(port, function() {
    console.log(`Server now running at PORT: ${port}`);
});

