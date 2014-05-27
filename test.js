var expect = require('chai').expect;

var ChirpStream = require('./');

describe("chirp-stream", function() {
    describe("#stream", function() {
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

        it("should be return friend array", function(done) {
            
            var userstream = twitter.stream('https://userstream.twitter.com/1.1/user.json');

            userstream.on('json', function(json) {
                expect(json).to.have.property('friends').that.is.an('array');
                done();
            });
        });
    });
});