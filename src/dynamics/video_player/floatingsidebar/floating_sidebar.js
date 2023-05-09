Scoped.define("module:VideoPlayer.Dynamics.FloatingSidebar", [
    "dynamics:Dynamic",
    "module:StylesMixin",
    "browser:Dom",
    "module:Assets"
], function(Class, StylesMixin, DOM, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/floating_sidebar.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "cssadsplayer": "ba-adsplayer",
                    "cssfloatingsidebar": "ba-floating-sidebar",
                    "containerstyle": null,
                    "sidebartitle": null,
                    "bodyelementtouched": false,
                    "bodyelementpadding": 114
                },

                events: {
                    "change:mobileview": function(isMobile) {
                        if (isMobile) {
                            document.body.style.paddingTop = parseFloat(document.body.style.paddingTop) + this.get("bodyelementpadding") + 'px';
                            this.set("bodyelementtouched", true);
                        }
                    }
                    // "change:adsplaying": function(isPlaying) {}
                },

                functions: {
                    pause_ads: function() {
                        if (this.get("adsplaying")) {
                            this.trigger("pause_ads");
                        }
                    },

                    close: function() {
                        var parent = this.parent();
                        if (this.get("bodyelementtouched")) {
                            document.body.style.paddingTop = parseFloat(document.body.style.paddingTop) - this.get("bodyelementpadding") + 'px';
                        }
                        if (parent) parent.destroy();
                    }
                }
            };
        }])
        .register("ba-videoplayer-floating-sidebar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/floating_sidebar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "ad-choices": "Ad Choices",
            "learn-more": "Learn More"
        });
});