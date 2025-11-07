// 2372043.js
// Game state
// Power-up
// Timer
// Score
import * as common from "./common.js";

let score = 0;
let gameTime = 60;
let isGameActive = false;
let gameTimer = null;

let powerUpsConfig = {
  speedBoost: {
    active: false,
    duration: 5000,
    timer: null,
    multiplier: 2
  },
  doublePoints: {
    active: false,
    duration: 7000,
    timer: null,
    multiplier: 2
  },
  widerNet: {
    active: false,
    duration: 6000,
    timer: null,
    sizeIncrease: 50
  }
};

export function getScore() {
  return score;
}

export function getGameTime() {
  return gameTime;
}

export function isGameRunning() {
  return isGameActive;
}

export function startGame() {
  // reset state
  score = 0;
  gameTime = 60;
  isGameActive = true;

  const oldScore = document.getElementById("scoreDisplay");
  if (oldScore) oldScore.remove();
  const scoreDiv = document.createElement("div");
  scoreDiv.id = "scoreDisplay";
  scoreDiv.style.position = "absolute";
  scoreDiv.style.top = "10px";
  scoreDiv.style.left = "10px";
  scoreDiv.style.color = "white";
  scoreDiv.style.backgroundColor = "rgba(0,0,0,0.5)";
  scoreDiv.style.padding = "8px 12px";
  scoreDiv.style.zIndex = 1000;
  scoreDiv.textContent = `Score: ${score}`;
  document.body.appendChild(scoreDiv);

  const oldTimer = document.getElementById("timerDisplay");
  if (oldTimer) oldTimer.remove();
  const timerDiv = document.createElement("div");
  timerDiv.id = "timerDisplay";
  timerDiv.style.position = "absolute";
  timerDiv.style.top = "10px";
  timerDiv.style.right = "10px";
  timerDiv.style.color = "white";
  timerDiv.style.backgroundColor = "rgba(0,0,0,0.5)";
  timerDiv.style.padding = "8px 12px";
  timerDiv.style.zIndex = 1000;
  timerDiv.textContent = `Time: ${gameTime}s`;
  document.body.appendChild(timerDiv);

  startTimer();
}

function startTimer() {
  if (gameTimer) clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    gameTime--;
    const el = document.getElementById("timerDisplay");
    if (el) el.textContent = `Time: ${gameTime}s`;
    if (gameTime <= 0) {
      endGame();
    }
  }, 1000);
}

export function setPaused(paused) {
  if (paused) {
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }
  } else {
    if (isGameActive && !gameTimer) {
      startTimer();
    }
  }
}

export function endGame() {
  isGameActive = false;
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }

  Object.keys(powerUpsConfig).forEach((k) => {
    if (powerUpsConfig[k].timer) {
      clearTimeout(powerUpsConfig[k].timer);
      powerUpsConfig[k].timer = null;
    }
    powerUpsConfig[k].active = false;
  });

  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) scoreDisplay.remove();
  const timerDisplay = document.getElementById("timerDisplay");
  if (timerDisplay) timerDisplay.remove();

  alert(`Game Over!\nFinal Score: ${score}`);
}

export function addScore(points) {
  if (!isGameActive) return;

  if (points > 0 && powerUpsConfig.doublePoints.active) {
    points *= powerUpsConfig.doublePoints.multiplier;
  }

  score += points;

  const el = document.getElementById("scoreDisplay");
  if (el) el.textContent = `Score: ${score}`;
}

export function activatePowerUp(type, net = undefined) {
  if (!powerUpsConfig[type]) return;

  powerUpsConfig[type].active = true;
  if (powerUpsConfig[type].timer) {
    clearTimeout(powerUpsConfig[type].timer);
  }

  powerUpsConfig[type].timer = setTimeout(() => {
    powerUpsConfig[type].active = false;
    powerUpsConfig[type].timer = null;
  }, powerUpsConfig[type].duration);
}

export function isPowerUpActive(type) {
  return !!(powerUpsConfig[type] && powerUpsConfig[type].active);
}

export function _getPowerUpsConfig() {
  return powerUpsConfig;
}

