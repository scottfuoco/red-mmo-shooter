import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])

    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('platform', 'img/platform.png');
    this.load.image('player', 'img/mushroom2.png');
    this.load.image('dj', 'img/dj1.png');

    this.load.audio('backgroundMusic', ['audio/backgroundMusic.mp3']);
    this.load.audio('bulletFire', ['audio/bulletFire.mp3']);
  }

  create() {

    this.goToGame = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    let text = this.add.text(this.world.centerX-500, this.world.centerY-200, 'Welcome to play game, press space and play for fun.', { font: '35px Arial', fill: '#000', align: 'center' })

  }

  update() {
    if (this.goToGame.isDown) {
      this.state.start('Game');
    }
  }
}
