#!/usr/bin/env node

var config = {

  appID: '2aa872a850f2c2017dc1ed8aa8eba331c9cf09b069fc029c792eb03fc4cf01d8',
  secretToken: '084c8acaae6ab93f4a8908f9b675ae6577de06717443e977fd85787f0cd3c7a8',
  callbackURL: 'http://localhost:8800/',
  baseAPI: 'https://app.mavenlink.com/',
  authorizePath: 'oauth/authorize',
  accessTokenPath: 'oauth/token'

};

module.exports = config;