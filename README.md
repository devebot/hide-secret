# hide-secret

## Installation

```shell
npm install --save hide-secret
```

## Usage

### Parameters

```javascript
var hideSecret = require('hide-secret');

var safeObj = hideSecret(jsonObj, opts);
```

The `opts` can be:

* `opts.immutable` - clone the input json object for transforming, keep the original object unchanged (default: `true`).
* `opts.secretFieldNames` - a list of secrect field names that need to be hidden (default: 
`{ pass: 1, passwd: 1, password: 1, secret: 1 }`).
* `opts.skipped` - skip transforming the json object (default: `false`).

### Example

```javascript
var hideSecret = require('hide-secret');

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

console.log(JSON.stringify(hideSecret(jsonObj), null, 2));
```

The console will display the output as the following:

```
{
  "name": "myname",
  "password": "******",
  "accounts": [
    {
      "role": "admin",
      "username": "root",
      "password": "********************..."
    },
    {
      "role": "API",
      "token": "a-sample-token",
      "secret": "*********"
    }
  ]
}
```

## License

MIT