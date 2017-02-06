Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"space": {
			css: "ba-videorecorder-theme-space",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["space-video_recorder_chooser"],
      tmpltopmessage: Templates["space-video_recorder_topmessage"],
      tmplcontrolbar: Templates["space-video_recorder_controlbar"],
      tmplimagegallery: Templates["space-recorder_imagegallery"],
			tmplloader: Templates["space-video_recorder_loader"],
      tmplmessage: Templates["space-video_recorder_message"]
		}
	};
});
