#!/usr/bin/env node

'use strict';

var request = require('./request'),
  config = require('../config'),
  q = require('q'),
  moment = require('moment'),
  inquirer = require('inquirer');

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

    inquirer.prompt([{
      type: 'list',
      name: 'project',
      message: 'What project are you tracking ?',
      choices: function () {
        var workspaces = [];
        for ( var i = 0, len = _results.length; i < len; i++ ) {
          workspaces.push({
            name: _workspaces[_results[i].id].title,
            value: i
          });
        }
        return workspaces;
      }
    }], function (answers) {
      _currWorkspace = _workspaces[_results[answers.project].id];
      defer.resolve(_currWorkspace);
    });

    return defer.promise;
  },

  askStory: function (stories) {
    var defer = q.defer(),
      _stories = stories.stories,
      _results = stories.results;

    inquirer.prompt([{
      type: 'list',
      name: 'task',
      message: 'Select the task',
      choices: function () {
        var tasks = [];
        for ( var i = 0, len = _results.length; i < len; i++ ) {
          tasks.push({
            name: _stories[_results[i].id].title,
            value: i
          });
        }
        return tasks;
      }
    }], function (answers) {
      _currStory = _stories[_results[answers.task].id];
      defer.resolve(_currStory);
    });

    return defer.promise;
  },

  askHours: function () {
    var defer = q.defer();

    inquirer.prompt([{
      type: 'input',
      name: 'hours',
      message: 'How many hours ?',
      default: 0,
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a correct number";
      },
      filter: Number
    }], function (answers) {
      defer.resolve(answers.hours*60);
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