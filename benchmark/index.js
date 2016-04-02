/* global suite, bench */
var fs = require('fs')
var path = require('path')

var bencode = require('../')
var bencodejs = require('../')
var bencoding = require('bencoding')
var dht_bencode = require('dht-bencode')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')

var buffer = fs.readFileSync(path.join(__dirname, 'Fedora-Live-MATE_Compiz-x86_64-23.torrent'))
var object1 = bencode.decode(buffer)
var object2 = bencodejs.decode(buffer)
var object3 = bencoding.decode(buffer)
var object4 = dht_bencode.bdecode(buffer)
var object5 = bncode.decode(buffer)
var object6 = dht.decode(buffer)

suite('decode', () => {
  bench('bencode', () => bencode.decode(buffer))
  bench('bencode.js', () => bencodejs.decode(buffer))
  bench('bencoding', () => bencoding.decode(buffer))
  bench('dht_bencode', () => dht_bencode.bdecode(buffer))
  bench('bncode', () => bncode.decode(buffer))
  bench('dht', () => dht.decode(buffer))
})

suite('encode', () => {
  bench('bencode', () => bencode.encode(object1))
  bench('bencode.js', () => bencodejs.encode(object2))
  bench('bencoding', () => bencoding.encode(object3))
  bench('dht_bencode', () => dht_bencode.bencode(object4))
  bench('bncode', () => bncode.encode(object5))
  bench('dht', () => dht.encode(object6))
})
