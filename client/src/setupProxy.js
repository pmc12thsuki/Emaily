const proxy = require('http-proxy-middleware');

const localhost = 'http://localhost:5000';

module.exports = (app) => {
  // 告訴 client 端，如果看到要前往 client_host/auth/google 的要導向 target, 也就是 http://localhost:5000/auth/google
  app.use(proxy('/auth/google', { target: localhost }));
  app.use(proxy('/api/*', { target: localhost })); // 設定所有 api/ 開頭的 URL 都會通過 proxy (但只有一層？)
  app.use(proxy('/api/surveys/**/yes', { target: localhost })); 
  app.use(proxy('/api/surveys/**/no', { target: localhost })); 
};
