// 2372046.js
import * as common from "./common.js";

// jaringNaik: shrink current net (dipanggil bila ingin memperkecil jaring)
export function jaringNaik(activeJaringAnimations) {
  if (!activeJaringAnimations || activeJaringAnimations.length === 0) return;
  // ambil net terakhir (atau pertama)
  const net = activeJaringAnimations.shift();
  // buat net mengecil dari maxR ke 0
  activeJaringAnimations.push({ x: net.x, y: net.y, r: net.maxR || 150, maxR: 0, speed: -3, done: false, counted: false });
}

// sensorJaring: helper untuk menghitung warna pixel di dalam net (tidak digunakan langsung,
// karena animate melakukan pengecekan berbasis posisi objek)
export function sensorJaring(imageData, cnv, center, radius) {
  // contoh: hitung berapa pixel berwarna biru (ikan) dan merah (sampah)
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
