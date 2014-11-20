#!/usr/bin/env node

'use strict';

var https = require('https'),
  config = require('../config'),
  q = require('q');


var request = {

  init: function (token) {
    this.token = token;
  },

  req: function (options, parameters) {

    var defer = q.defer();

    if (!options.method) {
      options.method = 'GET';
    }

    options.headers = {};

    if (options.method === 'POST') {
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': parameters.length
      };
    }

    options.host = config.baseAPI;
    options.headers.Authorization = 'Bearer '+this.token;

    var req = https.request(options);

    if (parameters) {
      req.write(parameters);
    }

    req.on('response', function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var jsChunk = JSON.parse(chunk);
        defer.resolve(jsChunk);
      });
    });

    req.on('error', function (e) {
      defer.reject(e.message);
      console.log('problem with request: ', e.message, e.stack);
    });

    req.end();

    return defer.promise;

  }

};

module.exports = request;


