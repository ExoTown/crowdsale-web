
var sha3 = require('js-sha3').keccak256;
var crypto = require('crypto');
var moment = require('moment');

var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

function h2d(s) {

    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10);
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

var getGoogleAnalyticId = function (req) {
    var ga = req.cookies['_ga'];
    if(!ga) return '';
    return ga.substr(6);
};

var sha1 = function(val){
    return crypto.createHash('sha1').update(val).digest('hex');
};

var makePassword = function(){
    return Math.random().toString(36).slice(-8).toLowerCase();
};

var makeReferralCode = function(){
    return sha1(makePassword() + makePassword() + makePassword()).slice(4, 20);
};

var filterEmail = function (mail) {
    var p = mail.split('@');
    var len = Math.round(p[0].length / 2);
    p[0] = p[0].substr(0, p[0].length - len) + "*".repeat(len);
    return p.join('@');
};

module.exports.makeReferralCode = makeReferralCode;
module.exports.makePassword = makePassword;
module.exports.isEthAddress = isAddress;
module.exports.h2d = h2d;
module.exports.sha1 = sha1;
module.exports.getGoogleAnalyticId = getGoogleAnalyticId;
module.exports.filterEmail = filterEmail;