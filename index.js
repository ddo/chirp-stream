var util     = require('util');
var Writable = require('stream').Writable;

var debug   = require('debug')('twitter-stream');
var request = require('request');
var OAuth   = require('oauth-1.0a');

module.exports = TwitterStream;

function TwitterStream(opt) {
    if(!(this instanceof TwitterStream)) {
        return new TwitterStream(opt);
    }

    if(!(opt.consumer && opt.consumer.public && opt.consumer.secret)) {
        throw new Error('consumer.public and consumer.secret are required');
    }

    if(!(opt.token && opt.token.public && opt.token.secret)) {
        throw new Error('token.public and token.secret are required');
    }

    if(!opt.url) {
        throw new Error('url is required');
    }

    this.consumer = opt.consumer;
    this.token    = opt.token;

    this.oauth = OAuth({
        consumer: this.consumer
    });

    this.url    = opt.url;
    this.method = opt.method || 'GET';

    //init as a writable stream
    Writable.call(this);

    //incomplete buffers
    this.incomplete_buffers = [];
}

//inherit from writable stream
util.inherits(TwitterStream, Writable);

/**
 * debug
 * @param  {String} title
 * @param  {String} data
 * @api private
 */
TwitterStream.prototype._log = function(title, data) {
    debug('%s - %j', title, data);
};

/**
 * override the wriable stream method
 * @api private
 */
TwitterStream.prototype._write = function(chunk, encoding, next) {
    //convert buffer into utf-8 then trim
    var str = chunk.toString().trim();

    //twitter also stream the enter chars every some seconds
    if(str.length) {
        
        //need to wait the next buffer to get the complete data
        //#parse() solve it for us
        var data = this.parse(str);
        if(data) {
            this._log('#_write - new data', str);
            this.emit('data', data);
        }
    }

    //next buffer
    next();
};

/**
 * parse twitter data to JSON
 * @param  {String} str
 * @return {data} JSON or null
 * @api private
 *
 * some time Twitter stream just a piece of data
 * so need to wait the next buffer to append
 */
TwitterStream.prototype.parse = function(str) {
    var self = this;
    var data = null;

    try {
        data = JSON.parse(str); 
    } catch(e) {
        self._log('#parse - new buffer fail', str);

        //push to incomplete buffer array for next parse
        self.incomplete_buffers.push(str);
        
        //get the incomplete buffer
        str = self._getIncompleteBuffer();

        try {
            data = JSON.parse(str); 
        } catch(e) {
            self._log('#parse - incomplete buffer fail', str);
        }
    }

    if(data) {
        self._log('#parse - clean buffer');
        self.incomplete_buffers = [];
    }

    return data;
};

/**
 * @return {String} all incomplete buffers as string
 * @api private
 */
TwitterStream.prototype._getIncompleteBuffer = function() {
    var str = '';
    for(var i = 0; i < this.incomplete_buffers.length; i++) {
        str += this.incomplete_buffers[i];
    }
    debug('#_getIncompleteBuffer', str);
    return str;
};

TwitterStream.prototype.stream = function() {
    var self = this;

    var request_data = {
        url: self.url,
        method: self.method
    };

    request({
        url: request_data.url,
        method: request_data.method,
        qs: self.oauth.authorize(request_data, self.token)
    }).pipe(this);
};