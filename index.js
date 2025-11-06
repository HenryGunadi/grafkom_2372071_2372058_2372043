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

function main() {
  // Memulai UI dan timer permainan
  rafaelFunctions.startGame();

  // Tambahkan tombol untuk menarik jaring
  const retractButton = document.getElementById("jaring-naik");
  retractButton.innerHTML = '<button style="padding: 10px; margin: 10px;">Tarik Jaring</button>';
  retractButton.firstChild.addEventListener("click", () => {
    nazwaFunctions.jaringNaik(activeJaringAnimations);
  });

  // Tambahkan tombol restart
  const resetContainer = document.getElementById("reset");
  resetContainer.innerHTML = '<button id="restartButton" style="padding: 10px; margin: 10px;">Mulai Ulang</button>';
  const restartBtn = document.getElementById("restartButton");
  restartBtn.addEventListener("click", () => {
    // hanya bisa restart jika permainan sudah selesai
    if (rafaelFunctions.isGameRunning()) return;
    restartGame();
  });

  // Tambahkan tombol pause/resume
  const pauseBtn = document.createElement('button');
  pauseBtn.id = 'pauseButton';
  pauseBtn.style.padding = '10px';
  pauseBtn.style.margin = '10px';
  pauseBtn.textContent = 'Pause';
  resetContainer.appendChild(pauseBtn);
  pauseBtn.addEventListener('click', () => {
    // ubah status pause
    controls.paused = !controls.paused;
    pauseBtn.textContent = controls.paused ? 'Lanjutkan' : 'Pause';
    // hentikan/jalankan timer permainan juga
    rafaelFunctions.setPaused(controls.paused);
    // saat pause, ambil snapshot layar untuk menampilkan overlay
    if (controls.paused) {
      try {
        controls._snapshot = ctx.getImageData(0, 0, cnv.width, cnv.height);
      } catch (e) {
        // getImageData bisa gagal jika canvas ter-“taint”; abaikan jika gagal
        controls._snapshot = null;
      }
    } else {
      controls._snapshot = null;
    }
  });

  // Inisialisasi ikan dan sampah
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
  const fishAndTrashes = henryFunctions.generateFishAndTrash(
    imageData,
    cnv,
    20, // jumlah ikan
    10, // jumlah sampah
    { r: 0, g: 0, b: 255 }, // warna ikan
    { r: 255, g: 0, b: 0 }  // warna sampah
  );

  // Tampilkan hasil awal ke layar
  ctx.putImageData(imageData, 0, 0);

  // Aktifkan klik untuk melempar jaring
  maherFunctions.jaring(cnv, activeJaringAnimations);

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
    controls
  );
}

function restartGame() {
  // Bersihkan daftar animasi dan power-up aktif
  activeJaringAnimations.length = 0;
  powerUps.length = 0;

  // Bersihkan canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  // Reset UI dan timer
  // pastikan mode pause dimatikan dan timer berjalan lagi
  controls.paused = false;
  const pb = document.getElementById('pauseButton');
  if (pb) pb.textContent = 'Pause';
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
    controls
  );
}

// Tunggu sampai halaman selesai dimuat, lalu atur ukuran canvas dan mulai game
window.addEventListener("load", () => {
  // atur ukuran canvas jika belum ditentukan di HTML
  if (!cnv.width) cnv.width = 800;
  if (!cnv.height) cnv.height = 600;

  // bersihkan layar
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // inisialisasi imageData
  imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

  // jalankan permainan
  main();
});
