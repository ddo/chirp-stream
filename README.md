chirp-stream [![Build Status](https://travis-ci.org/ddo/chirp-stream.svg)](https://travis-ci.org/ddo/chirp-stream)
==============

[![NPM version](https://badge.fury.io/js/chirp-stream.png)](http://badge.fury.io/js/chirp-stream)
[![Dependency Status](https://david-dm.org/ddo/chirp-stream.png?theme=shields.io)](https://david-dm.org/ddo/chirp-stream)

[![Coverage Status](https://coveralls.io/repos/ddo/chirp-stream/badge.png?branch=master)](https://coveralls.io/r/ddo/chirp-stream?branch=master)
[![Code Climate](https://codeclimate.com/github/ddo/chirp-stream.png)](https://codeclimate.com/github/ddo/chirp-stream)

> twitter streaming apis in nodejs

## Installation

```
npm i chirp-stream --save
```

## Usage

```js
var twitter = Chirp({
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
    console.log(data);
});

userstream.on('json', function(json) {
    console.log(json);
});

userstream.on('end', function() {
    console.log('end');
});

userstream.on('error', function(error) {
    console.log(error);
});
```

## [Example](/example.js)

### Public streams

#### statuses/filter

```js
var filterstream = twitter.stream('https://stream.twitter.com/1.1/statuses/filter.json', {
    follow: 61260444 //me :)
});
//listen to events...
```

#### statuses/sample

```js
var samplestream = twitter.stream('https://stream.twitter.com/1.1/statuses/sample.json');
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
* ``param``: ``Object`` Twitter parameters ``optional``
* ``method``: ``String`` default ``GET``

#### return
streaming object

#### event
* ``data``: ``String`` twitter raw data. Beware: there are some incomplete data
* ``json``: ``Object`` twitter data **Use this instead of ``data``**
* ``response``: ``Object`` response object
* ``error``: status code (404, 503, ...)
* ``end``
