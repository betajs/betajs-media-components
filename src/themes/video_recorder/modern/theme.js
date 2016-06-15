Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"modern": {
			css: "ba-videorecorder-theme-modern",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["modern-video_recorder_chooser"]
		},
		"modern-green": {
			css: "ba-videorecorder-theme-modern",
			csstheme: "ba-videorecorder-theme-modern-green",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["modern-video_recorder_chooser"]
		},
		"modern-blue": {
			css: "ba-videorecorder-theme-modern",
			csstheme: "ba-videorecorder-theme-modern-blue",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["modern-video_recorder_chooser"]
		}
	};
});