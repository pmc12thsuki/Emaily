'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

// 定義該 collection 的 schema
const userSchema = new Schema({
  googleId: String,
});

// 實際創造該 collection
// 第一個參數是該 collection 的名字，第二個參數是該 collection 的 schema
mongoose.model('user', userSchema);
