# hide-secret

## Installation

```shell
npm install --save hide-secret
```

## Usage

### Parameters

```javascript
var hideSecret = require('hide-secret');
// ...
var maskedObj = hideSecret(obj, opts);
// ...
```

The `opts` can be:

* `opts.cloned` - clone the input json object for transforming, keep the original object unchanged (default: `true`).
* `opts.secretFieldNames` - a list of secrect field names that need to be hidden (default: 
`['pass', 'passwd', 'password', 'passphrase', 'secret']`).
* `opts.skipped` - skip transforming the json object (default: `false`).

### Example

```javascript
// file: lab/example.js
var hideSecret = require('hide-secret');

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
      password: 'a-very-very-very-long-passphrase'
    },
    {
      role: 'API',
      token: 'a-sample-token',
      secret: 'tops3cr3t'
    }
  ]
};

console.log(JSON.stringify(hideSecret(jsonObj, opts), null, 2));
```

Run the example (without `NODE_ENV`):

```shell
node lab/example.js
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
      "password": "*****************..."
    },
    {
      "role": "API",
      "token": "a-sample-token",
      "secret": "*********"
    }
  ]
}
```

Run the example with `NODE_ENV=test`:

```shell
NODE_ENV=test node lab/example.js
```

The output will be:

```plain
{
  "name": "myname",
  "password": "s3cr3t",
  "accounts": [
    {
      "role": "admin",
      "username": "root",
      "password": "a-very-very-very-long-passphrase"
    },
    {
      "role": "API",
      "token": "a-sample-token",
      "secret": "tops3cr3t"
    }
  ]
}
```

### Benchmark

Clone source code from [github](https://github.com/devebot/hide-secret), install
dependencies and execute `lab/benchmark.js` script:

```shell
git clone https://github.com/devebot/hide-secret.git
cd hide-secret
node install
node lab/benchmark.js
```

The benchmark script will return the following output:

```
$ node lab/benchmark.js
=> Benchmark of hideSecret() started ...
 - hideSecret(obj, { cloned: true }) x 60,685 ops/sec ±0.57% (89 runs sampled)
 - hideSecret(obj, { cloned: false }) x 28,421 ops/sec ±1.66% (88 runs sampled)
 - hideSecret(lodash.cloneDeep(obj)) x 19,497 ops/sec ±1.12% (88 runs sampled)
+> Fastest is hideSecret(obj, { cloned: true })
```

## License

MIT
