Scoped.define("module:VideoRecorder.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Assets",
    "base:Timers.Timer"
], [
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.RepeatPartial"
], function(Class, Assets, Timer, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_recorder_controlbar.html') %>",

                attrs: {
                    "css": "ba-videorecorder",
                    "hovermessage": "",
                    "recordingindication": true,
                    "covershot_accept_string": "image/*,image/png,image/jpg,image/jpeg"
                },

                create: function() {
                    this.auto_destroy(new Timer({
                        context: this,
                        fire: function() {
                            this.set("recordingindication", !this.get("recordingindication"));
                        },
                        delay: 500
                    }));
                },

                functions: {
                    selectCamera: function(cameraId) {
                        this.trigger("select-camera", cameraId);
                    },
                    selectMicrophone: function(microphoneId) {
                        this.trigger("select-microphone", microphoneId);
                    },
                    hover: function(text) {
                        this.set("hovermessage", text);
                    },
                    unhover: function() {
                        this.set("hovermessage", "");
                    },
                    record: function() {
                        this.trigger("invoke-record");
                    },
                    rerecord: function() {
                        this.trigger("invoke-rerecord");
                    },
                    stop: function() {
                        this.trigger("invoke-stop");
                    },
                    skip: function() {
                        this.trigger("invoke-skip");
                    },
                    cancel: function() {
                        this.trigger("invoke-cancel");
                    },
                    uploadCovershot: function(domEvent) {
                        this.trigger("upload-covershot", domEvent[0].target);
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
            "rerecord": "Redo",
            "rerecord-tooltip": "Click here to redo.",
            "upload-covershot": "Upload Cover",
            "upload-covershot-tooltip": "Click here to upload custom cover shot",
            "stop": "Stop",
            "stop-tooltip": "Click here to stop.",
            "skip": "Skip",
            "skip-tooltip": "Click here to skip.",
            "stop-available-after": "Minimum recording time is %d seconds",
            "cancel": "Cancel",
            "cancel-tooltip": "Click here to cancel."
        });
});