'use strict';

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/mailer/Mailer');
const surveyTemplate = require('../services/mailer/serveyTemplate');

const Survey = mongoose.model('surveys');
// 1. check user is login
// 2. check user has enough credit to create surveys
module.exports = (app) => {
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
};
