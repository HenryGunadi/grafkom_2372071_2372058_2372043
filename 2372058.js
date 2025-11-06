import * as common from "./common.js"

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
      return
    }
    const rect = cnv.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    activeJaringAnimations.push({ x, y, r: 10, maxR: 150, speed: 1, done: false });
  });
}