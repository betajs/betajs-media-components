Scoped.define("module:Ads.Controlbar", [
    "dynamics:Dynamic"
], function(Dynamic, scoped) {
    return Dynamic.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/controlbar.html') %>",

            attrs: {
                'css': 'ba-ad-player-controlbar'
            },

            create: function(options) {

            }

        };
    }).register("ba-ad-controlbar");
});