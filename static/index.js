function game() {
    document.querySelector("#firstTab").style.visibility = "visible"
    document.querySelector("#secondTab").style.visibility = "hidden"
}

function winners() {
    document.querySelector("#firstTab").style.visibility = "hidden"
    document.querySelector("#secondTab").style.visibility = "visible"
}


// Database

const dbscore = {
  getScore() {
    console.log("Highscore")
  }
}

// GAME

const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = 2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0

//my block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

//all blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]



//add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()



// start game by pressing button
function startGame() {
  addBlocks()
  resetBall()

  timerId = setInterval(moveBall, 20)
  document.addEventListener('keydown', moveUser)

}

//draw blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    grid.appendChild(block)
    console.log(blocks[i].bottomLeft)
  }
}

//draw User
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

//move user
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        console.log(currentPosition[0] > 0)
        drawUser()  
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10
        console.log(currentPosition[0])
        drawUser()   
      }
      break
  }
}

//draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
    gameOver()
}

// reset ball position
function resetBall() {
  ballCurrentPosition = ballStart
  drawBall()
}

//check for collisions
function checkForCollisions() {
  //check for block collision
  for (let i = 0; i < blocks.length; i++){
    if
    (
      ((ballCurrentPosition[0] + ballDiameter) > blocks[i].bottomLeft[0] && (ballCurrentPosition[0] + ballDiameter) < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && (ballCurrentPosition[1] + ballDiameter) < blocks[i].topLeft[1])
    )
      {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i,1)
      changeDirectionBlock()

      score++
      scoreDisplay.innerHTML = score
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }
  // check for wall hits
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0)
  {
    changeDirectionWall()
  }

  // ceiling hits
  if (ballCurrentPosition[1] >= (boardHeight - ballDiameter))
  {
    changeDirectionCeiling()
  }

  //check for user collision
  if
  (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
  )
  {
    changeDirectionUser()
  }

}

function gameOver() {
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'You lose!'
    document.removeEventListener('keydown', moveUser)
  }
}

function changeDirectionUser() {
  if (xDirection === 2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
}

function changeDirectionBlock() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        yDirection = -2
        return
    }
    
}

function changeDirectionWall(){
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
    if (xDirection === 2 && yDirection === 2) {
        xDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        xDirection = 2
        return
    }
}

function changeDirectionCeiling(){
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    yDirection = -2
    return
  }
}