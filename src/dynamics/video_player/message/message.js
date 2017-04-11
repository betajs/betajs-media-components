Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/video_player_message.html') %>",

            attrs: {
                "css": "ba-videoplayer",
                "message": ''
            },

            functions: {

                click: function() {
                    this.trigger("click");
                }

            }

        };
    }).register("ba-videoplayer-message");
});