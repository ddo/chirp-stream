var debug = require('debug')('chirp-stream');
var OAuth = require('oauth-request');

module.exports = ChirpStream;

function ChirpStream(opt) {
    if(!(this instanceof ChirpStream)) {
        return new ChirpStream(opt);
    }

    if(!(opt && opt.consumer && opt.consumer.public && opt.consumer.secret)) {
        throw new Error('consumer.public and consumer.secret are required');
    }

    if(!(opt.token && opt.token.public && opt.token.secret)) {
        throw new Error('token.public and token.secret are required');
    }

    this.consumer = opt.consumer;
    this.token    = opt.token;

    this.oauth = OAuth({
        consumer: this.consumer,
        token: this.token
    });
}

/**
 * debug
 * @api private
 */
ChirpStream.prototype._log = debug;

/**
 * stream
 * @param  {String} url streaming endpoint
 * @param  {Object} param twitter parameters
 * @param  {String} method twitter endpoint
 * 
 * @return {stream.Readable} stream.Readable object
 */
ChirpStream.prototype.stream = function(url, param, method) {
    var self = this;

    if(typeof url !== 'string') {
        throw new Error('url is required');
    }

    param  = param || {};
    method = method || 'GET';
    
    var readable;

    if(method === 'GET') {
        readable = self.oauth.get({
            url: url,
            qs: param,
            encoding: 'utf8'
        });
    } else {
        readable = self.oauth.post({
            url: url,
            form: param,
            encoding: 'utf8'
        });
    }

    var incomplete_json = [];

    readable.on('response', function(res) {
        self._log('statusCode', res.statusCode);

        if(res.statusCode != 200) {
            readable.emit('error', res.statusCode);
        }
    });

    readable.on('data', function(str) {
        str = str.trim();

        if(!str.length) {
            self._log('newline');
            return;
        }

        var json = null;

        //try to parse
        try {
            json = JSON.parse(str);
        } catch(e) {
            self._log('incomplete json', str);
        }

        if(json) {
            self._log('json', str);

            //clean incomplete json array
            incomplete_json = [];

            //emit json event
            return readable.emit('json', json);
        }

        //push to incomplete json array
        incomplete_json.push(str);

        //get all the incomplete json
        str = incomplete_json.join('');

        //try to parse
        try {
            json = JSON.parse(str);
        } catch(e) {
            self._log('incomplete json from join', str);
        }

        if(json) {
            self._log('json', str);

            //clean incomplete json array
            incomplete_json = [];

            //emit json event
            return readable.emit('json', json);
        }
    });

    return readable;
};