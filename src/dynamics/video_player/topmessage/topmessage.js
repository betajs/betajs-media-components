Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_topmessage.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_topmessage.html') %>*/ })
        .register("ba-videoplayer-topmessage");
});