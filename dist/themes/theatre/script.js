/*!
betajs-media-components - v0.0.39 - 2017-01-18
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("browser", "global:BetaJS.Browser");
Scoped.binding("module", "global:BetaJS.MediaComponents");

Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"theatre": {
			css: "ba-videoplayer-theatre-theme",
			csstheme: "ba-videoplayer-theatre-theme",
			tmplcontrolbar: Templates["theatre-video_player_controlbar"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});

Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"theatre": {
			css: "ba-videorecorder-theme-theatre",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
      tmpltopmessage: Templates["theatre-video_recorder_topmessage"],
      tmplcontrolbar: Templates["theatre-video_recorder_controlbar"],
      tmplimagegallery: Templates["theatre-recorder_imagegallery"],
			tmplloader: Templates["theatre-video_recorder_loader"],
      tmplchooser: Templates["theatre-video_recorder_chooser"],
      tmplmessage: Templates["theatre-video_recorder_message"]
		}
	};
});

}).call(Scoped);