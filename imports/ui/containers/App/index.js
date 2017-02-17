import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Phaser from '/imports/startup/phaser-split.js';
import AccountsUIWrapper from './../../components/AccountsUiWrapper'

import BootState from './state/Boot'
import SplashState from './state/Splash'
import ScoreState from './state/Score'
import GameState from './state/Game'
import LoginState from './state/Login'
import config from './config'

class Game extends Phaser.Game {

  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.AUTO, 'game', null);
    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Score', ScoreState, false);
    this.state.add('Login' , LoginState, false);
    this.state.add('Game', GameState, false);
    this.state.start('Boot');
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.game = new Game()
  }

  render() {
    return (
      <div >
        <div className="login-wrapper">
          <AccountsUIWrapper />
        </div>
        <div id="game" style={{ display: (this.props.currentUserId ? 'block' : 'none') }}>
        </div>
        {this.props.currentUserId ?
          <div></div>
          :
          <div className="logged-out-message">
            <p style={{ color: 'white' }}> Please sign in to start playing. </p>
          </div>
        }
      </div>
    );

  }
}

export default createContainer(() => {
  return {
    currentUserId: Meteor.userId(),
  };
}, App);