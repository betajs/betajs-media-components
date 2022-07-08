Scoped.define("module:VideoCall.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Assets"
], [

], function(Dynamic, Assets, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/call_controlbar.html') %>",

                functions: {
                    toggle_mute: function() {
                        this.channel("call").trigger("toggle_mute");
                    },
                    toggle_camera: function() {
                        this.channel("call").trigger("toggle_camera");
                    },
                    leave_call: function() {
                        this.channel("call").trigger("leave_call");
                    }
                }
            };
        })
        .register("ba-call-controlbar")
        .attachStringTable(Assets.strings)
        .addStrings({
            "camera-button": "Show/Hide Camera",
            "leave-button": "Leave Call",
            "mute-button": "Mute/Unmute"
        });
});