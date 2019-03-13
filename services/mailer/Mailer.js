'use strict';

const sendgrid = require('sendgrid');

const helper = sendgrid.mail;
const keys = require('../../config/keys');

// follow the sendGrid document to config Mailer
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    // content is the html of our email
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresse(recipients);

    this.addContent(this.body); // use built-in helper function
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresse(recipients) {
    return recipients.map(({ email }) => new helper.Email(email));
  }

  addClickTracking() {
    // follow the documentation to setup clickTracking
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);
    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    // follow the documentation to setup clickTracking
    const personalize = new helper.Personalization();
    this.recipients.forEach((recipient) => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // send mail
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
