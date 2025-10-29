import * as common from "./common.js";

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
  for (var theta = 0; theta < Math.PI * 2; theta += 0.005) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    common.gambar_titik(imageData, x, y, r, g, b, cnv);
  }
  if (net === false) {
    common.FloodFillStack(
      imageData,
      cnv,
      xc,
      yc,
      { r: 0, g: 0, b: 0 },
      { r: r, g: g, b: b }
    );
  }
}

export function generateFishAndTrash(
  imageData,
  cnv,
  nFish,
  nTrash,
  fishColor,
  trashColor
) {
  const trashes = [];
  const fishes = [];

  for (var i = 0; i < nFish; i++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 5 + Math.floor(Math.random() * 6);
    const randomSpeed = 5 + Math.floor(Math.random() * 11); // pixel
    const randomDirection = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    const fish = {
      x: x,
      y: y,
      size: randomSize,
      speed: randomSpeed,
      xDirection: randomDirection,
      yDirection: randomDirection,
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

  for (var i = 0; i < nTrash; i++) {
    const x = Math.floor(Math.random() * cnv.width);
    const y = Math.floor(Math.random() * cnv.height);
    const randomSize = 20 + Math.floor(Math.random() * 6);
    const randomSpeed = 5 + Math.floor(Math.random() * 6); // pixel
    const randomDirection = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    const trash = {
      x: x,
      y: y,
      size: randomSize,
      speed: randomSpeed,
      xDirection: randomDirection,
      yDirection: randomDirection,
      r: trashColor.r,
      g: trashColor.g,
      b: trashColor.b,
    };

    square(
      imageData,
      x,
      y,
      randomSize,
      trashColor.r,
      trashColor.g,
      trashColor.b,
      cnv
    );

    trashes.push(trash);
  }

  return { trashes, fishes };
}

export function animate(trashes, fishes, cnv, imageData, ctx, activeJaringAnimations) {
  var timer = 0;

  function draw() {
    timer += 1;

    if (timer > 1) {
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
      fishes.forEach((fish) => {
        if (fish.x >= cnv.width || fish.x <= 0) {
          fish.xDirection *= -1;
        }

        if (fish.y >= cnv.height || fish.y <= 0) {
          fish.yDirection *= -1;
        }

        const m = common.createTranslation(
          fish.speed * fish.xDirection,
          fish.speed * fish.yDirection
        );

        const [transformedFish] = common.transform_array(
          [{ x: fish.x, y: fish.y }],
          m
        );

        fish.x = transformedFish.x;
        fish.y = transformedFish.y;

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

      trashes.forEach((trash) => {
        if (trash.x >= cnv.width || trash.x <= 0) {
          trash.xDirection *= -1;
        }

        if (trash.y >= cnv.height || trash.y <= 0) {
          trash.yDirection *= -1;
        }

        const m = common.createTranslation(
          trash.speed * trash.xDirection,
          trash.speed * trash.yDirection
        );

        const [transformedTrash] = common.transform_array(
          [{ x: trash.x, y: trash.y }],
          m
        );

        trash.x = transformedTrash.x;
        trash.y = transformedTrash.y;

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
          common.lingkaran_polar(imageData, net.x, net.y, net.r, 0, 255, 0, cnv);
          net.r += net.speed;

          if (net.r >= net.maxR) {
            net.done = true;
            net.timer = 30; 
          }
        } else {
          common.lingkaran_polar(imageData, net.x, net.y, net.maxR, 255, 0, 0, cnv);
          net.timer -= 1;
        }
      });

      ctx.putImageData(imageData, 0, 0);
      timer = 0;
    }

    requestAnimationFrame(draw);
  }

  draw();
}