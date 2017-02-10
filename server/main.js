import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  Streamy.on('clientMove', function (d, s) {
    console.log(d.data); // Will print 'world!'
    Streamy.broadcast('movement', { data: d.data })
  });

  Streamy.on('DJDie', function(d, s){

    Streamy.broadcast('spawnDJ', { data: { x:d.data.x, y:d.data.y } })

  })

});
Meteor.onConnection(() => {
  Streamy.broadcast('hello', { data: 'world!' })
})
