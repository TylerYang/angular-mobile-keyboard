var gulp = require("gulp");
var stylus = require("gulp-stylus");
var templateCache = require("gulp-angular-templatecache");
var del = require("del");
var concat = require("gulp-concat");
var streamqueue = require("streamqueue");

gulp.task("clean", function() {
    return del.sync("dist/**/*", function(err, paths) {
        console.log("Deleted fils/folders:\n", paths.join("\n"));
    });
});
gulp.task("gen-style", function() {
    return gulp.src("./src/css/keyboard.styl")
        .pipe(stylus({compress: true}))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("concat", function() {
    return streamqueue({objectMode: true}, gulp.src(["./src/js/src/**/*.js"]), getTemplateStream())
        .pipe(concat("keyboard.js"))
        .pipe(gulp.dest("./dist/js/"));
    
});

function getTemplateStream() {
    var options = {
        module: "ngMobileKeyboard",
        filename: "keyboard.js"
    };
    return gulp.src("./src/template/**/*.html")
        .pipe(templateCache(options));
}

gulp.task("default", ["clean", "gen-style", "concat"]);
