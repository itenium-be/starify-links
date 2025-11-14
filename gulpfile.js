const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const execAsync = promisify(exec);

gulp.task('clean', function() {
	return del(['./dist/**']);
});


gulp.task('typescript', async function() {
	const { stdout, stderr } = await execAsync('npx rollup -c');
	if (stdout) console.log(stdout);
	if (stderr) console.error(stderr);
});


const copyRootFiles = () => gulp.src(['./favicon.png', './manifest.json', './background.js'])
	.pipe(gulp.dest('./dist'));

const copyOptionsFiles = () => gulp.src(['./src/options/options.html', './src/options/options.css'])
	.pipe(gulp.dest('./dist'));

const copyBootstrapCss = () => gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
	.pipe(gulp.dest('./dist'));

const copyBootstrapJs = () => gulp.src('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
	.pipe(gulp.dest('./dist'));

gulp.task('copy', gulp.parallel(copyRootFiles, copyOptionsFiles, copyBootstrapCss, copyBootstrapJs));


gulp.task('zip', function(done) {
	// Read original manifest
	const originalManifest = fs.readFileSync('./dist/manifest.json', 'utf-8');
	const manifest = JSON.parse(originalManifest);

	// Remove reload command for production
	if (manifest.commands && manifest.commands.reload) {
		delete manifest.commands.reload;
	}

	// Write modified manifest
	fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 4));

	// Create zip
	gulp.src(['./dist/**', '!./dist/*.zip'])
		.pipe(zip('starify-links.zip'))
		.pipe(gulp.dest('./dist'))
		.on('end', () => {
			// Restore original manifest
			fs.writeFileSync('./dist/manifest.json', originalManifest);
			done();
		});
});


gulp.task('watch', gulp.series('typescript', 'copy', function() {
	return gulp.watch('src/**/*.*', gulp.series('typescript', 'copy'));
}))


gulp.task('default', gulp.series('clean', 'typescript', 'copy', 'zip'));
