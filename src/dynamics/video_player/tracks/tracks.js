Scoped.define("module:VideoPlayer.Dynamics.Tracks", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatPartial"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_tracks.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "trackcuetext": null,
                    "trackselectorhovered": false
                },

                functions: {
                    select_track: function(track) {
                        this.__parent.trigger("switch-track", track);
                    },

                    hover_cc: function(hover) {
                        var _dyn = this.__parent;
                        return hover ? _dyn.set("trackselectorhovered", hover) : _dyn.set("trackselectorhovered", hover);
                    }
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_tracks.html') %>*/ })
        .register("ba-videoplayer-tracks");
});