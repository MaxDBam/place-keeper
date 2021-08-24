'use strict';

function initMap() {
    createPlaces();
    let elMap = document.querySelector('.map');
    const eilatCoords = getEilatCoords();
    let options = {
        center: eilatCoords,
        zoom: 15,
        disableDefaultUI: true
    };
    const map = new google.maps.Map(
        elMap,
        options,
    );
    const geocoder = new google.maps.Geocoder();
    const infoWindow = new google.maps.InfoWindow();
    map.addListener('click', (e) => {
        placeMarkerAndPanTo(e.latLng, map, geocoder, infoWindow);
        onMapClick();
    }, {passive: true});
    const locationButton = document.createElement('button');
    locationButton.innerHTML = '<img class="locate-img" src="./img/location.png"></img>';
    locationButton.classList.add('locate-button');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
    locationButton.addEventListener('click', () => {
        onLocate(map, infoWindow);
    },{passive: true});
    renderPlaces();
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
}

function onSavePlace(street, lat, lng) {
    const elInputName = document.querySelector('input[name="place-name"]');
    const name = elInputName.value;
    const location = {
        lat,
        lng
    };
    if (!street || !location || !name) {
        return;
    } else {
        addPlace(name, street, location);
    }
    document.querySelector('aside').hidden = true;
    renderPlaces();
    elInputName.value = '';
}

function onRemovePlace(placeId) {
    removePlace(placeId);
    renderPlaces();
}

function onLocate(map, infoWindow) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent('Your location');
                infoWindow.open(map);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function geocodeLatLng(location, geocoder, map, infoWindow) {
    let result = {};
    const latLng = location;
    geocoder
        .geocode({ location: latLng }, function (results, status) {
            if (status == 'OK') {
                map.setZoom(11);
                const marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                });
                onMapClick();
                result['lat'] = results[0].geometry.location.lat(); 
                result['lng'] = results[0].geometry.location.lng(); 
                result['street'] = results[0].formatted_address; 
                infoWindow.setContent(results[0].formatted_address);
                infoWindow.open(map, marker);
            } else {
                window.alert("No results found");
            }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));

    document.querySelector('button.save-btn').addEventListener('click', () => {
        onSavePlace(result.street, result.lat, result.lng);
        renderPlaces();
        result = {};
    }, {passive: true});
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
    new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
    geocodeLatLng(latLng, gc, map, infoWindow);
}