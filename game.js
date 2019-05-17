window.addEventListener("load", function() {
  var GAME_WIDTH = 640;
  var GAME_HEIGHT = 480;
  var GAME_PADDING = 5;
  var ENEMY_WIDTH = 30;
  var ENEMY_HEIGHT = 30;
  var PLAYER_HEIGHT = 20;
  var PLAYER_WIDTH = 20;
  var PLAYER_SPEED = 3;
  var COIN_HEIGHT = 10;
  var COIN_WIDTH = 10;

  var gameOver = false;
  var numberOfLives = 3;
  var score = 0;

  var player = {
    x: GAME_PADDING,
    y: GAME_PADDING,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT,
    speedX: 0,
    speedY: 0
  };

  var enemies = [
    {
      x: 200,
      y: 150,
      w: ENEMY_WIDTH,
      h: ENEMY_HEIGHT,
      speedX: 4,
      speedY: 0
    },
    {
      x: 150,
      y: 200,
      w: ENEMY_WIDTH,
      h: ENEMY_HEIGHT,
      speedX: 0,
      speedY: 3
    },
    {
      x: 550,
      y: 150,
      w: ENEMY_WIDTH,
      h: ENEMY_HEIGHT,
      speedX: 3,
      speedY: 2
    },
    {
      x: 350,
      y: 50,
      w: ENEMY_WIDTH,
      h: ENEMY_HEIGHT,
      speedX: 2,
      speedY: 2
    },
    {
      x: 50,
      y: 350,
      w: ENEMY_WIDTH,
      h: ENEMY_HEIGHT,
      speedX: 1,
      speedY: 3
    }
  ];

  var coin = {
    x: 300,
    y: 200,
    w: 10,
    h: 10
  }

  var scoreNode = document.getElementById("score");
  var livesNode = document.getElementById("lives");
  var canvas = document.getElementById("mycanvas");
  var ctx = canvas.getContext("2d");

  canvas.addEventListener("animationend", (e) => {
    canvas.classList.remove("apply-shake");
  });

  addEventListener("keydown", function(e) {
    if (e.keyCode == 37) {
      player.speedX = -PLAYER_SPEED;
    }

    if (e.keyCode == 39) {
      player.speedX = PLAYER_SPEED;
    }

    if (e.keyCode == 38) {
      player.speedY = -PLAYER_SPEED;
    }

    if (e.keyCode == 40) {
      player.speedY = PLAYER_SPEED;
    }
  });

  addEventListener("keyup", function(e) {
    if (e.keyCode == 37) {
      player.speedX = 0;
    }

    if (e.keyCode == 39) {
      player.speedX = 0;
    }

    if (e.keyCode == 38) {
      player.speedY = 0;
    }

    if (e.keyCode == 40) {
      player.speedY = 0;
    }
  });

  var update = function() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    player.x = player.x + player.speedX;
    player.y = player.y + player.speedY;

    if (enemies.length < 5) {
      var newEnemySpeedX = getRandomInt(5);
      var newEnemySpeedY = getRandomInt(5);
      var newEnemyX = getRandomInt(GAME_WIDTH - GAME_PADDING - ENEMY_WIDTH);
      var newEnemyY = getRandomInt(GAME_HEIGHT - GAME_PADDING - ENEMY_HEIGHT);
      var newEnemy = {
        x: newEnemyX,
        y: newEnemyY,
        w: ENEMY_WIDTH,
        h: ENEMY_HEIGHT,
        speedX: newEnemySpeedX,
        speedY: newEnemySpeedY
      }

      enemies.push(newEnemy);
    }

    var createNewCoin = function() {
      coin.x = getRandomInt(GAME_WIDTH - GAME_PADDING - COIN_WIDTH);
      coin.y = getRandomInt(GAME_HEIGHT - GAME_PADDING - COIN_HEIGHT);
    }

    var boundaryLeft = function(object) {
      return object.x <= GAME_PADDING;
    }

    var boundaryRight = function(object) {
      return object.x + object.w >= GAME_WIDTH - GAME_PADDING;
    }

    var boundaryUp = function(object) {
      return object.y <= GAME_PADDING;
    }

    var boundaryDown = function(object) {
      return object.y + object.h >= GAME_HEIGHT - GAME_PADDING;
    }

    enemies.forEach((enemy, index) => {
      if (checkCollision(player, enemy)) {
        canvas.classList.add("apply-shake");
        numberOfLives--;
        livesNode.innerHTML = "NUMBER OF LIVES: " + numberOfLives;
        enemies.splice(index, 1);
        if (numberOfLives < 1) {
          gameOver = true;
        }
      }

      if (checkCollision(coin, enemy)) {
        createNewCoin();
      }

      enemy.x = enemy.x + enemy.speedX;
      enemy.y = enemy.y + enemy.speedY;

      if (boundaryLeft(enemy)) {
        enemy.x = GAME_PADDING;
        enemy.speedX = -enemy.speedX;
      }

      if (boundaryRight(enemy)) {
        enemy.x = GAME_WIDTH - enemy.w - GAME_PADDING;
        enemy.speedX = -enemy.speedX;
      }

      if (boundaryUp(enemy)) {
        enemy.y = GAME_PADDING;
        enemy.speedY = -enemy.speedY;
      }

      if (boundaryDown(enemy)) {
        enemy.y = GAME_HEIGHT - enemy.h - GAME_PADDING;
        enemy.speedY = -enemy.speedY;
      }
    });

    if (boundaryLeft(player)) { player.x = GAME_PADDING; }
    if (boundaryRight(player)) { player.x = GAME_WIDTH - player.w - GAME_PADDING; }
    if (boundaryUp(player)) { player.y = GAME_PADDING; }
    if (boundaryDown(player)) { player.y = GAME_HEIGHT - player.h - GAME_PADDING; }

    if (checkCollision(player, coin)) {
      score += 1000;
      scoreNode.innerHTML = "SCORE: " + score;
      createNewCoin();
    }
  }

  var draw = function() {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(coin.x, coin.y, coin.w, coin.h);

    ctx.fillStyle = "#FF0000";
    enemies.forEach((enemy) => {
      ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    });
  }

  var run = function() {
    update();
    draw();

    if(!gameOver) {
      window.requestAnimationFrame(run);
    }
  }

  var checkCollision = function(rect1, rect2) {
    var hitOnX = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
    var hitOnY = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
    return hitOnX && hitOnY;
  }

  var getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  run();
});
