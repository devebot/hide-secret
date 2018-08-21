'use strict';

var Benchmark = require('benchmark');
var lodash = require('lodash');
var hideSecret = require('../index');

function execSuite(obj) {
  var copied = lodash.cloneDeep(obj);

  var suite = new Benchmark.Suite('hideSecret', {});

  // add tests
  suite
    // add listeners
    .on('start', function() {
      console.log('=> Benchmark of hideSecret() started ...');
    })
    .on('cycle', function(event) {
      console.log(' - ' + String(event.target));
    })
    .on('complete', function() {
      console.log('+> Fastest is ' + this.filter('fastest').map('name'));
    });

  suite
    .add('JSON.stringify(hideSecret(obj, { immutable: true }))', {
      'defer': false,
      'fn': function(deferred) {
        JSON.stringify(hideSecret(obj, { immutable: true }));
      }
    });

  suite
    .add('JSON.stringify(hideSecret(copied, { immutable: false }))', {
      'defer': false,
      'fn': function(deferred) {
        JSON.stringify(hideSecret(copied, { immutable: false }));
      }
    });

  suite
    .add('JSON.stringify(hideSecret(lodash.cloneDeep(obj))', {
      'defer': false,
      'fn': function(deferred) {
        JSON.stringify(hideSecret(lodash.cloneDeep(obj), { immutable: false }));
      }
    });

  suite
    .add('JSON.stringify(hideSecret(obj, { skipped: true }))', {
      'defer': false,
      'fn': function(deferred) {
        JSON.stringify(hideSecret(obj, { skipped: true }));
      }
    });

  suite.run({ 'async': false });
}

function isEnabled(flag) {
  if (flag) {
    return process.env.BENCHMARK === flag;
  }
  return process.env.BENCHMARK == null;
}

isEnabled() && execSuite({
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
});

isEnabled('without-secret') && execSuite({
  name: 'myname',
  word: 's3cr3t',
  accounts: [
    {
      role: 'admin',
      username: 'root',
      phrase: 'a-very-very-very-long-passphrase'
    },
    {
      role: 'API',
      token: 'a-sample-token',
      hidden: 'tops3cr3t'
    },
    {
      role: 'API',
      token: 'a-sample-passwd',
      silent: 'tops3cr3t'
    },
    {
      role: 'bot',
      token: 'passphrase-example',
      quote: 'the fox jumps over lazy dog'
    }
  ]
});

isEnabled('small-object') && execSuite({
  foo: 'bar',
  car: 'toyota',
  hub: {
    username: 'root',
    email: 'master@example.com'
  }
});
