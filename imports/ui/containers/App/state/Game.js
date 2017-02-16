import Phaser from '/imports/startup/phaser-split.js';
import Player from './../sprite/Player';
import DJ from './../sprite/DJ';
// import { fireButton } from './../methods/bullet.js';
export default class extends Phaser.State {
  init() {

  }
  preload() {
    this.load.image('bullet', 'img/bullet.png');
  }

  create() {

    this.stage.disableVisibilityChange = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // this.bullets = bulletFactory.create(this);

    // generate random starting x posiiton based on world width
    const x = Math.floor(Math.random() * this.world.width);
    const y =  Math.floor(Math.random() * this.world.height);

    // create player with starting position
    this.player = new Player({
      game: this,
      x,
      y,
      asset: 'player',
    });
    // send server players coordinates to broadcast to all other clients
    Streamy.emit('newChallenger', { id: Streamy.id(), player: { x, y } });

    Streamy.on('movement', d => {
      this.djObjects[d.data.id].x = d.data.x;
      this.djObjects[d.data.id].y = d.data.y;
    });

    this.platforms = this.game.add.physicsGroup();
    this.platforms.create(600, 550, 'platform');
    this.platforms.create(-50, 350, 'platform');
    this.platforms.create(1000, 200, 'platform');
    this.platforms.setAll('body.immovable', true)

    this.djObjects = {};

    Streamy.on('createChallenger', d => {
      this.djObjects[d.challenger.id] = this.game.add.existing(new DJ({ game: this, x: d.challenger.player.x, y: d.challenger.player.y, asset: 'dj' }));
      this.physics.arcade.enable(this.djObjects[d.challenger.id]);
      Streamy.emit('createChallengerResponse', { newChallengerId: d.challenger.id, id: Streamy.id(), player: { x: this.player.x, y: this.player.y } });
    });

    Streamy.on('requestChallengers', d => {
      console.log('request Challenger');
      this.djObjects[d.challenger.id] = this.game.add.existing(new DJ({ game: this, x: d.challenger.player.x, y: d.challenger.player.y, asset: 'dj' }));
      this.physics.arcade.enable(this.djObjects[d.challenger.id]);
    });
    Streamy.on('spawnBullet',d =>{
      this.fireEvilBullet(d.data);
    } )
    Streamy.on( 'respawnHim', d =>{
      this.djObjects[d.data.id].reset( d.data.x, d.data.y )
    })
    this.firingTimer = 0;
    this.bulletTime = 0;
    this.createBulletSettings()

    // set physics on below entities and groups
    this.physics.arcade.enable([this.bullets, this.player, this.platforms]);
    this.player.body.collideWorldBounds = true;
    this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.respawnkey = this.input.keyboard.addKey(Phaser.Keyboard.R);

    this.game.add.existing(this.player);
    this.game.add.existing(this.bullets.getFirstExists(false));
    this.spawnDJ = false;
    this.spawnDJLocation = {};


    Streamy.on('spawnDJ', (d, s) => {
      this.spawnDJ = true;
      this.spawnDJLocation = { x: d.data.x, y: d.data.y };
    });

    Streamy.on('killDJ', (d, s) => {
      if (d.data.id === Streamy.id()) {
        this.player.kill();
        return;
      }    
      this.djObjects[d.data.id].kill();
    });


    music = this.game.add.audio('backgroundMusic');
    bulletFire = this.game.add.audio('bulletFire');
    music.loop = true;
    //music.play();

        if(this.game.pause) {
      Meteor.disconnect();
    }

  }

  update() {
        if(this.game.pause) {
      Meteor.disconnect();
    }
    this.game.physics.arcade.collide(this.player, this.platforms);
    //  Firing?
    if (this.fireButton.isDown && this.player.visible) {
      this.fireBullet(this.player.facing);
    }
    if (this.respawnkey.isDown & !this.player.visible){
      this.respawnPlayer()
    }

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

respawnPlayer(){
  const newX = Math.floor(Math.random() * this.world.width);
  const newY =  Math.floor(Math.random() * this.world.height);
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
        bullet.reset(this.player.x, this.player.y + 8);
        if (facing === 'left') {
          bullet.angle = -180;
          bullet.body.velocity.x = -400;
        }
        if (facing === 'right') {
          bullet.angle = 0;
          bullet.body.velocity.x = 400;
        }
        Streamy.emit('bulletFire', {data:{bulletx: this.player.x, bullety: this.player.y, facing }, id:Streamy.id() });

        this.bulletTime = this.game.time.now + 200;
      }
    }
  }

  //Cast Evil bullet flying
  fireEvilBullet({x, y, facing}) {
      bullet = this.DJbullets.getFirstExists(false);
      bulletFire.play()
      if (bullet) {
        //  And fire it
        bullet.reset(x, y + 8);
        if (facing === 'left') {
          bullet.angle = -180;
          bullet.body.velocity.x = -400;
        }
        if (facing === 'right') {
          bullet.angle = 0;
          bullet.body.velocity.x = 400;
        }
      }
  }
  resetBullet(bullet) {
    //  Called if the bullet goes out of the screen
    bullet.kill();

  }

  collisionHandlerBulletDJ(DJ, bullet) {
    //  When a bullet hits an alien DJ we kill them both
    DJ.kill();
    // bullet.kill();
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
    this.bullets.createMultiple(5, 'bullet');
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
    // this.game.debug.body(this.dj);
    // this.game.debug.body(this.bullets);
    // this.game.debug.body(this.player);
  }
}

