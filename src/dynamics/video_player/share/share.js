Scoped.define("module:VideoPlayer.Dynamics.Share", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {

    var SHARES = {
        facebook: 'https://facebook.com/sharer/sharer.php?u=',
        twitter: 'https://twitter.com/home?status=',
        gplus: 'https://plus.google.com/share?url='
    };

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_share.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    csscommon: "ba-commoncss",
                    cssplayer: "ba-player",
                    url: "",
                    shares: []
                },

                functions: {

                    shareMedia: function(share) {
                        window.open(SHARES[share] + this.get("url"), 'pop', 'width=600 height=400');
                    },

                    toggleShare: function() {
                        /*
                        var container = this.activeElement().querySelector().firstElementChild;
                        container.style.right = container.style.right ? "" : "-45px";
                        */
                    }

                }
            };
        }).register("ba-videoplayer-share")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_share.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "share": "Share media"
        });
});