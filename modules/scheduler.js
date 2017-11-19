/**
 * Created by d34thkn3ll on 12/11/2017.
 */


var CronJob = require('cron').CronJob;
var ee = require('event-emitter');
var emitter = ee();

var start = function(){

    new CronJob({
        cronTime: '0 * * * * *',    // 1 min
        onTick: function(){
            emitter.emit('minute');
        },
        start: true,
        timeZone: 'Europe/Moscow'
    });

    new CronJob({
        cronTime: '0 */10 * * * *',    // 10 min
        onTick: function(){
            emitter.emit('5min');
        },
        start: true,
        timeZone: 'Europe/Moscow'
    });

    new CronJob({
        cronTime: '0 */10 * * * *',    // 10 min
        onTick: function(){
            emitter.emit('get_exchange');
        },
        start: true,
        timeZone: 'Europe/Moscow'
    });

    new CronJob({
        cronTime: '0 0 10 * * *',    // 10:00 am
        onTick: function(){
            emitter.emit('morning');
        },
        start: true,
        timeZone: 'Europe/Moscow'
    });

    setTimeout(function () {
        emitter.emit('get_exchange');
    }, 1000)

};

start();

module.exports = emitter;