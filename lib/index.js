var debug   = require('debug')('chirp-stream');


var Stream = require('./stream');

module.exports = ChirpStream;

function ChirpStream(opt) {
    if(!(this instanceof ChirpStream)) {
        return new ChirpStream(opt);
    }

    if(!(opt.consumer && opt.consumer.public && opt.consumer.secret)) {
        throw new Error('consumer.public and consumer.secret are required');
    }

    if(!(opt.token && opt.token.public && opt.token.secret)) {
        throw new Error('token.public and token.secret are required');
    }

    this.oauth_opt = opt;

    this._log('init', opt);
}

/**
 * debug
 * 
 * @api private
 */
ChirpStream.prototype._log = debug;

ChirpStream.prototype.stream = function(url, param, method) {
    if(!url) {
        throw new Error('url is required');
    }

    param  = param || {};
    method = method || 'GET';

    return Stream(url, param, method, this.oauth_opt);
};