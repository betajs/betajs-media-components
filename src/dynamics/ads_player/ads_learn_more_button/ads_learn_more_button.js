Scoped.define("module:Ads.Dynamics.LearnMoreButton", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Dynamic, Assets, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/ads_learn_more_button.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    cssadsplayer: "ba-adsplayer"
                },

                object_functions: ["pause_ads"],

                functions: {
                    pause_ads: function(url) {
                        if (this.get("adsplaying")) {
                            this.trigger("pause_ads");
                        }
                        if (url) this.__redirect(url);
                    },
                },

                // in mobileview click not redirect to url, so making it manually
                __redirect: function(url) {
                    if (url && url.length > 0 && /^(http|https):\/\//i.test(url) && window) {
                        window.open(url, "_blank");
                    }
                }
            };
        }).register("ba-ads-learn-more-button")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_learn_more_button.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "learn-more": "Learn More"
        });
});
