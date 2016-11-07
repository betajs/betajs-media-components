Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
	"dynamics:Dynamic",
	"jquery:",
	"module:Templates",
	"module:Assets",
	"browser:Info"
], [
	"dynamics:Partials.StylesPartial",
	"dynamics:Partials.ShowPartial",
	"dynamics:Partials.IfPartial",
	"dynamics:Partials.ClickPartial"
], function (Class, $, Templates, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {

			template: Templates.video_player_topmessage,

			attrs: {
				"css": "ba-videoplayer",
				"volume": 1.0,
				"fullscreen": true,
				"topmessage": ''
			},

			functions: {

				share_media: function() {
					alert('Share me');
				},

				toggle_fullscreen: function () {
					this.trigger("fullscreen");
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

				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else
						this.set("volume", this.__oldVolume || 1);
					this.trigger("volume", this.get("volume"));
				}
			}

		};
	}).register("ba-videoplayer-topmessage")
		.attachStringTable(Assets.strings)
		.addStrings({
			"volume-button": "Set volume",
			"fullscreen-video": "Enter fullscreen",
			"volume-mute": "Mute sound",
			"volume-unmute": "Unmute sound",
			"share-media": "Share this media"
		});
});
