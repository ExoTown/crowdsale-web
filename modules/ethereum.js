var config = require('./config.js');
var request = require('request');
var Web3 = require('web3');
var async = require('async');
var utils = require('./utils.js');
var querystring = require('querystring');
var _ = require('underscore');
var BigNumber = require('big-number');

var divider = 1000000000000000000;

var icoAbi = require('./../contracts/icoAbi.json');
var tokenAbi = require('./../contracts/tokenAbi.json');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3.server));

var ContractApi = function(contractAddress, abi){
    var self = this;

    var contract = web3.eth.contract(abi).at(contractAddress);

    var infuraApi = function (data, callback) {

        var options = {
            jsonrpc: "2.0",
            id: 1,
            method: 'eth_call',
            params: [{
                to: contractAddress,
                data: data
            }, 'latest']
        };

        request({
            method: 'POST',
            url: 'https://mainnet.infura.io/',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(options)
        }, function (error, response, body) {
            if (error)
                return callback(error);
            callback(null, body);
        });

    };

    this.method = function (name, callback) {

        var data = contract[name].getData();

        infuraApi(data, function (err, result) {
            try {
                var val = JSON.parse(result).result;
                callback(err, val);
            } catch (e) {
                console.log('infuraApi Error', e);
                callback(err, result);
            }
        });

    };

    this.methodParam = function (name, param, callback) {

        var data = contract[name].getData(param);

        infuraApi(data, function (err, result) {
            try {
                var val = JSON.parse(result).result;
                callback(err, val);
            } catch (e) {
                console.log('infuraApi Error', e);
                callback(err, result);
            }
        });

    }

};

var contractIco = new ContractApi(config.web3.contract_ico, icoAbi);
var contractToken = new ContractApi(config.web3.contract_token, tokenAbi);

var StatsDataCache = {
    data: null,
    lifeTime: 3 * 60 * 1000, // 3 min
    init: function () {
        var self = this;
        setInterval(function () {
            self.data = null;
        }, this.lifeTime)
    }
};
StatsDataCache.init();

var getStats = function (callback) {

    if (StatsDataCache.data) {
        return callback(null, StatsDataCache.data);
    }

    async.parallel({
        tokensSold: function(cb) {
            contractIco.method('getTokensSold', function(err, res) {
                if (err) return cb(err);
                cb(null, utils.h2d(res) / divider);
            })
        },
        etherRaised: function(cb) {
            contractIco.method('getEtherRaised', function(err, res) {
                if (err) return cb(err);
                cb(null, utils.h2d(res) / divider);
            })
        },
        stageSoldTokens: function(cb) {
            contractIco.method('getStageSoldTokens', function(err, res) {
                if (err) return cb(err);
                cb(null, utils.h2d(res) / divider);
            })
        },
        stageEtherRaised: function(cb) {
            contractIco.method('getStageEtherRaised', function(err, res) {
                if (err) return cb(err);
                cb(null, utils.h2d(res) / divider);
            })
        },
        stageSupplyLimit: function(cb) {
            contractIco.method('getStageSupplyLimit', function(err, res) {
                if (err) return cb(err);
                cb(null, utils.h2d(res) / divider);
            })
        },
        ownerCount: function (cb) {

            contractToken.method('getOwnerCount', function (err, res) {
                if (err)
                    return cb(err);
                cb(null, utils.h2d(res));
            });

        }
    }, function (err, result) {

        if(err)
            return callback && callback(err);

        var statData = { stats: result };

        StatsDataCache.data = statData;
        callback && callback(err, statData);
    });

};

var balanceOf = function (address, callback) {

    contractToken.methodParam('balanceOf', address, function (err, res) {
        if (err)
            return callback(err);

        var bigDivider = BigNumber(divider);
        var num = BigNumber(utils.h2d(res));
        var result = num.div(bigDivider);
        var resultStr = result.val() + (result.rest ? ('.' + result.rest.val()) : '');

        callback(null, resultStr * 1);
    });

};

module.exports.getStats = getStats;
module.exports.balanceOf = balanceOf;
// module.exports.getState = getState;
// module.exports.getChartData = getChartData;