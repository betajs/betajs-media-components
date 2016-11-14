Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"minimalist": {
			css: "ba-videoplayer-minimalist-theme",
			csstheme: "ba-videoplayer-minimalist-theme",
			tmplcontrolbar: Templates["minimalist-video_player_controlbar"],
			tmpltopmessage: Templates["minimalist-video_player_topmessage"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});
