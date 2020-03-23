/* VARIABLES & START OF PROJECT */
var canvas,
  ctx,
  width = 600,
  height = 600,
  enemy,
  enemy_x = 100,
  enemy_y = -45,
  enemy_w = 32,
  enemy_h = 32,
  enemyTotal = 5,
  enemies = [],
  speed = 3,
  rightKey = false,
  leftKey = false,
  upKey = false,
  downKey = false,
  laserTotal = 2,
  lasers = [],
  score = 0,
  alive = true,
  levens = 3,
  gameStarted = false;

var spaceship = {
  x: 100,
  y: 500,
  width: 32,
  height: 32,
  counter: 0
};

var keyboard = {};

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 64;
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}


addKeyboardEvents();
setInterval(gameLoop, 1000 / 30);

/* DRAW SHIP */

function drawSpaceship() {
  ctx.fillStyle = "white";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function addEvent(node, name, func) {
  if (node.addEventListener) {
    node.addEventListener(name, func, false);
  } else if (node.attachEvent) {
    node.attachEvent(name, func);
  }
}


/* SHIP MOVEMENT */

function updateSpaceship() {

  // move left
  if (keyboard[37]) {
    spaceship.x -= 10;
    if (spaceship.x < 0) {
      spaceship.x = 0;
    }
  }

  // move right
  if (keyboard[39]) {
    spaceship.x += 10;
    var right = canvas.width - spaceship.width;
    if (spaceship.x > right) {
      spaceship.x = right;
    }
  }
}

function addKeyboardEvents() {
  addEvent(document, "keydown", function(e) {
    if (e.keyCode == 32) {
      keyboard[e.keyCode] = false;
    } else {
      keyboard[e.keyCode] = true;
    }
  });

  addEvent(document, "keyup", function(e) {
    if (e.keyCode == 32) {
      keyboard[e.keyCode] = false;
      fireLaser();
    } else {
      keyboard[e.keyCode] = false;
    }
  });

}


function updateSpaceship() {
  if (keyboard[37]) {
    spaceship.x -= 10;
    if (spaceship.x < 0) {
      spaceship.x = 0;
    }
  }

  if (keyboard[39]) {
    spaceship.x += 10;
    var right = canvas.width - spaceship.width;
    if (spaceship.x > right) {
      spaceship.x = right;
    }
  }
}


/* DRAW LASER OF SHIP */

function drawLaser() {
  if (lasers.length) {
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(lasers[i][0], lasers[i][1], lasers[i][2], lasers[i][3]);
    }
  }
}

/* MOVE LASER OF SHIP */

function moveLaser() {
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
}

/* DRAW ENEMIES */

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemies[i][0], enemies[i][1], enemy_w, enemy_h);
  }
}

/* MOVE ENEMIES */

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][1] < height) {
      enemies[i][1] += enemies[i][4];
    } else if (enemies[i][1] > height - 1) {
      enemies[i][1] = -45;
    }
  }
}

/* WHEN LASER HITS ENEMIES */
function hitTest() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
      }
    }
    if (remove === true) {
      lasers.splice(i, 1);
      remove = false;
    }
  }
}

/* WHEN SHIP HITS ENEMIES */
function shipCollision() {
  var spaceship_xw = spaceship.x + spaceship.width,
    spaceship_yh = spaceship.y + spaceship.height;
  for (var i = 0; i < enemies.length; i++) {
    if (spaceship.x > enemies[i][0] && spaceship.x < enemies[i][0] + enemy_w && spaceship.y > enemies[i][1] && spaceship.y < enemies[i][1] + enemy_h) {
      checkLevens();
    }
    if (spaceship_xw > enemies[i][0] && spaceship_xw < enemies[i][0] + enemy_w && spaceship.y > enemies[i][1] && spaceship.y < enemies[i][1] + enemy_h) {
      checkLevens();
    }
    if (spaceship_yh > enemies[i][1] && spaceship_yh < enemies[i][1] + enemy_h && spaceship.x > enemies[i][0] && spaceship.x < enemies[i][0] + enemy_w) {
      checkLevens();
    }
    if (spaceship_yh > enemies[i][1] && spaceship_yh < enemies[i][1] + enemy_h && spaceship_xw < enemies[i][0] + enemy_w && spaceship_xw > enemies[i][0]) {
      checkLevens();
    }
  }
}

/* CHECK LEVENS AFTER SHIP HITS ENEMIES */
function checkLevens() {
  levens -= 1;
  if (levens > 0) {
    reset();
  } else if (levens === 0) {
    alive = false;
  }
}

/* RESET GAME AFTER LOSING ALL LIVES */
function reset() {
  var enemy_reset_x = 100;
  spaceship.x = (width / 2) - 16, spaceship.y = height - 48, spaceship.width = 32, spaceship.height = 32;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i][0] = enemy_reset_x;
    enemies[i][1] = -45;
    enemy_reset_x = enemy_reset_x + enemy_w + 64;
  }
}

/* GAME OVER */
function continueButton(e) {
  var cursorPos = getCursorPos(e);
  if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
    alive = true;
    levens = 3;
    reset();
    canvas.removeEventListener('click', continueButton, false);
  }
}


/* CHANGE TO START POSITION WHEN YOU LOSE A LIVE */
function getCursorPos(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}

function cursorPosition(x, y) {
  this.x = x;
  this.y = y;
}

/* END SCREEN & SCORE + LIVES */
function scoreTotal() {
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Score: ', 10, 55);
  ctx.fillText(score, 70, 55);
  ctx.fillText('Levens: ', 10, 30);
  ctx.fillText(levens, 80, 30);
  if (!alive) {
    ctx.fillText('Game Over!', 245, height / 2);
    ctx.fillRect((width / 2) - 60, (height / 2) + 10, 100, 40);
    ctx.fillStyle = '#000';
    ctx.fillText('Continue?', 250, (height / 2) + 35);
    canvas.addEventListener('click', continueButton, false);
  }
}

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
}

/* EVENT TO START GAME */
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  setInterval(gameLoop, 25);
  canvas.addEventListener('click', gameStart, false);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

/* LOOP */
function gameLoop() {
  clearCanvas();
  if (alive && gameStarted && levens > 0) {
    hitTest();
    shipCollision();
    moveEnemies();
    moveLaser();
    drawEnemies();
    updateSpaceship();
    drawSpaceship();
    drawLaser();
  }
  scoreTotal();
}

function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
  if (e.keyCode == 38) upKey = true;
  else if (e.keyCode == 40) downKey = true;
  if (e.keyCode == 32 && lasers.length <= laserTotal) lasers.push([spaceship.x + 16, spaceship.y - 20, 4, 20]);
}

function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
  if (e.keyCode == 38) upKey = false;
  else if (e.keyCode == 40) downKey = false;
}

window.onload = init;
