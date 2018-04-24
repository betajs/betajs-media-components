Scoped.define("module:VideoPlayer.Dynamics.Tracks", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_tracks.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "trackcuetext": null,
                    "acceptedtracktexts": "text/vtt,application/ttml+xml,type/subtype",
                    "trackselectorhovered": false
                },

                functions: {
                    select_track: function(track) {
                        this.parent().set("trackselectorhovered", false);
                        this.parent().trigger("switch-track", track);
                    },

                    hover_cc: function(hover) {
                        return this.parent().set("trackselectorhovered", hover);
                    },

                    select_text_track: function(domEvent) {
                        this.trigger("upload-text-tracks", domEvent[0].target);
                    }
                }

            };
        })
        .register("ba-videoplayer-tracks")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_tracks.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "upload-video-track-text": "Upload track text files"
        });
});