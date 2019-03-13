'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

const keys = require('./config/keys');
require('./models/User'); // 要先宣告 Schema, 之後才能使用。因為 passport 中會對 schema 操作，因此 pasport 一定要放在這行之後
require('./services/passport'); // 因為 passport 中沒有 export 的東西，所以只需要單純 require 這段 code 就好

const env = process.env.NODE_ENV;

mongoose.connect(keys.mongoURI);

const app = express();
const PORT = process.env.PORT || 5000;

// config app to use bodyparser to help parse incoming request to JSON format
app.use(bodyParser.json());


// tell express how to handle cookie
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days here. how long does the cookie live in max. 單位是 milisecond
    keys: [keys.cookieKey], // used to encrypt our cookie. can provide multiple key, and it will randomly choose one
  })
);
// tell passport that it should make use of cookies to handle auth
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoute')(app); // 將 app 當作參數傳入 route 中，才能設定需要的 route，相等於以下的 code 但更簡潔
require('./routes/billingRoutes')(app);
/*
const authRoute = require('./routes/authRoutes');
authRoute(app);
*/

if (env === 'production') {
  // let Express serve up production assets, like our main.js file, or main.css file
  // express 會進去 client/build 這個資料夾中，找到 client 要求的檔案並返回，而不是返回整個 build 資料夾
  app.use(express.static('client/build'));

  // let Express serve up the index.html file, if it doesn't recognize the route
  // 若上面沒有在 build 中找到對應的檔案，才會執行下面的 code
  // 下面這一條一定要放在其他的 route 的判定之後，不然我們的 API get method 都會返回 index.html
  // 用 path.resolve 來組成 index.html 的實際路徑，__dirname 代表目前所在的位置
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`listen on port ${PORT} in ${env} mode`);
});
