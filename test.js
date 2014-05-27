var expect = require('chai').expect;

var ChirpStream = require('./');

describe("chirp-stream", function() {
    var twitter = new ChirpStream({
        consumer: {
            public: process.env.TWITTER_CONSUMER_PUBLIC,
            secret: process.env.TWITTER_CONSUMER_SECRET
        },
        token: {
            public: process.env.TWITTER_TOKEN_PUBLIC,
            secret: process.env.TWITTER_TOKEN_SECRET
        }
    });

    describe("#userstream", function() {
        it("should be return friend array", function(done) {
            var userstream = twitter.stream('https://userstream.twitter.com/1.1/user.json');

            userstream.on('json', function(json) {
                expect(json).to.have.property('friends').that.is.an('array');
                done();
            });
        });
    });

    describe("#samplestream", function() {
        it("should be return some random data", function(done) {
            var samplestream = twitter.stream('https://stream.twitter.com/1.1/statuses/sample.json');

            var _done = false;

            samplestream.on('json', function(json) {
                expect(json).to.be.an('object');
                if(!_done) {
                    _done = true;
                    done();
                }
            });
        });
    });

    describe("#filterstream", function() {
        it("should be return some random data", function(done) {
            var filterstream = twitter.stream('https://stream.twitter.com/1.1/statuses/filter.json', {
                track: 'apple'
            }, 'POST');

            var _done = false;

            filterstream.on('json', function(json) {
                expect(json).to.have.property('id');
                expect(json).to.have.property('text');
                expect(json).to.have.property('user').that.is.an('object');
                
                if(!_done) {
                    _done = true;
                    done();
                }
            });
        });
    });

    https://stream.twitter.com/1.1/statuses/filter.json

    describe("invalid init", function() {
        it("should throw error", function() {
            expect(function() {
                ChirpStream();
            }).to.throw('consumer.public and consumer.secret are required');
        });

         it("should throw consumer error", function() {
            expect(function() {
                ChirpStream({
                    token: {
                        public: process.env.TWITTER_TOKEN_PUBLIC,
                        secret: process.env.TWITTER_TOKEN_SECRET
                    }
                });
            }).to.throw('consumer.public and consumer.secret are required');
        });

        it("should throw token error", function() {
            expect(function() {
                ChirpStream({
                    consumer: {
                        public: process.env.TWITTER_CONSUMER_PUBLIC,
                        secret: process.env.TWITTER_CONSUMER_SECRET
                    }
                });
            }).to.throw('token.public and token.secret are required');
        });
    });
});