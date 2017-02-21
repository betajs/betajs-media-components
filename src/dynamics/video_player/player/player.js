Scoped.define("module:VideoPlayer.Dynamics.Player", [
	"dynamics:Dynamic",
	"module:Templates",
	"module:Assets",
	"browser:Info",
	"browser:Dom",
	"media:Player.VideoPlayerWrapper",
	"base:Types",
	"base:Objs",
	"base:Strings",
	"base:Time",
	"base:Timers",
	"base:States.Host",
	"base:Classes.ClassRegistry",
	"module:VideoPlayer.Dynamics.PlayerStates.Initial",
	"module:VideoPlayer.Dynamics.PlayerStates",
	"module:Ads.AbstractVideoAdProvider"
], [
	"module:VideoPlayer.Dynamics.Playbutton",
	"module:VideoPlayer.Dynamics.Message",
	"module:VideoPlayer.Dynamics.Loader",
	"module:VideoPlayer.Dynamics.Share",
	"module:VideoPlayer.Dynamics.Controlbar",
	"dynamics:Partials.EventPartial",
	"dynamics:Partials.OnPartial",
	"dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, Dom, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, AdProvider, scoped) {
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
				"csstopmessage": "",
				"csscontrolbar": "",
				"width": "",
				"height": "",
				/* Themes */
				"theme": "",
				"csstheme": "",
				/* Dynamics */
				"dynplaybutton": "videoplayer-playbutton",
				"dynloader": "videoplayer-loader",
				"dynmessage": "videoplayer-message",
				"dyntopmessage": "videoplayer-topmessage",
				"dyncontrolbar": "videoplayer-controlbar",
				"dynshare": "videoplayer-share",
				/* Templates */
				"tmplplaybutton": "",
				"tmplloader": "",
				"tmplmessage": "",
				"tmplshare": "",
				"tmpltopmessage": "",
				"tmplcontrolbar": "",
				/* Attributes */
				"poster": "",
				"source": "",
				"sources": [],
				"sourcefilter": {},
				"streams": [],
				"currentstream": null,
				"playlist": null,
				"volume": 1.0,
				"title": "",
				"initialseek": null,
				"fullscreened": false,
				"sharevideo": [],
				"sharevideourl": "",

				/* Configuration */
				"forceflash": false,
				"noflash": false,
				"reloadonplay": false,
				/* Ads */
				"adprovider": null,
				"preroll": false,
				/* Options */
				"rerecordable": false,
				"submittable": false,
				"autoplay": false,
				"preload": false,
				"loop": false,
				"nofullscreen": false,
				"ready": true,
				"stretch": false,
				"hideoninactivity": true,
				"skipinitial": false,
				"topmessage": "",
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
				"ready": "boolean",
				"nofullscreen": "boolean",
				"stretch": "boolean",
				"preroll": "boolean",
				"hideoninactivity": "boolean",
				"skipinitial": "boolean",
				"volume": "float",
				"initialseek": "float",
				"fullscreened": "boolean",
				"sharevideo": "array",
				"sharevideourl": "string"
			},

			extendables: ["states"],

			remove_on_destroy: true,

			create: function () {
				if (Info.isMobile()) {
					if (Info.isiOS() && Info.iOSversion().major >= 10) {
						if (this.get("autoplay"))
							this.set("volume", 0.0);
					} else {
						this.set("autoplay", false);
						this.set("loop", false);
					}
				}
				if (this.get("theme") in Assets.playerthemes) {
					Objs.iter(Assets.playerthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}
				if (this.get("adprovider")) {
					this._adProvider = this.get("adprovider");
					if (Types.is_string(this._adProvider))
						this._adProvider = AdProvider.registry[this._adProvider];
				}
				if (this.get("playlist")) {
					var pl0 = (this.get("playlist"))[0];
					this.set("poster", pl0.poster);
					this.set("source", pl0.source);
					this.set("sources", pl0.sources);
				}
				if (this.get("streams") && !this.get("currentstream"))
					this.set("currentstream", (this.get("streams"))[0]);

				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("firefox", Info.isFirefox());
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("message", "");
				this.set("fullscreensupport", false);
				this.set("csssize", "normal");

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
				this.__currentStretch = null;

				this.on("change:stretch", function () {
					this._updateStretch();
				}, this);
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
				if (this._prerollAd)
					this._prerollAd.weakDestroy();
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
				var video = this.activeElement().querySelector("[data-video='video']");
				this._clearError();
				VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
					element: video,
					forceflash: !!this.get("forceflash"),
					noflash: !!this.get("noflash"),
					preload: !!this.get("preload"),
					loop: !!this.get("loop"),
					reloadonplay: !!this.get("reloadonplay")
				})).error(function (e) {
					if (this.destroyed())
						return;
					this._error("attach", e);
				}, this).success(function (instance) {
					if (this.destroyed())
						return;
					if (this._adProvider && this.get("preroll")) {
						this._prerollAd = this._adProvider.newPrerollAd({
							videoElement: this.activeElement().querySelector("[data-video='video']"),
							adElement: this.activeElement().querySelector("[data-video='ad']")
						});
					}
					this.player = instance;
					this.player.on("fullscreen-change", function (inFullscreen) {
						this.set("fullscreened", inFullscreen);
					}, this);
					this.player.on("postererror", function () {
						this._error("poster");
					}, this);
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
					this.trigger("attached", instance);
					this.player.once("loaded", function () {
						var volume = Math.min(1.0, this.get("volume"));
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0.0);
						this.trigger("loaded");
						this.set("duration", this.player.duration());
						this.set("fullscreensupport", this.player.supportsFullscreen());
						this._updateStretch();
						if (this.get("initialseek"))
							this.player.setPosition(this.get("initialseek"));
					}, this);
					if (this.player.loaded())
						this.player.trigger("loaded");
					this._updateStretch();
				}, this);
			},
			
			_getSources: function () {
				var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
				var poster = this.get("poster");
				var source = this.get("source");
				var sources = filter ? Objs.filter(this.get("sources"), function (source) {
					return Objs.subset_of(filter, source);
				}, this) : this.get("sources");
				Objs.iter(sources, function (s) {
					if (s.poster)
						poster = s.poster;
				});
				return {
					poster: poster,
					source: source,
					sources: sources
				};
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

				submit: function () {
					if (!this.get("submittable"))
						return;
					this.trigger("submit");
					this.set("submittable", false);
					this.set("rerecordable", false);
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
					if (this.get("fullscreened"))
						this.player.exitFullscreen();
					else
						this.player.enterFullscreen();
					this.set("fullscreened", !this.get("fullscreened"));
				}
				
			},

			destroy: function () {
				this._detachVideo();
				inherited.destroy.call(this);
			},

			_timerFire: function () {
				if (this.destroyed())
					return;
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
						this.set("fullscreened", this.player.isFullscreen());
					}
				} catch (e) {}
				this._updateStretch();
				this._updateCSSSize();
			},

			_updateCSSSize: function () {
				var width = Dom.elementDimensions(this.activeElement()).width;
				this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
			},

			videoHeight: function () {
				return this.videoAttached() ? this.player.videoHeight() : NaN;
			},

			videoWidth: function () {
				return this.videoAttached() ? this.player.videoWidth() : NaN;
			},

			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},

			parentWidth: function () {
				return Dom.elementDimensions(this.activeElement().parentElement).width;
			},

			parentHeight: function () {
				return Dom.elementDimensions(this.activeElement().parentElement).height;
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},

			_updateStretch: function () {
				var newStretch = null;
				if (this.get("stretch")) {
					var ar = this.aspectRatio();
					if (isFinite(ar)) {
						var par = this.parentAspectRatio();
						if (isFinite(par)) {
							if (par > ar)
								newStretch = "height";
							if (par < ar)
								newStretch = "width";
						} else if (par === Infinity)
							newStretch = "height";
					}
				}
				if (this.__currentStretch !== newStretch) {
					if (this.__currentStretch)
						Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
					if (newStretch)
						Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
				}
				this.__currentStretch = newStretch;
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
