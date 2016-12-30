Scoped.extend("module:Assets.recorderthemes", [ "module:Templates" ], function(
		Templates) {
	return {
		"cube" : {
			css : "ba-videorecorder-theme-cube",
			cssmessage : "ba-videorecorder",
			cssloader : "ba-videorecorder",
			tmplcontrolbar : Templates["cube-video_recorder_controlbar"],
			tmplimagegallery : Templates["cube-video_recorder_imagegallery"],
			tmplchooser : Templates["cube-video_recorder_chooser"],
			tmplmessage : Templates["cube-video_recorder_message"]
		}
	};
});
