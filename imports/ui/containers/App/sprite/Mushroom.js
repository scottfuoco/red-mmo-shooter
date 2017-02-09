import Phaser from '/imports/startup/phaser-split.js';


export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset, bulletasset }) {
    console.log(bulletasset)
    super(game, x, y, asset)
    this.cursors = game.input.keyboard.createCursorKeys()
    this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.anchor.setTo(0.5)
  }

  update() {
    if (this.cursors.left.isDown) {
      this.angle += 1
    }
    if (this.cursors.down.isDown) {
      this.y += 1
    }
    if (this.cursors.up.isDown) {
      this.y -= 1
    }
    if (this.cursors.right.isDown) {
      this.angle -= 1
    }

  }

}
