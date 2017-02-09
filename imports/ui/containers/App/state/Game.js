import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player';
import DJ from './../sprite/DJ';
export default class extends Phaser.State {
  init() {

  }
  preload() {

    this.load.image('bullet', 'img/bullet.png');

  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player',
    });

    this.dj = new DJ({
      game: this,
      x: this.world.width - 80,
      y: this.world.height - 50,
      asset: 'dj',
    })

    this.platforms = this.game.add.physicsGroup();
    this.platforms.create(500, 150, 'platform');
    this.platforms.create(-200, 300, 'platform');
    this.platforms.create(400, 450, 'platform');
    this.platforms.setAll('body.immovable', true)



    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;


    this.dj.physicsBodyType = Phaser.Physics.ARCADE;



    this.firingTimer = 0;
    this.bulletTime = 0;

    this.bullets = this.add.group();
    this.bullets.enableBody = true;

    this.bullets.createMultiple(10, 'bullet');
    this.bullets.setAll('anchor.x', .5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.physics.arcade.enable([this.bullets, this.dj, this.platforms]); 
    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    this.game.add.existing(this.dj);
    this.game.add.existing(this.player)

  }
  update() {
    this.game.physics.arcade.collide(this.player, this.platforms);

    //  Firing?
    if (this.fireButton.isDown) {
      this.fireBullet();
    }
    this.physics.arcade.collide(this.bullets, this.dj, this.collisionHandler, null, this);
    this.physics.arcade.collide(this.bullets, this.platforms, this.collisionHandler2, null, this);
    //this.physics.arcade.overlap(this.bullets, this.DJ, this.collisionHandler, null, this);
  }

  fireBullet() {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime) {
      //  Grab the first bullet we can from the pool
      bullet = this.bullets.getFirstExists(false);

      if (bullet) {
        //  And fire it
        bullet.reset(this.player.x, this.player.y + 8);
        bullet.body.velocity.x = 400;
        this.bulletTime = this.game.time.now + 200;
      }
    }

  }
  resetBullet(bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

  }
  collisionHandler2(bullet, platform) {
    console.log(bullet);
console.log('$$$$$$$$$$$$$$$$$$$$$$$$44');
    console.log(DJ)
    //  When a bullet hits an alien we kill them both
    bullet.kill();
  }
  collisionHandler(bullet, DJ) {
    console.log(bullet);
console.log('$$$$$$$$$$$$$$$$$$$$$$$$44');
    console.log(DJ)
    //  When a bullet hits an alien we kill them both
    bullet.kill();
    DJ.kill();
  }
  render() {
    this.game.debug.body(this.dj);
    this.game.debug.body(this.bullets);
    this.game.debug.body(this.player);
  }
}
