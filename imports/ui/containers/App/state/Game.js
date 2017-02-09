import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player'
import Platform from './../sprite/Platform'

export default class extends Phaser.State {
  init () {

  }
  preload () { }

  create () {
    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player',  
    })
    this.platform1 = new Platform({
       game: this,
      x: 200,
      y: 200,
      asset: 'platform',  
    })
     this.game.add.existing(this.player)
     this.game.physics.arcade.enable(this.player);
     this.player.body.collideWorldBounds = true;
  }
  
  render () {
    
  }
}
