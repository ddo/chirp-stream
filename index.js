var fs       = require('fs');
var util     = require('util');
var Writable = require('stream').Writable;

var request = require('request');
var OAuth   = require('oauth-1.0a');

function TwitterStream() {
    Writable.call(this);

    this.buffer = [];
}

util.inherits(Ddo, Writable);

Ddo.prototype._write = function(chunk, encoding, next) {
    var str = chunk.toString().trim();
    if(str.length) {
        var data = this.parse(str);
        if(data) {
            if(data.text) {
                console.log(data.text);
                console.log(data.user.name);
            }
        }
    }
    next();
};

Ddo.prototype.parse = function(str) {
    var self = this;
    var data = false;

    try {
        data = JSON.parse(str); 
    } catch(e) {
        console.log('fail 1');

        self.buffer.push(str);
        str = self.merge();
        try {
            data = JSON.parse(str); 
        } catch(e) {
            console.log('fail 2');
        }
    }

    if(data) {
        console.log('clear');
        self.buffer = [];
    }

    return data;
};

Ddo.prototype.merge = function() {
    var str = '';
    for(var i = 0; i < this.buffer.length; i++) {
        str += this.buffer[i];
    }
    return str;
};

var ddo = new Ddo();

var oauth = OAuth({
    consumer: {
        public: 'sZT0SD2jf84lCdF8PWTLQ',
        secret: 'u25CRWvCpCB61ndpRHgiQ5EkioqNB7cPL43uQ3bk'
    },
    signature_method: 'HMAC-SHA1'
});

var token = {
    public: '61260444-Esv29YumfnPt4A7l5uyYWp6Sm6zJBMKmdY6kwLFH5',
    secret: 'gfNAhxRs9WjSfAtju570RRNTrbD1TyJNANq0cuYUoD7T9'
};

var request_data = {
    url: 'https://userstream.twitter.com/1.1/user.json',
    method: 'GET'
};

request({
    url: request_data.url,
    method: request_data.method,
    qs: oauth.authorize(request_data, token)
}).pipe(ddo);