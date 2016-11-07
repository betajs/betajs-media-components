Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"minimalist": {
			css: "ba-videorecorder-minimalist-theme",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["minimalist-video_recorder_chooser"]
		}
	};
});
