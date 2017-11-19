/**
 * Created by d34thkn3ll on 15/08/2017.
 */
var express = require('express');
var config = require('./../modules/config.js');
var ethereum = require('./../modules/ethereum.js');
var router = express.Router();
var _ = require('underscore');
var async = require('async');

var _serverStartDate = new Date();

var commonParams = {
    postfix: [
        _serverStartDate.getFullYear(),
        _serverStartDate.getMonth() + 1,
        _serverStartDate.getDate(),
        _serverStartDate.getHours(),
        _serverStartDate.getMinutes(),
        _serverStartDate.getSeconds()
    ].join(""),
    crowdsale: config.crowdsale
};

router.get('/', getIndex);

function getIndex(req, res) {
    var params = {
        config: config
    };

    getIcoData(function(err, result) {
        if (err) {
            console.log(err);
            return res.render('index', _.extend({ from: "/" }, { infura_fell: true }, commonParams, params));
        }
        res.render('index', _.extend({ from: "/" }, { stats: result.stats }, commonParams, params));
    });

}

function getIcoData(callback) {

    var stats = function (cb) {
            ethereum.getStats(function (err, ethStats) {

                if (err) {
                    cb(err);
                    return;
                }
                console.log('Received ICO stats: ', ethStats);
                cb(null, ethStats);

            });
    };

    stats(callback);

}

module.exports = router;