const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Player
const player = {
  x: 180,
  y: 500,
  width: 40,
  height: 40,
  speed: 5,
  dy: 0
};

// Obstacles
let obstacles = [];
let score = 0;
let highScore = localStorage.getItem("donkeyHighScore") || 0;
document.getElementById("highscore").innerText = highScore;

// Key Controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function updatePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
}

function spawnObstacle() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  obstacles.push({ x: x, y: -size, width: size, height: size });
}

function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += 3;
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
      document.getElementById("score").innerText = score;
    }
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver();
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "brown";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "gray";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

function gameOver() {
  alert("Game Over! Your Score: " + score);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("donkeyHighScore", highScore);
  }
  score = 0;
  obstacles = [];
  player.x = 180;
  player.y = 500;
  document.getElementById("score").innerText = score;
  document.getElementById("highscore").innerText = highScore;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  updateObstacles();
  drawPlayer();
  drawObstacles();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Spawn obstacles every 1.5 seconds
setInterval(spawnObstacle, 1500);
gameLoop();
