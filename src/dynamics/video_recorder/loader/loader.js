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
        "hovermessage": "",
				"tooltip": "",
				"label": "",
				"message": ""
			},

			functions: {
        hover: function (text) {
        	console.log(text);
          this.set("hovermessage", text);
          console.log(this.get("hovermessage"));
        },
        unhover: function () {
          this.set("hovermessage", "");
        }
			}
			
		};
	}).register("ba-videorecorder-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
      "starts-in": "Starts in ",
      "wait": "Wait",
      "wait-tooltip": "Wait"
    });
});