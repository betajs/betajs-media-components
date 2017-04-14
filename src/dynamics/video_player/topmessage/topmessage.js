Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/video_player_topmessage.html') %>",

            attrs: {
                "css": "ba-videoplayer",
                "topmessage": ''
            }

        };
    }).register("ba-videoplayer-topmessage");
});