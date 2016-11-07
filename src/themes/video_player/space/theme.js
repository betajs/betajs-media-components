Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"space": {
			css: "ba-videoplayer-space-theme",
			csstheme: "ba-videoplayer-space-theme",
			tmplcontrolbar: Templates["space-video_player_controlbar"],
			tmpltopmessage: Templates["space-video_player_topmessage"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});
