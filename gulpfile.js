var gulp = require("gulp");
var stylus = require("gulp-stylus");
var templateCache = require("gulp-angular-templatecache");
var del = require("del");
var concat = require("gulp-concat");
var streamqueue = require("streamqueue");
var connect = require("gulp-connect");

gulp.task("clean", function() {
    return del.sync("dist/**/*", function(err, paths) {
        console.log("Deleted fils/folders:\n", paths.join("\n"));
    });
});

gulp.task("gen-style", function() {
    return gulp.src("./src/css/keyboard.styl")
        .pipe(stylus({compress: true}))
        .pipe(gulp.dest("./dist/css"))
        .pipe(connect.reload());
});
gulp.task("gen-demo-style", function() {
    return gulp.src("./example/css/**/*.styl")
        .pipe(stylus({compress: false}))
        .pipe(gulp.dest("./example/css"))
        .pipe(connect.reload());
});

gulp.task("concat", function() {
    return streamqueue({objectMode: true}, gulp.src(["./src/js/src/**/*.js"]), getTemplateStream())
        .pipe(concat("angular-mobile-keyboard.js"))
        .pipe(gulp.dest("./dist/js/"))
        .pipe(connect.reload());
});

gulp.task("auto-gen", function() {
    var options = { 
        start: true
    };
    gulp.watch("./src/css/**/*.styl", ["gen-style"]);
    //auto gen example basic style
    gulp.watch("./example/css/**/*.styl",["gen-demo-style"]);
    //auto gen scripts 
    gulp.watch(["./src/js/src/**.js", "./src/template/**/*.html"], ["concat"]);
});

gulp.task("connect", function(){
    connect.server({
        livereload: true
    });    
});

function getTemplateStream() {
    var options = {
        module: "ngMobileKeyboard",
        filename: "angular-mobile-keyboard.js",
        transformUrl: function(url) {
            return "template/" + url;
        }
    };
    return gulp.src("./src/template/**/*.html")
        .pipe(templateCache(options));
}

gulp.task("default", ["clean", "gen-style", "concat"]);

gulp.task("dev", ["clean", "gen-style", "concat", "connect", "auto-gen"]);
