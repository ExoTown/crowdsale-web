/**
 * Created by d34thkn3ll on 01/08/2017.
 */

var express = require('express');
var moment = require('moment');
var validator = require('email-validator');
var uuid = require('node-uuid');
var request = require('request');
var router = express.Router();
var config = require('./../modules/config.js');
var Mailgun = require('mailgun-js');

var mg_key = config.mailgun.api_key,
    mg_domain = 'exo.town';

var ERR = {
    ALREADY_EXIST: '23505'
};

router.post('/', function (req, res) {

    var body = req.body;

    if (!isEmailValid(body.email)) {
        return res.status(400).json({ "status": "invalid" });
    }

    console.log('New subscription ' + body.email);

    res.status(200).json({ "status": "ok" });

    console.log('mailgun...');
    var mailgun = new Mailgun({ apiKey: mg_key, domain: mg_domain });

    mailgun.lists('new_subscribers@exo.town').members().add({ members: [{ address: body.email }], subscribed: true, upsert: false }, function (err, body) {
        console.log(body);
        if (err) console.log('error', err);
        else console.log('success', body);
    });

});

function isEmailValid(email) {
    return validator.validate(email);
}

module.exports = router;