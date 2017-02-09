import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player'

export default class extends Phaser.State {
  init() {

  }
  preload() { 

       this.load.image('bullet', 'img/bullet.png');

  }

  create() {
    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player',
    })

    this.platforms = this.game.add.physicsGroup();
    this.platforms.create(500, 150, 'platform');
    this.platforms.create(-200, 300, 'platform');
    this.platforms.create(400, 450, 'platform');
    this.platforms.setAll('body.immovable', true)

    this.game.add.existing(this.player)

    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.firingTimer = 0;
    this.bulletTime = 0;

    this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', .5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


  }
  update() {
    this.game.physics.arcade.collide(this.player, this.platforms);

            //  Firing?
        if (this.fireButton.isDown)
        {
            this.fireBullet();
        }

  }

   fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = this.bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(this.player.x, this.player.y + 8);
            bullet.body.velocity.x = 400;
            this.bulletTime = this.game.time.now + 200;
        }
    }

}
 resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}
  render() {

  }
}
