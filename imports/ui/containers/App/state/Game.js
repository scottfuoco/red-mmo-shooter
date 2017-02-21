import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player';
import DJ from './../sprite/DJ';
// import { fireButton } from './../methods/bullet.js';
export default class extends Phaser.State {
  init() {

  }
  preload() {

  }

  create() {
    this.stage.disableVisibilityChange = false;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.bulletSpeed = 600;
    // generate random starting x posiiton based on world width
    const x = Math.floor(Math.random() * this.world.width);
    const y = Math.floor(Math.random() * this.world.height);
    this.textincrement = 0;
    this.style = { font: "bold 32px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };

    // create player with starting position
    this.player = new Player({
      game: this,
      x,
      y,
      asset: 'player',
    });
    this.game.add.existing(this.player);

    // send server players coordinates to broadcast to all other clients
    Streamy.emit('newChallenger', { id: Streamy.id(), player: { x, y } });


    Streamy.on('movement', d => {
      this.djObjects[d.data.id].x = d.data.x;
      this.djObjects[d.data.id].y = d.data.y;
    });

    this.platforms = this.game.add.physicsGroup();
    this.platforms.create(90, 440, 'platform');
    this.platforms.create(730, 110, 'platform');
    this.platforms.create(730, 440, 'platform');
    this.platforms.setAll('body.immovable', true)

    this.goodPlatforms = this.game.add.physicsGroup();
    this.goodPlatforms.create(0, 275, 'goodPlatform');
    this.goodPlatforms.create(820, 400, 'goodPlatform');
    this.goodPlatforms.create(820, 150, 'goodPlatform');
    this.goodPlatforms.setAll('body.immovable', true)


    this.djObjects = {};
    

    Streamy.on('createChallenger', d => {


      this.djObjects[d.challenger.id] = this.game.add.existing(new DJ({ game: this, x: d.challenger.player.x, y: d.challenger.player.y, asset: 'dj' }));
      this.physics.arcade.enable(this.djObjects[d.challenger.id]);
      Streamy.emit('createChallengerResponse', { newChallengerId: d.challenger.id, id: Streamy.id(), player: { x: this.player.x, y: this.player.y, alive: this.player.alive } });

    });

    Streamy.on('requestChallengers', d => {

      this.djObjects[d.challenger.id] = this.game.add.existing(new DJ({ game: this, x: d.challenger.player.x, y: d.challenger.player.y, asset: 'dj' }));
      if (!d.challenger.player.alive) {
        this.djObjects[d.challenger.id].kill();
      }
      this.physics.arcade.enable(this.djObjects[d.challenger.id]);

    });
    Streamy.on('spawnBullet', d => {
      this.fireEvilBullet(d.data);
    })
    Streamy.on('respawnHim', d => {
      this.djObjects[d.data.id].reset(d.data.x, d.data.y)
    })
    Streamy.on('heWon', d => {
      this.gameOver(d.email)
    })

    this.firingTimer = 0;
    this.bulletTime = 0;
    this.createBulletSettings()

    // set physics on below entities and groups
    this.physics.arcade.enable([this.bullets, this.player, this.platforms]);
    this.player.body.collideWorldBounds = true;
    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.respawnkey = this.input.keyboard.addKey(Phaser.Keyboard.R);

    this.game.add.existing(this.bullets.getFirstExists(false));

    Streamy.on('killDJ', (d, s) => {
      if (d.data.id === Streamy.id()) {
        this.player.kill();
        return;
      }
      this.djObjects[d.data.id].kill();
    });

    while (this.physics.arcade.overlap(this.player, this.platforms, null, this.platformSpawnCheck, this) ||
      this.physics.arcade.overlap(this.player, this.goodPlatforms, null, this.platformSpawnCheck, this)) {
      let newX = Math.floor(Math.random() * this.world.width);
      let newY = Math.floor(Math.random() * this.world.height);
      this.player.x = newX;
      this.player.y = newY;
      this.player.reset(newX, newY)
    }

    music = this.game.add.audio('backgroundMusic');
    bulletFire = this.game.add.audio('bulletFire');
    music.loop = true;
    music.play();

    this.game.onPause.add(function () {
      Streamy.emit('DJDie', { data: { id: Streamy.id() }, myID: Streamy.id() });
      this.state.start('Splash')
    }, this);
  }

  update() {

    //  Firing?
    if (this.fireButton.isDown && this.player.visible) {
      this.fireBullet(this.player.facing);
    }
    if (this.respawnkey.isDown & !this.player.visible) {
      this.respawnPlayer()
    }

    this.physics.arcade.collide(this.player, this.goodPlatforms);
    this.physics.arcade.collide(this.player, this.platforms, this.collisionHandlerPlayerPlatform, null, this);
    this.physics.arcade.collide(this.bullets, this.platforms, this.collisionHandlerBulletPlatform, null, this);
    this.physics.arcade.collide(this.DJbullets, this.platforms, this.collisionHandlerDJBulletPlatform, null, this);

    for (dj in this.djObjects) {
      if (this.physics.arcade.collide(this.bullets, this.djObjects[dj], this.collisionHandlerBulletDJ, this.collisionProccessorBulletDJ, this)) {
        this.player.increasePlayerScore();
        Streamy.emit('DJDie', { data: { id: dj }, myID: Streamy.id() });

      }
    }
  }
  collisionHandlerDJBulletDJ(bullet, DJ) {
    //  When a bullet hits an alien DJ we kill them both
    bullet.kill();
  }

  platformSpawnCheck() {
    return true;
  }

  respawnPlayer() {
    let newX = Math.floor(Math.random() * this.world.width);
    let newY = Math.floor(Math.random() * this.world.height);
    this.player.x = newX;
    this.player.y = newY;
    this.player.reset(newX, newY)

    while (this.physics.arcade.overlap(this.player, this.platforms, null, this.platformSpawnCheck, this) ||
      this.physics.arcade.overlap(this.player, this.goodPlatforms, null, this.platformSpawnCheck, this)) {
      newX = Math.floor(Math.random() * this.world.width);
      newY = Math.floor(Math.random() * this.world.height);
      this.player.x = newX;
      this.player.y = newY;
      this.player.reset(newX, newY)
    }

    this.player.reset(newX, newY)

    Streamy.emit('respawnMe', { data: { x: newX, y: newY }, id: Streamy.id() })
  }
  collisionProccessorBulletDJ() {
    return true;
  }
  fireBullet(facing) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime) {
      //  Grab the first bullet we can from the pool
      bullet = this.bullets.getFirstExists(false);
      bulletFire.play()
      if (bullet) {
        //  And fire it
        bullet.reset(this.player.x, this.player.y);
        if (facing === 'left') {
          bullet.angle = -180;
          bullet.body.velocity.x = -this.bulletSpeed;
        }
        if (facing === 'right') {
          bullet.angle = 0;
          bullet.body.velocity.x = this.bulletSpeed;
        }
        Streamy.emit('bulletFire', { data: { bulletx: this.player.x, bullety: this.player.y, facing }, id: Streamy.id() });
        this.bulletTime = this.game.time.now + 320;
      }
    }
  }

  //Cast Evil bullet flying
  fireEvilBullet({x, y, facing}) {
    bullet = this.DJbullets.getFirstExists(false);
    bulletFire.play()
    if (bullet) {
      //  And fire it
      bullet.reset(x, y + 12);
      if (facing === 'left') {
        bullet.angle = -180;
        bullet.body.velocity.x = -this.bulletSpeed;
      }
      if (facing === 'right') {
        bullet.angle = 0;
        bullet.body.velocity.x = this.bulletSpeed;
      }
    }
  }
  resetBullet(bullet) {
    //  Called if the bullet goes out of the screen
    bullet.kill();

  }
gameOver(email){
  this.state.start('GameOver', false, false, email)
}
  collisionHandlerBulletDJ(DJ, bullet) {
    //  When a bullet hits an alien DJ we kill them both
    if (bullet.body.velocity.x < 0) bullet.body.velocity.x = -400
    if (bullet.body.velocity.x > 0) bullet.body.velocity.x = 400
    this.player.winscore++
    // this.scoreObjects[Streamy.id()].setText(`Your Score: ${this.player.winscore}`)

    DJ.kill();

    if (bullet.body.velocity.x > 0) {
      bullet.body.velocity.x = this.bulletSpeed;
    } else {
      bullet.body.velocity.x = -this.bulletSpeed;
    }
    // bullet.kill();
  }

  collisionHandlerPlayerPlatform(player, platform) {
    Streamy.emit('DJDie', { data: { id: Streamy.id() }, myID: Streamy.id() });
    player.kill();
  }

  collisionHandlerBulletPlatform(bullet, platform) {
    //  When a bullet hits an alien DJ we kill them both
    bullet.kill();
  }
  collisionHandlerDJBulletPlatform(bullet, platform) {
    //  When a bullet hits an alien DJ we kill them both
    bullet.kill();
  }

  createBulletSettings() {
    // MY BULLETS
    this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(7, 'bullet');
    this.bullets.setAll('anchor.x', .5);
    this.bullets.setAll('anchor.y', .5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('immovable', true);

    // EVIL BULLETS
    this.DJbullets = this.add.group();
    this.DJbullets.enableBody = true;
    this.DJbullets.createMultiple(500, 'djbullet');
    this.DJbullets.setAll('anchor.x', .5);
    this.DJbullets.setAll('anchor.y', .5);
    this.DJbullets.setAll('outOfBoundsKill', true);
    this.DJbullets.setAll('checkWorldBounds', true);
  }

  render() {
  }
}

