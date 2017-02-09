import Phaser from '/imports/startup/phaser-split'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
  }

  preload () {

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', 'img/loader-bar.png')
    this.load.image('loaderBar', 'img/loader-bar.png')
  }

  render () {
      this.state.start('Splash')
  }
}
