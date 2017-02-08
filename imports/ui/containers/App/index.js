import React, { Component } from 'react';
import Phaser from '/imports/startup/phaser-split.js';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, create, update });
let paddle1;
let paddle2;

function preload(){
  game.load.image('paddle', 'img/paddle.png')
}

function create() {
  paddle1 = createPaddle(0, game.world.centerY);

  // note the anchor point for the paddle is in the middle and hte sprite is 32px wide that is where -16 comes from
  paddle2 = createPaddle(game.world.width - 16, game.world.centerY);
}

function update() {
  controlPaddle(paddle1, game.input.y)
}

function createPaddle(x, y) {
  const paddle = game.add.sprite(x, y, 'paddle');
  paddle.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(paddle);
  paddle.bodycollideWorldBounds = true;

  return paddle;
}

function controlPaddle(paddle, y) {
  paddle.y = y;

  if (paddle.y < paddle.height / 2) {
    paddle.y = paddle.height /2;
  } else if ( paddle.y > game.world.height - paddle.height /2){
    paddle.y = game.world.height - paddle.height / 2;
  }
}

class App extends Component {
  render() {
    return (
      <div id="game">
        
      </div>
    );
  }
}

export default App;