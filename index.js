#!/usr/bin/env node

'use strict';

var events = require('events'),
  evt = new events.EventEmitter(),
  mavenApi = require('./lib/mavenapi'),
  Tracker = require('./lib/tracker'),
  pr = require('prompt');

// Start prompt
pr.start();

// @TODO: check if OAuth Access Token already exists

mavenApi.init(evt);
mavenApi.auth();
evt.on('authenticated', function (token) {
  console.log('authenticated', token);
  // Test API Call
  // Test API Call
  var track = new Tracker(token);
  track.track(function(data) {
    console.log('You added '+data.hours+'h on '+data.date_performed+' for ' + data.story + ' on '+data.workspace);
  }, function (err) {
    console.log('Something went wrong', err);
  });
});
