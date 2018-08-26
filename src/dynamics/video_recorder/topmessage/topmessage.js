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
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_recorder_topmessage.html') %>*/ })
        .register("ba-videorecorder-topmessage");
});