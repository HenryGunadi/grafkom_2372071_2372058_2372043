import * as henryFunctions from "./2372071.js";
import * as maherFunctions from "./2372058.js";
import * as nazwaFunctions from "./2372046.js";
import * as rafaelFunctions from "./2372043.js";

const cnv = document.querySelector("#myCanvas");
const ctx = cnv.getContext("2d");
let imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

let activeJaringAnimations = [];
let powerUps = [];
let powerUpSpawnerRunning = false;
const controls = { paused: false, _snapshot: null };
let umpans = [];

function startPowerUpSpawner() {
  if (powerUpSpawnerRunning) return;
  powerUpSpawnerRunning = true;

  function spawnOne() {
    const types = [
      { type: "speedBoost", color: "orange" },
      { type: "doublePoints", color: "purple" },
      { type: "widerNet", color: "cyan" },
    ];
    if (powerUps.length > 0) {
      const delay = 5000 + Math.random() * 10000;
      setTimeout(spawnOne, delay);
      return;
    }

    const chosen = types[Math.floor(Math.random() * types.length)];
    const lifeSeconds = 5 + Math.floor(Math.random() * 11);
    const p = {
      x: 20 + Math.random() * (cnv.width - 40),
      y: 20 + Math.random() * (cnv.height - 40),
      type: chosen.type,
      color: chosen.color,
      size: 12,
      life: 60 * lifeSeconds,
      collected: false,
    };
    powerUps.push(p);
    const delay = 5000 + Math.random() * 10000;
    setTimeout(spawnOne, delay);
  }
  spawnOne();
}

function setupEventListeners() {
  const baitBtn = document.getElementById("button-umpan");
  if (baitBtn) {
    baitBtn.addEventListener("click", function (ev) {
      maherFunctions.umpan(cnv, umpans);
    });
  }

  const pullNetBtn = document.getElementById("jaring-naik");
  if (pullNetBtn) {
    pullNetBtn.addEventListener("click", function (ev) {
      nazwaFunctions.jaringNaik(activeJaringAnimations);
    });
  }

  const pauseBtn = document.getElementById("pauseButton");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      controls.paused = !controls.paused;
      pauseBtn.textContent = controls.paused ? "Continue" : "Pause";
      pauseBtn.className = controls.paused
        ? "game-button success"
        : "game-button secondary";

      rafaelFunctions.setPaused(controls.paused);

      if (controls.paused) {
        try {
          controls._snapshot = ctx.getImageData(0, 0, cnv.width, cnv.height);
        } catch (e) {
          controls._snapshot = null;
        }
      } else {
        controls._snapshot = null;
      }
    });
  }

  const restartBtn = document.getElementById("restartButton");
  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      if (rafaelFunctions.isGameRunning()) return;
      restartGame();
    });
  }

  maherFunctions.jaring(cnv, activeJaringAnimations);
}

function main() {
  rafaelFunctions.startGame();

  setupEventListeners();

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20,
    10,
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 0, b: 0 }
  );

  ctx.putImageData(imageData, 0, 0);

  startPowerUpSpawner();

  henryFunctions.animate(
    fishAndTrashes.trashes,
    fishAndTrashes.fishes,
    cnv,
    imageData,
    ctx,
    activeJaringAnimations,
    powerUps,
    controls,
    umpans
  );

  setInterval(updateGameStats, 1000);
}

function restartGame() {
  activeJaringAnimations.length = 0;
  powerUps.length = 0;
  umpans.length = 0;

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  controls.paused = false;
  const pauseBtn = document.getElementById("pauseButton");
  if (pauseBtn) {
    pauseBtn.textContent = "Pause";
    pauseBtn.className = "game-button secondary";
  }

  rafaelFunctions.startGame();
  rafaelFunctions.setPaused(false);

  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20,
    10,
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 0, b: 0 }
  );

  ctx.putImageData(imageData, 0, 0);
  henryFunctions.animate(
    fishAndTrashes.trashes,
    fishAndTrashes.fishes,
    cnv,
    imageData,
    ctx,
    activeJaringAnimations,
    powerUps,
    controls,
    umpans
  );
}

function updateGameStats() {
  const scoreElement = document.getElementById("scoreValue");
  const timeElement = document.getElementById("timeValue");
  const fishElement = document.getElementById("fishValue");
  const baitElement = document.getElementById("baitValue");

  if (scoreElement) scoreElement.textContent = rafaelFunctions.getScore() || 0;
  if (timeElement)
     timeElement.textContent = `${rafaelFunctions.getTimeRemaining() || 60}s`;
  if (fishElement)
     fishElement.textContent = rafaelFunctions.getFishCaught() || 0;
  if (baitElement) baitElement.textContent = umpans.length;
}

window.addEventListener("load", () => {
  if (!cnv.width) cnv.width = 800;
  if (!cnv.height) cnv.height = 600;

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  main();
});
