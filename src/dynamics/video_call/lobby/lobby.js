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

                attrs: {
                    mode: "join"
                },

                computed: {
                    "title:mode": function(mode) {
                        return mode === "create" ? this.string("title-create") : this.string("title-join");
                    },
                    "description:mode": function(mode) {
                        return mode === "create" ? this.string("description-create") : this.string("description-join");
                    },
                    "button:mode": function(mode) {
                        return mode === "create" ? this.string("create-button") : this.string("join-button");
                    }
                },

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
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/call_lobby.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "camera-button": "Camera",
            "description-create": "When you're ready click on the button below to create a call.",
            "description-join": "When you're ready click on the button below to join the call.",
            "join-button": "Join",
            "create-button": "Create",
            "mute-button": "Mute",
            "title-create": "Create Call",
            "title-join": "Join Call"
        });
});