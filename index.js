#!/usr/bin/env node

var mavenApi = require('./lib/mavenapi'),
    tracker = require('./lib/tracker');

// @TODO: check if OAuth Access Token already exists

// Let's test Oauth first
mavenApi.auth();
