Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "base:Browser.Info",
    "base:Media.Player.FlashPlayer",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers"
], function (Class, Templates, Info, FlashPlayer, Types, Objs, Strings, Time, Timers, scoped) {
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
				
				var sources = this.get("source") || this.get("sources");
				if (Types.is_string(sources))
					sources = sources.split(" ");
				var sourcesMapped = [];
				Objs.iter(sources, function (source) {
					if (Types.is_string(source))
						source = {src: source};
					if (!source.type)
						source.type = source.src.indexOf(".") >= 0 ? "video/" + Strings.last_after(source.src, ".") : "video";
					sourcesMapped.push(source);
				}, this);
				this.set("sources", sourcesMapped);
				
				this.set("message", "");
				this.set("state", "init");
				this.set("playing", false);
				this.set("loaded", false);
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("last_activity", Time.now());
			},
			
			_afterActivate: function () {
				var video = this.element().find("video").get(0);
				video.poster = this.get("poster");
				$(video).on("error", function () {
					console.log(arguments);
				});
				FlashPlayer.polyfill(video, "div", this.get("forceflash"), true).success(function (video) {
					this._video = video;
					var $video = $(video);
					this._$video = $video;
					var self = this;
					Objs.iter({
						"canplay": "_eventLoaded",
						"timeupdate": "_eventProgress",
						"playing": "_eventPlaying",
						"pause": "_eventPause",
						"ended": "_eventEnded"
					}, function (method, event) {
						$video.on(event, function () {
							self[method]();
						});
					});
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
				}
			
			},
			
			_methodLoad: function () {
				if (this.get("state") === "init") {
					if (this.get("loaded")) {
						this.set("state", "main");
						this._video.play();
					} else {
						this.set("state", "loading");
						this._video.play();
					}
				}
			},
			
			_methodPlay: function () {
				if (this.get("state") === "main") {
					this._video.play();
				}
			},
			
			_methodPause: function () {
				if (this.get("state") === "main") {
					this._video.pause();
				}
			},

			_methodRerecord: function () {
				if (!this.get("rerecordable"))
					return;
				this.trigger("rerecord");
			},
			
			_methodSeek: function (position) {
				this._video.currentTime = position;
				this.trigger("seek", position);
			},
			
			_eventLoaded: function () {
				this.set("loaded", true);
				this.set("duration", this._video.duration);
				if (this.get("state") === "loading")
					this.set("state", "main");
				this.trigger("loaded");
			},
			
			_eventPlaying: function () {
				this.set("playing", true);
				this.trigger("playing");
			},
			
			_eventPause: function () {
				this.set("playing", false);
				this.trigger("pause");
			},

			_eventEnded: function () {
				this.set("playing", false);
				this.trigger("ended");
				this.set("state", "init");
			},
			
			_eventProgress: function () {
				this.set("position", this._video.currentTime);
				this.trigger("progress", this.get("position"));
			},
			
			_timerFire: function () {
				if (this.get("state") === "main") {
					this.set("activity_delta", Time.now() - this.get("last_activity"));
				}
			}
			
		};
	}).register("ba-videoplayer");
});