export function dda_line(imageData, x1, y1, x2, y2, r, g, b, cnv) {
  var dx = x2 - x1;
  var dy = y2 - y1;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (x2 > x1) {
      var y = y1;
      for (var x = x1; x < x2; x++) {
        y = y + dy / Math.abs(dx);
        gambar_titik(imageData, x, y, r, g, b, cnv);
      }
    } else {
      var y = y1;
      for (var x = x1; x > x2; x--) {
        y = y + dy / Math.abs(dx);
        gambar_titik(imageData, x, y, r, g, b, cnv);
      }
    }
  } else {
    if (y2 > y1) {
      var x = x1;
      for (var y = y1; y < y2; y++) {
        x = x + dx / Math.abs(dy);
        gambar_titik(imageData, x, y, r, g, b, cnv);
      }
    } else {
      var x = x1;
      for (var y = y1; y > y2; y--) {
        x = x + dx / Math.abs(dy);
        gambar_titik(imageData, x, y, r, g, b, cnv);
      }
    }
  }
}

export function gambar_titik(imageData, x, y, r, g, b, cnv) {
  var index;
  index = 4 * (Math.ceil(x) + Math.ceil(y) * cnv.width);

  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = 255;
}

export function FloodFillStack(imageData, cnv, x, y, toFlood, color) {
  var index = 4 * (x + y * cnv.width);
  var r1 = imageData.data[index];
  var g1 = imageData.data[index + 1];
  var b1 = imageData.data[index + 2];

  var tumpukan = [];
  tumpukan.push({ x: x, y: y });

  while (tumpukan.length > 0) {
    var titikS = tumpukan.pop();
    var indexS = 4 * (titikS.x + titikS.y * cnv.width);
    var r1 = imageData.data[indexS];
    var g1 = imageData.data[indexS + 1];
    var b1 = imageData.data[indexS + 2];

    if (toFlood.r == r1 && toFlood.g == g1 && toFlood.b == b1) {
      imageData.data[indexS] = color.r;
      imageData.data[indexS + 1] = color.g;
      imageData.data[indexS + 2] = color.b;
      imageData.data[indexS + 3] = 255;

      tumpukan.push({ x: titikS.x + 1, y: titikS.y });
      tumpukan.push({ x: titikS.x - 1, y: titikS.y });
      tumpukan.push({ x: titikS.x, y: titikS.y + 1 });
      tumpukan.push({ x: titikS.x, y: titikS.y - 1 });
    }
  }
}

export function createTranslation(tx, ty) {
  var translasi = [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
  ];

  return translasi;
}

export function transform_titik(titik_lama, m) {
  var x_baru = m[0][0] * titik_lama.x + m[0][1] * titik_lama.y + m[0][2] * 1;
  var y_baru = m[1][0] * titik_lama.x + m[1][1] * titik_lama.y + m[1][2] * 1;

  return { x: x_baru, y: y_baru };
}

export function transform_array(array_titik, m) {
  var hasil = [];

  for (var i = 0; i < array_titik.length; i++) {
    var titik_hasil;
    titik_hasil = transform_titik(array_titik[i], m);

    hasil.push(titik_hasil);
  }

  return hasil;
}

export function applyTransformations(transformations, point_arrays) {
  point_arrays.map((p) => {
    let original = { ...p };

    for (const transformation of transformations) {
      original = transform_array(original, transformation);
    }

    return original;
  });
}

export function translasi(titik_lama, jarak) {
  var x_baru = titik_lama.x + jarak.x;
  var y_baru = titik_lama.y + jarak.y;

  return { x: x_baru, y: y_baru };
}

export function lingkaran_polar(imageData, xc, yc, radius, r, g, b, cnv) {
  for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
    var x = xc + radius * Math.cos(theta);
    var y = yc + radius * Math.sin(theta);
    if (x >= 0) {
      if (x < cnv.width) {
        if (y >= 0) {
          if (y < cnv.height) {
            gambar_titik(imageData, x, y, r, g, b, cnv);
          }
        }
      }
    }
  }
}