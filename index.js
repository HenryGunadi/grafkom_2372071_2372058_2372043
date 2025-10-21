var cnv;

function gambar_titik(imageData, x, y, r, g, b){
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0){
        return; 
    }
    if (x >= cnv.width){
        return;
    }
    if (y < 0){
        return;
    }
    if (y >= cnv.height){
        return;
    }

    var index; 
    index = 4 * (x + y * cnv.width); 
    imageData.data[index] = r; // red
    imageData.data[index + 1] = g; // green 
    imageData.data[index + 2] = b; // blue
    imageData.data[index + 3] = 255; // alfa
}

function lingkaran_polar(imageData, xc, yc, radius, r, g, b){
    for(var theta = 0; theta < Math.PI*2; theta += 0.001){
        var x = xc + radius * Math.cos(theta); 
        var y = yc + radius * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b); 
    }
}

function translasi(titik_lama, jarak){
    var x_baru = titik_lama.x + jarak.x; 
    var y_baru = titik_lama.y + jarak.y; 

    return{x:x_baru, y:y_baru};
}

function rotasi(titik_lama, sudut){
    var x_baru = titik_lama.x * Math.cos(sudut) - titik_lama.y * Math.sin(sudut); 
    var y_baru = titik_lama.x * Math.sin(sudut) + titik_lama.y * Math.cos(sudut);

    return{x:x_baru, y:y_baru};
}

function rotasi_fp(titik_lama, titik_putar, sudut){
    var p1 = translasi(titik_lama, {x:-titik_putar.x, y:-titik_putar.y});
    var p2 = rotasi(p1, sudut); 
    var p3 = translasi(p2, titik_putar);

    return p3;
}

cnv = document.querySelector("#myCanvas");
var contex1;
contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0,0,cnv.width, cnv.height);
var move = false; 

cnv.addEventListener('click', function(ev){
    if (move == true){
        return;
    }

    move = false; 

    var rectangle = cnv.getBoundingClientRect();  
    var x = ev.clientX - rectangle.left;
    var y = ev.clientY - rectangle.top;

    var maximalR = 150;
    var r = 10;
    var speed = 1;

    function animate() {
        contex1.clearRect(0, 0, cnv.width, cnv.height);
        var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
        lingkaran_polar(imageData, x, y, r, 0, 255, 0);
        contex1.putImageData(imageData, 0, 0);

        r = r + speed;
        if (r < maximalR) {
            requestAnimationFrame(animate);
        } else {
            contex1.clearRect(0, 0, cnv.width, cnv.height);
            var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);
            lingkaran_polar(imageData, x, y, maximalR, 255, 0, 0);
            contex1.putImageData(imageData, 0, 0);
            animating = false;
        }
      }
      animate();
});

contex1.putImageData(imageData, 0, 0);