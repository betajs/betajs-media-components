Scoped.define("module:VideoPlayer.Dynamics.Share", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {

    var SHARES = {
        facebook: 'https://facebook.com/sharer/sharer.php?u=',
        twitter: 'https://twitter.com/home?status=',
        gplus: 'https://plus.google.com/share?url='
    };

    return Class.extend({scoped: scoped}, function (inherited) {
        return {
            template: Templates.video_player_share,

            attrs: {
                css: "ba-videoplayer",
                url: "",
                shares: []
            },

            functions: {

                shareMedia: function (share) {
                    window.open(SHARES[share] + this.get("url"), 'pop', 'width=600 height=400');
                },

                toggleShare: function () {
                    /*
                    var container = this.activeElement().querySelector().firstElementChild;
                    container.style.right = container.style.right ? "" : "-45px";
                    */
                }

            }
        };
    }).register("ba-videoplayer-share")
    .attachStringTable(Assets.strings)
    .addStrings({
        "share": "Share video"
    });
});