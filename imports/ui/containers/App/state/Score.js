import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
  }

  create() {
    this.goToGame = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.goToSplash = this.input.keyboard.addKey(Phaser.Keyboard.H);
    const style = { font: "bold 32px Arial", fill: "#000", boundsAlignH: "cnter", boundsAlignV: "middle" };
    const text = this.add.text(0, 0, `Your shit score is ${localStorage.getItem('myScore')}`, style)
    // Make the score request one from the DB
    text.setTextBounds(0, 0, this.world.width, 100);

    const splashScreenImg = this.game.add.sprite(this.world.centerX, this.world.centerY-300, 'splashScreenImg');
    this.game.add.tween(splashScreenImg.scale).to({ x: 2, y: 2 }, 2000, Phaser.Easing.Linear.None, true);
    const tween = this.game.add.tween(splashScreenImg).to({ angle: 45 }, 2000, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(addSpashText, this);

    function addSpashText() {
      const text2 = this.add.text(0, 0, 'Smells like wieners.', style)
      text2.setTextBounds(0, 500, this.world.width, 100);
    }
  }

  update() {


    if (Meteor.userId()) {
      if (this.goToGame.isDown) {
        this.state.start('Game');
      }
      if (this.goToSplash.isDown) {
        this.state.start('Splash');
      }

    } else {
      let text2 = this.add.text(this.world.centerX - 500, this.world.centerY, 'Log the fuck in', { font: '35px Arial', fill: '#000', align: 'center' })
    }
  }
}
