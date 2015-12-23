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
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TemplatePartial"
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
				"noflash": false,
				"rerecordable": false,
				"theme": "",
				"message": "",
				"autoplay": false,
				"csstheme": "",
				"preload": false
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
					return this.get("playing") && this.get("state") === "main" && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
				}, ["buffered", "position", "last_position_change_delta", "playing", "state"]);
			},
			
			_afterActivate: function () {
				var video = this.element().find("video").get(0);
				VideoPlayerWrapper.create({
			    	element: video,
			    	poster: this.get("poster"),
			    	source: this.get("source"),
			    	sources: this.get("sources"),
			    	forceflash: !!this.get("forceflash"),
			    	noflash: !!this.get("noflash"),
			    	preload: !!this.get("preload")
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
					this.player.play();
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
				try {
					if (this.get("state") === "main") {
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
	}).register("ba-videoplayer")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"video-error": "An error occurred, please try again later. Click to retry."
    });
});
