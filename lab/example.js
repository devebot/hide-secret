'use strict';

var hideSecret = require('../index');

var opts = {
  skipped: (process.env.NODE_ENV === 'test')
}

var jsonObj = {
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

console.log(JSON.stringify(hideSecret(jsonObj, opts), null, 2));
