'use strict';

// key.js - figure out what set of credentials to return
const env = process.env.NODE_ENV;

// if its production mode, return the prod set of keys, else return the dev keys
module.exports = (env === 'production') ? require('./prod') : require('./dev');
