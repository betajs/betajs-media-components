module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {

	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				'revision-count' : {
					options : {
						property : 'revisioncount',
						ref : 'HEAD'
					}
				},
				concat : {
					options : {
						banner : module.banner
					},
					dist_raw : {
						dest : 'dist/betajs-media-components-raw.js',
						src : [ 'src/fragments/begin.js-fragment',
						        'dist/betajs-media-components-templates.js',
								'src/**/*.js',
								'src/fragments/end.js-fragment' ]
					},
					dist_scoped : {
						dest : 'dist/betajs-media-components.js',
						src : [ 'vendors/scoped.js',
								'dist/betajs-media-components-noscoped.js' ]
					},
					dist_scss: {
						dest: 'dist/betajs-media-components.scss',
						src: [
						    'src/video_player/globals/globals.scss',
							'src/**/*.scss'
						]
					}
				},
				preprocess : {
					options : {
						context : {
							MAJOR_VERSION : '<%= revisioncount %>',
							MINOR_VERSION : (new Date()).getTime()
						}
					},
					dist : {
						src : 'dist/betajs-media-components-raw.js',
						dest : 'dist/betajs-media-components-noscoped.js'
					}
				},
				sass: {
					dist: {
						files: {
							'dist/betajs-media-components.css': 'dist/betajs-media-components.scss'
						}
					}
				},
				cssmin: {
					target: {
						files: {
							'dist/betajs-media-components.css.min': 'dist/betajs-media-components.css'
						}
					}
				},
				clean : {
					raw: "dist/betajs-media-components-raw.js",
					closure: "dist/betajs-media-components-closure.js",
					browserstack : [ "./browserstack.json", "BrowserStackLocal" ],
					templates: "dist/betajs-media-components-templates.js",
					scss: "dist/betajs-media-components.scss",
					jsdoc : ['./jsdoc.conf.json']
				},
				betajs_templates: {
					dist: {
						files: {
							"dist/betajs-media-components-templates.js": [
								"src/**/*.html"
							]
						},
						options: {
							namespace: 'BetaJS.MediaComponents.Templates'
						}
					}
				},
				jsdoc : {
					dist : {
						src : [ './README.md', './src/*/*.js' ],					
						options : {
							destination : 'docs',
							template : "node_modules/grunt-betajs-docs-compile",
							configure : "./jsdoc.conf.json",
							tutorials: "./docsrc/tutorials",
							recurse: true
						}
					}
				},
				uglify : {
					options : {
						banner : module.banner
					},
					dist : {
						files : {
							'dist/betajs-media-components-noscoped.min.js' : [ 'dist/betajs-media-components-noscoped.js' ],
							'dist/betajs-media-components.min.js' : [ 'dist/betajs-media-components.js' ]
						}
					}
				},
				jshint : {
					options: {
						es5: false,
						es3: true
					},
					source : [ "./src/**/*.js"],
					dist : [ "./dist/betajs-media-components-noscoped.js", "./dist/betajs-media-components.js" ],
					gruntfile : [ "./Gruntfile.js" ],
					tests : [ "./tests/**/*.js" ]
				},
				closureCompiler : {
					options : {
						compilerFile : process.env.CLOSURE_PATH + "/compiler.jar",
						compilerOpts : {
							compilation_level : 'ADVANCED_OPTIMIZATIONS',
							warning_level : 'verbose',
							externs : [ "./src/fragments/closure.js-fragment", "./vendors/jquery-1.9.closure-extern.js" ]
						}
					},
					dist : {
						src : [ "./vendors/beta.js",
								"./vendors/betajs-flash-noscoped.js",
								"./vendors/beta-browser-noscoped.js",
								"./vendors/beta-media-noscoped.js",
								"./vendors/beta-dynamics-noscoped.js",
								"./dist/betajs-media-components-noscoped.js" ],
						dest : "./dist/betajs-media-components-closure.js"
					}
				},
				wget : {
					dependencies : {
						options : {
							overwrite : true
						},
						files : {
							"./vendors/scoped.js" : "https://raw.githubusercontent.com/betajs/betajs-scoped/master/dist/scoped.js",
							"./vendors/beta.js" : "https://raw.githubusercontent.com/betajs/betajs/master/dist/beta.js",
							"./vendors/beta-browser-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-browser/master/dist/beta-browser-noscoped.js",
							"./vendors/betajs-flash-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-flash/master/dist/betajs-flash-noscoped.js",
							"./vendors/betajs-flash.swf" : "https://raw.githubusercontent.com/betajs/betajs-flash/master/dist/betajs-flash.swf",
							"./vendors/betajs-media-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-media/master/dist/betajs-media-noscoped.js",
							"./vendors/betajs-dynamics-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.js",
							"./vendors/jquery-1.9.closure-extern.js" : "https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js"
						}
					}
				},
				shell: {
					tests: {
						command: "open http://localhost:8080/tests/tests.html ; php -S localhost:8080"
					},
					browserstack : {
						command : 'browserstack-runner',
						options : {
							stdout : true,
							stderr : true
						}
					}
				},
				template : {
					"readme" : {
						options : {
							data: {
								indent: "",
								framework: grunt.file.readJSON('package.json')
							}
						},
						files : {
							"README.md" : ["readme.tpl"]
						}
					},
					"jsdoc": {
						options: {
							data: {
								data: {
									"tags": {
										"allowUnknownTags": true
									},
									"plugins": ["plugins/markdown"],
									"templates": {
										"cleverLinks": false,
										"monospaceLinks": false,
										"dateFormat": "ddd MMM Do YYYY",
										"outputSourceFiles": true,
										"outputSourcePath": true,
										"systemName": "BetaJS",
										"footer": "",
										"copyright": "BetaJS (c) - MIT License",
										"navType": "vertical",
										"theme": "cerulean",
										"linenums": true,
										"collapseSymbols": false,
										"inverseNav": true,
										"highlightTutorialCode": true,
										"protocol": "fred://",
										"singleTutorials": true,
										"emptyTutorials": true
									},
									"markdown": {
										"parser": "gfm",
										"hardwrap": true
									}
								}
							}
						},
						files : {
							"jsdoc.conf.json": ["json.tpl"]
						}
					},
					"browserstack-desktop" : {
						options : {
							data: {
								data: {
									"test_path" : "tests/tests.html",
									"test_framework" : "qunit",
									"timeout": 10 * 60,
									"browsers": [
						              	'firefox_latest',
									    'firefox_4',
						                'chrome_latest',
							            'chrome_14', 
						                'safari_latest',
							            'safari_4',
						                'opera_latest', 
									    'opera_12_15',
						                'ie_11',
						                'ie_10',
						                'ie_9',
						                'ie_8',
						                'ie_7',
						                'ie_6'
						            ]
								}
							}
						},
						files : {
							"browserstack.json" : ["json.tpl"]
						}
					}			
				},
				csslint : {
					strict : {
						options : {
							"import" : 2,
							"box-sizing": false,
							"bulletproof-font-face": false
						},
						src : [ 'dist/betajs-media-components.css' ]
					}
				}
			});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-git-revision-count');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-wget');
	grunt.loadNpmTasks('grunt-closure-tools');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-shell');	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-betajs-templates');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('default', [ 'revision-count', 'betajs_templates', 'concat:dist_raw',
			'preprocess', 'clean:raw', 'clean:templates', 'concat:dist_scoped', 'uglify',
			'concat:dist_scss', 'sass', 'cssmin', 'clean:scss' ]);
	grunt.registerTask('lint', [ 'jshint:source', 'jshint:dist',
	                 			 'jshint:gruntfile', 'jshint:tests' ]);
	grunt.registerTask('qunit', [ 'shell:tests' ]);
	grunt.registerTask('docs', ['template:jsdoc', 'jsdoc', 'clean:jsdoc']);
	grunt.registerTask('check', ['lint', 'csslint', 'qunit']);
	grunt.registerTask('dependencies', [ 'wget:dependencies' ]);
	grunt.registerTask('closure', [ 'closureCompiler', 'clean:closure' ]);
	grunt.registerTask('browserstack-desktop', [ 'template:browserstack-desktop', 'shell:browserstack', 'clean:browserstack' ]);
	grunt.registerTask('readme', [ 'template:readme' ]);

};
