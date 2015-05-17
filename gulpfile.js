var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	include = require('gulp-include'),
	prefix = require('gulp-autoprefixer'),
	rename = require("gulp-rename");

// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
var displayError = function(error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
        errorString += ' in ' + error.fileName;

    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
}

// sass task
gulp.task('sass', function () {
  gulp.src('./assets/sass/*.scss')
  	.pipe(sass({ outputStyle: 'compressed' }))
  	.on('error', function(err){
        displayError(err);
    })
  	//.pipe(sourcemaps.init())
	//.pipe(sass())
	//.pipe(sourcemaps.write('./assets/css/'))
    .pipe(prefix(
        'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))
	.pipe(gulp.dest('./assets/css/'))
	.pipe(notify({
		message: "SASS Compiled"
	}));
});

// uglify task
gulp.task('js', function() {
	// main app js file
	gulp.src('./assets/js/script.js')
	.pipe(include())
	.pipe(uglify())
	.pipe(rename("script.min.js"))
	.pipe(gulp.dest('./assets/js/'))
	.pipe(notify({
		message: "JS Compiled"
	}));
});

gulp.task('compress-img', function() {
	gulp.src('./assets/img/**/*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('./assets/img/'));
});

gulp.task('watch', function() {
	// watch scss files
	gulp.watch('./assets/sass/**/*.scss', ['sass'])
	.on('change', function(evt) {
		console.log(
			'[watcher] File ' + evt.path.replace(/.*(?=sass)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});
  	gulp.watch('./app/assets/img/**/*', ['compress-img']);
  	gulp.watch('./app/assets/js/**/*', ['js']);
});

gulp.task('default', ['sass', 'js', 'compress-img', 'watch']);