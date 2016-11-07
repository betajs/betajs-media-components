Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"cube": {
			css: "ba-videorecorder-cube-theme",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["cube-video_recorder_chooser"]
		}
	};
});
