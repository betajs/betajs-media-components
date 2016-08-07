Scoped.define("module:VideoRecorder.Dynamics.Chooser", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.IfPartial"
], function (Class, Templates, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_chooser,
			
			attrs: {
				"css": "ba-videorecorder",
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"primaryrecord": true
			},
			
			create: function () {
				this.set("has_primary", true);
				this.set("enable_primary_select", false);
				this.set("primary_label", this.string(this.get("primaryrecord") && this.get("allowrecord") ? "record-video" : "upload-video"));
				this.set("secondary_label", this.string(this.get("primaryrecord") ? "upload-video" : "record-video"));
				if (!this.get("allowrecord") || !this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_primary_select", true);
					this.set("primary_select_capture", Info.isMobile() && this.get("allowrecord") && this.get("primaryrecord"));
					this.set("primary_accept_string", Info.isMobile() && this.get("allowrecord") && this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : (Info.isMobile() || !this.get("allowcustomupload") ? "video/*,video/mp4" : ""));
				}
				this.set("has_secondary", this.get("allowrecord") && this.get("allowupload"));
				this.set("enable_secondary_select", false);
				if (this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_secondary_select", true);
					this.set("secondary_select_capture", Info.isMobile() && !this.get("primaryrecord"));
					this.set("secondary_accept_string", Info.isMobile() && !this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : (Info.isMobile() || !this.get("allowcustomupload") ? "video/*,video/mp4" : ""));
				}
			},
			
			__recordCordova: function () {
				var self = this;
				navigator.device.capture.captureVideo(function (mediaFiles) {
				    var mediaFile = mediaFiles[0];
				    self.trigger("upload", mediaFile);
				}, function (error) {}, {limit:1});
			},
			
			functions: {
				primary: function () {
					if (this.get("enable_primary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				secondary: function () {
					if (this.get("enable_secondary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				primary_select: function (domEvent) {
					if (!this.get("enable_primary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				},
				secondary_select: function (domEvent) {
					if (!this.get("enable_secondary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				}
			}
			
		};
	}).register("ba-videorecorder-chooser")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"record-video": "Record Your Video",
    	"upload-video": "Upload Video"
    });
});
