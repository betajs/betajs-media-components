module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
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
    	"base:version": pkg.devDependencies.betajs,
    	"browser:version": pkg.devDependencies["betajs-browser"],
    	"flash:version": pkg.devDependencies["betajs-flash"],
    	"dynamics:version": pkg.devDependencies["betajs-dynamics"],
    	"media:version": pkg.devDependencies["betajs-media"]
    })
    .concatTask('concat-scoped', [require.resolve("betajs-scoped"), 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .concatsassTask('concat-dist-css', [
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
    .betajstemplatesTask('templates-modern-theme', ['src/themes/video_player/modern/*.html'], 'dist/themes/modern/modern-templates.js', 'module:Templates')
    .concatTask('concat-modern-theme', [
	    'src/fragments/theme-begin.js-fragment',
	    'dist/themes/modern-templates.js',
	    'src/themes/video_player/modern/theme.js',
	    'src/themes/video_recorder/modern/theme.js',
	    'src/fragments/end.js-fragment'
    ], 'dist/themes/modern/script.js')
    .uglifyTask('uglify-modern-theme', 'dist/themes/modern/script.js', 'dist/themes/modern/script.min.js')
    .concatsassTask('concat-modern-theme-css', [
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
    ], 'dist/themes/modern/style.css')
    .cssminTask('cssmin-modern-theme', 'dist/themes/modern/style.css', 'dist/themes/modern/style.min.css')
    .cleanTask('clean-modern-theme', 'dist/themes/modern/modern-templates.js')

    /* Compile Space Theme */
    .betajstemplatesTask('templates-space-theme', ['src/themes/video_player/space/**/*.html'], 'dist/themes/space/space-templates.js', 'module:Templates')
    .concatTask('concat-space-theme', [
      'src/fragments/theme-begin.js-fragment',
      'dist/themes/space/space-templates.js',
      'src/themes/video_player/space/theme.js',
      'src/themes/video_recorder/space/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/space/script.js')
    .uglifyTask('uglify-space-theme', 'dist/themes/space/script.js', 'dist/themes/space/script.min.js')
    .concatsassTask('concat-space-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/space/theme.scss',
      'src/themes/common/fontello.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/space/*.scss',

      'src/themes/video_recorder/space/theme.scss',
      'src/../src/themes/common/fontello.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/space/*.scss'
    ], 'dist/themes/space/style.css')
    .cssminTask('cssmin-space-theme', 'dist/themes/space/style.css', 'dist/themes/space/style.min.css')
    .cleanTask('clean-space-theme', 'dist/themes/space/space-templates.js')

    /* Compile Theatre Theme */
    .betajstemplatesTask('templates-theatre-theme', ['src/themes/video_player/theatre/**/*.html'], 'dist/themes/theatre/theatre-templates.js', 'module:Templates')
    .concatTask('concat-theatre-theme', [
      'src/fragments/theme-begin.js-fragment',
      'dist/themes/theatre/space-templates.js',
      'src/themes/video_player/theatre/theme.js',
      'src/themes/video_recorder/theatre/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/theatre/script.js')
    .uglifyTask('uglify-theatre-theme', 'dist/themes/theatre/script.js', 'dist/themes/theatre/script.min.js')
    .concatsassTask('concat-theatre-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/theatre/theme.scss',
      'src/themes/common/fontello.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/theatre/*.scss',

      'src/themes/video_recorder/theatre/theme.scss',
      'src/../src/themes/common/fontello.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/theatre/*.scss',
      'src/themes/video_recorder/theatre/**/*.scss'
    ], 'dist/themes/theatre/style.css')
    .cssminTask('cssmin-theatre-theme', 'dist/themes/theatre/style.css', 'dist/themes/theatre/style.min.css')
    .cleanTask('clean-theatre-theme', 'dist/themes/theatre/theatre-templates.js')


    /* Compile Elevate Theme */
    .betajstemplatesTask('templates-elevate-theme', ['src/themes/video_player/elevate/**/*.html'], 'dist/themes/elevate/elevate-templates.js', 'module:Templates')
    .concatTask('concat-elevate-theme', [
      'src/fragments/theme-begin.js-fragment',
      'dist/themes/elevate/elevate-templates.js',
      'src/themes/video_player/elevate/theme.js',
      'src/themes/video_recorder/elevate/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/elevate/script.js')
    .uglifyTask('uglify-elevate-theme', 'dist/themes/elevate/script.js', 'dist/themes/elevate/script.min.js')
    .concatsassTask('concat-elevate-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/elevate/theme.scss',
      'src/themes/common/fontello.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/elevate/*.scss',

      'src/themes/video_recorder/elevate/theme.scss',
      'src/../src/themes/common/fontello.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/elevate/*.scss',
      'src/themes/video_recorder/elevate/**/*.scss'
    ], 'dist/themes/elevate/style.css')
    .cssminTask('cssmin-elevate-theme', 'dist/themes/elevate/style.css', 'dist/themes/elevate/style.min.css')
    .cleanTask('clean-elevate-theme', 'dist/themes/elevate/elevate-templates.js')

    /* Compile Cube Theme */
    .betajstemplatesTask('templates-cube-theme', ['src/themes/video_player/cube/**/*.html'], 'dist/themes/cube/cube-templates.js', 'module:Templates')
    .concatTask('concat-cube-theme', [
      'src/fragments/theme-begin.js-fragment',
      'dist/themes/cube/cube-templates.js',
      'src/themes/video_player/cube/theme.js',
      'src/themes/video_recorder/cube/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/cube/script.js')
    .uglifyTask('uglify-cube-theme', 'dist/themes/cube/script.js', 'dist/themes/cube/script.min.js')
    .concatsassTask('concat-cube-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/cube/theme.scss',
      'src/themes/common/fontello.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/cube/*.scss',

      'src/themes/video_recorder/cube/theme.scss',
      'src/../src/themes/common/fontello.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/cube/*.scss',
      'src/themes/video_recorder/cube/**/*.scss'
    ], 'dist/themes/cube/style.css')
    .cssminTask('cssmin-cube-theme', 'dist/themes/cube/style.css', 'dist/themes/cube/style.min.css')
    .cleanTask('clean-cube-theme', 'dist/themes/cube/cube-templates.js')


    /* Compile Minimalist Theme */
    .betajstemplatesTask('templates-minimalist-theme', ['src/themes/video_player/minimalist/**/*.html'], 'dist/themes/minimalist/minimalist-templates.js', 'module:Templates')
    .concatTask('concat-minimalist-theme', [
      'src/fragments/theme-begin.js-fragment',
      'dist/themes/minimalist/minimalist-templates.js',
      'src/themes/video_player/minimalist/theme.js',
      'src/themes/video_recorder/minimalist/theme.js',
      'src/fragments/end.js-fragment'
    ], 'dist/themes/minimalist/script.js')
    .uglifyTask('uglify-minimalist-theme', 'dist/themes/minimalist/script.js', 'dist/themes/minimalist/script.min.js')
    .concatsassTask('concat-minimalist-theme-css', [
      'src/themes/common/mixins.scss',
      'src/themes/video_player/minimalist/theme.scss',
      'src/themes/common/fontello.scss',
      'src/themes/video_player/default/player.scss',
      'src/themes/video_player/default/loader.scss',
      'src/themes/video_player/default/topmessage.scss',
      'src/themes/video_player/minimalist/*.scss',

      'src/themes/video_recorder/minimalist/theme.scss',
      'src/../src/themes/common/fontello.scss',
      'src/themes/video_recorder/default/recorder.scss',
      'src/themes/video_recorder/default/chooser.scss',
      'src/themes/video_recorder/default/topmessage.scss',
      'src/themes/video_recorder/default/imagegallery.scss',
      'src/themes/video_recorder/default/controlbar.scss',
      'src/themes/video_recorder/default/settings.scss',
      'src/themes/video_recorder/minimalist/*.scss',
      'src/themes/video_recorder/minimalist/**/*.scss'
    ], 'dist/themes/minimalist/style.css')
    .cssminTask('cssmin-minimalist-theme', 'dist/themes/minimalist/style.css', 'dist/themes/minimalist/style.min.css')
    .cleanTask('clean-minimalist-theme', 'dist/themes/minimalist/minimalist-templates.js')

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
     ], null, { jquery: true })
    .browserstackTask(null, 'tests/browserstack.html', {desktop: true, mobile: true})
    .browserstackTask("browserstack-media", 'tests/server/browserstack.html', {desktop: true, mobile: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
    .csslinterTask(null, [
      'dist/betajs-media-components.css',
      'dist/themes/cube/style.css',
      'dist/themes/modern/style.css',
      'dist/themes/space/style.css',
      'dist/themes/theatre/style.css',
      'dist/themes/elevate/style.css',
      'dist/themes/minimalist/style.css',
      'dist/themes/theatre/style.css'
    ])

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
        'betajs/betajs-shims/dist/betajs-shims.js'
     ] })

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
      "generate-default-yml",

      // Include theme generation
      "modern-theme",
      "space-theme",
      "cube-theme",
      "elevate-theme",
      "minimalist-theme",
      "theatre-theme"
    ]);

  // ** MODERN THEME **//
	grunt.registerTask('modern-theme', [
      'templates-modern-theme',
      'concat-modern-theme',
      'uglify-modern-theme',
      'concat-modern-theme-css',
      'cssmin-modern-theme',
      'clean-modern-theme'
  ]);

  // **  SPACE THEME **//
  grunt.registerTask('space-theme', [
    'templates-space-theme',
    'concat-space-theme',
    'uglify-space-theme',
    'concat-space-theme-css',
    'cssmin-space-theme',
    'clean-space-theme'
  ]);

  // **  Theatre THEME **//
  grunt.registerTask('theatre-theme', [
    'templates-theatre-theme',
    'concat-theatre-theme',
    'uglify-theatre-theme',
    'concat-theatre-theme-css',
    'cssmin-theatre-theme',
    'clean-theatre-theme'
  ]);

  // **  Elevate THEME **//
  grunt.registerTask('elevate-theme', [
    'templates-elevate-theme',
    'concat-elevate-theme',
    'uglify-elevate-theme',
    'concat-elevate-theme-css',
    'cssmin-elevate-theme',
    'clean-elevate-theme'
  ]);

  // **  Cube THEME **//
  grunt.registerTask('cube-theme', [
    'templates-cube-theme',
    'concat-cube-theme',
    'uglify-cube-theme',
    'concat-cube-theme-css',
    'cssmin-cube-theme',
    'clean-cube-theme'
  ]);

  // **  Minimalist THEME **//
  grunt.registerTask('minimalist-theme', [
    'templates-minimalist-theme',
    'concat-minimalist-theme',
    'uglify-minimalist-theme',
    'concat-minimalist-theme-css',
    'cssmin-minimalist-theme',
    'clean-minimalist-theme'
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
	  var languages = ["de", "fr", "es", "nl", "pt-br", "it", "sv", "da", "no", "fi", "cat", "bg", "hu", "pl", "ro", "sr", "tr", "hr"];
	  var sourceFile = "./dist/english.yml";
	  var targetFolder = "./src/locales/";
	  languages.forEach(function (targetLang) {
		  finalizeTranslation(sourceFile, targetFolder, targetLang);
	  });
	  this.async();	  
  });

    grunt.registerTask('check', ['csslinter', 'lint', 'browserqunit']);

	grunt.registerTask("generate-default-yml", function () {
		var done = this.async();
		require('jsdom').jsdom.env("", [
            "./vendors/jquery.min.js",
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
