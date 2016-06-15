Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"modern": {
			css: "ba-videoplayer-theme-modern",
			tmplcontrolbar: Templates["modern-video_player_controlbar"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		},
		"modern-green": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-green",
			tmplcontrolbar: Templates["modern-video_player_controlbar"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		},
		"modern-blue": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-blue",
			tmplcontrolbar: Templates["modern-video_player_controlbar"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});