import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.load.image('platform', 'img/platform.png');
    this.load.image('player', 'img/mushroom2.png');
    this.load.image( 'djbullet', 'img/djbulletimg.png')
    this.load.image('dj', 'img/dj1.png');
    this.load.audio('backgroundMusic', ['audio/backgroundMusic.mp3']);
    this.load.audio('bulletFire', ['audio/bulletFire.mp3']);
  }

  create() {

    this.goToGame = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    let text = this.add.text(this.world.centerX - 500, this.world.centerY - 200, 'Welcome to play game, press space and play for fun.', { font: '35px Arial', fill: '#000', align: 'center' })

  }

  update() {
    if (Meteor.userId()) {
      if (this.goToGame.isDown) {
        this.state.start('Game');
      }
    } else {
      let text2 = this.add.text(this.world.centerX-500, this.world.centerY, 'Log the fuck in', { font: '35px Arial', fill: '#000', align: 'center' })
    }
  }
}
