/*!
betajs-media-components - v0.0.5 - 2015-12-14
Copyright (c) Oliver Friedmann
MIT Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("module", "global:BetaJS.MediaComponents");
Scoped.binding("base", "global:BetaJS");
Scoped.binding("browser", "global:BetaJS.Browser");
Scoped.binding("flash", "global:BetaJS.Flash");
Scoped.binding("media", "global:BetaJS.Media");
Scoped.binding("dynamics", "global:BetaJS.Dynamics");

Scoped.binding("jquery", "global:jQuery");

Scoped.define("module:", function () {
	return {
		guid: "7a20804e-be62-4982-91c6-98eb096d2e70",
		version: '11.1450150166349'
	};
});

Scoped.assumeVersion("base:version", 444);
Scoped.assumeVersion("browser:version", 58);
Scoped.assumeVersion("flash:version", 19);
Scoped.assumeVersion("media:version", 31);
Scoped.assumeVersion("dynamics:version", 195);

Scoped.extend('module:Templates', function () {
return {"controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 ? (css + '-dashboard-hidden') : ''}}\">  <div class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}}\"       onmousedown=\"{{startUpdatePosition(domEvent)}}\"       onmouseup=\"{{stopUpdatePosition(domEvent)}}\"       onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"       onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">    <div class=\"{{css}}-progressbar-button\"></div>   </div>  </div>  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\">             <div class=\"{{css}}-button-inner\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>   <div class=\"{{css}}-leftbutton-container\">    <div class=\"{{css}}-button-inner\" ba-show=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">     <i class=\"{{css}}-icon-play\"></i>    </div>             <div class=\"{{css}}-button-inner\" ba-show=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>   </div>   <div class=\"{{css}}-time-container\">    <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>    <div class=\"{{css}}-time-sep\">/</div>    <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{duration_formatted}}</div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\">    <div class=\"{{css}}-button-inner\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">     <i class=\"{{css}}-icon-resize-full\"></i>    </div>   </div>   <div class=\"{{css}}-volumebar\">    <div class=\"{{css}}-volumebar-inner\"         onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">         <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>     </div>        </div>   </div>   <div class=\"{{css}}-rightbutton-container\">    <div class=\"{{css}}-button-inner\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>    </div>   </div>  </div> </div> ","loader":" <div class=\"{{css}}-loader-container\">     <div class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">     </div> </div>","message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class='{{css}}-message-message'>         {{message}}     </div> </div>","playbutton":" <div class=\"{{css}}-playbutton-container\">  <div class=\"{{css}}-playbutton-button\" ba-click=\"play()\" title=\"{{string('tooltip')}}\"></div> </div> ","player":" <div     class=\"{{css}}-container {{css}}-{{ie8 ? 'ie8' : 'noie8'}}\"     ba-on:mousemove=\"user_activity()\"     ba-on:mousedown=\"user_activity()\"     ba-on:touchstart=\"user_activity()\" >     <video class=\"{{css}}-video\"></video>     <div class='{{css}}-overlay'>              <ba-{{dyncontrolbar}}             ba-css=\"{{css}}\"             ba-template=\"{{tmplcontrolbar}}\"             ba-show=\"{{state==='main'}}\"             ba-playing=\"{{playing}}\"             ba-event:rerecord=\"rerecord\"             ba-event:play=\"play\"             ba-event:pause=\"pause\"             ba-event:position=\"seek\"             ba-event:volume=\"set_volume\"             ba-event:fullscreen=\"toggle_fullscreen\"             ba-volume=\"{{volume}}\"             ba-duration=\"{{duration}}\"             ba-cached=\"{{buffered}}\"             ba-position=\"{{position}}\"             ba-activitydelta=\"{{activity_delta}}\"             ba-rerecordable=\"{{rerecordable}}\"             ba-fullscreen=\"{{fullscreensupport}}\"         ></ba-{{dyncontrolbar}}>                  <ba-{{dynplaybutton}}             ba-css=\"{{css}}\"             ba-template=\"{{tmplplaybutton}}\"             ba-show=\"{{state==='init'}}\"             ba-event:play=\"play\"         ></ba-{{dynplaybutton}}>                  <ba-{{dynloader}}             ba-css=\"{{css}}\"             ba-template=\"{{tmplloader}}\"             ba-show=\"{{state==='loading' || buffering}}\"         ></ba-{{dynloader}}>                  <ba-{{dynmessage}}             ba-css=\"{{css}}\"             ba-template=\"{{tmplmessage}}\"             ba-show=\"{{state==='message'}}\"             ba-message=\"{{message}}\"             ba-event:click=\"play\"         ></ba-{{dynmessage}}>     </div> </div> "};
});
Scoped.require(["module:Assets"], function (Assets) {
    var languages = {"language:de":{"ba-videoplayer-playbutton.tooltip":"Hier clicken um Wiedergabe zu starten.","ba-videoplayer-loader.tooltip":"Video wird geladen...","ba-videoplayer-controlbar.video-progress":"Videofortschritt","ba-videoplayer-controlbar.rerecord-video":"Video erneut aufnehmen?","ba-videoplayer-controlbar.play-video":"Video wiedergeben","ba-videoplayer-controlbar.pause-video":"Video pausieren","ba-videoplayer-controlbar.elapsed-time":"Vergangene Zeit","ba-videoplayer-controlbar.total-time":"L&#xE4;nge des Videos","ba-videoplayer-controlbar.fullscreen-video":"Vollbildmodus","ba-videoplayer-controlbar.volume-button":"Lautst&#xE4;rke regulieren","ba-videoplayer-controlbar.volume-mute":"Ton abstellen","ba-videoplayer-controlbar.volume-unmute":"Ton wieder einstellen","ba-videoplayer.video-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren."}};
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
});

Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:Time",
    "module:Templates",
    "jquery:",
    "module:Assets",
    "browser:Info"
], function (Class, Time, Templates, $, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 0,
				"position": 0,
				"cached": 0,
				"volume": 1.0,
				"expandedprogress": true,
				"playing": false,
				"rerecordable": false,
				"fullscreen": true,
				"activitydelta": 0
			},
			
			functions: {
				
				startUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", true);
					this.call("progressUpdatePosition", event);
				},
				
				progressUpdatePosition: function (event) {
					event[0].preventDefault();
					if (!this.get("_updatePosition"))
						return;
					this.set("position", this.get("duration") * (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("position", this.get("position"));
				},
				
				stopUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", false);
				},
				
				startUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressUpdateVolume", event);
				},
				
				progressUpdateVolume: function (event) {
					event[0].preventDefault();
					if (!this.get("_updateVolume"))
						return;
					this.set("volume", (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("volume", this.get("volume"));
				},
				
				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				play: function () {
					this.trigger("play");
				},
				
				pause: function () {
					this.trigger("pause");
				},
				
				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else 
						this.set("volume", this.__oldVolume || 1);
					this.trigger("volume", this.get("volume"));
				},
				
				toggle_fullscreen: function () {
					this.trigger("fullscreen");
				},
				
				rerecord: function () {
					this.trigger("rerecord");
				}
				
			},
			
			create: function () {
				this.properties().compute("position_formatted", function () {
					return Time.formatTime(this.get("position") * 1000, "mm:ss");
				}, ['position']);
				this.properties().compute("duration_formatted", function () {
					return Time.formatTime(this.get("duration") * 1000, "mm:ss");
				}, ['duration']);
				this.set("ismobile", Info.isMobile());
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Re-record video?",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.loader,
			
			attrs: {
				"css": "ba-videoplayer"
			}
			
		};
	})
	.register("ba-videoplayer-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Loading video..."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.message,
			
			attrs: {
				"css": "ba-videoplayer",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					this.trigger("click");
				}
				
			}
			
		};
	}).register("ba-videoplayer-message");
});
Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.playbutton,
			
			attrs: {
				"css": "ba-videoplayer"
			},
			
			functions: {
				
				play: function () {
					this.trigger("play");
				}
				
			}
			
		};
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "media:Player.VideoPlayerWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers"
], function (Class, Templates, Assets, Info, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				"css": "ba-videoplayer",
				"dynplaybutton": "videoplayer-playbutton",
				"tmplplaybutton": "",
				"dynloader": "videoplayer-loader",
				"tmplloader": "",
				"dynmessage": "videoplayer-message",
				"tmplmessage": "",
				"dyncontrolbar": "videoplayer-controlbar",
				"tmplcontrolbar": "",
				"poster": "",
				"source": "",
				"sources": [],
				"forceflash": false,
				"rerecordable": false,
				"theme": "",
				"message": "",
				"autoplay": false
			},
			
			create: function () {
				if (this.get("theme") in Assets.themes)
					this.setAll(Assets.themes[this.get("theme")]);
				
				this._timer = this.auto_destroy(new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 100,
					start: true
				}));
				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				
				this.set("message", "");
				this.set("state", "init");
				this.set("playing", false);
				this.set("loaded", false);
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("last_activity", Time.now());
				this.set("volume", 1.0);
				this.set("activated", false);
				
				this.properties().compute("buffering", function () {
					return this.get("buffered") < this.get("position");
				}, ["buffered", "position"]);
			},
			
			_afterActivate: function () {
				var video = this.element().find("video").get(0);
				VideoPlayerWrapper.create({
			    	element: video,
			    	poster: this.get("poster"),
			    	source: this.get("source"),
			    	sources: this.get("sources"),
			    	forceflash: !!this.get("forceflash"),
			    	preload: false
			    }).error(function (e) {
			    	this._eventError(e);
			    }, this).success(function (instance) {
			    	this.set("activated", true);
			    	this.player = instance;			    	
					this.player.on("error", this._eventError, this);
					this.player.on("postererror", this._eventPosterError, this);
					this.set("loaded", this.player.loaded());
					this.player.on("loaded", this._eventLoaded, this);
					if (this.player.loaded())
						this._eventLoaded();
					this.player.on("playing", this._eventPlaying, this);
					this.player.on("paused", this._eventPaused, this);
					this.player.on("ended", this._eventEnded, this);
					if (this.get("autoplay"))
						this._methodPlay();
			        if (this.player.error())
			        	this._eventError(this.player.error());
			    }, this);
			},
			
			functions: {
				
				play: function () {
					this._methodPlay();
				},
				
				rerecord: function () {
					this._methodRerecord();
				},
				
				pause: function () {
					this._methodPause();
				},
				
				seek: function (position) {
					this._methodSeek(position);
				},
				
				user_activity: function () {
					this.set("last_activity", Time.now());
					this.set("activity_delta", 0);
				},
				
				set_volume: function (volume) {
					this._methodSetVolume(volume);
				},
				
				toggle_fullscreen: function () {
					this.player.enterFullscreen();
				}
			
			},
			
			destroy: function () {
				if (this.player)
					this.player.weakDestroy();
				inherited.destroy.call(this);
			},
			
			play: function () {
				this.call("play");
			},
			
			error: function () {
				return this.get("activated") ? this.player.error() : null;
			},
			
			_methodPlay: function () {
				if (!this.get("activated")) {
					this.set("autoplay", true);
					return;
				}
				var state = this.get("state");
				if (state === "init" || state === "message") {
					if (this.get("loaded")) {
						this.set("state", "main");
						this.player.play();
					} else {
						this.set("state", "loading");
						this.player.play();
					}
				} else if (state === "main") {
					this.player.player();
				}
			},
			
			_methodPause: function () {
				if (this.get("state") === "main") {
					this.player.pause();
				}
			},

			_methodRerecord: function () {
				if (!this.get("rerecordable"))
					return;
				this.trigger("rerecord");
			},
			
			_methodSeek: function (position) {
				this.player.setPosition(position);
				this.trigger("seek", position);
			},
			
			_methodSetVolume: function (volume) {
				volume = Math.min(1.0, volume);
				this.set("volume", volume);
				this.player.setVolume(volume);
				this.player.setMuted(volume <= 0);
			},
			
			_eventLoaded: function () {
				this.set("loaded", true);
				this.set("duration", this.player.duration());
				this.set("fullscreensupport", this.player.supportsFullscreen());
				if (this.get("state") === "loading")
					this.set("state", "main");
				this.trigger("loaded");
			},
			
			_eventPlaying: function () {
				this.set("playing", true);
				this.trigger("playing");
			},
			
			_eventPaused: function () {
				this.set("playing", false);
				this.trigger("paused");
			},

			_eventEnded: function () {
				this.set("playing", false);
				this.trigger("ended");
				this.set("state", "init");
			},
			
			_eventError: function (error) {
				this.set("state", "message");
				this.set("message", this.string("video-error"));
				this.trigger("error", error);
			},
			
			_eventPosterError: function () {
				this.trigger("postererror");
			},

			_timerFire: function () {
				if (this.get("state") === "main") {
					this.set("activity_delta", Time.now() - this.get("last_activity"));
					this.set("position", this.player.position());
					this.set("buffered", this.player.buffered());
					this.set("duration", this.player.duration());
				}
			}
			
		};
	}).register("ba-videoplayer")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"video-error": "An error occurred, please try again later. Click to retry."
    });
});
Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "browser:Info"
], function (LocaleTable, Info) {
	
	var strings = new LocaleTable();
	strings.setWeakLocale(Info.language());
	
	return {
		
		strings: strings,
		
		themes: {}
		
	};
});
}).call(Scoped);