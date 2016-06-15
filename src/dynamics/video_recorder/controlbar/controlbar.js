Scoped.define("module:VideoRecorder.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "base:Timers.Timer"
], [
	"dynamics:Partials.ShowPartial",
	"dynamics:Partials.RepeatPartial"	
], function (Class, Templates, Assets, Timer, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_controlbar,
			
			attrs: {
				"css": "ba-videorecorder",
				"hovermessage": "",
				"recordingindication": true
			},
			
			create: function () {
				this.auto_destroy(new Timer({
					context: this,
					fire: function () {
						this.set("recordingindication", !this.get("recordingindication"));
					},
					delay: 500
				}));
			},
			
			functions: {
				selectCamera: function (cameraId) {
					this.trigger("select-camera", cameraId);
				},
				selectMicrophone: function (microphoneId) {
					this.trigger("select-microphone", microphoneId);
				},
				hover: function (text) {
					this.set("hovermessage", text);
				},
				unhover: function () {
					this.set("hovermessage", "");
				},
				record: function () {
					this.trigger("invoke-record");
				},
				stop: function () {
					this.trigger("invoke-stop");
				},
				skip: function () {
					this.trigger("invoke-skip");
				}
			}
			
		};
	})
	.register("ba-videorecorder-controlbar")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"settings": "Settings",
    	"camerahealthy": "Lighting is good",
    	"cameraunhealthy": "Lighting is not optimal",
    	"microphonehealthy": "Sound is good",
    	"microphoneunhealthy": "Cannot pick up any sound",
    	"record": "Record",
    	"record-tooltip": "Click here to record.",
    	"stop": "Stop",
    	"stop-tooltip": "Click here to stop.",
    	"skip": "Skip",
    	"skip-tooltip": "Click here to skip."
    });
});