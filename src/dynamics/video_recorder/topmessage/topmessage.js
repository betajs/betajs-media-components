Scoped.define("module:VideoRecorder.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_topmessage,
			
			attrs: {
				"css": "ba-videorecorder",
				"topmessage": ''
			}
			
		};
	}).register("ba-videorecorder-topmessage");
});