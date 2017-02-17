import Phaser from '/imports/startup/phaser-split.js';
import DJ from './DJ';
import Score from '../../../../apis/score'
export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.cursors = game.input.keyboard.createCursorKeys()
    // this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.anchor.setTo(0.5)
    this.score = this.getScore()
    this.facing = "right"
  }
  increasePlayerScore() {
    this.score++
    localStorage.setItem('myScore', this.score);
    Meteor.call('score.upsert', this.score)
  }
  getScore(){
    const storage = localStorage.getItem('myScore');
    if (storage) return storage
    return 0
  }

  update() {
    // console.log(this);
    if(this.alive)console.log("I EXIST")
    this.body.velocity.x = 0;
    this.body.gravity.y = 900;
    if (this.cursors.left.isDown) {
      this.facing = "left"
      this.body.velocity.x = -650;
    }
    if (this.cursors.right.isDown) {
      this.facing = "right"
      this.body.velocity.x = 650;
    }
    if (this.cursors.up.isDown) {
      this.body.velocity.y = -650;
    }

    if (this.cursors.down.isDown) {
      this.body.velocity.y = 1300;
    }
    if (this.jumpButton.isDown && (this.body.onFloor() || this.body.touching.down)) {
      this.body.velocity.y = -550;
    }

    if (this.body.velocity.x || this.body.velocity.y) {
      Streamy.emit('clientMove', { id: Streamy.id(), data: { direction: this.facing, x: this.x, y: this.y } });
    }
  }

}
