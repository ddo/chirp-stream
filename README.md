twitter-stream
==============

twitter streaming apis in nodejs

*****

## Installation

```
npm i ddo/twitter-stream
```

## Usage - [Example](/example.js)

```js
var TwitterStream = require('twitter-stream');

var twitter = new TwitterStream({
    consumer: {
        public: 'xxxxx',
        secret: 'xxxxx'
    },
    token: {
        public: 'xxxxx',
        secret: 'xxxxx'
    },
    url: 'https://userstream.twitter.com/1.1/user.json',
    method: 'GET'
});

twitter.on('data', function(data) {
    console.log(data);
});

//start streaming !
twitter.stream();
```

## Options

* ``consumer``: ``Object`` Twitter app public and secret consumer.
* ``token``: ``Object`` Client public and secret token.
* ``url``: ``String`` Twitter endpoint
* ``method``: ``String`` default ``GET``

## API

* ``.stream``: start streaming

## Events

* ``data``: on new data
* ``error`` *todo*
* ``end`` *todo*