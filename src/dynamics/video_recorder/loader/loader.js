Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates"
], [
	"dynamics:Partials.ShowPartial"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_loader,
			
			attrs: {
				"css": "ba-videorecorder",
				"tooltip": "",
				"label": "",
				"message": ""
			}
			
		};
	}).register("ba-videorecorder-loader");
});