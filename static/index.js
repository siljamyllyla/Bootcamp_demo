// HTML

function game() {
    document.querySelector("#firstTab").style.visibility = "visible"
    document.querySelector("#secondTab").style.visibility = "hidden"
}

function winners() {
    document.querySelector("#firstTab").style.visibility = "hidden"
    document.querySelector("#secondTab").style.visibility = "visible"
}


// GAME

const scoreDisplay = document.querySelector(".high-score");
const reset = document.querySelector(".reset");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

let highScore = parseInt(localStorage.getItem("highScore"));

if (isNaN(highScore)) {
  highScore = 0;
}

scoreDisplay.innerHTML = `${highScore}`;

reset.addEventListener("click", () => {
  localStorage.setItem("highScore", "0");
  score = 0;
  scoreDisplay.innerHTML = `0`;
});

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

let score = 0;

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Score: " + score, 8, 20);
}

let speed = 3;

let ball = {
  x: canvas.height / 2,
  y: canvas.height - 50,
  dx: speed,
  dy: -speed + 1,
  radius: 7,
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = "#FFD8FB";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
};

let paddle = {
  height: 10,
  width: 76,
  x: canvas.width / 2 - 76 / 2,
  draw: function() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = "#FFFAD8";
    ctx.fill();
    ctx.closePath();
  }
};


ball.draw()
paddle.draw()

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  ball.draw()
  paddle.draw()
  movePaddle()
  collisionDetection()
  levelUp()
  drawScore()
  gameOver()

    // reset score
    if (ball.y + ball.radius > canvas.height) {
      if (score > parseInt(localStorage.getItem("highScore"))) {
        localStorage.setItem("highScore", score.toString());
        scoreDisplay.innerHTML = `${score}`;
      }
      // score = 0;
      generateBricks();
      ball.dx = speed;
      ball.dy = -speed + 1;
    }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  if (ball.y + ball.radius > canvas.height) {
    LIFE--; // LOSE LIFE
    console.log("You lost")
  }

  // Bounce off paddle
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y + ball.radius >= canvas.height - paddle.height
  ) {
    ball.dy *= -1;
  }
  if(! GAME_OVER) {
    requestAnimationFrame(play);
  }

}

let gameLevelUp = true;

function movePaddle() {
  if (rightPressed) {
    paddle.x += 7;
    console.log("Right")
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    console.log("Left")
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 35;

var bricks = [];

function generateBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#A1E5FF";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          ball.x >= b.x &&
          ball.x <= b.x + brickWidth &&
          ball.y >= b.y &&
          ball.y <= b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
          score++;
        }
      }
    }
  }
}

function levelUp() {
  if (score % 15 == 0 && score != 0) {
    if (ball.y > canvas.height / 2) {
      generateBricks();
    }

    if (gameLevelUp) {
      if (ball.dy > 0) {
        ball.dy += 1;
        gameLevelUp = false;
      } else {
        ball.dy -= 1;
        gameLevelUp = false;
      }
      console.log(ball.dy);
    }
  }

  if (score % 15 != 0) {
    gameLevelUp = true;
  }
}

let GAME_OVER = false
let LIFE = 1

function startGame() {
  generateBricks();
  play();

}

function gameOver() {
  if(LIFE <= 0) {
    GAME_OVER = true;
  }
}