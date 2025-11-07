import * as common from "./common.js";

export function gambar_titik(imageData, x, y, r, g, b, cnv) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0) {
    return;
  }
  if (x >= cnv.width) {
    return;
  }
  if (y < 0) {
    return;
  }
  if (y >= cnv.height) {
    return;
  }

  var index;
  index = 4 * (x + y * cnv.width);
  imageData.data[index] = r; // red
  imageData.data[index + 1] = g; // green
  imageData.data[index + 2] = b; // blue
  imageData.data[index + 3] = 255; // alfa
}

export function jaring(cnv, activeJaringAnimations) {
  cnv.addEventListener("click", function (ev) {
    if (activeJaringAnimations.length > 0) {
      return;
    }
    const rect = cnv.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    activeJaringAnimations.push({
      x,
      y,
      r: 10,
      maxR: 150,
      speed: 1,
      done: false,
    });
  });
}

export function umpan(cnv, umpans) {
  const buttonUmpan = document.querySelector("#button-umpan");
  buttonUmpan.addEventListener("click", function (ev) {
    umpans.length = 0;
    const baseX = Math.random() * cnv.width * 0.8 + 50;
    const baseY = Math.random() * cnv.height * 0.8 + 50;

    for (var i = 0; i < 7; i++) {
      const setX =
        Math.cos((i * Math.PI) / 3) * 25 + (Math.random() - 0.5) * 10;
      const setY =
        Math.sin((i * Math.PI) / 3) * 25 + (Math.random() - 0.5) * 10;
      umpans.push({
        x: baseX + setX,
        y: baseY + setY,
        r: 10,
      });
    }
    console.log(
      `Umpan ditebar di (${Math.round(baseX)}, ${Math.round(baseY)})`
    );
  });
}
