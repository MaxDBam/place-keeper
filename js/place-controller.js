'use strict';

var gMap, geocoder, infoWindow, gMapListener;

function initMap() {
    createPlaces();
    let elMap = document.querySelector('.map');
    const eilatCoords = getEilatCoords();
    let options = {
        center: eilatCoords,
        zoom: 15,
        disableDefaultUI: true
    };
    gMap = new google.maps.Map(
        elMap,
        options,
    );
    geocoder = getGeoCoder();
    infoWindow = getinfoWindow();
    gMapListener = gMap.addListener('click', (e) => {
            placeMarkerAndPanTo(e.latLng, gMap, geocoder, infoWindow);
            onMapClick();
    }, { passive: true });

    const locationButton = document.createElement('button');
    let lBtn = new onLocateUser(locationButton);
    locationButton.index = 1;
    gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
    
    renderPlaces();
    renderMarkers();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : 'Error: Your browser doesn\'t support geolocation.'
    );
    infoWindow.open(map)
}

function onMapClick() {
    document.querySelector('aside').hidden = false;
    document.querySelector('input').focus();
    google.maps.event.removeListener(gMapListener);
}

function onLocateUser(locationButton) {
    locationButton.innerHTML = '<img class="locate-img" src="./img/location.png"></img>';
    locationButton.classList.add('locate-button');
    locationButton.addEventListener('click', () => {
        onLocate(gMap, infoWindow);
    });
}

function onSavePlace(street, lat, lng) {
    const elInputName = document.querySelector('input[name="place-name"]');
    const name = elInputName.value;
    var placeId;
    const location = {
        lat,
        lng
    };
    if (!street || !location || !name) {
        return;
    } else {
        addPlace(name, street, location);
        placeId = getPlaceIdForMarker(location);
        onAddMarker(location, placeId, name);
        setMapOnAll(gMap);
    }
    document.querySelector('aside').hidden = true;
    gMapListener = gMap.addListener('click', (e) => {
            placeMarkerAndPanTo(e.latLng, gMap, geocoder, infoWindow);
            onMapClick();
        });
        
    renderPlaces();
    elInputName.value = '';
}

function getGeoCoder() {
    return new google.maps.Geocoder();
}

function getinfoWindow() {
    return new google.maps.InfoWindow();
}

function onRemovePlace(placeId) {
    var placeIdx = getPlaceIdxForMarker(placeId);
    if (!getMarkersArray().length || placeIdx < 0) {
        removePlace(placeId);
        renderPlaces();
    } else {
        removePlace(placeId);
        onRemoveMarker(placeIdx);
        renderPlaces();
    }
}

function onLocate(map, infoWindow) {;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition, handleLocationError, { maximumAge: 10 });
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
}

function getPosition(position) {
    const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    // infoWindow.setPosition(pos);
    infoWindow.setContent('Your location');
    infoWindow.open(gMap);
    gMap.setCenter(pos);
    gMap.setZoom(15);
}

function geocodeLatLng(location, geocoder, map, infoWindow) {
    var result = {};
    const latLng = location;
    const elSaveBtn = document.querySelector('button.save-btn');
    geocoder
        .geocode({ location: latLng }, function (results, status) {
            if (status == 'OK') {
                map.setZoom(15);
                onMapClick();
                result['lat'] = results[0].geometry.location.lat();
                result['lng'] = results[0].geometry.location.lng();
                result['street'] = results[0].formatted_address;
                infoWindow.setContent(results[0].formatted_address);
                infoWindow.open(map);
            } else {
                window.alert("No results found");
            }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));

    elSaveBtn.addEventListener('click', () => {
        onSavePlace(result.street, result.lat, result.lng);
        renderPlaces();
        result = {};
    }, { passive: true });
    onClickEnter();
}

function onClickEnter() {
    const elSaveBtn = document.querySelector('button.save-btn');
    const elAside = document.querySelector('aside');
    elAside.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            elSaveBtn.click();
    }
});
}

function renderPlaces() {
    let places = getPlaces();
    const elPlaceList = document.querySelector('.places-list');
    let strHTMLs = places.map(place => {
        return `<div class="place">
        <div class="icon-bgc">
        <i class="fas fa-flag"></i>
        </div>
        <div class="place-desc">
        <h2>${place.name}</h2>
        <p>${place.street}</p>
        </div>
        <button class="remove-btn" onclick="onRemovePlace('${place.id}')">X</button>
        </div>`;
    });
    elPlaceList.innerHTML = strHTMLs.join('');
}

function placeMarkerAndPanTo(latLng, map, gc, infoWindow) {
    const marker = new google.maps.Marker({
        position: latLng,
    });
    map.panTo(latLng);
    geocodeLatLng(latLng, gc, map, infoWindow);
}

function onAddMarker(position, id, name) {
    const marker = new google.maps.Marker({ position, id, gMap, title: name });
    addMarker(marker);
}

function setMapOnAll(map) {
    for (let i = 0; i < getMarkersArray().length; i++) {
        getMarkersArray()[i].setMap(map);
    }
}

function renderMarkers() {
    const markers = getPlaces();
    markers.forEach(place => {
        const marker = new google.maps.Marker({
            id: place.id,
            position: {
                lat: place.lat,
                lng: place.lng,
            },
            title: place.name,
            map: gMap
        });
        getMarkersArray().push(marker);
    });
}

function onRemoveMarker(idx) {
    getMarkersArray()[idx].setMap(null);
    removeMarker(idx);
}
