'use strict';

const passport = require('passport');

module.exports = (app) => {
  // 當使用者想要登入時，交給 passport 來處理這個 request
  app.get('/auth/google', passport.authenticate('google', {
    // 並告訴 passport，
    // google strategy has an internal identifier of 'google', so passport will go and find the GoogleStrategy above
    // scope is optional, it tell google what access we want to have inside of the user's profile
    scope: ['profile', 'email'],
  }));

  //  使用者 grant premission 之後，google 會送回一組 code 到 callback URL ，因此我們需要在 express 中設定 callback URL 這個 route，讓 passport 再拿著這組 code 回去向 google server 換取使用者 profile
  // after user grant premission, passport will then get the code and request to google server to exchange user's profile back
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/surveys');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    // req.logout is a function that is attached automatically to the request object by passport
    // when we call logout(), it takes the cookie that contains our user ID and it kills the ID
    req.logout();
    res.redirect('/');
  });
};
