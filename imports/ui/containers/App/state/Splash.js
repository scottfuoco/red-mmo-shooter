import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // loading of assets
    this.load.image('platform', 'img/platform.png');
    this.load.image('player', 'img/mushroom2.png');
    this.load.image('dj', 'img/dj1.png');
    this.load.audio('backgroundMusic', ['audio/backgroundMusic.mp3']);
    this.load.audio('bulletFire', ['audio/bulletFire.mp3']);
  }

  create () {
    this.state.start('Game')
  }

}
