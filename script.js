const game = document.getElementById("game");
const player = document.getElementById("player");
const coin = document.getElementById("coin");
const obstacle = document.getElementById("obstacle");
const powerUp = document.getElementById("power-up");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const gameOverMessage = document.getElementById("game-over-message");

let score = 0;
let speed = 8; // Increased initial speed
let obstacleSpeed = 6; // Increased initial obstacle speed
let powerUpSpeed = 4;
let isMovingLeft = false;
let isMovingRight = false;
let isGameRunning = false;
let powerUpActive = false;
let powerUpTimeout;
const gameWidth = game.offsetWidth;
const playerWidth = player.offsetWidth;

// Initial player position
const initialPlayerPosition = { left: 130, bottom: 10 };

function movePlayer() {
  const playerPosition = player.getBoundingClientRect();
  const gamePosition = game.getBoundingClientRect();

  if (isMovingLeft && playerPosition.left > gamePosition.left) {
    player.style.left = Math.max(parseInt(player.style.left) - 5, 0) + "px"; // Boundary check on the left side
  }
  if (isMovingRight && playerPosition.right < gamePosition.right) {
    player.style.left =
      Math.min(parseInt(player.style.left) + 5, gameWidth - playerWidth) + "px"; // Boundary check on the right side
  }
}

function randomPosition() {
  const x = Math.random() * (game.offsetWidth - 30);
  coin.style.left = x + "px";
  if (score >= 5) {
    obstacle.style.display = "block";
    const obstacleX = Math.random() * (game.offsetWidth - 50);
    obstacle.style.left = obstacleX + "px";
    obstacle.style.top = "0px"; // Reset obstacle to the top after collecting the coin
  }
  if (Math.random() < 0.2) {
    const powerUpX = Math.random() * (game.offsetWidth - 30);
    powerUp.style.left = powerUpX + "px";
    powerUp.style.top = "-30px";
  }
}

function dropCoin() {
  let coinY = 0;
  const dropInterval = setInterval(() => {
    coinY += speed;
    coin.style.top = coinY + "px";

    if (coinY > game.offsetHeight) {
      clearInterval(dropInterval);
      gameOver();
    }

    if (detectCollision(player, coin)) {
      clearInterval(dropInterval);
      score += 1;
      speed += 0.5; // Increase speed as score increases
      scoreElement.textContent = score;
      resetCoin();
      resetObstacle(); // Reset obstacle after collecting a coin
    }

    if (detectCollision(player, obstacle)) {
      clearInterval(dropInterval);
      gameOver();
    }
  }, 50);
}

function dropObstacle() {
  let obstacleY = 0;
  const obstacleDropInterval = setInterval(() => {
    obstacleY += obstacleSpeed;
    obstacle.style.top = obstacleY + "px";
    if (obstacleY > game.offsetHeight) {
      obstacleY = -50;
      obstacle.style.top = obstacleY + "px";
    }
  }, 50);
}

function resetObstacle() {
  // Reset obstacle position to the top of the game area
  obstacle.style.top = "-50px";
}

function dropPowerUp() {
  let powerUpY = 0;
  const powerUpDropInterval = setInterval(() => {
    powerUpY += powerUpSpeed;
    powerUp.style.top = powerUpY + "px";

    if (powerUpY > game.offsetHeight) {
      powerUp.style.top = "-100px";
    }

    if (detectCollision(player, powerUp) && !powerUpActive) {
      powerUpActive = true;
      clearTimeout(powerUpTimeout);
      player.style.transition = "0.05s ease-in-out";
      powerUpTimeout = setTimeout(() => {
        powerUpActive = false;
        player.style.transition = "0.1s ease-in-out";
      }, 5000);
      powerUp.style.top = "-100px";
    }
  }, 50);
}

function detectCollision(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();
  return !(
    rect2.bottom < rect1.top ||
    rect2.top > rect1.bottom ||
    rect2.right < rect1.left ||
    rect2.left > rect1.right
  );
}

function resetCoin() {
  randomPosition();
  coin.style.top = "0px";
  dropCoin();
}

function gameOver() {
  isGameRunning = false;
  gameOverMessage.style.display = "block";
  startBtn.style.display = "block";
}

function startGame() {
  score = 0;
  speed = 8; // Reset initial speed
  obstacleSpeed = 6; // Reset obstacle speed
  isGameRunning = true;
  gameOverMessage.style.display = "none";
  startBtn.style.display = "none";
  scoreElement.textContent = score;
  obstacle.style.display = "none";
  resetCoin();
  resetObstacle(); // Ensure obstacle starts from the top
  dropObstacle();
  dropPowerUp();
  // Reset player to initial position
  player.style.left = initialPlayerPosition.left + "px";
  player.style.bottom = initialPlayerPosition.bottom + "px";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") isMovingLeft = true;
  if (e.key === "ArrowRight") isMovingRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") isMovingLeft = false;
  if (e.key === "ArrowRight") isMovingRight = false;
});

startBtn.addEventListener("click", () => {
  if (!isGameRunning) {
    startGame();
  }
});

setInterval(movePlayer, 10);
