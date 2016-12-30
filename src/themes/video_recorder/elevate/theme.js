Scoped.extend("module:Assets.recorderthemes", [ "module:Templates" ], function(
		Templates) {
	return {
		"elevate" : {
			css : "ba-videorecorder-theme-elevate",
			cssmessage : "ba-videorecorder",
			cssloader : "ba-videorecorder",
			tmpltopmessage : Templates["elevate-video_recorder_topmessage"],
			tmplcontrolbar : Templates["elevate-video_recorder_controlbar"],
			tmplimagegallery : Templates["elevate-recorder_imagegallery"],
			tmplmessage : Templates["elevate-video_recorder_message"]
		}
	};
});
