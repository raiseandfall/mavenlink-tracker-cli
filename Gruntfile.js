module.exports = function (grunt) {

  'use strict';

  grunt.initConfig({

    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'index.js',
        'package.json',
        'test/**/*.js',
        '.jshintrc'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    'node-inspector': {
      custom: {
        options: {
          'web-port': 2663,
          'web-host': 'localhost',
          'debug-port': 5857,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 4,
          'hidden': ['node_modules']
        }
      }
    },

    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '5455'
          }
        }
      }
    },

    mochaTest: {
      all: {
        src: ['test/**/*.js']
      }
    },

    watch: {
      server: {
        files: ['.rebooted'],
        options: {
          livereload: true
        }
      }
    }

  });


  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('build', ['jshint', 'mochaTest']);
};