Scoped.define("module:VideoPlayer.Dynamics.Next", [
    "dynamics:Dynamic",
    "browser:Info",
    "module:Assets"
], function(Class, Info, Assets, scoped) {

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/next.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    csscommon: "ba-commoncss",
                    cssplayer: "ba-player",
                    shownext: false,
                    style: "mobile"
                },
                channels: {
                    "next:showNextWidget": function() {
                        this.set("shownext", true);
                    },
                    "next:noEngageNextWidget": function() {
                        this.set("shownext", false);
                        this.call("next");
                    }
                },

                computed: {
                    "staytext:style": function(style) {
                        return style === "desktop" ? "Stay & Watch" : "Stay";
                    },
                    "nexttext:style": function(style) {
                        return style === "desktop" ? "Next Video" : "Next";
                    },
                    "nextvideoposter:playlist,current_video_from_playlist": function(playlist, currIndex) {
                        if (!playlist || !playlist[currIndex + 1]) return;
                        return playlist[currIndex + 1].poster;
                    }
                },

                create: function() {
                    if (!Info.isMobile()) {
                        if (!this.get("is_floating")) this.set("style", "desktop");
                        this.on("change:is_floating", function(isFloating) {
                            this.set("style", isFloating ? "mobile" : "desktop");
                        }, this);
                    }
                },

                functions: {
                    stay: function() {
                        this.set("shownext", false);
                        this.channel("next").trigger("setStay");
                    },
                    next: function() {
                        this.set("shownext", false);
                        this.channel("next").trigger("playNext");
                    }
                }
            };
        }).register("ba-videoplayer-next")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/next.html') %>*/
        })
        .attachStringTable(Assets.strings);
});