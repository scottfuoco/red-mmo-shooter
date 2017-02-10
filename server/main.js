import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});
Meteor.onConnection(() => {
  Streamy.broadcast('hello', { data: 'world!' })
})
