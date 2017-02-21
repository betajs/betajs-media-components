Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
		"module:Assets"
], [
	"dynamics:Partials.ShowPartial"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_loader,
			
			attrs: {
				"css": "ba-videorecorder",
				"tooltip": "",
				"label": "",
				"message": "",
				"hovermessage": ""
			}
			
		};
	}).register("ba-videorecorder-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
    });
});