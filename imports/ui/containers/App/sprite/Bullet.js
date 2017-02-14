import Phaser from '/imports/startup/phaser-split.js';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.enableBody = true;
    this.createMultiple(5, 'bullet');
    this.set('outOfBoundsKill', true);
    this.set('checkWorldBounds', true);
    
    Streamy.on('movement', d => {
      this.x = d.data.x;
      this.y = d.data.y;
    });
  }

  create() {

  }
  update() {
    this.body.velocity.x = 0;
  }

}
