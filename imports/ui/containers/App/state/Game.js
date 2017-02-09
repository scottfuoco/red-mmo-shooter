import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player'

export default class extends Phaser.State {
  init() {

  }
  preload() { }

  create() {
    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player',
    })

    this.platforms = this.game.add.physicsGroup();
    this.platforms.create(50, 150, 'platform');
    // this.platforms.create(200, 300, 'platform');
    // this.platforms.create(400, 350, 'platform');
    this.platforms.setAll('body.immovable', true)

    this.game.add.existing(this.player)

    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    
  }
  update(){
    this.game.physics.arcade.collide(this.player, this.platforms);
  }
  render() {

  }
}
