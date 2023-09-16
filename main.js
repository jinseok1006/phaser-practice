import Phaser from 'phaser';

let player;
let cursor;
let jumping = false;
let canDoubleJump = false;
let doubleJumping = false;
let maxHeight = 600;
const logText = () =>
  `jumping: ${jumping}, doubleJumping: ${doubleJumping}, canDoubleJump:${canDoubleJump}\nvelocity: (${
    player.body.velocity.x
  },${player.body.velocity.y}), maxHeight:${600 - Math.ceil(maxHeight)}`;

let log;

class MyScene extends Phaser.Scene {
  constructor() {
    super('MyScene');
  }
  preload() {
    this.load.baseURL = './assets/';
    this.load.image('myPlayer', 'char.png');
  }
  create() {
    cursor = this.input.keyboard.createCursorKeys();
    player = this.physics.add.sprite(100, 550, 'myPlayer');
    player.setCollideWorldBounds(true);

    this.physics.world.enable(player);

    log = this.add.text(10, 10, logText(), {
      fill: '#000000',
    });
  }
  update() {
    const speed = 200;

    if (cursor.left.isDown) {
      player.setVelocityX(-speed);
    } else if (cursor.right.isDown) {
      player.setVelocityX(speed);
    } else {
      player.setVelocityX(0);
    }

    if (cursor.space.isDown) {
      if (!jumping) {
        player.setVelocityY(-300);
        jumping = true;
      } else if (canDoubleJump && !doubleJumping) {
        player.setVelocityY(player.body.velocity.y - 300);
        canDoubleJump = false;
        doubleJumping = true;
      }
    }

    if (jumping && !cursor.space.isDown && !doubleJumping) {
      canDoubleJump = true;
    }

    if (cursor.shift.isDown) {
      player.setVelocityY(-100);
    }

    // 중력에 의한 가속
    if (!player.body.blocked.down) {
      player.setAccelerationY(150);
    } else {
      player.setAccelerationY(0);
      jumping = false;
      doubleJumping = false;
      canDoubleJump = false;
    }

    if (player.body.y < maxHeight) {
      maxHeight = player.body.y;
    }
    log.setText(logText());
  }
}

function main() {
  const game = new Phaser.Game({
    parent: 'app',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0xffffff,
    scene: MyScene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 330 },
        debug: true,
      },
    },
  });
}

window.onload = main;
