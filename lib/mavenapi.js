#!/usr/bin/env node

var OAuth2 = require('../node_modules/oauth/lib/oauth2').OAuth2,
    config = require('../config'),
    http = require('http'),
    qs = require('querystring'),
    open = require('open');

var mavenapi = {

  init: function (evt) {
    this.evtEmitter = evt;
  },

  auth: function () {
    'use strict';

    var oauth2 = new OAuth2(
          config.appID,
          config.secretToken,
          config.baseAuthAPI,
          config.authorizePath,
          config.accessTokenPath
        ),
        authURL = oauth2.getAuthorizeUrl({
          response_type: 'code',
          redirect_uri: config.callbackURL
        }),
        self = this;

    // Open authorize URL in browser
    open(authURL);

    http.createServer(function (req, res) {
      var p = req.url.split('/'),
          pLen = p.length;

      if (pLen === 2 && p[1].indexOf('code') === 1) {
        // Get code
        var qsObj = qs.parse(p[1].split('?')[1]);

        // Obtaining access_token
        oauth2.getOAuthAccessToken(
          qsObj.code,
          {
            'redirect_uri': config.callbackURL,
            'grant_type': 'authorization_code'
          },
          function (e, access_token, refresh_token, results){
            if (e) {
              res.end(e);
            } else if (results.error) {
              res.end(JSON.stringify(results));
            } else {
              // Display success message
              // @TODO Improve success page
              var successBody = 'You can now use MavenTrack. Please close this browser window and go to your terminal.';
              res.writeHead(200, {
                'Content-Length': successBody.length,
                'Content-Type': 'text/html' });
              res.end(successBody);

              self.evtEmitter.emit('authenticated', access_token);
            }
          }
        );
      }

    }).listen(8800);
  }
};

module.exports = mavenapi;

