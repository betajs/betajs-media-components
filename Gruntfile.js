module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');
	var dist = 'betajs-media-components';

	gruntHelper.init(pkg, grunt)
	
	
    /* Compilation */    
	.scopedclosurerevisionTask(null, [
  		'dist/betajs-media-components-templates.js',
		'dist/betajs-media-components-locales.js',
		'src/ads/**/*.js',
		'src/dynamics/common/*.js',
		'src/dynamics/video_player/**/*.js',
		'src/dynamics/video_recorder/**/*.js'
     ], "dist/" + dist + "-noscoped.js", {
		"module": "global:BetaJS.MediaComponents",
		"base": "global:BetaJS",
		"browser": "global:BetaJS.Browser",
		"flash": "global:BetaJS.Flash",
		"media": "global:BetaJS.Media",
		"dynamics": "global:BetaJS.Dynamics",
		"jquery": "global:jQuery"
    }, {
    	"base:version": 502,
    	"browser:version": 78,
    	"flash:version": 33,
    	"dynamics:version": 251,
    	"media:version": 57
    })	
    .concatTask('concat-scoped', ['vendors/scoped.js', 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .concatsassTask('concat-dist-css', [
        //'vendors/_hacks.scss',
        'src/themes/common/mixins.scss',
        'src/themes/common/fontello_font.scss',
        'src/themes/video_player/default/theme.scss',
        'src/themes/common/fontello.scss',
        'src/themes/video_player/default/*.scss',

        'src/themes/video_recorder/default/theme.scss',
        'src/../src/themes/common/fontello.scss',
        'src/themes/video_recorder/default/*.scss'
     ], 'dist/betajs-media-components.css')
    .uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .cssminTask('cssmin-dist', 'dist/' + dist + '.css', 'dist/' + dist + '.min.css')
    .betajstemplatesTask('templates-dist', ['src/**/*.html'], 'dist/betajs-media-components-templates.js', 'module:Templates')
    .yamltojsTask('locales', ['src/locales/*.yml'], 'dist/betajs-media-components-locales.js', 'src/fragments/locale.tpl', function (s) {
    	return require('he').encode(s);
    })
    .cleanTask('clean-compile', ['dist/betajs-media-components-templates.js', 'dist/betajs-media-components-locales.js'])
    .simplecopyTask('copy-fonts', {'dist/bjsmc-ie8.eot': 'vendors/fontello/font/fontello.eot'})
    .packageTask()

    /* Compile Themes */
    .betajstemplatesTask('templates-themes', ['src/themes/video_player/modern/*.html'], 'dist/themes/modern-templates.js', 'module:Templates')
    .concatTask('concat-themes', [
	    'src/fragments/theme-begin.js-fragment',
	    'dist/themes/modern-templates.js',
	    'src/themes/video_player/modern/theme.js',
	    'src/themes/video_recorder/modern/theme.js',
	    'src/fragments/end.js-fragment'
    ], 'dist/themes/modern.js')
    .uglifyTask('uglify-themes', 'dist/themes/modern.js', 'dist/themes/modern.min.js')
    .concatsassTask('concat-themes-css', [
        //'vendors/_hacks.scss',
  	    'src/themes/common/mixins.scss',
	    'src/themes/video_player/modern/theme.scss',
        'src/themes/common/fontello.scss',
	    'src/themes/video_player/default/player.scss',
	    'src/themes/video_player/default/loader.scss',
	    'src/themes/video_player/default/topmessage.scss',
	    'src/themes/video_player/modern/*.scss',
	    
	    'src/themes/video_recorder/modern/theme.scss',
        'src/../src/themes/common/fontello.scss',
	    'src/themes/video_recorder/default/recorder.scss',
	    'src/themes/video_recorder/default/chooser.scss',
	    'src/themes/video_recorder/default/topmessage.scss',
	    'src/themes/video_recorder/default/imagegallery.scss',
	    'src/themes/video_recorder/default/controlbar.scss',
	    'src/themes/video_recorder/default/settings.scss',
	    'src/themes/video_recorder/modern/*.scss'
    ], 'dist/themes/modern.css')
    .cssminTask('cssmin-themes', 'dist/themes/modern.css', 'dist/themes/modern.min.css')
    .cleanTask('clean-themes', 'dist/themes/modern-templates.js')
    
    /* Testing */
    .browserqunitTask(null, 'tests/tests.html', true)
    .closureTask(null, [
        './vendors/scoped.js',
        './vendors/beta-noscoped.js',
        './vendors/betajs-browser-noscoped.js',
        './vendors/betajs-flash-noscoped.js',
        './vendors/betajs-media-noscoped.js',
        './vendors/beta-dynamics-noscoped.js',
        './dist/betajs-media-components-noscoped.js'
     ], null, { jquery: true })
    .browserstackTask(null, 'tests/tests.html', {desktop: true, mobile: false})
    .browserstackTask(null, 'tests/tests.html', {desktop: false, mobile: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
    .csslinterTask(null, ['dist/betajs-media-components.css', 'dist/themes/modern.css'])
    
    /* External Configurations */
    .codeclimateTask()
    
    /* Dependencies */
    .dependenciesTask(null, { github: [
        'betajs/betajs-scoped/dist/scoped.js',
        'betajs/betajs/dist/beta-noscoped.js',
        'betajs/betajs-browser/dist/betajs-browser-noscoped.js',
        'betajs/betajs-flash/dist/betajs-flash-noscoped.js',
        'betajs/betajs-flash/dist/betajs-flash.swf',
        'betajs/betajs-media/dist/betajs-media-noscoped.js',
        'betajs/betajs-dynamics/dist/betajs-dynamics-noscoped.js',
        'saadeghi/browser-hack-sass-mixins/_hacks.scss'
     ] })

    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    
    /* Documentation */
    .docsTask();

	grunt.initConfig(gruntHelper.config);	
	
	grunt.registerTask('default', [
	    'package',
        'readme',
        'license',
        'codeclimate',        
        'templates-dist',
        'locales',
        'scopedclosurerevision',
        'concat-scoped',
        'uglify-noscoped',
        'uglify-scoped',
        'concat-dist-css',
        'cssmin-dist',
        'clean-compile',
        'copy-fonts',
        "generate-default-yml"
    ]);
	grunt.registerTask('themes', [
        'templates-themes',
        'concat-themes',
        'uglify-themes',
        'concat-themes-css',
        'cssmin-themes',
        'clean-themes'
    ]);
	grunt.registerTask('check', ['csslinter', 'lint', 'browserqunit']);

	grunt.registerTask("generate-default-yml", function () {
		var done = this.async();
		require('jsdom').jsdom.env("", [
            "./vendors/jquery.min.js",
            "./vendors/scoped.js",
            "./vendors/beta-noscoped.js",
            "./vendors/betajs-browser-noscoped.js",
            "./vendors/betajs-dynamics-noscoped.js",
            "./vendors/betajs-media-noscoped.js",
            "./dist/betajs-media-components-noscoped.js"
        ], function (err, window) {
			var strings = window.BetaJS.MediaComponents.Assets.strings.all();
			var lang = {
				"language:en": strings
			};
			var yml = require("js-yaml").dump(lang);
			grunt.file.write("./dist/english.yml", yml);
			done();
        });
	});

};
