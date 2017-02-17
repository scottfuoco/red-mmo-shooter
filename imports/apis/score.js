import { Mongo } from 'meteor/mongo'

export const Score = new Mongo.Collection('score');

if (Meteor.isServer) {
  Meteor.publish('score', function scorePublication() {
    return Score.find({}, sort({'score':-1}).limit(5))
  });

}
Meteor.methods({
  'score.upsert'(score) {
    Score.upsert(Meteor.userId, { $set: { userEmail: Meteor.user().emails[0].address, score: score } });
  },
});