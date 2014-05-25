twitter-stream
==============

> twitter streaming apis in nodejs

*****

## Installation

```
npm i ddo/twitter-stream --save
```

## Usage - [Example](/example.js)

```js
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
```

## [Example](/example.js)

### Public streams

#### statuses/filter

```js
var userstream = twitter.stream('https://stream.twitter.com/1.1/statuses/filter.json', {
    data: {
        follow: 61260444 //me :)
    }
});
//listen to events...
```

#### statuses/sample

```js
var userstream = twitter.stream('https://stream.twitter.com/1.1/statuses/sample.json');
//listen to events...
```

### User streams

```js
var userstream = twitter.stream('https://userstream.twitter.com/1.1/user.json');
//listen to events...
```

## Option

* ``consumer``: ``Object`` Twitter app public and secret consumer.
* ``token``: ``Object`` Client public and secret token.


## API

### .stream()
create a stream

#### options
* ``url``: ``String`` Twitter endpoint
* ``method``: ``String`` default ``GET``

#### return
streaming object

#### events
* ``data``: ``String`` twitter raw data. Beware: there are some incomplete data
* ``json``: ``Object`` twitter data **Use this instead of ``data``**
* ``error``: status code (404, 503, ...)
* ``end``
