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