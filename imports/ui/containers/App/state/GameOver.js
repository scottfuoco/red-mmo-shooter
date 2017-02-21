import Phaser from '/imports/startup/phaser-split'

export default class extends Phaser.State {
  init() {
   (email)=>{this.winner = email}
  }

  preload() {
    let text = this.add.text(this.world.centerX, this.world.centerY, `${this.winner} has won!`, { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5);
    this.scale.pageAlignHorizontally = true;
  }

  render() {
  }
}