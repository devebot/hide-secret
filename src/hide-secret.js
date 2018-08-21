'use strict';

const cloneDeepWith = require('lodash.clonedeepwith');
const traverse = require('traverse');

const DEFAULT_SECRET_FIELD_NAMES = [
  'pass', 'passwd', 'password', 'passphrase', 'secret'
];
const CACHED_SECRET_FIELD_NAMES = {};
const DEFAULT_MAX_SECRET_LENGTH = 17;
const CACHED_MASKED_SECRET = {};

function hideSecret(obj, opts) {
  if (opts && opts.skipped) return obj;

  let fieldNames = null;
  if (opts && opts.secretFieldNames) {
    fieldNames = getSecretFieldNames(opts.secretFieldNames);
  }

  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;

  opts = opts || {};
  fieldNames = fieldNames || getSecretFieldNames(opts.secretFieldNames);

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

function getSecretFieldNames(names) {
  let fieldNames = CACHED_SECRET_FIELD_NAMES;
  if (Array.isArray(names)) {
    for(let key in fieldNames) {
      delete fieldNames[key];
    }
    for(let i in names) {
      fieldNames[names[i]] = true;
    }
  }
  if (Object.keys(fieldNames).length === 0) {
    names = DEFAULT_SECRET_FIELD_NAMES;
    for(let i in names) {
      fieldNames[names[i]] = true;
    }
  }
  return fieldNames;
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
