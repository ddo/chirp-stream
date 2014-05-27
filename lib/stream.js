var util     = require('util');
var Writable = require('stream').Writable;

var request = require('request');
var OAuth   = require('oauth-1.0a');
var debug   = require('debug')('chirp-stream');

module.exports = Stream;

function Stream(url, param, method, oauth_opt) {
    if(!(this instanceof Stream)) {
        return new Stream(url, param, method, oauth_opt);
    }
    
    this.url    = url;
    this.param  = param;
    this.method = method;

    this.consumer = oauth_opt.consumer;
    this.token    = oauth_opt.token;

    this.oauth = OAuth({
        consumer: this.consumer
    });

    this._log('new stream', url, param, method);

    //init as a writable stream
    Writable.call(this);

    //incomplete json from buffers
    this.incomplete_json = [];
}

//inherit from writable stream
util.inherits(Stream, Writable);

/**
 * debug
 * 
 * @api private
 */
Stream.prototype._log = debug;

/**
 * override the wriable stream method
 * 
 * @api private
 */
Stream.prototype._write = function(chunk, encoding, next) {
    //convert buffer into utf-8 then trim
    var str = chunk.toString().trim();

    if(!str.length) {
        this._log('newline');

        //next buffer
        return next();
    }

    var json = this._parse(str);

    if(json) {
        this._log('data', json);

        //emit data event
        this.emit('data', json);

    } else {
        this._log('incomplete json', str);
    }

    //next buffer
    return next();
};

/**
 * parse twitter data into JSON
 * some time Twitter stream just a piece of data
 * so need to wait the next buffer to get a complete data
 * 
 * @param  {String} str
 * @return {Object} JSON or null
 * 
 * @api private
 */
Stream.prototype._parse = function(str) {
    var json = null;

    //try to parse
    try {
        json = JSON.parse(str);
    } catch(e) {
        this._log('incomplete json', str);
    }

    if(json) {
        //clean incomplete json array
        this.incomplete_json = [];

        return json;
    }

    //push to incomplete json array
    this.incomplete_json.push(str);

    //get all the incomplete json
    str = this.incomplete_json.join('');

    //try to parse
    try {
        json = JSON.parse(str);
    } catch(e) {
        this._log('incomplete json from join', str);
    }

    if(json) {
        //clean incomplete json array
        this.incomplete_json = [];
    }

    return json;
};

Stream.prototype.start = function() {
    var self = this;

    var request_data = {
        url: self.url,
        method: self.method,
        data: self.param
    };

    var r;

    if(self.method === 'GET') {
        r = request({
            url: request_data.url,
            method: request_data.method,
            qs: self.oauth.authorize(request_data, self.token),
            json: true
        }).pipe(self);
    } else {
        r = request({
            url: request_data.url,
            method: request_data.method,
            form: self.oauth.authorize(request_data, self.token),
            json: true
        }).pipe(self);
    }

    r.on('error', function(err) {
        console.log('error');
        console.log(err);
    });

    r.on('response', function(res) {
        console.log('response');
        console.log(res);
    });

    // console.log(r);
};
