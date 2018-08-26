Scoped.define("module:AudioRecorder.Dynamics.Controlbar", [
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

                template: "<%= template(dirname + '/audio_recorder_controlbar.html') %>",

                attrs: {
                    "css": "ba-audiorecorder",
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
                    "hovermessage": "",
                    "recordingindication": true
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
                    cancel: function() {
                        this.trigger("invoke-cancel");
                    }
                }

            };
        })
        .register("ba-audiorecorder-controlbar")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_recorder_controlbar.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "settings": "Settings",
            "microphonehealthy": "Sound is good",
            "microphoneunhealthy": "Cannot pick up any sound",
            "record": "Record",
            "record-tooltip": "Click here to record.",
            "rerecord": "Redo",
            "rerecord-tooltip": "Click here to redo.",
            "stop": "Stop",
            "stop-tooltip": "Click here to stop.",
            "stop-available-after": "Minimum recording time is %d seconds",
            "cancel": "Cancel",
            "cancel-tooltip": "Click here to cancel."
        });
});