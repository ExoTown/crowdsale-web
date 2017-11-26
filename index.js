var config = require('./modules/config.js');

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('view engine', 'pug');
app.set('view cache', !config.debug);

app.use(bodyParser.json({
    type: "application/json"
}));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/feedback', require('./controllers/feedback.js'));
// app.use('/api/ico', require('./controllers/ico.js'));
// app.use('/api', require('./controllers/api.js'));
// app.use('/user', require('./controllers/user.js'));
// app.use('/invite', require('./controllers/referrals.js'));

app.use('/subscribe', require('./controllers/subscribe.js'));

app.use(express.static(config.path, { index: 'index.html' }));

app.use('/', require('./controllers/site.js'));

app.listen(config.http_port, function() {
    console.log('exo.town server listening at ' + config.http_port);
});
