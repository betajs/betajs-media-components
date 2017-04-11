Scoped.define("module:VideoRecorder.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/video_recorder_topmessage.html') %>",

            attrs: {
                "css": "ba-videorecorder",
                "topmessage": ''
            }

        };
    }).register("ba-videorecorder-topmessage");
});