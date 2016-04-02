# Bencode

[![NPM Package](https://img.shields.io/npm/v/bencode.js.svg?style=flat-square)](https://www.npmjs.org/package/bencode.js)
[![Build Status](https://img.shields.io/travis/fanatid/bencode.js.svg?branch=master&style=flat-square)](https://travis-ci.org/fanatid/bencode.js)
[![Dependency status](https://img.shields.io/david/fanatid/bencode.js.svg?style=flat-square)](https://david-dm.org/fanatid/bencode.js#info=dependencies)

[![abstract-encoding](https://img.shields.io/badge/abstract--encoding-compliant-brightgreen.svg?style=flat-square)](https://github.com/mafintosh/abstract-encoding)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A node library for encoding and decoding bencoded data, according to the [BitTorrent specification](http://www.bittorrent.org/beps/bep_0003.html).

*bencode.js* uses [indutny/bn.js](https://github.com/indutny/bn.js) as Integer because JavaScript support only 53-bit precise integers :(

## Install with [npm](https://npmjs.org)

```
npm install bencode.js
```

## Usage

```javascript
var bencode = require('bencode.js')
var data = {
  string: new Buffer('Hey there!'),
  integer: new bencode.BN(42),
  dict: { key: new Buffer('dict-key-string') },
  list: [ new bencode.BN(1), new Buffer('str'), new bencode.BN(5), {}, [] ]
}

console.log(bencode.encodingLength(data))
// 90

var encoded = bencode.encode(data)
console.log(encoded.toString())
// d4:dictd3:key15:dict-key-stringe7:integeri42e4:listli1e3:stri5edelee6:string10:Hey there!e

console.log(bencode.decode(encoded))
// { dict: { key: <Buffer 64 69 63 74 2d 6b 65 79 2d 73 74 72 69 6e 67> },
//   integer: <BN: 2a>,
//   list: [ <BN: 1>, <Buffer 73 74 72>, <BN: 5>, {}, [] ],
//   string: <Buffer 48 65 79 20 74 68 65 72 65 21> }
```

## Benchmark

Torrent file for benchmark: [Fedora-Live-MATE_Compiz-x86_64-23.torrent](https://torrent.fedoraproject.org/torrents/Fedora-Live-MATE_Compiz-x86_64-23.torrent)

```shell
$ cd benchmark
$ npm i
...
$ npm start
                      decode
          33,311 op/s » bencode
          34,559 op/s » bencode.js
          23,026 op/s » bencoding
          33,448 op/s » dht_bencode
             546 op/s » bncode
          27,194 op/s » dht

                      encode
          11,413 op/s » bencode
          11,562 op/s » bencode.js
           6,444 op/s » bencoding
           8,108 op/s » dht_bencode
           5,586 op/s » bncode
          10,278 op/s » dht
```

## License

MIT
