'use strict';

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.post('/api/stripe', requireLogin, async (req, res) => { // we can pass in as many middleware as we want
    await stripe.charges.create({
      amount: 500, // confirm the amount again, 因為前端送來的資料有可能被惡意竄改
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id, // the token passed form frontend, which is the authorization of the charge
    });

    // 透過 passport 的幫助，我們可以直接透過 req.user 來 access 到發送這個 request 的 user instance
    // 並且可以直接操作這個 instance
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
    // 我們應該要傳回去 save 之後回傳所得到的 user，而不是 req.user。雖然兩個 referenct 到同樣的 instance，但可以確保「回傳的 user」一定是與 DB 同步
  });
};
