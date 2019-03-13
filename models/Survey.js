'use strict';

const mongoose = require('mongoose');
const { RecipientSchema } = require('./Recipient');

const { Schema } = mongoose;

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], // array of strings,
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }, // a id which reference to a instance of a user that belongs to User collection
  // _user 前面的底線不是必須的，但用底線開頭會讓別人知道這是一個 relationship
  dateSent: Date,
  lastResponded: Date,
});

mongoose.model('surveys', surveySchema);
