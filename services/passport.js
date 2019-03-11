'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

// 從 mongoose 中找出名字為 user 的 collection
const User = mongoose.model('user');

// 這個 function 定義如何將 user 中獨特的資訊 (id) 加密，並將其設在使用者的 cookie 上 (或 session, JWT 等)
passport.serializeUser((user, done) => {
  // 這邊的 user 就是我們從 DB 裡 createOrFind 的那個 user result，也就是下方 callback 中 done(null, existingUser) 或 done(null, user) 的 user
  // call done(err, identifying-piece-of-information-that-is-going-to-identify-the-user-in-follow-request)
  done(null, user.id);
  // 這邊使用的 user.id ，不會是 goole 的 profile.id，而是這個使用者的資料在 mongoDB 中的 id (primary key)
  // 也就是說，在拿到 google profile.id 後，他對我們來說就不重要了。因為我們可能會提供多種登入方法，所以作為判斷 user 的獨特 id 識別，不應該使用「外部」的 id(google profile.id)，而是使用建立在 mondoDB 中的 「內部」 id
  // 要取得 mongodb 中 instance 的 id （也就是_id），可以直接用 .id 拿到，如 user.id
});

// 這個 function 定義當有 request 進來時，如何透過 cookie 解密後得捯的 userid，找出該 user instance
passport.deserializeUser((id, done) => {
  // id 是 passport 幫我們從 user's browser 取出的 cookie，並解密之後還原的 id (mongodb user id)
  // 接著拿這個 id 去 mongodb 中查找出這個 user instance
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// create a new instance of GoogleStrategy
passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback', // the callback url after user grant premission
  proxy: true, // let google to trust heroku's proxy
}, (accessToken, refreshToken, profile, done) => {
  // this is the only place we can get users profile
  // accessToken，之後該應用程式可以拿 accessToken 向 google 證明該用戶有給過 premission，如此就不用每次用戶登入就要重新 grant premission，我們目前不會用到，但在某些應用程式中常用
  // refreshToken，當 accessToken 過期時可以這個來 refresh
  // profile，使用者的資訊，是我們想要的東西

  // after saving user into db, we must call done() in our passport callback
  // done() take two argument, first is error, second is the user we find
  console.log(accessToken, refreshToken, profile);
  User.findOne({ googleId: profile.id }).then((existingUser) => {
    if (existingUser) {
      // find this user
      done(null, existingUser);
    } else {
      // create a new user instance (which is a record in DB)
      new User({ googleId: profile.id }).save().then((user) => {
        done(null, user);
      });
    }
  });
}));
