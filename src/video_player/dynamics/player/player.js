Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "base:Browser.Info",
    "base:Media.Player.FlashPlayer",
    "base:Types",
    "base:Objs",
    "base:Strings"
], function (Class, Templates, Info, FlashPlayer, Types, Objs, Strings, scoped) {
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
			},
			
			_afterActivate: function () {
				var video = this.element().find("video").get(0);
				video.poster = this.get("poster");
				FlashPlayer.polyfill(video, "div", this.get("forceflash"), true).success(function (video) {
					this._video = video;
					var $video = $(video);
					this._$video = $video;
					var self = this;
					Objs.iter({
						"playing": "_eventPlaying",
						"ended": "_eventEnded"
					}, function (method, event) {
						$video.on(event, function () {
							self[method]();
						});
					});
				}, this);
			},
			
			functions: {
				
				play: function () {
					this._methodPlay();
				},
				
				rerecord: function () {
					this._methodRerecord();
				}
			
			},
			
			
			_methodPlay: function () {
				if (this.get("state") === "init") {
					this.set("state", "main");
					this._video.play();
				}
			},
			
			_methodRerecord: function () {
				if (!this.get("rerecordable"))
					return;
				this.trigger("rerecord");
			},
			
			_eventPlaying: function () {
				this.set("playing", true);
				this.trigger("playing");
			},
			
			_eventEnded: function () {
				this.set("playing", false);
				this.trigger("ended");
			}			
			
		};
	}).register("ba-videoplayer");
});