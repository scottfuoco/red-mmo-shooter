import React, { Component } from 'react';
import Phaser from '/imports/startup/phaser-split.js';
import AccountsUIWrapper from './../../components/AccountsUiWrapper'

import BootState from './state/Boot'
import SplashState from './state/Splash'
import GameState from './state/Game'

import config from './config'

class Game extends Phaser.Game {

  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.AUTO, 'game', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Game', GameState, false);

    this.state.start('Boot');
  }
}


class App extends Component {
  constructor() {
    super()
    this.game = new Game()
  }

  render() {
    console.log(Meteor.userId())
    return (
      <div >
        <div className="login-wrapper">
          <AccountsUIWrapper />
        </div>
        <div id="game" style={{ display: Meteor.userId() ? 'block' : 'none' }}>
        </div>
        <div className="logged-out-message">
          <p  style={{ color: 'white' }}> Please sign in to see your todos. </p>
        </div>
      </div>
    );

  }
}

export default App;