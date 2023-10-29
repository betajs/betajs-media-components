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
                    datatestselector: 'ba-ads-choices-link',
                    size: 16
                },

                // object_functions: ['click_action'],

                functions: {
                    click_action: function(url) {
                        this.trigger("click_action", url);
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