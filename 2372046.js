// 2372046.js
import * as common from "./common.js";

export function jaringNaik(activeJaringAnimations) {
  if (!activeJaringAnimations || activeJaringAnimations.length === 0) return;
  const net = activeJaringAnimations.shift();
  activeJaringAnimations.push({
    x: net.x,
    y: net.y,
    r: net.maxR || 150,
    maxR: 0,
    speed: -3,
    done: false,
    counted: false,
  });
}

export function sensorJaring(imageData, cnv, center, radius) {
  const xmin = Math.max(0, Math.floor(center.x - radius));
  const xmax = Math.min(cnv.width - 1, Math.ceil(center.x + radius));
  const ymin = Math.max(0, Math.floor(center.y - radius));
  const ymax = Math.min(cnv.height - 1, Math.ceil(center.y + radius));
  let blueCount = 0;
  let redCount = 0;
  for (let yy = ymin; yy <= ymax; yy++) {
    for (let xx = xmin; xx <= xmax; xx++) {
      const dx = xx - center.x;
      const dy = yy - center.y;
      if (dx * dx + dy * dy <= radius * radius) {
        const idx = 4 * (xx + yy * cnv.width);
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        if (b > 200 && r < 50 && g < 50) blueCount++;
        if (r > 200 && g < 50 && b < 50) redCount++;
      }
    }
  }
  return { blueCount, redCount };
}
