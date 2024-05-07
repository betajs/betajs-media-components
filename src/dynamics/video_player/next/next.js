Scoped.define("module:VideoPlayer.Dynamics.Next", [
    "dynamics:Dynamic",
    "browser:Canvas",
    "browser:Info",
    "module:Assets"
], function(Class, Canvas, Info, Assets, scoped) {

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/next.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    csscommon: "ba-commoncss",
                    cssplayer: "ba-player",
                    style: "mobile"
                },

                computed: {
                    "nextvideoposter:playlist,current_video_from_playlist": function(playlist, currIndex) {
                        if (!playlist || !playlist[currIndex + 1]) return;
                        return playlist[currIndex + 1].poster;
                    }
                },

                events: {
                    "change:nextvideoposter": function(nextvideoposter) {
                        if (!nextvideoposter) return;
                        var img = new Image();
                        img.crossOrigin = "anonymous";
                        img.onload = function() {
                            this.set("hidenextvideoposter", Canvas.isImageBlack(img));
                        }.bind(this);
                        img.src = nextvideoposter;
                    }
                },
                functions: {
                    stay: function(event) {
                        if (event)
                            if (event[0].type === 'touchstart') {
                                event[0].preventDefault();
                                event[0].stopPropagation();
                            }

                        this.channel("next").trigger("setStay");
                    },
                    next: function(event) {
                        if (event)
                            if (event[0].type === 'touchstart') {
                                event[0].preventDefault();
                                event[0].stopPropagation();
                            }
                        this.channel("next").trigger("manualPlayNext");
                        this.channel("next").trigger("playNext", false);
                    }
                }
            };
        }).register("ba-videoplayer-next")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/next.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "stay": "Stay",
            "next": "Next"
        });
});