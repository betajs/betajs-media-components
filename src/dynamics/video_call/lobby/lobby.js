Scoped.define("module:VideoCall.Dynamics.Lobby", [
    "dynamics:Dynamic",
    "module:Assets"
], [

], function(Dynamic, Assets, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/call_lobby.html') %>",

                functions: {
                    connect: function() {
                        this.channel("call").trigger("connect");
                    },
                    toggle_mute: function() {
                        this.channel("call").trigger("toggle_mute");
                    },
                    toggle_camera: function() {
                        this.channel("call").trigger("toggle_camera");
                    }
                }
            };
        })
        .register("ba-call-lobby")
        .attachStringTable(Assets.strings)
        .addStrings({
            "camera-button": "Camera",
            "description": "When you're ready click on the button below to join the call.",
            "join-button": "Join",
            "mute-button": "Mute",
            "title": "Join Call"
        });
});