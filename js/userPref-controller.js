'use strict';

function onInit() {
    let colors = getColors();
    let elTxts = document.querySelectorAll('.txt');
    for(let i = 0; i < elTxts.length; i++) {
        elTxts[i].style.color = colors[0].textColor;
    };
    document.querySelector('body').style.backgroundColor = colors[0].bgcColor;
    document.querySelector('p').innerText = colors[0].birthDate;
}

function onSubmit(ev) {
    ev.preventDefault();
    const bgcColorInput = document.querySelector('input[name="bgc-color"]').value;
    const textColorInput = document.querySelector('input[name="text-color"]').value;
    const birthdayInput = document.querySelector('input[name="birthday-date"]').value;
    console.log(birthdayInput);
    savePrefs(bgcColorInput, textColorInput, birthdayInput);
}

function showAge(newVal) {
    document.querySelector('.show-age').innerHTML = newVal;
}