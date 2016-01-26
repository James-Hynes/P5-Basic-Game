"use strict";

var player;
var game_control;
var bullet_list = [];

/*

Sprite Class -- Contains update, draw, etc.

*/

class Sprite {
  constructor(posX, posY) {
    this.posX = posX || 0;
    this.posY = posY || 0;
  }
}

var sprite = new Sprite(1);

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

  this.init();
}

var Bullet = function(keyCode, origX, origY) {
  this.keyCode = keyCode;
  this.x = origX; this.y = origY;
  this.speed = 15; this.movements = [];

  this.update = function() {
    this.x += this.movements[0]; this.y += this.movements[1];
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
    console.log(change_x, change_y);
    return [change_x, change_y];
  }

  this.movements = this.handle_direction(keyCode);
}

var Player = function() {
  this.update = function() {
    this.x += this.change_x;
    this.y += this.change_y;
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
    this.change_x += speedX;
    this.change_y += speedY;
  };

  this.shoot = function() {
    console.log(this.x, this.y);
    bullet_list.push(new Bullet(this.prev_dir, this.x, this.y));
  }

  this.name = "Player";
  this.state = 1;
  this.x = 50; this.y = 50;
  this.change_x = 0; this.change_y = 0; this.speed = 4;
  this.prev_dir = null;
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  game_control = new GameController();
}

function draw() {
  clear();
  player.update();
  handleObjectList(bullet_list);
}

function keyPressed() {
  switch(keyCode) {
    case 27: game_control.handleGameState();
    case 32: player.shoot(); break;
    case 37: case 38: case 39: case 40: player.handle_movements(keyCode, true); break;
  }

  return false;
}

function keyReleased() {
  switch(keyCode) {
    case 37: case 38: case 39: case 40: player.handle_movements(keyCode, false); break;
  }
  return false;
}

function handleObjectList(objectList) {
  objectList.forEach(function(obj) {
    obj.update();
  });
}
