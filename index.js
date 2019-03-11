'use strict';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();
const PORT = process.env.PORT || 5000;

// create a new instance of GoogleStrategy
passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback', // the callback url after user grant premission
}, (accessToken, refreshToken, profile, done) => {
  // this is the only place we can get users profile
  // accessToken，之後該應用程式可以拿 accessToken 向 google 證明該用戶有給過 premission，如此就不用每次用戶登入就要重新 grant premission，我們目前不會用到，但在某些應用程式中常用
  // refreshToken，當 accessToken 過期時可以這個來 refresh
  // profile，使用者的資訊，是我們想要的東西
  console.log(accessToken, refreshToken, profile);
}));

// 當使用者想要登入時，交給 passport 來處理這個 request
app.get('/auth/google', passport.authenticate('google', {
  // 並告訴 passport，
  // google strategy has an internal identifier of 'google', so passport will go and find the GoogleStrategy above
  // scope is optional, it tell google what access we want to have inside of the user's profile
  scope: ['profile', 'email'],
}));

//  使用者 grant premission 之後，google 會送回一組 code 到 callback URL ，因此我們需要在 express 中設定 callback URL 這個 route，讓 passport 再拿著這組 code 回去向 google server 換取使用者 profile
// after user grant premission, passport will then get the code and request to google server to exchange user's profile back
app.get('/auth/google/callback', passport.authenticate('google'));


app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
