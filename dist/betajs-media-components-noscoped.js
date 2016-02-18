(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.MediaComponents');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('flash', 'global:BetaJS.Flash');
Scoped.binding('media', 'global:BetaJS.Media');
Scoped.binding('dynamics', 'global:BetaJS.Dynamics');
Scoped.binding('jquery', 'global:jQuery');
Scoped.define("module:", function () {
	return {
    "guid": "7a20804e-be62-4982-91c6-98eb096d2e70",
    "version": "22.1455806854953"
};
});
Scoped.assumeVersion('base:version', 474);
Scoped.assumeVersion('browser:version', 70);
Scoped.assumeVersion('flash:version', 27);
Scoped.assumeVersion('dynamics:version', 219);
Scoped.assumeVersion('media:version', 42);
Scoped.extend('module:Templates', function () {
return {"controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 ? (css + '-dashboard-hidden') : ''}}\">  <div class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}}\"       onmousedown=\"{{startUpdatePosition(domEvent)}}\"       onmouseup=\"{{stopUpdatePosition(domEvent)}}\"       onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"       onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">    <div class=\"{{css}}-progressbar-button\"></div>   </div>  </div>  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\"  ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-play\"></i>    </div>   </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>   </div>   <div class=\"{{css}}-time-container\">    <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>    <div class=\"{{css}}-time-sep\">/</div>    <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{duration_formatted}}</div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-resize-full\"></i>    </div>   </div>   <div class=\"{{css}}-volumebar\">    <div class=\"{{css}}-volumebar-inner\"         onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">         <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>     </div>        </div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>    </div>   </div>  </div> </div> ","loader":" <div class=\"{{css}}-loader-container\">     <div class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">     </div> </div>","message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class='{{css}}-message-message'>         {{message}}     </div> </div>","playbutton":" <div class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div> ","player":" <div     class=\"{{css}}-container {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}\"     ba-on:mousemove=\"user_activity()\"     ba-on:mousedown=\"user_activity()\"     ba-on:touchstart=\"user_activity()\" >     <video class=\"{{css}}-video\" data-video=\"video\"></video>     <div class='{{css}}-overlay'>              <ba-{{dyncontrolbar}}             ba-css=\"{{csscontrolbar || css}}\"             ba-template=\"{{tmplcontrolbar}}\"             ba-show=\"{{controlbar_active}}\"             ba-playing=\"{{playing}}\"             ba-event:rerecord=\"rerecord\"             ba-event:play=\"play\"             ba-event:pause=\"pause\"             ba-event:position=\"seek\"             ba-event:volume=\"set_volume\"             ba-event:fullscreen=\"toggle_fullscreen\"             ba-volume=\"{{volume}}\"             ba-duration=\"{{duration}}\"             ba-cached=\"{{buffered}}\"             ba-position=\"{{position}}\"             ba-activitydelta=\"{{activity_delta}}\"             ba-rerecordable=\"{{rerecordable}}\"             ba-fullscreen=\"{{fullscreensupport}}\"         ></ba-{{dyncontrolbar}}>                  <ba-{{dynplaybutton}}             ba-css=\"{{cssplaybutton || css}}\"             ba-template=\"{{tmplplaybutton}}\"             ba-show=\"{{playbutton_active}}\"             ba-event:play=\"playbutton_click\"         ></ba-{{dynplaybutton}}>                  <ba-{{dynloader}}             ba-css=\"{{cssloader || css}}\"             ba-template=\"{{tmplloader}}\"             ba-show=\"{{loader_active}}\"         ></ba-{{dynloader}}>                  <ba-{{dynmessage}}             ba-css=\"{{cssmessage || css}}\"             ba-template=\"{{tmplmessage}}\"             ba-show=\"{{message_active}}\"             ba-message=\"{{message}}\"             ba-event:click=\"message_click\"         ></ba-{{dynmessage}}>     </div> </div> ","modern-controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 ? (css + '-dashboard-hidden') : ''}}\">        <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>        </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-play\"></i>   </div>  </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">    <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-pause\"></i>   </div>  </div>  <div class=\"{{css}}-time-container\">   <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}/{{duration_formatted}}</div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-resize-full\"></i>   </div>  </div>  <div class=\"{{css}}-volumebar\">   <div class=\"{{css}}-volumebar-inner\"           onmousedown=\"{{startUpdateVolume(domEvent)}}\"                 onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                 onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                 onmousemove=\"{{progressUpdateVolume(domEvent)}}\">    <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>       </div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>   </div>  </div>  <div class=\"{{css}}-progressbar\">   <div class=\"{{css}}-progressbar-inner\"        onmousedown=\"{{startUpdatePosition(domEvent)}}\"        onmouseup=\"{{stopUpdatePosition(domEvent)}}\"        onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"        onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>  </div> </div> "};
});
Scoped.extend("module:Assets", ["module:Assets"], function (Assets) {
    var languages = {"language:de":{"ba-videoplayer-playbutton.tooltip":"Hier clicken um Wiedergabe zu starten.","ba-videoplayer-loader.tooltip":"Video wird geladen...","ba-videoplayer-controlbar.video-progress":"Videofortschritt","ba-videoplayer-controlbar.rerecord-video":"Video erneut aufnehmen?","ba-videoplayer-controlbar.play-video":"Video wiedergeben","ba-videoplayer-controlbar.pause-video":"Video pausieren","ba-videoplayer-controlbar.elapsed-time":"Vergangene Zeit","ba-videoplayer-controlbar.total-time":"L&#xE4;nge des Videos","ba-videoplayer-controlbar.fullscreen-video":"Vollbildmodus","ba-videoplayer-controlbar.volume-button":"Lautst&#xE4;rke regulieren","ba-videoplayer-controlbar.volume-mute":"Ton abstellen","ba-videoplayer-controlbar.volume-unmute":"Ton wieder einstellen","ba-videoplayer.video-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren."}};
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
    return {};
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
Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:Time",
    "module:Templates",
    "jquery:",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
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
], [
    "dynamics:Partials.ClickPartial"
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
], [
    "dynamics:Partials.ClickPartial"
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
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates"
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				/* CSS */
				"css": "ba-videoplayer",
				"iecss": "ba-videoplayer",
				"cssplaybutton": "",
				"cssloader": "",
				"cssmessage": "",
				"csscontrolbar": "",
				/* Themes */
				"theme": "",
				"csstheme": "",
				/* Dynamics */
				"dynplaybutton": "videoplayer-playbutton",
				"dynloader": "videoplayer-loader",
				"dynmessage": "videoplayer-message",
				"dyncontrolbar": "videoplayer-controlbar",
				/* Templates */
				"tmplplaybutton": "",
				"tmplloader": "",
				"tmplmessage": "",
				"tmplcontrolbar": "",
				/* Attributes */
				"poster": "",
				"source": "",
				"sources": [],
				/* Configuration */
				"forceflash": false,
				"noflash": false,
				/* Options */
				"rerecordable": false,
				"autoplay": false,
				"preload": false,
				"loop": false,
				"ready": true,
				/* States */
				"states": {
					"poster_error": {
						"ignore": false,
						"click_play": true
					}
				}				
			},

			types: {
				"forceflash": "boolean",
				"noflash": "boolean",
				"rerecordable": "boolean",
				"loop": "boolean",
				"autoplay": "boolean",
				"preload": "boolean",
				"ready": "boolean"				
			},
			
			extendables: ["states"],
			
			remove_on_destroy: true,
			
			create: function () {
				if (this.get("theme") in Assets.themes)
					this.setAll(Assets.themes[this.get("theme")]);

				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("volume", 1.0);
				this.set("message", "");
				this.set("fullscreensupport", false);
				
				this.set("loader_active", false);
				this.set("playbutton_active", false);
				this.set("controlbar_active", false);
				this.set("message_active", false);

				this.set("last_activity", Time.now());
				this.set("activity_delta", 0);
				
				this.set("playing", false);
				
				this.__attachRequested = false;
				this.__activated = false;
				this.__error = null;
				
				this.host = this.auto_destroy(new Host({
					stateRegistry: new ClassRegistry(this.cls.playerStates())
				}));
				this.host.dynamic = this;
				this.host.initialize(InitialState);
				
				this._timer = this.auto_destroy(new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 100,
					start: true
				}));
				
				this.properties().compute("buffering", function () {
					return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
				}, ["buffered", "position", "last_position_change_delta", "playing"]);
			},
			
			state: function () {
				return this.host.state();
			},
			
			videoAttached: function () {
				return !!this.player;
			},
			
			videoLoaded: function () {
				return this.videoAttached() && this.player.loaded();
			},
			
			videoError: function () {
				return this.__error;
			},
			
			_error: function (error_type, error_code) {
				this.__error = {
					error_type: error_type,
					error_code: error_code
				};
				this.trigger("error:" + error_type, error_code);
				this.trigger("error", error_type, error_code);
			},
			
			_clearError: function () {
				this.__error = null;
			},
			
			_detachVideo: function () {
				this.set("playing", false);
				if (this.player)
					this.player.weakDestroy();
				this.player = null;
			},
			
			_attachVideo: function () {
				if (this.videoAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.__attachRequested = false;
				var video = this.element().find("[data-video='video']").get(0);
				this._clearError();
				VideoPlayerWrapper.create({
			    	element: video,
			    	poster: this.get("poster"),
			    	source: this.get("source"),
			    	sources: this.get("sources"),
			    	forceflash: !!this.get("forceflash"),
			    	noflash: !!this.get("noflash"),
			    	preload: !!this.get("preload"),
					loop: !!this.get("loop")
			    }).error(function (e) {
			    	this._error("attach", e);
			    }, this).success(function (instance) {
			    	this.player = instance;			    	
			    	this.trigger("attached", instance);
					this.player.on("postererror", function () {
				    	this._error("poster");
					}, this);					
					this.player.once("loaded", function () {
						this.set("duration", this.player.duration());
						this.set("fullscreensupport", this.player.supportsFullscreen());
						this.trigger("loaded");
					}, this);
					if (this.player.loaded())
						this.player.trigger("loaded");
					this.player.on("playing", function () {
						this.set("playing", true);
						this.trigger("playing");
					}, this);
					this.player.on("error", function (e) {
						this._error("video", e);
					}, this);
			        if (this.player.error())
			        	this.player.trigger("error", this.player.error());
			        this.player.on("paused", function () {
			        	this.set("playing", false);
			        	this.trigger("paused");
			        }, this);
					this.player.on("ended", function () {
						this.set("playing", false);
						this.trigger("ended");
					}, this);
			    }, this);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachVideo();
			},
			
			reattachVideo: function () {
				this._detachVideo();
				this._attachVideo();
			},

			object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],
			
			functions: {
				
				user_activity: function () {
					this.set("last_activity", Time.now());
					this.set("activity_delta", 0);
				},
				
				message_click: function () {
					this.trigger("message:click");
				},
				
				playbutton_click: function () {
					this.host.state().play();
				},
				
				play: function () {
					this.host.state().play();
				},
				
				rerecord: function () {
					if (!this.get("rerecordable"))
						return;
					this.trigger("rerecord");
				},
				
				pause: function () {
					if (this.get("playing"))
						this.player.pause();
				},
				
				stop: function () {
					if (!this.videoLoaded())
						return;
					if (this.get("playing"))
						this.player.pause();
					this.player.setPosition(0);
					this.trigger("stopped");
				},			
				
				seek: function (position) {
					if (this.videoLoaded())
						this.player.setPosition(position);
					this.trigger("seek", position);
				},

				set_volume: function (volume) {
					volume = Math.min(1.0, volume);
					this.set("volume", volume);
					if (this.videoLoaded()) {
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0);
					}
				},
				
				toggle_fullscreen: function () {
					if (this.videoLoaded())
						this.player.enterFullscreen();
				} 
			
			},
			
			destroy: function () {
				this._detachVideo();
				inherited.destroy.call(this);
			},
			
			_timerFire: function () {
				try {
					if (this.videoLoaded()) {
						this.set("activity_delta", Time.now() - this.get("last_activity"));
						var new_position = this.player.position();
						if (new_position != this.get("position") || this.get("last_position_change"))
							this.set("last_position_change", Time.now());
						this.set("last_position_change_delta", Time.now() - this.get("last_position_change"));
						this.set("position", new_position);
						this.set("buffered", this.player.buffered());
						this.set("duration", this.player.duration());
					}
				} catch (e) {}
			}

		};
	}, {
		
		playerStates: function () {
			return [PlayerStates];
		}
		
	}).register("ba-videoplayer")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"video-error": "An error occurred, please try again later. Click to retry."
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"loader": false,
				"message": false,
				"playbutton": false,
				"controlbar": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
		},
		
		play: function () {
			this.dyn.set("autoplay", true);
		}
	
	}]);
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
			_locals: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this._message || this.dyn.string("video-error"));
			}
	
		};
	});
});






Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				if (this.dyn.get("ready"))
					this.next("LoadPlayer");
				else {
					this.listenOn(this.dyn, "change:ready", function () {
						this.next("LoadPlayer");
					});
				}
			}
	
		};
	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:attach", function () {
					this.next("LoadError");
				}, this);
				this.listenOn(this.dyn, "error:poster", function () {
					if (!this.dyn.get("states").poster_error.ignore)
						this.next("PosterError");
				}, this);
				this.listenOn(this.dyn, "attached", function () {
					this.next("PosterReady");
				}, this);
				this.dyn.reattachVideo();
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next("LoadPlayer");
				}, this);
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["playbutton"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:poster", function () {
					if (!this.dyn.get("states").poster_error.ignore)
						this.next("PosterError");
				}, this);
				if (this.dyn.get("autoplay"))
					this.next("LoadVideo");
			},
			
			play: function () {
				this.next("LoadVideo");
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
			
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
				}, this);
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State",
	"base:Async"
], function (State, Async, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["loader"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "error:video", function () {
					this.next("ErrorVideo");
				}, this);
				this.listenOn(this.dyn, "playing", function () {
					this.next("PlayVideo");
				}, this);
				Async.eventually(function () {
					this.dyn.player.play();
				}, this);				
			}
	
		};
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["message"],
	
			_start: function () {
				inherited._start.call(this);
				this.dyn.set("message", this.dyn.string("video-error"));
				this.listenOn(this.dyn, "message:click", function () {
					this.next("LoadVideo");
				}, this);
			}
	
		};
	});
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, function (inherited) {
		return {
			
			dynamics: ["controlbar"],
	
			_start: function () {
				inherited._start.call(this);
				this.listenOn(this.dyn, "ended", function () {
					this.next("PosterReady");
				}, this);
				this.listenOn(this.dyn, "change:buffering", function () {
					this.dyn.set("loader_active", this.dyn.get("buffering"));
				}, this);
				this.listenOn(this.dyn, "error:video", function () {
					this.next("ErrorVideo");
				}, this);
			},
			
			play: function () {
				if (!this.dyn.get("playing"))
					this.dyn.player.play();
			}
	
		};
	});
});


}).call(Scoped);