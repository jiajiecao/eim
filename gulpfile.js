"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local dev server
var serveStatic = require('serve-static');
var config = {
    port: 3000,
    devBaseUrl: 'http://localhost'
};

//Start a local development server
gulp.task('connect', function() {
    connect.server({
        root:[ './src', ],
        port: config.port,
        base: config.devBaseUrl,
        livereload: false
    });
});

gulp.task('default', ['connect']);