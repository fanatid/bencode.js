var test = require('tape').test
var bencode = require('../lib/bencode')
var BN = bencode.BN
var fixture = require('./fixture')

test('should always return a Buffer', function (t) {
  t.ok(Buffer.isBuffer(bencode.encode({})), 'its a buffer for empty dicts')
  t.ok(Buffer.isBuffer(bencode.encode(new Buffer('test', 'ascii'))), 'its a buffer for strings')
  t.ok(Buffer.isBuffer(bencode.encode([ new BN(3), new BN(2) ])), 'its a buffer for lists')
  t.ok(Buffer.isBuffer(bencode.encode({ 'a': new Buffer('b', 'ascii'), 3: new BN(6) })), 'its a buffer for big dicts')
  t.ok(Buffer.isBuffer(bencode.encode(new BN(123))), 'its a buffer for numbers')
  t.end()
})

test('should sort dictionaries', function (t) {
  var data = { string: new Buffer('Hello World', 'ascii'), integer: new BN(12345) }
  t.same(bencode.encode(data).toString(), 'd7:integeri12345e6:string11:Hello Worlde')
  t.end()
})

test('should force keys to be strings', function (t) {
  var data = { 12: new Buffer('Hello World', 'ascii'), 34: new BN(12345) }
  t.same(bencode.encode(data).toString(), 'd2:1211:Hello World2:34i12345ee')
  t.end()
})

test('should be able to encode a positive integer', function (t) {
  t.same(bencode.encode(new BN(123)).toString(), 'i123e')
  t.end()
})

test('should be able to encode a negative integer', function (t) {
  t.same(bencode.encode(new BN(-123)).toString(), 'i-123e')
  t.end()
})

test('should be able to safely encode numbers between -/+ 2 ^ 53 (as ints)', function (t) {
  var JAVASCRIPT_INT_BITS = 53
  var MAX_JAVASCRIPT_INT = Math.pow(2, JAVASCRIPT_INT_BITS) - 1

  t.same(bencode.encode(new BN(0)).toString(), 'i' + 0 + 'e')

  for (var exp = 1; exp < JAVASCRIPT_INT_BITS; ++exp) {
    var val = Math.pow(2, exp)
    // try the positive and negative
    t.same(bencode.encode(new BN(val)).toString(), 'i' + val + 'e')
    t.same(bencode.encode(new BN(-val)).toString(), 'i-' + val + 'e')

    // try the value, one above and one below, both positive and negative
    var above = val + 1
    var below = val - 1

    t.same(bencode.encode(new BN(above)).toString(), 'i' + above + 'e')
    t.same(bencode.encode(new BN(-above)).toString(), 'i-' + above + 'e')

    t.same(bencode.encode(new BN(below)).toString(), 'i' + below + 'e')
    t.same(bencode.encode(new BN(-below)).toString(), 'i-' + below + 'e')
  }

  t.same(bencode.encode(new BN(MAX_JAVASCRIPT_INT)).toString(), 'i' + MAX_JAVASCRIPT_INT + 'e')
  t.same(bencode.encode(new BN(-MAX_JAVASCRIPT_INT)).toString(), 'i-' + MAX_JAVASCRIPT_INT + 'e')

  t.end()
})

test('should be able to encode a previously problematice 64 bit int', function (t) {
  t.same(bencode.encode(new BN(2).pow(new BN(60)).iaddn(1)).toString(), 'i1152921504606846977e')
  t.end()
})

test('should be able to encode a negative 64 bit int', function (t) {
  t.same(bencode.encode(new BN(2).pow(new BN(60)).iaddn(1).neg()).toString(), 'i-1152921504606846977e')
  t.end()
})

test('should be able to encode a string', function (t) {
  t.same(bencode.encode(new Buffer('asdf', 'ascii')).toString(), '4:asdf')
  t.same(bencode.encode(new Buffer(':asdf:', 'ascii')).toString(), '6::asdf:')
  t.end()
})

test('should be able to encode a unicode string', function (t) {
  t.deepEqual(bencode.encode(fixture.binStringData), fixture.binResultData)
  t.deepEqual(bencode.encode(fixture.binStringData), fixture.binResultData)
  t.end()
})

test('should be able to encode an array', function (t) {
  t.same(bencode.encode([ new BN(32), new BN(12) ]).toString(), 'li32ei12ee')
  t.same(bencode.encode([ new Buffer(':asdf:', 'ascii') ]).toString(), 'l6::asdf:e')
  t.end()
})

test('should be able to encode an object', function (t) {
  t.same(bencode.encode({ a: new Buffer('bc', 'ascii') }).toString(), 'd1:a2:bce')
  t.same(bencode.encode({ a: new Buffer('45', 'ascii'), b: new BN(45) }).toString(), 'd1:a2:451:bi45ee')
  t.end()
})
