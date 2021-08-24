'use strict';

var gUserPrefs;
const KEY = 'userData';

function getColors() {
    var colors = loadFromStorage(KEY);
    if (!colors || !colors.length) {
        colors = [];
        const bgcColor = 'white';
        const textColor = 'black';
        const birthDate = '';
        colors.push({
            bgcColor,
            textColor,
            birthDate
        });
    }
    gUserPrefs = colors;
    return gUserPrefs;
}

function savePrefs(bgcColor, textColor, birthDate) {
    gUserPrefs = [{
        bgcColor,
        textColor,
        birthDate: randomForecast()[getRandomIntInclusive(0, 2)]
    }];
    saveToStorage(KEY, gUserPrefs);
}


function _saveColorsToStorage() {
    saveToStorage(KEY, gUserPrefs);
}

function randomForecast() {
    let arrayOfForecasts = ['Mercury aligns with Mars in the sign of Virgo tonight, and it’s a time of motivated, energetic work, particularly related to communications and the mind.',
        'Work and health can be a strong focus, interest, or topic. We want to get right to the point so that communications can be on the insensitive side but also direct and clear.',
        'Taking care of business is a central theme now.'
    ];
    return arrayOfForecasts;
}