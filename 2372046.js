import * as common from "./common.js";

// Button jaring naik
export function jaringNaik(imageData, cnv, activeJaringAnimations){
  var jaringBtn = document.createElement('button')
  jaringBtn.innerText = 'Jaring Naik';
  jaringBtn.id = 'jaringUp';
  var container = document.getElementById('jaring-naik'); 
  container.appendChild(jaringBtn);
  jaringBtn.addEventListener('click', function() {
    // Pastikan Jaring udh turun
    if(activeJaringAnimations.length < 0){
      return
    }
    // Cek dalem jaring ada apa aja
    // sensorJaring(imageData, cnv, activeJaringAnimations);

    // Animasi Jaring Mengecil
    activeJaringAnimations.push({x, y, r: 150, maxR: 0, speed: -3, done: false});
  });
}

// Ngecek dalem jaring ada apa aja dan brp banyak
export function sensorJaring(imageData, cnv, activeJaringAnimations) {
  var center, radius, fishTotal, trashTotal;

  center = {x: activeJaringAnimations[0].x, y: activeJaringAnimations[0].y};
  radius = activeJaringAnimations[0].r;

  // TODO: Cek dalem jaring ada berapa fish n trash di dalem

  // if(fish.b == 255 && ){ // TODO: Add condition cek warna dot
  //   fishTotal += 1;
  // } else {
  //   trashTotal += 1;
  // }

  var resetBtn = document.createElement('button')
  resetBtn.innerText = 'Reset';
  resetBtn.id = 'resetBtn';
  var resetContainer = document.getElementById('reset'); 
  resetContainer.appendChild(resetBtn);
  resetBtn.addEventListener('click', function() {
    fishTotal = 0;
    trashTotal = 0;
  });
}