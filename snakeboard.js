const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";

document.addEventListener("keydown", changeDirectionEvent);

const board_border = "white";
const board_background = "black";
const snake_col = "white";
const snake_border = "black";

let changing_direction = false;

let dy = 0;
let dx = 20;

let food_x;
let food_y;

let score = 0;

let snake = [
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 },
  { x: 140, y: 200 },
  { x: 120, y: 200 },
];

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = snake_col;
  snakeboard_ctx.strokeStyle = snake_border;
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function clearCanvas() {
  snakeboard_ctx.fillStyle = board_background;
  snakeboard_ctx.strokeStyle = board_border;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function main() {
  if (hasGameEnded()) return;

  changing_direction = false;
  setTimeout(function onTick() {
    clearCanvas();
    move_snake();
    drawFood();
    drawSnake();
    main();
  }, 100);
}

function changeDirectionEvent(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -20;
  const goingDown = dy === 20;
  const goingRight = dx === 20;
  const goingLeft = dx === -20;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -20;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -20;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 20;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 20;
  }
}
main();

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 20;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 20;

  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
    alert("Game Over! Press ok to play again");
    window.location.reload();
  }

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function generatefood() {
  food_x = random_food(0, snakeboard.width - 20);
  food_y = random_food(0, snakeboard.height - 20);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) generatefood();
  });
}

function drawFood() {
  snakeboard_ctx.fillStyle = "green";
  snakeboard_ctx.strokestyle = "black";
  snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
  snakeboard_ctx.strokeRect(food_x, food_y, 20, 20);
}

function move_snake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    generatefood();
  } else {
    snake.pop();
  }
}

generatefood();