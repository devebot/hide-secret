'use strict';

var assert = require('chai').assert;
var lodash = require('lodash');
var hideSecret = require('../index');

describe('hideSecret', function() {
  var obj = {
    name: 'myname',
    pass: 's3cr3t',
    accounts: [
      {
        role: 'admin',
        username: 'root',
        password: 'a-very-very-very-long-passphrase'
      },
      {
        role: 'API',
        token: 'a-sample-token',
        secret: 'tops3cr3t'
      },
      {
        role: 'API',
        token: 'a-sample-passwd',
        secret: 'tops3cr3t'
      },
      {
        role: 'bot',
        token: 'passphrase-example',
        passphrase: 'the fox jumps over lazy dog'
      }
    ]
  };

  var expected = {
    "name": "myname",
    "pass": "******",
    "accounts": [
      {
        "role": "admin",
        "username": "root",
        "password": "*****************..."
      },
      {
        "role": "API",
        "token": "a-sample-token",
        "secret": "*********"
      },
      {
        "role": "API",
        "token": "a-sample-passwd",
        "secret": "*********"
      },
      {
        "role": "bot",
        "token": "passphrase-example",
        "passphrase": "*****************..."
      }
    ]
  };

  it('should skip transforming if opts.skipped is [true]', function() {
    var s1 = lodash.cloneDeep(obj);
    var implicit = hideSecret(s1, { skipped: true });
    assert.equal(implicit, s1);
    assert.deepEqual(s1, obj);
  });

  it('should clone and hide secret fields of a json object', function() {
    var s1 = lodash.cloneDeep(obj);
    var implicit = hideSecret(s1);
    assert.deepEqual(s1, obj);
    assert.notEqual(implicit, s1);
    assert.deepEqual(implicit, expected);

    var s2 = lodash.cloneDeep(obj);
    var explicit = hideSecret(s2, { immutable: true });
    assert.deepEqual(s2, obj);
    assert.notEqual(explicit, s2);
    assert.deepEqual(explicit, expected);

    assert.deepEqual(implicit, explicit);
  });

  it('should hide secret fields of a json object on-the-fly', function() {
    var s2 = lodash.cloneDeep(obj);
    var explicit = hideSecret(s2, { immutable: false });
    assert.equal(explicit, s2);
    assert.deepEqual(explicit, expected);
  });
});
