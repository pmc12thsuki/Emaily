'use strict';

const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/mailer/Mailer');
const surveyTemplate = require('../services/mailer/serveyTemplate');

const Survey = mongoose.model('surveys');
// 1. check user is login
// 2. check user has enough credit to create surveys
module.exports = (app) => {
  // user query for surveys list
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false }) // return a survey instance but exclude the recipients field
      .sort({ dateSent: -1, lastResponded: -1 });
    res.send(surveys);
  });


  // user create a survey
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    // use middleware to first check if user is login, then check if user has enough credits
    const {
      title, subject, body, recipients,
    } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })), // map string of email to object of email
      // the above is equal to
      // recipients.split(',).map( email => {
      // return { email: email}
      // })
      _user: req.user.id, // pass in the user id
      dateSent: Date.now(),
    });

    try {
      // send email by sendgrid, first argument is the data of our email, second is the html of our email
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      // after email is sent successfully, update Survey and User in DB
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  // sendgrid hit our webhooks
  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice'); // 我們想要從路徑中 parse 出來的樣式
    _.chain(req.body) // 使用 lodash 的 chain 功能，把 map, compact, uniqBy 串起來，最後再用 value 回傳處理好的值
      .map((event) => {
        const match = p.test(new URL(event.url).pathname); // 幫我們從 url parse 成 { surveyId: '5c89c11141a650a57e23d1c6', choice: 'yes' } 的樣式，如果缺少任一參數就會回覆 null
        if (match) {
          return {
            email: event.email,
            surveyId: match.surveyId,
            choice: match.choice,
          }; // 沒有 match 的 event 就會回傳 undefined
        }
      })
      .compact() // 這個函數會 loop array 並過濾掉那些 undefined 的值。
      .uniqBy('email', 'surveyId') // 這個函數會移除 array 中 duplicate 的那些（要 email + surveyId 一起重複出現才會被移除）
      .each(({ surveyId, email, choice }) => { // each query is an async function, but we dont need to wait for it execute
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: { email, responded: false },
          },
        }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date(),
        }).exec();
      })
      .value(); // 最後回傳 value


    res.send({});
    /*
    這段 code 跟上面一樣，只是上面更簡潔
    const events = req.body.map((event) => {
      const match = p.test(new URL(event.url).pathname); // 幫我們從 url parse 成 { surveyId: '5c89c11141a650a57e23d1c6', choice: 'yes' } 的樣式，如果缺少任一參數就會回覆 null
      if (match) {
        return {
          email: event.email,
          surveyId: match.surveyId,
          choice: match.choice,
        }; // 沒有 match 的 event 就會回傳 undefined
      }
    });

    const compactEvents = _.compact(events); // 這個函數會 loop array 並過濾掉那些 undefined 的值。我們也可以自己用 filter 寫
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId'); // 這個函數會移除 array 中 duplicate 的那些（要 email + surveyId 一起重複出現才會被移除）
    */
  });

  // recipients click the email link
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.redirect('/surveys/thanks');
  });
};
