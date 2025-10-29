import * as henryFunctions from "./2372071.js";
import * as maherFunctions from "./2372058.js"; 

var cnv = document.querySelector("#myCanvas");
var ctx;
ctx = cnv.getContext("2d");
var imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
let activeJaringAnimations = [];  

function main() {
  // Kode Main
  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20,
    10,
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 0, b: 0 }
  );

  // animasi
  henryFunctions.animate(
    fishAndTrashes.trashes,
    fishAndTrashes.fishes,
    cnv,
    imageData,
    ctx, 
    activeJaringAnimations
  );

  maherFunctions.jaring(
    cnv, activeJaringAnimations
  );
}

main();