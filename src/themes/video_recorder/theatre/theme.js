Scoped.extend("module:Assets.recorderthemes", [ "module:Templates" ], function(
		Templates) {
	return {
		"theatre" : {
			css : "ba-videorecorder-theme-theatre",
			cssmessage : "ba-videorecorder",
			tmplcontrolbar : Templates["theatre-video_recorder_controlbar"],
			tmplimagegallery : Templates["theatre-recorder_imagegallery"],
			cssloader: "ba-videorecorder",
			tmplchooser : Templates["theatre-video_recorder_chooser"],
			tmplmessage : Templates["theatre-video_recorder_message"]
		}
	};
});
