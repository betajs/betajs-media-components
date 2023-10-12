Scoped.define("module:Ads.Dynamics.ChoicesLink", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Dynamic, Assets, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/ads_choices_link.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    cssadsplayer: "ba-adsplayer",
                    adchoiceslink: null
                },

                object_functions: ['redirect'],

                functions: {
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
        }).register("ba-ads-choices-link")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_choices_link.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "ad-choices": "Ad Choices"
        });
});
