/**
 * Created by d34thkn3ll on 01/08/2017.
 */

var argv = require('minimist')(process.argv.slice(2));

var configFile = 'dev.json';

if(argv.release) {
    configFile = 'release.json';
}

console.log('Use config:', configFile);
var config = require('./../../config/' + configFile);
config.arguments = argv;

module.exports = config;
