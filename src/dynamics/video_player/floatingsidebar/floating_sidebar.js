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
                    "bodyelementpadding": 114,
                    "companionadcontent": null
                },

                functions: {
                    pause_ads: function(url) {
                        if (this.get("adsplaying")) {
                            this.trigger("pause_ads");
                        }
                        if (url) this.__redirect(url);
                    },
                    redirect: function(url) {
                        this.__redirect(url);
                    }
                },

                // in mobileview click not redirect to url, so making it manually
                __redirect: function(url) {
                    if (url && url.length > 0 && /^(http|https):\/\//i.test(url) && window) {
                        window.open(url, "_blank");
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