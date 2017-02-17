import Phaser from '/imports/startup/phaser-split'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.load.image('goodPlatform', 'img/goodPlatform.png');
    this.load.image('platform', 'img/flaming-death-cloud.png');
    this.load.image('player', 'img/mushroom3.png');
    this.load.image('djbullet', 'img/djbulletimg.png')
    this.load.image('dj', 'img/dj1.png');
    this.load.audio('backgroundMusic', ['audio/backgroundMusic.mp3']);
    this.load.audio('bulletFire', ['audio/bulletFire.mp3']);
    this.load.image('splashScreenImg', 'img/splash-screen-img.png');
    this.load.image('bullet', 'img/bullet.png');
  }

  create() {
    this.goToGame = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.goToHighscore = this.input.keyboard.addKey(Phaser.Keyboard.H);
    const style = { font: "bold 32px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };
    const text = this.add.text(0, 0, 'Welcome to play game, press space and play for fun.', style)
    text.setTextBounds(0, 0, this.world.width, 100);
    const controls1 = this.add.text(100, 200, '← : move left', style)
    const controls2 = this.add.text(100, 250, '→ : move right', style)
    const controls3 = this.add.text(100, 300, '↑ : jetpack', style)
    const controls4 = this.add.text(100, 350, 'spacebar: jump and shoot', style)

    const splashScreenImg = this.game.add.sprite(this.world.centerX, 100, 'splashScreenImg');
    this.game.add.tween(splashScreenImg.scale).to({ x: 1.5, y: 1.5 }, 2000, Phaser.Easing.Linear.None, true);
    const tween = this.game.add.tween(splashScreenImg).to({ angle: 30 }, 2000, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(addSpashText, this);

    function addSpashText() {
      const text2 = this.add.text(0, 0, 'Smells like wieners.', style)
      text2.setTextBounds(0, 650, this.world.width, 100);
    }
  }

  update() {


    if (Meteor.userId()) {
      if (this.goToGame.isDown) {
        this.state.start('Game');
      }
      if (this.goToHighscore.isDown) {
        this.state.start('Score');
      }

    } else {
      let text2 = this.add.text(this.world.centerX - 500, this.world.centerY, 'Log the fuck in', { font: '35px Arial', fill: '#000', align: 'center' })
    }
  }
}
