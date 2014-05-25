var ChirpStream = require('./');

var twitter = new ChirpStream({
    consumer: {
        public: process.env.TWITTER_CONSUMER_PUBLIC,
        secret: process.env.TWITTER_CONSUMER_SECRET
    },
    token: {
        public: process.env.TWITTER_TOKEN_PUBLIC,
        secret: process.env.TWITTER_SECRET_SECRET
    }
});

var userstream = twitter.stream('https://stream.twitter.com/1.1/statuses/filter.json', {
    data: {
        follow: 61260444 //me :)
    }
});

userstream.on('data', function(data) {
    console.log('data');
    console.log(data);
});

userstream.on('json', function(json) {
    console.log('json');
    console.log(json);
});

userstream.on('end', function() {
    console.log('end');
});

userstream.on('error', function(error) {
    console.log('error');
    console.log(error);
});