import React, { Component } from 'react';
import Phaser from '/imports/startup/phaser-split.js';

import BootState from './state/Boot'
import SplashState from './state/Splash'
import GameState from './state/Game'

import config from './config'

class Game extends Phaser.Game {

  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.AUTO, 'game', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}
var game = new Game()

class App extends Component {
  render() {
    return (
      <div id="game">
        
      </div>
    );
  }
}

export default App;