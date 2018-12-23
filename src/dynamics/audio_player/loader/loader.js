Scoped.define("module:AudioPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_player_loader.html') %>",

                attrs: {
                    "css": "ba-audioplayer"
                }

            };
        })
        .register("ba-audioplayer-loader")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/audio_player_loader.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Loading..."
        });
});