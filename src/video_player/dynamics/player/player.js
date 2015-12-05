Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "base:Browser.Info",
    "base:Media.Player.VideoPlayerWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers"
], function (Class, Templates, Info, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				"css": "ba-videoplayer",
				"poster": "",
				"source": "",
				"sources": [],
				"forceflash": false,
				"rerecordable": false
			},
			
			create: function () {
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
			    	preload: true
			    }).error(function () {
			    	
			    	// TODO
			    	
			    }, this).success(function (instance) {
			    	
			    	this.player = this.auto_destroy(instance);			    	
					this.set("loaded", this.player.loaded());
					// TODO loaded
					// TODO error
					this.player.on("loaded", this._eventLoaded, this);
					if (this.player.loaded())
						this._eventLoaded();
					this.player.on("playing", this._eventPlaying, this);
					this.player.on("paused", this._eventPaused, this);
					this.player.on("ended", this._eventEnded, this);
			    }, this);
			},
			
			functions: {
				
				load: function () {
					this._methodLoad();
				},
				
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
			
			_methodLoad: function () {
				if (this.get("state") === "init") {
					if (this.get("loaded")) {
						this.set("state", "main");
						this.player.play();
					} else {
						this.set("state", "loading");
						this.player.play();
					}
				}
			},
			
			_methodPlay: function () {
				if (this.get("state") === "main") {
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
			
			_timerFire: function () {
				if (this.get("state") === "main") {
					this.set("activity_delta", Time.now() - this.get("last_activity"));
					this.set("position", this.player.position());
					this.set("buffered", this.player.buffered());
					this.set("duration", this.player.duration());
				}
			}
			
		};
	}).register("ba-videoplayer");
});