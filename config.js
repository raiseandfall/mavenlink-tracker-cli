#!/usr/bin/env node

'use strict';

var config = {

  // Authentication
  appID: '2aa872a850f2c2017dc1ed8aa8eba331c9cf09b069fc029c792eb03fc4cf01d8',
  secretToken: '084c8acaae6ab93f4a8908f9b675ae6577de06717443e977fd85787f0cd3c7a8',
  callbackURL: 'http://localhost:8800/',
  baseAuthAPI: 'https://app.mavenlink.com/',
  authorizePath: 'oauth/authorize',
  accessTokenPath: 'oauth/token',

  // API
  baseAPI: 'api.mavenlink.com',
  version: '/api/v1/',
  apiPaths: {
    workspaces: 'workspaces.json?include_archived=false&order=updated_at:asc',
    stories: 'stories.json?workspace_id=',
    track: 'time_entries.json'
  }

};

module.exports = config;