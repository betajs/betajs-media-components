Scoped.extend("module:Assets.recorderthemes", [ "module:Templates" ], function(
		Templates) {
	return {
		"minimalist" : {
			css : "ba-videorecorder-theme-minimalist",
			cssmessage : "ba-videorecorder",
			tmpltopmessage : Templates["minimalist-video_recorder_topmessage"],
			tmplcontrolbar : Templates["minimalist-video_recorder_controlbar"],
			tmplimagegallery : Templates["minimalist-recorder_imagegallery"],
			cssloader: "ba-videorecorder",
			tmplmessage : Templates["minimalist-video_recorder_message"]
		}
	};
});
