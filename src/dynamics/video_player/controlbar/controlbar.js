Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "module:Templates",
    "browser:Dom",
    "module:Assets",
    "browser:Info",
    "media:Player.Support"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function (Class, TimeFormat, Comparators, Templates, Dom, Assets, Info, PlayerSupport, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 0,
				"position": 0,
				"cached": 0,
				"volume": 1.0,
				"expandedprogress": true,
				"playing": false,
				"rerecordable": false,
				"submittable": false,
				"streams": [],
				"currentstream": null,
				"fullscreen": true,
				"fullscreened": false,
				"activitydelta": 0,
				"title": ""
			},
			
			computed: {
				"currentstream_label:currentstream": function () {
					var cs = this.get("currentstream");
					return cs ? (cs.label ? cs.label : PlayerSupport.resolutionToLabel(cs.width, cs.height)): "";
				}
			},
			
			functions: {
				
				formatTime: function (time) {
					time = Math.max(time || 0, 1);
					return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
				},
				
				startUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", true);
					this.call("progressUpdatePosition", event);
				},
				
				progressUpdatePosition: function (event) {
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updatePosition"))
						return;
					var clientX = ev.clientX;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("position", this.get("duration") * (clientX - offset.left) / (dimensions.width || 1));
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
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updateVolume"))
						return;
					var clientX = ev.clientX;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("volume", (clientX - offset.left) / (dimensions.width || 1));
					this.trigger("volume", this.get("volume"));
				},

				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				startVerticallyUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressVerticallyUpdateVolume", event);
				},

				progressVerticallyUpdateVolume: function (event) {
					var ev = event[0];
					ev.preventDefault();
					if (!this.get("_updateVolume"))
						return;
					var pageY = ev.pageY;
					var target = ev.currentTarget;
					var offset = Dom.elementOffset(target);
					var dimensions = Dom.elementDimensions(target);
					this.set("volume", 1 - (pageY - offset.top) / dimensions.height);
					this.trigger("volume", this.get("volume"));
				},

				stopVerticallyUpdateVolume: function (event) {
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
				},
				
				submit: function () {
					this.set("submittable", false);
					this.set("rerecordable", false);
					this.trigger("submit");
				},
				
				toggle_stream: function () {
					var streams = this.get("streams");
					var current = streams.length - 1;
					streams.forEach(function (stream, i) {
						if (Comparators.deepEqual(stream, this.get("currentstream")))
							current = i;
					}, this);
					this.set("currentstream", streams[(current + 1) % streams.length]);
				}

			},
			
			create: function () {
				this.set("ismobile", Info.isMobile());
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Redo video?",
    	"submit-video": "Confirm video",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound",
    	"change-resolution": "Change resolution",
    	"exit-fullscreen-video": "Exit fullscreen"
    });
});