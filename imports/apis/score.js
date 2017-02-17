import { Mongo } from 'meteor/mongo'

export const Score = new Mongo.Collection('score');

Meteor.methods({
  'score.upsert'(score) {
    Score.upsert(Meteor.userId, { $set: { userEmail: Meteor.user().emails[0].address, score: score } });
  },
});