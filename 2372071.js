// 2372071.js
import * as common from "./common.js";
import * as game from "./2372043.js";

export function square(imageData, xc, yc, length, r, g, b, cnv) {
  const x1 = Math.floor(xc - length / 2);
  const x2 = Math.floor(xc + length / 2);
  const y1 = Math.floor(yc - length / 2);
  const y2 = Math.floor(yc + length / 2);

  common.dda_line(imageData, x1, y1, x2, y1, r, g, b, cnv);
  common.dda_line(imageData, x1, y1, x1, y2, r, g, b, cnv);
  common.dda_line(imageData, x1, y2, x2, y2, r, g, b, cnv);
  common.dda_line(imageData, x2, y1, x2, y2, r, g, b, cnv);

  common.FloodFillStack(
    imageData,
    cnv,
    xc,
    yc,
    { r: 0, g: 0, b: 0 },
    { r: r, g: g, b: b }
  );
}

export function lingkaran(
  imageData,
  xc,
  yc,
  radius,
  r,
  g,
  b,
  cnv,
  net = false
) {
  if (net === true) {
    for (let theta = 0; theta < Math.PI * 2; theta += 0.005) {
      const x = xc + radius * Math.cos(theta);
      const y = yc + radius * Math.sin(theta);
      common.gambar_titik(imageData, x, y, r, g, b, cnv);
    }
  } else {
    for (let rad = 0; rad <= radius; rad += 1) {
      for (let theta = 0; theta < Math.PI * 2; theta += 0.05) {
        const x = xc + rad * Math.cos(theta);
        const y = yc + rad * Math.sin(theta);
        common.gambar_titik(imageData, x, y, r, g, b, cnv);
      }
    }
  }
}

export function drawPentagon(imageData, cx, cy, radius, r, g, b, cnv) {
  const points = [];

  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    points.push({ x: px, y: py });
  }

  for (let i = 0; i < 5; i++) {
    const start = points[i];
    const end = points[(i + 1) % 5];
    common.dda_line(imageData, start.x, start.y, end.x, end.y, r, g, b, cnv);
  }

  const sx = Math.max(0, Math.min(Math.round(cx), cnv.width - 1));
  const sy = Math.max(0, Math.min(Math.round(cy), cnv.height - 1));
  const idxCenter = 4 * (sx + sy * cnv.width);
  const toFloodColor = {
    r: imageData.data[idxCenter] || 0,
    g: imageData.data[idxCenter + 1] || 0,
    b: imageData.data[idxCenter + 2] || 0,
  };

  common.FloodFillStack(
    imageData,
    cnv,
    sx,
    sy,
    toFloodColor,
    { r: r, g: g, b: b }
  );
}

export function generateFishAndTrash(
  imageData,
  cnv,
  nFish,
  nTrash,
  fishColor,
  trashColors
) {
  const trashes = [];
  const fishes = [];

  for (var i = 0; i < nFish; i++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 4 + Math.floor(Math.random() * 6);
    const randomSpeed = 1 + Math.floor(Math.random() * 2);
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

    lingkaran(
      imageData,
      x,
      y,
      randomSize,
      fishColor.r,
      fishColor.g,
      fishColor.b,
      cnv
    );
    fishes.push(fish);
  }

  for (var j = 0; j < nTrash; j++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 12 + Math.floor(Math.random() * 10);
    const randomSpeed = 1 + Math.floor(Math.random() * 2);
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

    square(
      imageData,
      x,
      y,
      randomSize,
      trashColors.r,
      trashColors.g,
      trashColors.b,
      cnv
    );
    trashes.push(trash);
  }

  return { trashes, fishes };
}

export function animate(
  trashes,
  fishes,
  cnv,
  imageData,
  ctx,
  activeJaringAnimations,
  powerUps = [],
  controls = { paused: false },
  umpans
) {
  var timer = 0;

  function drawPowerUps() {
    powerUps.forEach((p) => {
      if (p.collected || p.life <= 0) return;

      let r, g, b;
      switch (p.color) {
        case "orange":
          r = 255;
          g = 165;
          b = 0;
          break;
        case "purple":
          r = 128;
          g = 0;
          b = 128;
          break;
        case "cyan":
          r = 0;
          g = 255;
          b = 255;
          break;
        default:
          r = 255;
          g = 255;
          b = 255;
      }

      drawPentagon(imageData, p.x, p.y, p.size || 12, r, g, b, cnv);
    });
  }

  function drawUmpans() {
    umpans.forEach((u) => {
      lingkaran(imageData, u.x, u.y, u.r, 255, 255, 0, cnv);

      for (let theta = 0; theta < Math.PI * 2; theta += 0.1) {
        const x = u.x + u.r * Math.cos(theta);
        const y = u.y + u.r * Math.sin(theta);
        common.gambar_titik(imageData, x, y, 255, 165, 0, cnv);
      }
    });
  }

  function draw() {
    timer += 1;

    if (timer > 1) {
      if (!controls.paused) {
        imageData = ctx.createImageData(cnv.width, cnv.height);

        fishes.forEach((fish) => {
          if (umpans.length > 0) {
            let umpanTerdekat = umpans[0];
            let jarakTerdekat = Math.sqrt(
              (fish.x - umpanTerdekat.x) ** 2 + (fish.y - umpanTerdekat.y) ** 2
            );

            for (const umpan of umpans) {
              const jarak = Math.sqrt(
                (fish.x - umpan.x) ** 2 + (fish.y - umpan.y) ** 2
              );
              if (jarak < jarakTerdekat) {
                jarakTerdekat = jarak;
                umpanTerdekat = umpan;
              }
            }

            const dx = umpanTerdekat.x - fish.x;
            const dy = umpanTerdekat.y - fish.y;
            const total = Math.sqrt(dx * dx + dy * dy);

            if (jarakTerdekat < fish.size + umpanTerdekat.r + 2) {
              const index = umpans.indexOf(umpanTerdekat);
              if (index !== -1) {
                umpans.splice(index, 1);
                console.log("Ikan memakan umpan!");
              }
            } else if (total > 0) {
              fish.x += (dx / total) * fish.speed;
              fish.y += (dy / total) * fish.speed;
            }
          } else {
            if (fish.x >= cnv.width || fish.x <= 0) fish.xDirection *= -1;
            if (fish.y >= cnv.height || fish.y <= 0) fish.yDirection *= -1;

            fish.x += fish.speed * fish.xDirection;
            fish.y += fish.speed * fish.yDirection;
          }

          lingkaran(
            imageData,
            fish.x,
            fish.y,
            fish.size,
            fish.r,
            fish.g,
            fish.b,
            cnv
          );
        });

        drawUmpans();


        trashes.forEach((trash) => {
          if (trash.x >= cnv.width || trash.x <= 0) trash.xDirection *= -1;
          if (trash.y >= cnv.height || trash.y <= 0) trash.yDirection *= -1;

          trash.x += trash.speed * trash.xDirection;
          trash.y += trash.speed * trash.yDirection;

          square(
            imageData,
            trash.x,
            trash.y,
            trash.size,
            trash.r,
            trash.g,
            trash.b,
            cnv
          );
        });

        activeJaringAnimations.forEach((net) => {
          if (!net.done) {
            common.lingkaran_polar(
              imageData,
              net.x,
              net.y,
              net.r,
              0,
              255,
              0,
              cnv
            );
            net.r += net.speed;
            if (
              (net.speed > 0 && net.r >= net.maxR) ||
              (net.speed < 0 && net.r <= net.maxR)
            ) {
              net.done = true;
              net.timer = 30;
            }
          } else {
            common.lingkaran_polar(
              imageData,
              net.x,
              net.y,
              net.maxR,
              255,
              0,
              0,
              cnv
            );
            if (typeof net.timer === "number") net.timer -= 1;
          }

          if (net.done && !net.counted) {
            let fishCaughtIndices = [];
            for (let i = fishes.length - 1; i >= 0; i--) {
              const f = fishes[i];
              const dx = f.x - net.x;
              const dy = f.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                fishCaughtIndices.push(i);
                game.addScore(10);
              }
            }
            fishCaughtIndices.forEach((idx) => fishes.splice(idx, 1));

            let trashCaughtIndices = [];
            for (let i = trashes.length - 1; i >= 0; i--) {
              const t = trashes[i];
              const dx = t.x - net.x;
              const dy = t.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                trashCaughtIndices.push(i);
                game.addScore(-5);
              }
            }
            trashCaughtIndices.forEach((idx) => trashes.splice(idx, 1));

            let umpanCaughtIndices = [];
            for (let i = umpans.length - 1; i >= 0; i--) {
              const u = umpans[i];
              const dx = u.x - net.x;
              const dy = u.y - net.y;
              if (dx * dx + dy * dy <= net.maxR * net.maxR) {
                umpanCaughtIndices.push(i);
              }
            }
            umpanCaughtIndices.forEach((idx) => umpans.splice(idx, 1));

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

        drawPowerUps();

        for (let i = activeJaringAnimations.length - 1; i >= 0; i--) {
          const net = activeJaringAnimations[i];
          if (
            net.done &&
            (typeof net.timer === "number" ? net.timer <= 0 : true)
          ) {
            activeJaringAnimations.splice(i, 1);
          }
        }

        ctx.putImageData(imageData, 0, 0);

        timer = 0;
      }
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].life -= 1;
      if (powerUps[i].life <= 0 || powerUps[i].collected) {
        powerUps.splice(i, 1);
      }
    }

    if (game.isGameRunning()) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}
