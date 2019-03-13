'use strict';

module.exports = (app) => {
  require('./authRoute')(app);
  require('./billingRoutes')(app);
  require('./surveyRoute')(app);
};
