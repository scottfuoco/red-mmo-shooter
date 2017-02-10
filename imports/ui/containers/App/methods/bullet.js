fireBullet(facing) {
    console.log(facing)
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime) {
      //  Grab the first bullet we can from the pool
      bullet = this.bullets.getFirstExists(false);

      bulletFire.play()
      if (bullet) {
        //  And fire it
        bullet.reset(this.player.x, this.player.y + 8);
        if (facing === "left"){
          bullet.angle = -180;
          bullet.body.velocity.x = -400;
        }
        if (facing === 'right'){
          bullet.angle = 0;
          bullet.body.velocity.x = 400;
        }


        this.bulletTime = this.game.time.now + 200;
      }
    }
  }