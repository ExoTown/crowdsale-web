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

var ERR = {
    ALREADY_EXIST: '23505'
};

router.post('/', function (req, res) {

    var body = req.body;

    if (!isEmailValid(body.email)) {
        return res.status(400).json({ "status": "invalid" });
    }

    console.log('New subscription ' + body.email);

    successHandler();

    function successHandler() {
        res.status(200).json({ "status": "ok" });

        console.log('sending to mailchimp...');

        var mailchimpApiKey = config.mailchimp.api_key;

        request({
            url: config.mailchimp.list,
            method: 'POST',
            json: true,
            body: {
                "email_address": body.email,
                "status": "subscribed"
            },
            auth: {
                'user': 'username',
                'pass': mailchimpApiKey
            }
        }, function(err, resp, resp_body) {
            if (resp_body.status === 400)
                console.log(resp_body.detail);
            else
                console.log(resp_body.email_address + ' ' + resp_body.status);
        });


    }

    function errorHandler(err) {
        if (err.code === ERR.ALREADY_EXIST) { // email already exist, it's ok for us
            console.log('...is not new actually');
            res.status(200).json({ "status": "ok" });
        } else {
            console.log('...failed', err);
            res.status(500).json({ "status": "Internal Server Error" });
        }
    }
});

function isEmailValid(email) {
    return validator.validate(email);
}

module.exports = router;