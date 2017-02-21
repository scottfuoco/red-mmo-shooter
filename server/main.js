import { Meteor } from 'meteor/meteor';
import './../imports/startup/register_api'

Meteor.startup(() => {
  // code to run on server at startup

  let numOfConnections = 0;

  Streamy.on('clientMove', (d, s) => {
    Streamy.broadcast('movement', { data: { direction: d.data, id: d.id, x: d.data.x, y: d.data.y } }, d.id);
  });

  Streamy.on('DJDie', (d, s) => {
    Streamy.broadcast('killDJ', { data: { id: d.data.id } }, d.myID)
  })

  Streamy.on('newChallenger', (d, s) => {
    if(numOfConnections >= 4) {
      Streamy.emit('gameFull', {}, Streamy.sockets(d.id))
      console.log(numOfConnections);
      console.log('seeeeeeeeeeeeeeessss');
      return;
    }
    numOfConnections++;
    Streamy.broadcast('createChallenger', { challenger: { id: d.id, player: { x: d.player.x, y: d.player.y } } }, d.id);
  })

  Streamy.on('createChallengerResponse', (d, s) => {
    Streamy.emit('requestChallengers', { challenger: { id: d.id, player: { x: d.player.x, y: d.player.y, alive: d.player.alive } } }, Streamy.sockets(d.newChallengerId))
  })

  Streamy.on('bulletFire', (d, s) => {
    Streamy.broadcast('spawnBullet', { data: { x: d.data.bulletx, y: d.data.bullety, facing: d.data.facing } }, d.id)
  })

  Streamy.on('respawnMe', (d, s) => {
    Streamy.broadcast('respawnHim', {
      data: {
        x: d.data.x, y: d.data.y, id: d.id
      }
    }, d.id)
  })
  Streamy.on('iWon', (d, s) => {
    Streamy.broadcast('heWon', {
      winner: d.email
    }, d.id)
  })
  Streamy.on('ScoreUp', (d, s) => {
    console.log("increase Score")
    Streamy.broadcast('upHisScore', {
      id: d.id, score: d.score
    }, d.id)
  })

});

Meteor.onConnection(() => {

});