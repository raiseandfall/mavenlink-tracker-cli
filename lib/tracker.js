#!/usr/bin/env node

'use strict';

var request = require('./request'),
  config = require('../config'),
  q = require('q'),
  pr = require('prompt'),
  moment = require('moment');

var _currWorkspace,
  _currStory;

var _ = {

  getWorkspaces: function () {
    var defer = q.defer();
    request.req({
      path: config.version + config.apiPaths.workspaces
    }).then(function (data) {
      defer.resolve(data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },

  getStories: function (workspace) {
    var defer = q.defer();
    console.log('Getting stories for ' + workspace.title + '...');
    request.req({
      path: config.version + config.apiPaths.stories + workspace.id
    }).then(function (data) {
      defer.resolve(data);
    }, function (err) {
      defer.reject(err);
    });
    return defer.promise;
  },

  askWorkspace: function (workspaces) {
    var defer = q.defer(),
      _workspaces = workspaces.workspaces,
      _results = workspaces.results;
    for ( var i = 0, len = _results.length; i < len; i++ ) {
      console.log('['+i+']', _workspaces[_results[i].id].title);
    }

    // Ask user to choose a workspace
    pr.get({
      properties: {
        idx: {
          pattern: /^[0-9\s\-]+$/,
          type: 'number',
          description: 'Choose a project',
          required: true
        }
      }
    }, function (err, res) {
      _currWorkspace = _workspaces[_results[res.idx].id];
      defer.resolve(_currWorkspace);
    });
    return defer.promise;
  },

  askStory: function (stories) {
    var defer = q.defer(),
      _stories = stories.stories,
      _results = stories.results;
    for ( var i = 0, len = _results.length; i < len; i++ ) {
      console.log('['+i+']', _stories[_results[i].id].title);
    }

    // Ask user to choose a workspace
    pr.get({
      properties: {
        idx: {
          pattern: /^[0-9\s\-]+$/,
          type: 'number',
          description: 'Choose a story',
          required: true
        }
      }
    }, function (err, res) {
      _currStory = _stories[_results[res.idx].id];
      defer.resolve(_currStory);
    });
    return defer.promise;
  },


  askHours: function () {
    var defer = q.defer();
    pr.get({
      properties: {
        hours: {
          pattern: /^[0-9\s\-]+$/,
          type: 'number',
          description: 'Number of hours',
          required: true
        }
      }
    }, function (err, res) {
      defer.resolve(res.hours*60);
    });
    return defer.promise;
  },


  track: function (parameters) {
    var defer = q.defer(),
      params = JSON.stringify({ time_entry: parameters });

    request.req({
      path: config.version + config.apiPaths.track,
      method: 'POST'
    }, params).then(function (data) {
      defer.resolve(data);
    }, function (err) {
      defer.reject(err);
    });

    return defer.promise;
  }

};

function Tracker (token) {
  request.init( token );

  // Default values
  this.workspace = -1;
  this.story = -1;
  this.minutes = 0;
  this.date = moment().format('MM/DD/YYYY');
}

Tracker.prototype.track = function (cbSuccess, cbError) {
  var self = this;

  _.getWorkspaces().then(function (workspaces) {
    return _.askWorkspace(workspaces);
  }).then(function(workspace) {
    self.workspace = workspace;
    return _.getStories(workspace);
  }).then(function(stories) {
    return _.askStory(stories);
  }).then(function(story) {
    self.story = story;
    return _.askHours(story);
  }).then(function(minutes) {
    self.minutes = minutes;
    return _.track({
      time_in_minutes: minutes,
      workspace_id: self.workspace.id,
      story_id: self.story.id,
      date_performed: self.date
    });
  }).then(function() {
    cbSuccess({
      hours: self.minutes/60,
      date_performed: self.date,
      workspace: self.workspace.title,
      story: self.story.title
    });
  }, function(err) {
    cbError(err);
  });

};

module.exports = Tracker;