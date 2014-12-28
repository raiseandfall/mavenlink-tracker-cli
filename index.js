#!/usr/bin/env node

'use strict';

var events  = require('events'),
  evt       = new events.EventEmitter(),
  mavenApi  = require('./lib/mavenapi'),
  Tracker   = require('./lib/tracker');

// When authenticated
evt.on('authenticated', function (token) {
  var track = new Tracker(token);
  track.track(function(data) {
    console.log('You added '+data.hours+'h on '+data.date_performed+' for ' + data.story + ' on '+data.workspace);
  }, function (err) {
    console.log('Something went wrong', err);
  });
});

// Authenticate user
mavenApi.auth(evt);
