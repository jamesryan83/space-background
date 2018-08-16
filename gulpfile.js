"use strict";

var gulp = require("gulp");
var path = require("path");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var gulpts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");

var tsProject = gulpts.createProject("tsconfig.json");


// watch all
gulp.task("default", function () {
    gulp.watch(path.join(__dirname, "src", "**", "*.ts"), { interval: 500 }, ["ts"]);
});


// build all
gulp.task("dist", ["minify"]);


// typescript only
gulp.task("ts", function () {
    var tsResult = gulp.src("src/**/*.ts").pipe(tsProject());
    return tsResult
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});


// typescript + minify
gulp.task("minify", ["ts"], function() {
    gulp.src(["dist/**/*.js"])
        .pipe(uglify())
        .pipe(rename("space-bg.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});
