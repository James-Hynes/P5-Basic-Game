
var player;
var game_control;
var bullet_list = [];

/*

Sprite Class -- Contains update, draw, etc.

*/

var Sprite = function(posX, posY, sizeX, sizeY, movement, shape) {
  this.posX = posX || 0;
  this.posY = posY || 0;
  this.movement = movement || [0, 0];
  this.shape = shape || false;

  this.update = function() {
    this.posX += this.movement[0];
    this.posY += this.movement[1];
    this.draw();
  }

  this.draw = function() {
    this.shape(posX, posY, sizeX, sizeY);
  }


}

var sprite = new Sprite(100, 100, 25, 25, [0, 0], rect);

/*

Level class -- Array drawing.

[
'x', 'x', 'x', 'x', 'x'
'x', 'o', 'o', 'o', 'x',
'x', 'o', 'o', 'o', 'x',
'x', 'x', 'x', 'x', 'x'
]

*/

var GameController = function() {
  this.init = function() {
    player = new Player();
  }

  this.state = 0;
  this.handleGameState = function() {
    if(this.state === 0) {
      this.resume();
    } else {
      this.pause();
    }
  }
  this.pause = function() {
    this.state = 0;
    noLoop();
  };
  this.resume = function() {
    this.state = 1;
    loop();
  };

  this.update = function() {
    player.update();
    this.handleObjectList(bullet_list);
  }

  this.handleObjectList = function(objectList) {
    objectList.forEach(function(obj) {
      obj.update();
    });
  }

  this.init();
}

var Bullet = function(keyCode, origX, origY) {
  this.keyCode = keyCode;
  this.x = origX; this.y = origY;
  this.speed = 15; this.movements = [];

  this.update = function() {
    this.x += this.movements[0];
    this.y += this.movements[1];
    rect(this.x, this.y, 10, 10);
  }

  this.handle_direction = function(keyCode) {
    change_x = 0;
    change_y = 0;
    if(keyCode % 2 !== 0) {
      change_x = (keyCode - 38) * this.speed;
    } else {
      change_y = (keyCode - 39) * this.speed;
    }

    return [change_x, change_y];
  }

  this.movements = this.handle_direction(keyCode);
}

var Player = function() {
  this.update = function() {
    this.x += this.movements[0];
    this.y += this.movements[1];

    // Handle out of bounds
    if(this.x > displayWidth + 25) {
      this.x = 0;
    } else if(this.x < -25) {
      this.x = displayWidth;
    };
    if(this.y > displayHeight) {
      this.y = 0;
    } else if(this.y < -25) {
      this.y = displayHeight - 25;
    };
    // **************************

    this.image = rect(this.x, this.y, 25, 25);
  };

  this.handle_movements = function(keyCode, pressed) {
    var speedX = 0; var speedY = 0;
    if(keyCode % 2 !== 0) {
      speedX = (keyCode - 38) * this.speed * (pressed ? 1 : -1);
    } else {
      speedY = (keyCode - 39) * this.speed * (pressed ? 1 : -1);
    }

    if(pressed) {
      this.prev_dir = keyCode;
    }
    this.movements[0] += speedX; this.movements[1] += speedY;
  };

  this.shoot = function() {
    bullet_list.push(new Bullet(this.prev_dir, this.x, this.y));
  }

  this.x = 50; this.y = 50;
  this.movements = [0, 0]; this.speed = 4;
  this.prev_dir = null;
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  game_control = new GameController();
}

function draw() {
  clear();
  sprite.update();
  game_control.update();
}

function keyPressed() {
  switch(keyCode) {
    case 27: game_control.handleGameState();
    case 32: player.shoot(); break;
    case 37: case 38: case 39: case 40: player.handle_movements(keyCode, true); break;
  }
}

function keyReleased() {
  switch(keyCode) {
    case 37: case 38: case 39: case 40: player.handle_movements(keyCode, false); break;
  }
}
