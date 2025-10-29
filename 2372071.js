export function gambar_titik(imageData, x, y, r, g, b, cnv) {
    var index;
    index = 4 * (Math.ceil(x) + (Math.ceil(y) * cnv.width));

    imageData.data[index] = r;
    imageData.data[index + 1] = g;    
    imageData.data[index + 2] = b;    
    imageData.data[index + 3] = 255;    
}

export function dda_line(imageData, x1, y1, x2, y2, r, g, b, cnv){
    var dx = x2-x1;
    var dy = y2-y1;

    if(Math.abs(dx) > Math.abs(dy)){
        if(x2 > x1){
            var y = y1;
            for(var x = x1; x < x2; x++){
                y = y + (dy/Math.abs(dx))
                gambar_titik(imageData, x, y, r, g, b, cnv);
            }
        }
        else{
            var y = y1;
            for(var x = x1; x > x2; x--){
                y = y + (dy/Math.abs(dx))
                gambar_titik(imageData, x, y, r, g, b, cnv);
            }
        }
    }
    else{
        if(y2 > y1){
            var x = x1;
            for(var y = y1; y < y2; y++){
                x = x + (dx/Math.abs(dy))
                gambar_titik(imageData, x, y, r, g, b, cnv);
            }
        }
        else{
            var x = x1;
            for(var y = y1; y > y2; y--){
                x = x + (dx/Math.abs(dy))
                gambar_titik(imageData, x, y, r, g, b, cnv);
            }
        }
    }
}

export function square(imageData, xc, yc, length, r, g, b, cnv) {
    const x1 = Math.floor(xc - (length / 2))
    const x2 = Math.floor(xc + (length / 2))
    const y1 = Math.floor(yc - (length / 2))
    const y2 = Math.floor(yc + (length / 2))

    dda_line(imageData, x1, y1, x2, y1, r, g, b, cnv)
    dda_line(imageData, x1, y1, x1, y2, r, g, b, cnv)
    dda_line(imageData, x1, y2, x2, y2, r, g, b, cnv)
    dda_line(imageData, x2, y1, x2, y2, r, g, b, cnv)

    FloodFillStack(imageData, cnv, xc, yc, {r: 0, g: 0, b: 0}, {r: r, g: g, b:b})
}

export function FloodFillStack(imageData, cnv, x, y, toFlood, color) {
    var index = 4 * (x + (y * cnv.width));
    var r1 = imageData.data[index];
    var g1 = imageData.data[index + 1];
    var b1 = imageData.data[index + 2];

    var tumpukan = [];
    tumpukan.push({ x: x, y: y });

    while (tumpukan.length > 0) {
        var titikS = tumpukan.pop();
        var indexS = 4 * (titikS.x + (titikS.y * cnv.width));
        var r1 = imageData.data[indexS];
        var g1 = imageData.data[indexS + 1];
        var b1 = imageData.data[indexS + 2];

        if ((toFlood.r == r1) && (toFlood.g == g1) && (toFlood.b) == b1) {
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

export function lingkaran(imageData, xc, yc, radius, r, g, b, cnv, net = false) {
    for (var theta = 0; theta < Math.PI * 2; theta += 0.005) {
        var x = xc + (radius * Math.cos(theta));
        var y = yc + (radius * Math.sin(theta));
        gambar_titik(imageData, x, y, r, g, b, cnv);

    }
    if (net === false) {
        FloodFillStack(imageData, cnv, xc, yc, {r: 0, g: 0, b: 0}, {r: r, g: g, b: b})
    }
}

export function generateFishAndTrash(imageData, cnv, nFish, nTrash, fishColor, trashColor) {
    const trashes = []
    const fishes = []

    for (var i = 0; i < nFish; i ++) {
        const x = Math.floor(Math.random() * cnv.width)
        const y = Math.floor(Math.random() * cnv.height)

        const fish = {
            x: x,
            y: y,
            r: fishColor.r,
            g: fishColor.g,
            b: fishColor.b
        }
        
        lingkaran(imageData, x, y, 10, fishColor.r, fishColor.g, fishColor.b, cnv)
        
        fishes.push(fish)
    }
    
    for (var i = 0; i < nTrash; i ++) {
        const x = Math.floor(Math.random() * cnv.width)
        const y = Math.floor(Math.random() * cnv.height)
        
        const trash = {
            x: x,
            y: y,
            r: trashColor.r,
            g: trashColor.g,
            b: trashColor.b
        }
        
        square(imageData, x, y, 20, trashColor.r, trashColor.g, trashColor.b, cnv)
        
        trashes.push(trash)
    }

    return {trashes, fishes} 
}

