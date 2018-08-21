'use strict';

const cloneDeepWith = require('lodash.clonedeepwith');
const traverse = require('traverse');

const DEFAULT_SECRET_FIELD_NAMES = {
  pass: 1, passwd: 1, password: 1,
  passphrase: 1,
  secret: 1
};
const DEFAULT_MAX_SECRET_LENGTH = 20;
const CACHED_MASKED_SECRET = {};

function hideSecret(obj, opts) {
  if (opts && opts.skipped) return obj;
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  opts = opts || {};
  let fieldNames = opts.secretFieldNames || DEFAULT_SECRET_FIELD_NAMES;
  if (opts.immutable !== false) {
    obj = cloneDeepWith(obj, function(value, key) {
      if(fieldNames[key]) {
        return maskPassword(value);
      }
    });
  } else {
    traverse(obj).forEach(function (value) {
      if (fieldNames[this.key]) {
        this.update(maskPassword(value));
      }
    });
  }
  return obj;
}

function maskPassword(passwd) {
  if (typeof passwd !== 'string') return passwd;
  let len = passwd.length;
  let postfix = null;
  if (len > DEFAULT_MAX_SECRET_LENGTH) {
    len = DEFAULT_MAX_SECRET_LENGTH;
    postfix = '...';
  }
  if (!CACHED_MASKED_SECRET[len]) {
    CACHED_MASKED_SECRET[len] = new Array(len + 1).join('*');
    if (postfix) {
      CACHED_MASKED_SECRET[len] = CACHED_MASKED_SECRET[len] + postfix;
    }
  }
  return CACHED_MASKED_SECRET[len];
}

module.exports = hideSecret;
