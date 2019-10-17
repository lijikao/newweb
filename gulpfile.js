var gulp = require("gulp");
var path = require("path");
var less = require("gulp-less");
var concat = require("gulp-concat");
var pug = require('gulp-pug');
var notify = require('gulp-notify');
//var copyassets = require('gulp-css-copy-assets').default;


function compileLess(){
    return gulp.src('./styles/**/*.less', { base: '.'})
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./'));
}

function packBaseJs(){
    return gulp.src([
        //'node_modules/popper.js/dist/popper.min.js',
        'node_modules/jquery/dist/jquery.js',
        'jquery-slide/jquery.slide.min.js',
        'node_modules/lodash/lodash.js',
        'node_modules/vue/dist/vue.min.js',
        'node_modules/vue-router/dist/vue-router.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/echarts/dist/echarts.js',
        'node_modules/moment/min/moment-with-locales.js',
        'node_modules/daterangepicker/daterangepicker.js',
        'scripts/lib/base64unicode.js',
        'scripts/lib/wna-0.1.0.min.js'
    ])
    .pipe(concat('base.js'))
    .pipe(gulp.dest('dist/js/'));
}


function packBaseStyles(){
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/daterangepicker/daterangepicker.css',
        'styles/main.css',
        "styles/site.css",
    ])
    .pipe(concat('base.css'))
    //.pipe(copyassets())
    .pipe(gulp.dest('dist/styles/'))
}


function packAppJs(){
    return gulp.src([
        'vues/charts/trendchart.js',
        'vues/charts/piechart.js',
        'vues/charts/barchart.js',
        'vues/helpers.js',
        'vues/vertmenu.js',
        //'vues/tableview.js',
        'vues/tablix.js',
        'vues/tablixWithTools.js',
        'vues/tableview2.js',
        'vues/daterangeselector.js',
        'vues/daterangedview.js',
        'vues/counterfeitStore.js',
        'vues/counterfeitProduct.js',
        'vues/modalDialog.js',
        'vues/settingsView.js',
        'vues/login.js',
        'vues/register.js', 
        'vues/password.js', 
        'scripts/index.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js/'));
}

function packEntryStyles(){
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',        
        'styles/main.css',
        'styles/entry.css'
    ])
    .pipe(concat('entry.css'))
    //.pipe(copyassets())
    .pipe(gulp.dest('dist/styles/'))
}

const build = gulp.series(compileLess, packBaseJs, packBaseStyles, packAppJs, packHtml, watchFiles);

function packHtml(){
    return gulp.src([
        'views/index.pug'
    ])
    // .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(concat('index.html'))
    .pipe(gulp.dest('dist/'));
};


function watchFiles(){
    gulp.watch('vues/**/*', packAppJs);
    gulp.watch('scripts/**/*', packAppJs);
    gulp.watch('styles/**/*.css', packEntryStyles);
    gulp.watch('styles/**/*.less', compileLess);
    gulp.watch('styles/**/*.css', packBaseStyles);
    gulp.watch('gulpfile.js', build);
}



exports.default = build;