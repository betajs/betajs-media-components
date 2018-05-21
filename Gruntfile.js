module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
	var dist = 'betajs-media-components';

	var betajsTemplates = require("grunt-betajs-templates");

	gruntHelper.init(pkg, grunt)


    /* Compilation */
	.scopedclosurerevisionTask(null, [
		'dist/betajs-media-components-locales.js',
		'src/ads/**/*.js',
		'src/dynamics/common/*.js',
        'src/dynamics/popup_helper/*.js',
		'src/dynamics/video_player/**/*.js',
		'src/dynamics/video_recorder/**/*.js',
        'src/dynamics/image_viewer/**/*.js',
        'src/dynamics/audio_player/**/*.js'
     ], "dist/" + dist + "-noscoped.js", {
		"module": "global:BetaJS.MediaComponents",
		"base": "global:BetaJS",
		"browser": "global:BetaJS.Browser",
		"flash": "global:BetaJS.Flash",
		"media": "global:BetaJS.Media",
		"dynamics": "global:BetaJS.Dynamics"
    }, {
    	"base:version": pkg.devDependencies.betajs,
    	"browser:version": pkg.devDependencies["betajs-browser"],
    	"flash:version": pkg.devDependencies["betajs-flash"],
    	"dynamics:version": pkg.devDependencies["betajs-dynamics"],
    	"media:version": pkg.devDependencies["betajs-media"]
    }, null, betajsTemplates.concatProcess(grunt))
    .concatTask('concat-scoped', [require.resolve("betajs-scoped"), 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .concatsassTask('concat-dist-css', [
        'src/themes/common/mixins.scss',
        'src/themes/common/fontello_font_generated.scss',

        'src/themes/video_player/default/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
        'src/themes/common/style.scss',
        'src/themes/video_player/default/*.scss',

        'src/themes/video_recorder/default/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/video_recorder/default/*.scss',

        'src/themes/image_viewer/default/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/*.scss',

        'src/themes/audio_player/default/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/*.scss',

        'src/dynamics/popup_helper/*.scss'
     ], 'dist/betajs-media-components.css')
    .uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .cssminTask('cssmin-dist', 'dist/' + dist + '.css', 'dist/' + dist + '.min.css')
    .yamltojsTask('locales', ['src/locales/*.yml'], 'dist/betajs-media-components-locales.js', 'src/fragments/locale.tpl', function (s) {
    	return require('he').encode(s);
    })
    .cleanTask('clean-compile', ['dist/betajs-media-components-locales.js'])
    .simplecopyTask('copy-fonts', {'dist/bjsmc-ie8.eot': 'vendors/fontello/font/fontello.eot'})
    .packageTask()
    .autoincreasepackageTask(null, "package-source.json")
    .jsbeautifyTask("beautify1", "src/**/*.js")
    .jsbeautifyTask("beautify2", "src/**/**/*.js")
    .jsbeautifyTask("beautify3", "src/**/**/**/*.js")

    /* Compile Themes */
    .concatTask('concat-modern-theme', [
	    'src/fragments/theme-begin.js-fragment',
	    'src/themes/video_player/modern/theme.js',
	    'src/themes/video_recorder/modern/theme.js',
        'src/themes/image_viewer/modern/theme.js',
        'src/themes/audio_player/modern/theme.js',
	    'src/fragments/end.js-fragment'
    ], 'dist/themes/modern/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-modern-theme', 'dist/themes/modern/script.js', 'dist/themes/modern/script.min.js')
    .concatsassTask('concat-modern-theme-css', [
        'src/themes/common/mixins.scss',
	    'src/themes/video_player/modern/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
	    'src/themes/video_player/default/player.scss',
        'src/themes/video_player/default/adplayer.scss',
	    'src/themes/video_player/default/loader.scss',
	    'src/themes/video_player/default/topmessage.scss',
	    'src/themes/video_player/modern/*.scss',

	    'src/themes/video_recorder/modern/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
	    'src/themes/video_recorder/default/recorder.scss',
	    'src/themes/video_recorder/default/chooser.scss',
        'src/themes/video_recorder/default/message.scss',
	    'src/themes/video_recorder/default/topmessage.scss',
	    'src/themes/video_recorder/default/imagegallery.scss',
	    'src/themes/video_recorder/default/controlbar.scss',
	    'src/themes/video_recorder/default/settings.scss',
	    'src/themes/video_recorder/modern/*.scss',

        'src/themes/image_viewer/modern/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/modern/*.scss',

        'src/themes/audio_player/modern/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/video_player/default/loader.scss',
        'src/themes/video_player/modern/*.scss'

    ], 'dist/themes/modern/style.css')
    .cssminTask('cssmin-modern-theme', 'dist/themes/modern/style.css', 'dist/themes/modern/style.min.css')

    /* Compile Space Theme */
    .concatTask('concat-space-theme', [
      'src/fragments/theme-begin.js-fragment',
      'src/themes/video_player/space/theme.js',
      'src/themes/video_recorder/space/theme.js',
      'src/themes/image_viewer/space/theme.js',
      'src/themes/audio_player/space/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/space/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-space-theme', 'dist/themes/space/script.js', 'dist/themes/space/script.min.js')
    .concatsassTask('concat-space-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/space/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
      'src/themes/video_player/default/player.scss',
        'src/themes/video_player/default/adplayer.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/space/*.scss',

      'src/themes/video_recorder/space/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/space/*.scss',

        'src/themes/image_viewer/space/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/space/*.scss',

        'src/themes/audio_player/space/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/audio_player/default/loader.scss',
        'src/themes/audio_player/space/*.scss'

    ], 'dist/themes/space/style.css')
    .cssminTask('cssmin-space-theme', 'dist/themes/space/style.css', 'dist/themes/space/style.min.css')

    /* Compile Theatre Theme */
    .concatTask('concat-theatre-theme', [
      'src/fragments/theme-begin.js-fragment',
      'src/themes/video_player/theatre/theme.js',
      'src/themes/video_recorder/theatre/theme.js',
      'src/themes/image_viewer/theatre/theme.js',
        'src/themes/audio_player/theatre/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/theatre/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-theatre-theme', 'dist/themes/theatre/script.js', 'dist/themes/theatre/script.min.js')
    .concatsassTask('concat-theatre-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/theatre/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
      'src/themes/video_player/default/player.scss',
        'src/themes/video_player/default/adplayer.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/theatre/*.scss',

      'src/themes/video_recorder/theatre/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/theatre/*.scss',
      'src/themes/video_recorder/theatre/**/*.scss',

        'src/themes/image_viewer/theatre/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/theatre/*.scss',

        'src/themes/audio_player/theatre/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/audio_player/default/loader.scss',
        'src/themes/audio_player/theatre/*.scss'

    ], 'dist/themes/theatre/style.css')
    .cssminTask('cssmin-theatre-theme', 'dist/themes/theatre/style.css', 'dist/themes/theatre/style.min.css')


    /* Compile Elevate Theme */
    .concatTask('concat-elevate-theme', [
      'src/fragments/theme-begin.js-fragment',
      'src/themes/video_player/elevate/theme.js',
      'src/themes/video_recorder/elevate/theme.js',
        'src/themes/image_viewer/elevate/theme.js',
        'src/themes/audio_player/elevate/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/elevate/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-elevate-theme', 'dist/themes/elevate/script.js', 'dist/themes/elevate/script.min.js')
    .concatsassTask('concat-elevate-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/elevate/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
      'src/themes/video_player/default/player.scss',
        'src/themes/video_player/default/adplayer.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/elevate/*.scss',

      'src/themes/video_recorder/elevate/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/elevate/*.scss',
      'src/themes/video_recorder/elevate/**/*.scss',

        'src/themes/image_viewer/elevate/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/elevate/*.scss',

        'src/themes/audio_player/elevate/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/audio_player/default/loader.scss',
        'src/themes/audio_player/elevate/*.scss'

    ], 'dist/themes/elevate/style.css')
    .cssminTask('cssmin-elevate-theme', 'dist/themes/elevate/style.css', 'dist/themes/elevate/style.min.css')

    /* Compile Cube Theme */
    .concatTask('concat-cube-theme', [
      'src/fragments/theme-begin.js-fragment',
      'src/themes/video_player/cube/theme.js',
      'src/themes/video_recorder/cube/theme.js',
        'src/themes/image_viewer/cube/theme.js',
        'src/themes/audio_player/cube/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/cube/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-cube-theme', 'dist/themes/cube/script.js', 'dist/themes/cube/script.min.js')
    .concatsassTask('concat-cube-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/cube/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
      'src/themes/video_player/default/player.scss',
        'src/themes/video_player/default/adplayer.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/cube/*.scss',

      'src/themes/video_recorder/cube/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/cube/*.scss',
      'src/themes/video_recorder/cube/**/*.scss',

        'src/themes/image_viewer/cube/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/cube/*.scss',

        'src/themes/audio_player/cube/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/audio_player/default/loader.scss',
        'src/themes/audio_player/cube/*.scss'
    ], 'dist/themes/cube/style.css')
    .cssminTask('cssmin-cube-theme', 'dist/themes/cube/style.css', 'dist/themes/cube/style.min.css')


    /* Compile Minimalist Theme */
    .concatTask('concat-minimalist-theme', [
      'src/fragments/theme-begin.js-fragment',
      'src/themes/video_player/minimalist/theme.js',
      'src/themes/video_recorder/minimalist/theme.js',
        'src/themes/image_viewer/minimalist/theme.js',
        'src/themes/audio_player/minimalist/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/minimalist/script.js', {
        process: betajsTemplates.concatProcess(grunt)
    })
    .uglifyTask('uglify-minimalist-theme', 'dist/themes/minimalist/script.js', 'dist/themes/minimalist/script.min.js')
    .concatsassTask('concat-minimalist-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/minimalist/theme.scss',
        'src/themes/common/fontello_icon.scss',
        'src/themes/common/fontello_icons_generated.scss',
        'src/themes/common/fontello_icons_color.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/adplayer.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/minimalist/*.scss',

      'src/themes/video_recorder/minimalist/theme.scss',
        'src/../src/themes/common/fontello_icon.scss',
        'src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/themes/common/fontello_icons_color.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/minimalist/*.scss',
      'src/themes/video_recorder/minimalist/**/*.scss',

        'src/themes/image_viewer/minimalist/theme.scss',
        'src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/image_viewer/default/viewer.scss',
        'src/themes/image_viewer/default/topmessage.scss',
        'src/themes/image_viewer/minimalist/*.scss',

        'src/themes/audio_player/minimalist/theme.scss',
        'src/../src/../src/../src/themes/common/fontello_icon.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_generated.scss',
        'src/../src/../src/../src/themes/common/fontello_icons_color.scss',
        'src/themes/audio_player/default/player.scss',
        'src/themes/audio_player/default/loader.scss',
        'src/themes/audio_player/minimalist/*.scss'

    ], 'dist/themes/minimalist/style.css')
    .cssminTask('cssmin-minimalist-theme', 'dist/themes/minimalist/style.css', 'dist/themes/minimalist/style.min.css')

    /* Testing */
    .browserqunitTask(null, 'tests/tests.html', true)
    .closureTask(null, [
    	require.resolve("betajs-scoped"),
    	require.resolve("betajs"),
    	require.resolve("betajs-browser"),
    	require.resolve("betajs-flash"),
    	require.resolve("betajs-media"),
    	require.resolve("betajs-dynamics"),
        './dist/betajs-media-components-noscoped.js'
     ], null, { })
    .browserstackTask(null, 'tests/browserstack.html', {desktop: true, mobile: true})
    .browserstackTask("browserstack-media", 'tests/server/browserstack.html', {desktop: true, mobile: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
    .csslinterTask(null, [
      'dist/themes/cube/style.css',
      'dist/betajs-media-components.css',
      'dist/themes/elevate/style.css',
      'dist/themes/minimalist/style.css',
      'dist/themes/modern/style.css',
      'dist/themes/space/style.css',
      'dist/themes/theatre/style.css'
    ])

    /* External Configurations */
    .codeclimateTask()
    .githookTask(null, "pre-commit", "check-node")

    /* Markdown Files */
	.readmeTask()
    .licenseTask()

    /* Documentation */
    .docsTask();


	gruntHelper.config.shell.mediaqunit = {
        command: [
            'open http://' + gruntHelper.myip() + ':5000/static/tests/server/index.html',
            'node node_modules/nano-media-server/server.js --staticserve .'
        ].join("&&")
    };

	gruntHelper.config.template.fontello_font = {
        options: {
            data: {
                eot_base64: require("fs").readFileSync("vendors/fontello/font/fontello.eot").toString('base64'),
                woff_base64: require("fs").readFileSync("vendors/fontello/font/fontello.woff").toString('base64'),
                truetype_base64: require("fs").readFileSync("vendors/fontello/font/fontello.ttf").toString('base64')
            }
        },
        files: [{
            src: "src/fragments/fontello_font.tpl",
            dest: "src/themes/common/fontello_font_generated.scss"
        }]
    };
    gruntHelper.config.template.fontello_icons = {
        options: {
            data: {
                icons: grunt.file.read("vendors/fontello/css/fontello-codes.css").trim().split("\n").map(function (icon) {
                    var regex = /\.([^:]+):before\s*{\s*content\s*:\s*'([^']+)'\s*;\s*}\s* \/\*[^*]+\*\//g;
                    var match = regex.exec(icon);
                    return {
                        ident: match[1],
                        content: match[2]
                    };
                })
            }
        },
        files: [{
            src: "src/fragments/fontello_icons.tpl",
            dest: "src/themes/common/fontello_icons_generated.scss"
        }]
    };

	grunt.initConfig(gruntHelper.config);

	grunt.registerTask('default', [
	    'autoincreasepackage',
      'package',
      'readme',
      'license',
      'githooks',
      'codeclimate',
      'locales',
      'beautify1', 'beautify2', 'beautify3',
      'scopedclosurerevision',
      'concat-scoped',
      'uglify-noscoped',
      'uglify-scoped',
      'template:fontello_font',
    'template:fontello_icons',
      'concat-dist-css',
      'cssmin-dist',
      'clean-compile',
      'copy-fonts',
      "generate-default-yml",

      // Include theme generation
        "themes",

        "lint",
        "csslint"
    ]);

	grunt.registerTask("themes", [
        "cube-theme",
        "elevate-theme",
        "minimalist-theme",
        "modern-theme",
        "space-theme",
        "theatre-theme"
    ]);

  // ** MODERN THEME **//
	grunt.registerTask('modern-theme', [
      'concat-modern-theme',
      'uglify-modern-theme',
      'concat-modern-theme-css',
      'cssmin-modern-theme'
  ]);

  // **  SPACE THEME **//
  grunt.registerTask('space-theme', [
    'concat-space-theme',
    'uglify-space-theme',
    'concat-space-theme-css',
    'cssmin-space-theme'
  ]);

  // **  Theatre THEME **//
  grunt.registerTask('theatre-theme', [
    'concat-theatre-theme',
    'uglify-theatre-theme',
    'concat-theatre-theme-css',
    'cssmin-theatre-theme'
  ]);

  // **  Elevate THEME **//
  grunt.registerTask('elevate-theme', [
    'concat-elevate-theme',
    'uglify-elevate-theme',
    'concat-elevate-theme-css',
    'cssmin-elevate-theme'
  ]);

  // **  Cube THEME **//
  grunt.registerTask('cube-theme', [
    'concat-cube-theme',
    'uglify-cube-theme',
    'concat-cube-theme-css',
    'cssmin-cube-theme'
  ]);

  // **  Minimalist THEME **//
  grunt.registerTask('minimalist-theme', [
    'concat-minimalist-theme',
    'uglify-minimalist-theme',
    'concat-minimalist-theme-css',
    'cssmin-minimalist-theme'
  ]);
  
  
  
  var finalizeTranslation = function (sourceFile, targetFolder, targetLang) {
	  var yaml = require("js-yaml");	  

	  var loadLocale = function (filename) {
		  var raw = yaml.safeLoad(grunt.file.read(filename));
		  for (var key in raw) {
			  return {
				  language: key.split(":").pop(),
				  dict: raw[key] || {}
			  };
		  }
	  };

	  var targetFile = targetFolder + targetLang + ".yml";
	  var source = loadLocale(sourceFile);
	  var target = grunt.file.exists(targetFile) ? loadLocale(targetFile) : {language: targetLang, dict: {}};
	
	  var keys = [];
	  var values = [];
	  
	  for (var key in source.dict) {
		  if (!target.dict[key]) {
			  keys.push(key);
			  values.push(source.dict[key]);
		  }
	  }
	  
	  if (keys.length > 0) {
		  var translate = require('@google-cloud/translate')(JSON.parse(grunt.file.read("./google-translate-creds.json")));
		  translate.translate(values, {from: source.language, to: target.language}, function (err, translation) {
			  if (err) {
				  console.error(err);
				  return;
			  }
			  for (var i = 0; i < keys.length; ++i)
				  target.dict[keys[i]] = translation[i].replace("% ", " %");
			  
			  var result = {};
			  result["language:" + target.language] = target.dict;
			  grunt.file.write(targetFile, yaml.dump(result));
		  });
	  }
  };


    grunt.registerTask("translations", function () {
        var languages = [];
        grunt.file.recurse("./src/locales", function (abspath, rootdir, subdir, filename) {
            languages.push(filename.substring(0, filename.indexOf(".")));
        });
	  var sourceFile = "./dist/english.yml";
	  var targetFolder = "./src/locales/";
	  languages.forEach(function (targetLang) {
		  finalizeTranslation(sourceFile, targetFolder, targetLang);
	  });
	  this.async();	  
  });
    grunt.registerTask('check-node', ['lint']);
    grunt.registerTask('check', ['csslinter', 'check-node', 'browserqunit']);

	grunt.registerTask("generate-default-yml", function () {
		var done = this.async();
		require('jsdom').jsdom.env("", [
            require.resolve("betajs-scoped"),
        	require.resolve("betajs"),
        	require.resolve("betajs-browser"),
        	require.resolve("betajs-dynamics"),
        	require.resolve("betajs-media"),
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
