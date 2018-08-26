Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_message.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "message": ''
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    }

                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_message.html') %>*/ })
        .register("ba-videoplayer-message");
});