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
