Scoped.define("module:AudioPlayer.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_player_message.html') %>",

                attrs: {
                    "css": "ba-audioplayer",
                    "message": ''
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    }

                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_player_message.html') %>*/ })
        .register("ba-audioplayer-message");
});