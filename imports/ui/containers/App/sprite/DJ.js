import Phaser from '/imports/startup/phaser-split.js';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset)
    // this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.anchor.setTo(0.5)

  }

  create() {

  }
  update() {
    this.body.velocity.x = 0;



  }
}
