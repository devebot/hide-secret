'use strict';

var assert = require('chai').assert;
var lodash = require('lodash');
var hideSecret = require('../index');

describe('hideSecret', function() {
  var obj = {
    name: 'myname',
    password: 's3cr3t',
    accounts: [
      {
        role: 'admin',
        username: 'root',
        password: 'very-very-very-long-passphrase'
      },
      {
        role: 'API',
        token: 'a-sample-token',
        secret: 'tops3cr3t'
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

    var s2 = lodash.cloneDeep(obj);
    var explicit = hideSecret(s2, { immutable: true });

    assert.notEqual(implicit, s1);
    assert.notEqual(explicit, s2);

    assert.deepEqual(s1, obj);
    assert.deepEqual(s2, obj);

    assert.deepEqual(implicit, explicit);
    assert.notDeepEqual(explicit, obj);
  });

  it('should hide secret fields of a json object on-the-fly', function() {
    var s2 = lodash.cloneDeep(obj);
    var explicit = hideSecret(s2, { immutable: false });

    assert.equal(explicit, s2);
    assert.notDeepEqual(s2, obj);
  });
});
