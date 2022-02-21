const datapoints = require('./data/all.js');

/* sample usage:
 * findByProperty("activityLocation", "Region Code", "NCR")
 * should return
 * {
 *  "Region Name":"National Capital Region",
 *  "Population":13484462,
 *  "Cases":861212,
 *  "Code":" NCR"
 * }
 *
 * and if entry doesn't exist, should return null
 */

function findByProperty(arrayName, entryKey, entryValue) {
    let entries = datapoints[arrayName];
    let result = null;
    if (!entries) return null;

    for (let index = 0; index < entries.length; ++index) {
        let currentEntry = entries[index];
        let currentEntryValue = currentEntry[entryKey];
        if (currentEntryValue && currentEntryValue == entryValue) {
            result = currentEntry;
            break;
        }
    }
    return result;
}

function findByCondition(arrayName, conditionCallback) {
    let entries = datapoints[arrayName];
    let result = null;
    if (!entries) return null;

    for (let index = 0; index < entries.length; ++index) {
        let currentEntry = entries[index];
        if (conditionCallback(currentEntry)) {
            result = currentEntry;
            break;
        }
    }
    return result;
}

module.exports = { findByProperty, findByCondition }
