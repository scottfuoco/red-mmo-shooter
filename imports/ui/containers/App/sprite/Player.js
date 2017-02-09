import Phaser from '/imports/startup/phaser-split.js';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.cursors = game.input.keyboard.createCursorKeys()
    // this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.anchor.setTo(0.5)
  }

  update() {
    if (this.cursors.left.isDown)
    {
        this.body.velocity.x = -250;
    }
    else if (this.cursors.right.isDown)
    {
        this.body.velocity.x = 250;
    }

    if (this.jumpButton.isDown && (this.body.onFloor() || this.body.touching.down))
    {
        this.body.velocity.y = -400;
    }

  }

}
