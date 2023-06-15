Scoped.define("module:VideoPlayer.Dynamics.Next", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/next.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    csscommon: "ba-commoncss",
                    cssplayer: "ba-player",
                    staytext: "Stay",
                    nexttext: "Next",
                    shownext: false
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

                functions: {
                    stay: function() {
                        this.set("shownext", false);
                        this.channel("next").trigger("setUnmute");
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