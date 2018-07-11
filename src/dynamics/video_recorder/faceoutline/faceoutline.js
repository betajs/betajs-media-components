Scoped.define("module:VideoRecorder.Dynamics.Faceoutline", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_recorder_faceoutline.html') %>"

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_recorder_faceoutline.html') %>*/ })
        .register("ba-videorecorder-faceoutline");
});