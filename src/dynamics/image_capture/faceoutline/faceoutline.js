Scoped.define("module:ImageCapture.Dynamics.Faceoutline", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_capture_faceoutline.html') %>"

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_capture_faceoutline.html') %>*/ })
        .register("ba-imagecapture-faceoutline");
});