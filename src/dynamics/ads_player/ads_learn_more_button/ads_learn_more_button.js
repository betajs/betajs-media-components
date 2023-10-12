Scoped.define("module:Ads.Dynamics.ChoicesLink", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Dynamic, Assets, scoped) {
    return Dynamic.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/ad_choices_link.html') %>",

            attrs: {
                css: "ba-videoplayer",
                cssadsplayer: "",
            },


            functions: {
            }
        };
    }).register("ba-ads-choices-link")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_choices_link.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "skip-ad": "Skip ad"
        });
});
