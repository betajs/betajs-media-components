Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"elevate": {
			css: "ba-videorecorder-theme-elevate",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
      tmplchooser: Templates["elevate-video_recorder_chooser"],
      tmpltopmessage: Templates["elevate-video_recorder_topmessage"],
      tmplcontrolbar: Templates["elevate-video_recorder_controlbar"],
      tmplimagegallery: Templates["elevate-recorder_imagegallery"],
			tmplloader: Templates["elevate-video_recorder_loader"],
      tmplmessage: Templates["elevate-video_recorder_message"]
		}
	};
});
