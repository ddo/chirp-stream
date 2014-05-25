var TwitterStream = require('twitter-stream');

var twitter = new TwitterStream({
    consumer: {
        public: 'xxxxx',
        secret: 'xxxxx'
    },
    token: {
        public: 'xxxxx',
        secret: 'xxxxx'
    }
});

var userstream = twitter.stream('https://userstream.twitter.com/1.1/user.json');

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