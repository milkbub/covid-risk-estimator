function _diseasePrevalence(cases, population) {
    return cases/population;
}

function _quantaAverage(netEmission, lossRate, roomVolume, eventDuration) {
    return (netEmission / lossRate) / (roomVolume * (1 / lossRate / eventDuration) * (1-Math.exp(-lossRate * eventDuration)) );
}

function _netEmission(quantaExhalationRate, exhalationMaskEfficiency, peopleWithMask, infectivePeople) {
    return quantaExhalationRate * (1 - exhalationMaskEfficiency * peopleWithMask) * infectivePeople;
}

function _ventilationRate(occupantDensity, floorArea, peopleOutdoorRate, areaOutdoorRate) {
    return (occupantDensity * (floorArea/100)) * peopleOutdoorRate + floorArea * areaOutdoorRate;
}

function _outsideVentilation(ventilationRate, roomVolume) {
    return ventilationRate * 3600 * (0.001/roomVolume);
}

function _lossRate(outsideVentilation, decayRate, virusDeposition, controlMeasure) {
    return outsideVentilation + decayRate + virusDeposition + controlMeasure;
}

function _quantaInhaled(quantaAverage, breathingRate, eventDuration, inhalationMaskEfficiency, peopleWithMask) {
    return quantaAverage * breathingRate * eventDuration * (1 - inhalationMaskEfficiency * peopleWithMask);
}

function _susceptiblePeople(numberOfPeople, infectivePeople, fractionImmune) {
    return (numberOfPeople - infectivePeople) * (1 - fractionImmune);
}

/* 
 * areaOutdoorRate, 
 * breathingRate, 
 * cases, 
 * controlMeasure, 
 * decayRate, 
 * eventDuration, 
 * exhalationMaskEfficiency, 
 * floorArea, 
 * fractionImmune, 
 * infectivePeople, 
 * inhalationMaskEfficiency, 
 * numberOfPeople, 
 * occupantDensity, 
 * peopleOutdoorRate, 
 * peopleWithMask, 
 * population, 
 * quantaExhalationRate, 
 * roomVolume, 
 * virusDeposition
 */
function probabilityInfection(areaOutdoorRate, breathingRate, cases, controlMeasure, decayRate, eventDuration, exhalationMaskEfficiency, floorArea, fractionImmune, infectivePeople, inhalationMaskEfficiency, numberOfPeople, occupantDensity, peopleOutdoorRate, peopleWithMask, population, quantaExhalationRate, roomVolume, virusDeposition) {
    
    let netEmission = _netEmission(quantaExhalationRate, exhalationMaskEfficiency, peopleWithMask, infectivePeople);
    let ventilationRate = _ventilationRate(occupantDensity, floorArea, peopleOutdoorRate, areaOutdoorRate);
    let outsideVentilation = _outsideVentilation(ventilationRate, roomVolume);
    let lossRate = _lossRate(outsideVentilation, decayRate, virusDeposition, controlMeasure);
    let quantaAverage = _quantaAverage(netEmission, lossRate, roomVolume, eventDuration);

    let diseasePrevalence = _diseasePrevalence(cases, population);
    let quantaInhaled = _quantaInhaled(quantaAverage, breathingRate, eventDuration, inhalationMaskEfficiency, peopleWithMask);
    let susceptiblePeople = _susceptiblePeople(numberOfPeople, infectivePeople, fractionImmune);

    return 1 - ( 1 - diseasePrevalence * Math.pow(Math.exp(quantaInhaled), susceptiblePeople) );
}

module.exports = { probabilityInfection }
