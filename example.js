var TwitterStream = require('./');

var twitter = new TwitterStream({
    consumer: {
        public: process.env.TWITTER_CONSUMER_PUBLIC,
        secret: process.env.TWITTER_CONSUMER_SECRET
    },
    token: {
        public: process.env.TWITTER_TOKEN_PUBLIC,
        secret: process.env.TWITTER_SECRET_SECRET
    },
    url: 'https://userstream.twitter.com/1.1/user.jsonn'
});

twitter.on('data', function(data) {
    console.log('data');
    console.log(data);
});

twitter.on('error', function(data) {
    console.log('error');
    console.log(data);
});

twitter.on('finish', function(data) {
    console.log('finish');
});



twitter.stream();