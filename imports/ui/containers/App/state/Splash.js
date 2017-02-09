import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])

    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('platform', 'img/platform.png');
    this.load.image('player', 'img/mushroom2.png')
    this.load.image('dj', 'img/dj1.png')
  }

  create () {
    this.state.start('Game')
  }

}
