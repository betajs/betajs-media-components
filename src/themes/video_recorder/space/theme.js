Scoped.extend("module:Assets.recorderthemes", [ "module:Templates" ], function(
		Templates) {
	return {
		"space" : {
			css : "ba-videorecorder-theme-space",
			cssmessage : "ba-videorecorder",
			tmpltopmessage : Templates["space-video_recorder_topmessage"],
			tmplcontrolbar : Templates["space-video_recorder_controlbar"],
			tmplimagegallery : Templates["space-recorder_imagegallery"],
			cssloader: "ba-videorecorder",
			tmplmessage : Templates["space-video_recorder_message"]
		}
	};
});
