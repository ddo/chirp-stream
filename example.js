var TwitterStream = require('./');

var twitter = new TwitterStream({
    consumer: {
        public: 'xxxx',
        secret: 'xxxx'
    },
    token: {
        public: 'xxxx',
        secret: 'xxxx'
    },
    url: 'https://userstream.twitter.com/1.1/user.json'
});

twitter.on('data', function(data) {
    console.log(data);
});

twitter.stream();