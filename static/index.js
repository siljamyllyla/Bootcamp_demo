// HTML

function game() {
    document.querySelector("#firstTab").style.visibility = "visible"
    document.querySelector("#secondTab").style.visibility = "hidden"
}

function winners() {
    document.querySelector("#firstTab").style.visibility = "hidden"
    document.querySelector("#secondTab").style.visibility = "visible"
}


// Database

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
  drawBricks()
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

  // reset score
  if (ball.y + ball.radius > canvas.height) {
    if (score > parseInt(localStorage.getItem("highScore"))) {
      localStorage.setItem("highScore", score.toString());
      scoreDisplay.innerHTML = `${score}`;
    }
    // score = 0;
    generateBricks();
    resetBall()
    ball.dx = speed;
    ball.dy = -speed + 1;
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

function resetBall() {
  ball.x = canvas.height / 2,
  ball.y = canvas.height - 50
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
        ctx.fillStyle = "#FFD8DE";
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

// const grid = document.querySelector('.grid')
// const scoreDisplay = document.querySelector('#score')
// // const highScore = document.querySelector('.high-score')
// const ballDiameter = 20
// const boardWidth = 560
// const boardHeight = 600
// let xDirection = 2
// let yDirection = 2

// const blockWidth = 100
// const blockHeight = 20

// const userStart = [230, 10]
// let currentPosition = userStart

// const ballStart = [270, 40]
// let ballCurrentPosition = ballStart

// let timerId
// let score = 0

// //my block
// class Block {
//   constructor(xAxis, yAxis) {
//     this.bottomLeft = [xAxis, yAxis]
//     this.bottomRight = [xAxis + blockWidth, yAxis]
//     this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
//     this.topLeft = [xAxis, yAxis + blockHeight]
//   }
// }

// //all blocks
// const blocks = [
//   new Block(10, 570),
//   new Block(120, 570),
//   new Block(230, 570),
//   new Block(340, 570),
//   new Block(450, 570),
//   new Block(10, 540),
//   new Block(120, 540),
//   new Block(230, 540),
//   new Block(340, 540),
//   new Block(450, 540),
//   new Block(10, 510),
//   new Block(120, 510),
//   new Block(230, 510),
//   new Block(340, 510),
//   new Block(450, 510),
// ]



// //add user
// const user = document.createElement('div')
// user.classList.add('user')
// grid.appendChild(user)


// //add ball
// const ball = document.createElement('div')
// ball.classList.add('ball')
// grid.appendChild(ball)


// // start game by pressing button
// function startGame() {
//   addBlocks()

//   drawUser()
//   drawBall()
//   // resetBall()

//   timerId = setInterval(moveBall, 10)
//   document.addEventListener('keydown', moveUser)

//   // reset score
//   if(score > parseInt(localStorage.getItem('HighScore'))) {
//     localStorage.setItem('highScore', score.toString())
//     scoreDisplay.innerHTML = `High Score: ${score}`
//   }

// }

// //draw blocks
// function addBlocks() {
//   for (let i = 0; i < blocks.length; i++) {
//     const block = document.createElement('div')
//     block.classList.add('block')
//     block.style.left = blocks[i].bottomLeft[0] + 'px'  
//     block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
//     grid.appendChild(block)
//     console.log(blocks[i].bottomLeft)
//   }
// }

// //draw User
// function drawUser() {
//   user.style.left = currentPosition[0] + 'px'
//   user.style.bottom = currentPosition[1] + 'px'
// }

// //move user
// function moveUser(e) {
//   switch (e.key) {
//     case 'ArrowLeft':
//       if (currentPosition[0] > 0) {
//         currentPosition[0] -= 10
//         console.log("Left")
//         drawUser()  
//       }
//       break
//     case 'ArrowRight':
//       if (currentPosition[0] < (boardWidth - blockWidth)) {
//         currentPosition[0] += 10
//         console.log("right")
//         drawUser()   
//       }
//       break
//   }
// }

// //draw Ball
// function drawBall() {
//   ball.style.left = ballCurrentPosition[0] + 'px'
//   ball.style.bottom = ballCurrentPosition[1] + 'px'
// }

// //move ball
// function moveBall() {
//     ballCurrentPosition[0] += xDirection
//     ballCurrentPosition[1] += yDirection
//     drawBall()
//     checkForCollisions()
//     gameOver()
// }

// // // reset ball position
// // function resetBall() {
// //   ballCurrentPosition = ballStart
// //   drawBall()
// // }

// //check for collisions
// function checkForCollisions() {
//   //check for block collision
//   for (let i = 0; i < blocks.length; i++){
//     if
//     (
//       ((ballCurrentPosition[0] + ballDiameter) > blocks[i].bottomLeft[0] && (ballCurrentPosition[0] + ballDiameter) < blocks[i].bottomRight[0]) &&
//       ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && (ballCurrentPosition[1] + ballDiameter) < blocks[i].topLeft[1])
//     )
//       {
//       const allBlocks = Array.from(document.querySelectorAll('.block'))
//       allBlocks[i].classList.remove('block')
//       blocks.splice(i,1)
//       changeDirectionBlock()

//       score++
//       scoreDisplay.innerHTML = score
//       if (blocks.length == 0) {
//         scoreDisplay.innerHTML = score
//         clearInterval(timerId)
//         document.removeEventListener('keydown', moveUser)
//       }
//     }
//   }
//   // check for wall hits
//   if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0)
//   {
//     changeDirectionWall()
//   }

//   // ceiling hits
//   if (ballCurrentPosition[1] >= (boardHeight - ballDiameter))
//   {
//     changeDirectionCeiling()
//   }

//   //check for user collision
//   if
//   (
//     (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
//     (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
//   )
//   {
//     changeDirectionUser()
//   }

// }



// function gameOver() {
//   if (ballCurrentPosition[1] <= 0) {
//   score = 0
//   addBlocks()
//   ballCurrentPosition = ballStart
//   drawBall()

//   }
// }

// function changeDirectionUser() {
//   if (xDirection === 2 && yDirection === -2) {
//     yDirection = 2
//     return
//   }
//   if (xDirection === -2 && yDirection === -2) {
//     yDirection = 2
//     return
//   }
// }

// function changeDirectionBlock() {
//     if (xDirection === 2 && yDirection === 2) {
//         yDirection = -2
//         return
//     }
//     if (xDirection === -2 && yDirection === 2) {
//         yDirection = -2
//         return
//     }
    
// }

// function changeDirectionWall(){
//     if (xDirection === -2 && yDirection === 2) {
//         xDirection = 2
//         return
//     }
//     if (xDirection === 2 && yDirection === 2) {
//         xDirection = -2
//         return
//     }
//     if (xDirection === 2 && yDirection === -2) {
//         xDirection = -2
//         return
//     }
//     if (xDirection === -2 && yDirection === -2) {
//         xDirection = 2
//         return
//     }
// }

// function changeDirectionCeiling(){
//   if (xDirection === 2 && yDirection === 2) {
//     yDirection = -2
//     return
//   }
//   if (xDirection === -2 && yDirection === 2) {
//     yDirection = -2
//     return
//   }
// }