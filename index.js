import * as henryFunctions from "./2372071.js";
import * as maherFunctions from "./2372058.js";
import * as nazwaFunctions from "./2372046.js";
import * as rafaelFunctions from "./2372043.js";

const cnv = document.querySelector("#myCanvas");
const ctx = cnv.getContext("2d");
let imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

let activeJaringAnimations = [];
let powerUps = []; // daftar power-up aktif di kanvas
let powerUpSpawnerRunning = false;
const controls = { paused: false, _snapshot: null };
let umpans = [];

// Memunculkan power-up secara acak setiap 5–15 detik
function startPowerUpSpawner() {
  if (powerUpSpawnerRunning) return;
  powerUpSpawnerRunning = true;

  function spawnOne() {
    const types = [
      { type: "speedBoost", color: "orange" },
      { type: "doublePoints", color: "purple" },
      { type: "widerNet", color: "cyan" },
    ];
    // hanya munculkan satu power-up jika belum ada di layar
    if (powerUps.length > 0) {
      // jadwalkan percobaan berikutnya
      const delay = 5000 + Math.random() * 10000; // 5–15 detik
      setTimeout(spawnOne, delay);
      return;
    }

    const chosen = types[Math.floor(Math.random() * types.length)];
    // durasi hidup (dalam frame, ~60 fps): acak antara 5–15 detik
    const lifeSeconds = 5 + Math.floor(Math.random() * 11); // 5–15
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
    // jadwalkan kemunculan berikutnya
    const delay = 5000 + Math.random() * 10000; // 5–15 detik
    setTimeout(spawnOne, delay);
  }
  spawnOne();
}

function setupEventListeners() {
  // Setup bait button
  const baitBtn = document.getElementById("button-umpan");
  if (baitBtn) {
    baitBtn.addEventListener("click", function (ev) {
      maherFunctions.umpan(cnv, umpans);
    });
  }

  // Setup pull net button
  const pullNetBtn = document.getElementById("jaring-naik");
  if (pullNetBtn) {
    pullNetBtn.addEventListener("click", function (ev) {
      nazwaFunctions.jaringNaik(activeJaringAnimations);
    });
  }

  // Setup pause button
  const pauseBtn = document.getElementById("pauseButton");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      // ubah status pause
      controls.paused = !controls.paused;
      pauseBtn.textContent = controls.paused ? "▶️ Continue" : "⏸️ Pause";
      pauseBtn.className = controls.paused
        ? "game-button success"
        : "game-button secondary";

      // hentikan/jalankan timer permainan juga
      rafaelFunctions.setPaused(controls.paused);

      // saat pause, ambil snapshot layar untuk menampilkan overlay
      if (controls.paused) {
        try {
          controls._snapshot = ctx.getImageData(0, 0, cnv.width, cnv.height);
        } catch (e) {
          // getImageData bisa gagal jika canvas ter-"taint"; abaikan jika gagal
          controls._snapshot = null;
        }
      } else {
        controls._snapshot = null;
      }
    });
  }

  // Setup restart button
  const restartBtn = document.getElementById("restartButton");
  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      // hanya bisa restart jika permainan sudah selesai
      if (rafaelFunctions.isGameRunning()) return;
      restartGame();
    });
  }

  // Setup canvas click for fishing net
  maherFunctions.jaring(cnv, activeJaringAnimations);
}

function main() {
  // Memulai UI dan timer permainan
  rafaelFunctions.startGame();

  // Setup semua event listeners
  setupEventListeners();

  // Inisialisasi ikan dan sampah - CLEAR FIRST then get imageData
  ctx.clearRect(0, 0, cnv.width, cnv.height); // Clear to transparent/white
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height); // Get the cleared imageData

  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20, // jumlah ikan
    10, // jumlah sampah
    { r: 0, g: 0, b: 255 }, // warna ikan
    { r: 255, g: 0, b: 0 } // warna sampah
  );

  // Tampilkan hasil awal ke layar
  ctx.putImageData(imageData, 0, 0);

  // Mulai memunculkan power-up
  startPowerUpSpawner();

  // Jalankan animasi utama setelah semuanya siap
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

  // Start updating game stats
  setInterval(updateGameStats, 1000);
}

function restartGame() {
  // Bersihkan daftar animasi dan power-up aktif
  activeJaringAnimations.length = 0;
  powerUps.length = 0;
  umpans.length = 0;

  // Bersihkan canvas - clear first, then get fresh imageData
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  // Reset UI dan timer
  controls.paused = false;
  const pauseBtn = document.getElementById("pauseButton");
  if (pauseBtn) {
    pauseBtn.textContent = "⏸️ Pause";
    pauseBtn.className = "game-button secondary";
  }

  rafaelFunctions.startGame();
  rafaelFunctions.setPaused(false);

  // Hasilkan kembali ikan dan sampah
  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20,
    10,
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 0, b: 0 }
  );

  // Gambar frame awal dan mulai animasi lagi
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

// Tunggu sampai halaman selesai dimuat, lalu atur ukuran canvas dan mulai
window.addEventListener("load", () => {
  // atur ukuran canvas jika belum ditentukan di HTML
  if (!cnv.width) cnv.width = 800;
  if (!cnv.height) cnv.height = 600;

  // bersihkan layar dengan clearRect (transparent/white)
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  // inisialisasi imageData dari canvas yang sudah dibersihkan
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  // jalankan permainan
  main();
});
