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
                    cssadsplayer: "ba-adsplayer",
                    cssprefix: null,
                    buttontext: null,
                    buttontitletext: null,
                    datatestselector: 'ba-ads-learn-more-link'
                },

                object_functions: ["pause_ads"],

                functions: {
                    click_action: function(url) {
                        this.trigger("click_action", url);
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