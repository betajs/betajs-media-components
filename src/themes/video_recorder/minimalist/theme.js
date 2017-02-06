Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"minimalist": {
			css: "ba-videorecorder-theme-minimalist",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
      tmplchooser: Templates["minimalist-video_recorder_chooser"],
      tmpltopmessage: Templates["minimalist-video_recorder_topmessage"],
      tmplcontrolbar: Templates["minimalist-video_recorder_controlbar"],
      tmplimagegallery: Templates["minimalist-recorder_imagegallery"],
			tmplloader: Templates["minimalist-video_recorder_loader"],
      tmplmessage: Templates["minimalist-video_recorder_message"]
		}
	};
});
