Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_loader.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csstheme": "ba-videoplayer"
                }

            };
        })
        .register("ba-videoplayer-loader")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_loader.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Loading..."
        });
});