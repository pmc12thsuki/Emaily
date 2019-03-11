'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');
require('./models/User'); // 要先宣告 Schema, 之後才能使用。因為 passport 中會對 schema 操作，因此 pasport 一定要放在這行之後
require('./services/passport'); // 因為 passport 中沒有 export 的東西，所以只需要單純 require 這段 code 就好


mongoose.connect(keys.mongoURI);

const app = express();
const PORT = process.env.PORT || 5000;

// tell express how to handle cookie
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days here. how long does the cookie live in max. 單位是 milisecond
    keys: [keys.cookieKey], // used to encrypt our cookie. can provide multiple key, and it will randomly choose one
  })
);
// tell passport that it should make use of cookies to handle auth
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoute')(app); // 將 app 當作參數傳入 route 中，才能設定需要的 route，相等於以下的 code 但更簡潔
/*
const authRoute = require('./routes/authRoutes');
authRoute(app);
*/


app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
