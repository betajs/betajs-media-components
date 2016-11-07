Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"space": {
			css: "ba-videorecorder-space-theme",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["space-video_recorder_chooser"]
		}
	};
});
