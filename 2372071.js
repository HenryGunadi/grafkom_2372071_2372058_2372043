// 2372071.js
import * as common from "./common.js";
import * as game from "./2372043.js";

// Fungsi untuk menggambar persegi dengan garis dan isi warna
export function square(imageData, xc, yc, length, r, g, b, cnv) {
  const x1 = Math.floor(xc - length / 2);
  const x2 = Math.floor(xc + length / 2);
  const y1 = Math.floor(yc - length / 2);
  const y2 = Math.floor(yc + length / 2);

  common.dda_line(imageData, x1, y1, x2, y1, r, g, b, cnv);
  common.dda_line(imageData, x1, y1, x1, y2, r, g, b, cnv);
  common.dda_line(imageData, x1, y2, x2, y2, r, g, b, cnv);
  common.dda_line(imageData, x2, y1, x2, y2, r, g, b, cnv);

  common.FloodFillStack(imageData, cnv, xc, yc, { r: 0, g: 0, b: 0 }, { r: r, g: g, b: b });
}

// Fungsi untuk menggambar lingkaran (ikan atau jaring)
export function lingkaran(imageData, xc, yc, radius, r, g, b, cnv, net = false) {
  for (var theta = 0; theta < Math.PI * 2; theta += 0.005) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    common.gambar_titik(imageData, x, y, r, g, b, cnv);
  }
  // Jika bukan jaring, isi bagian dalam lingkaran
  if (net === false) {
    common.FloodFillStack(imageData, cnv, xc, yc, { r: 0, g: 0, b: 0 }, { r: r, g: g, b: b });
  }
}

// Membuat kumpulan ikan (lingkaran) dan sampah (persegi) secara acak
export function generateFishAndTrash(imageData, cnv, nFish, nTrash, fishColor, trashColors) {
  const trashes = [];
  const fishes = [];

  // Membuat ikan acak
  for (var i = 0; i < nFish; i++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 4 + Math.floor(Math.random() * 6);
    const randomSpeed = 1 + Math.floor(Math.random() * 3);
    const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
    const randomDirectionY = Math.random() < 0.5 ? -1 : 1;

    const fish = {
      x: x,
      y: y,
      size: randomSize,
      speed: randomSpeed,
      xDirection: randomDirectionX,
      yDirection: randomDirectionY,
      r: fishColor.r,
      g: fishColor.g,
      b: fishColor.b,
    };

    lingkaran(imageData, x, y, randomSize, fishColor.r, fishColor.g, fishColor.b, cnv);
    fishes.push(fish);
  }

  // Membuat sampah acak
  for (var j = 0; j < nTrash; j++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 12 + Math.floor(Math.random() * 10);
    const randomSpeed = 1 + Math.floor(Math.random() * 3);
    const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
    const randomDirectionY = Math.random() < 0.5 ? -1 : 1;

    const trash = {
      x: x,
      y: y,
      size: randomSize,
      speed: randomSpeed,
      xDirection: randomDirectionX,
      yDirection: randomDirectionY,
      r: trashColors.r,
      g: trashColors.g,
      b: trashColors.b,
    };

    square(imageData, x, y, randomSize, trashColors.r, trashColors.g, trashColors.b, cnv);
    trashes.push(trash);
  }

  return { trashes, fishes };
}

// Fungsi utama animasi untuk menggerakkan ikan, sampah, dan mendeteksi jaring
export function animate(trashes, fishes, cnv, imageData, ctx, activeJaringAnimations, powerUps = [], controls = { paused: false }) {
  var timer = 0;

  // Menggambar power-up (lambang segilima/pentagon)
  function drawPowerUps() {
    powerUps.forEach((p) => {
      if (p.collected || p.life <= 0) return;
      const cx = p.x;
      const cy = p.y;
      const radius = p.size || 12;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    });
  }

  function draw() {
    timer += 1;

    if (timer > 1) {
      // Jika permainan dijeda, jangan perbarui animasi
      if (!controls.paused) {
        // Hapus frame sebelumnya
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

        // Gerakkan ikan
        fishes.forEach((fish) => {
          if (fish.x >= cnv.width || fish.x <= 0) fish.xDirection *= -1;
          if (fish.y >= cnv.height || fish.y <= 0) fish.yDirection *= -1;

          const m = common.createTranslation(fish.speed * fish.xDirection, fish.speed * fish.yDirection);
          const [transformedFish] = common.transform_array([{ x: fish.x, y: fish.y }], m);

          fish.x = transformedFish.x;
          fish.y = transformedFish.y;

          lingkaran(imageData, fish.x, fish.y, fish.size, fish.r, fish.g, fish.b, cnv);
        });

        // Gerakkan sampah
        trashes.forEach((trash) => {
          if (trash.x >= cnv.width || trash.x <= 0) trash.xDirection *= -1;
          if (trash.y >= cnv.height || trash.y <= 0) trash.yDirection *= -1;

          const m = common.createTranslation(trash.speed * trash.xDirection, trash.speed * trash.yDirection);
          const [transformedTrash] = common.transform_array([{ x: trash.x, y: trash.y }], m);

          trash.x = transformedTrash.x;
          trash.y = transformedTrash.y;

          square(imageData, trash.x, trash.y, trash.size, trash.r, trash.g, trash.b, cnv);
        });

        // Menangani jaring (net) yang aktif di layar
        activeJaringAnimations.forEach((net) => {
          if (!net.done) {
            // Jaring sedang membesar/mengecil
            common.lingkaran_polar(imageData, net.x, net.y, net.r, 0, 255, 0, cnv);
            net.r += net.speed;
            // Jika ukuran maksimum tercapai
            if ((net.speed > 0 && net.r >= net.maxR) || (net.speed < 0 && net.r <= net.maxR)) {
              net.done = true;
              net.timer = 30; // Waktu tunda sedikit sebelum menghilang
            }
          } else {
            // Jaring berwarna merah (tanda selesai)
            common.lingkaran_polar(imageData, net.x, net.y, net.maxR, 255, 0, 0, cnv);
            if (typeof net.timer === "number") net.timer -= 1;
          }

          // Ketika jaring selesai dan belum dihitung, periksa tangkapan
          if (net.done && !net.counted) {
            // Tangkap ikan
            let fishCaughtIndices = [];
            for (let i = fishes.length - 1; i >= 0; i--) {
              const f = fishes[i];
              const dx = f.x - net.x;
              const dy = f.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                fishCaughtIndices.push(i);
                game.addScore(10); // +10 poin per ikan
              }
            }
            fishCaughtIndices.forEach((idx) => fishes.splice(idx, 1));

            // Tangkap sampah
            let trashCaughtIndices = [];
            for (let i = trashes.length - 1; i >= 0; i--) {
              const t = trashes[i];
              const dx = t.x - net.x;
              const dy = t.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                trashCaughtIndices.push(i);
                game.addScore(-5); // -5 poin untuk sampah
              }
            }
            trashCaughtIndices.forEach((idx) => trashes.splice(idx, 1));

            // Tangkap power-up
            powerUps.forEach((p) => {
              if (p.collected || p.life <= 0) return;
              const dx = p.x - net.x;
              const dy = p.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                p.collected = true;
                game.activatePowerUp(p.type);
              }
            });

            net.counted = true;
          }
        });

        // Hapus jaring yang sudah selesai dan waktunya habis
        for (let i = activeJaringAnimations.length - 1; i >= 0; i--) {
          const net = activeJaringAnimations[i];
          if (net.done && (typeof net.timer === "number" ? net.timer <= 0 : true)) {
            activeJaringAnimations.splice(i, 1);
          }
        }

        // Tampilkan hasil frame baru
        ctx.putImageData(imageData, 0, 0);

        // Gambar power-up di atas layer pixel
        drawPowerUps();

        timer = 0;
      }
    }

    // Jika permainan dijeda, tampilkan layar “PAUSED”
    if (controls.paused) {
      try {
        if (controls._snapshot) {
          ctx.putImageData(controls._snapshot, 0, 0);
        }
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "white";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSED", cnv.width / 2, cnv.height / 2);
        ctx.restore();
      } catch (e) {
        // Abaikan error render (misal canvas tainted)
      }
    }

    // Kurangi umur power-up dan hapus jika sudah habis
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].life -= 1;
      if (powerUps[i].life <= 0 || powerUps[i].collected) {
        powerUps.splice(i, 1);
      }
    }

    // Lanjutkan animasi jika game masih berjalan
    if (game.isGameRunning()) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}
