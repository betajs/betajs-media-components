Scoped.define("module:ImageCapture.Dynamics.Controlbar", [
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

                template: "<%= template(dirname + '/image_capture_controlbar.html') %>",

                attrs: {
                    "css": "ba-imagecapture",
                    "hovermessage": ""
                },

                functions: {
                    selectCamera: function(cameraId) {
                        this.trigger("select-camera", cameraId);
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
                    cancel: function() {
                        this.trigger("invoke-cancel");
                    }
                }

            };
        })
        .register("ba-imagecapture-controlbar")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_capture_controlbar.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "settings": "Settings",
            "camerahealthy": "Lighting is good",
            "cameraunhealthy": "Lighting is not optimal",
            "record": "Capture",
            "record-tooltip": "Click here to capture.",
            "rerecord": "Redo",
            "rerecord-tooltip": "Click here to redo.",
            "cancel": "Cancel",
            "cancel-tooltip": "Click here to cancel."
        });
});