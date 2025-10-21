var cnv = document.querySelector("#myCanvas");
var ctx;
ctx = cnv.getContext("2d");
var imageData = ctx.getImageData(10, 0, cnv.width, cnv.height);

function main() {
    // Kode Main

    ctx.putImageData(imageData, 0, 0);
}

main()