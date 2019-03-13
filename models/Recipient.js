'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false },
});

// instaed of add this schema into mongoose, we export this schema because it is a subDocument of Survey
module.exports = {
  RecipientSchema,
};
