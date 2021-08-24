'use strict';

const gLat = 29.5577;
const gLng = 34.9519;

var gPlaces;
const KEY = 'places';

function getEilatCoords() {
    const eilatCoords = {
        lat: gLat,
        lng: gLng
    };
    return eilatCoords;
}

function createPlaces() {
    let places = loadFromStorage(KEY);
    if (!places || !places.length) {
        places = [];
    } 
    gPlaces = places;
    savePlacesToStorage();
}

function addPlace(nameP, streetP, locationP) {
    var place = createPlace(nameP, streetP, locationP);
    gPlaces.push(place);
    savePlacesToStorage();
}

function createPlace(name, street, location) {
    return {
        id: makeId(),
        name,
        street,
        lat: location.lat,
        lng: location.lng
    };
}

function removePlace(placeId) {
    const placeIdx = gPlaces.findIndex(place => placeId === place.id);
    gPlaces.splice(placeIdx, 1);
    savePlacesToStorage();
}

function savePlacesToStorage() {
    saveToStorage(KEY, gPlaces);
}

function getPlaces() {
    return gPlaces;
}