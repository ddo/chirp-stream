var ChirpStream = require('./');

var twitter = ChirpStream({
    consumer: {
        public: process.env.TWITTER_CONSUMER_PUBLIC,
        secret: process.env.TWITTER_CONSUMER_SECRET
    },
    token: {
        public: process.env.TWITTER_TOKEN_PUBLIC,
        secret: process.env.TWITTER_TOKEN_SECRET
    }
});

var stream = twitter.stream('https://userstream.twitter.com/1.1/user.json');


stream.on('response', function(res) {
    console.log('response');
    console.log(res);
});

stream.on('data', function(data) {
    // console.log('data');
    // console.log(data);
});

stream.on('error', function(data) {
    console.log('error');
    console.log(data);
});

stream.on('finish', function() {
    console.log('finish');
});


stream.start();