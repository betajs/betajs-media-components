Scoped.define("module:ImageCapture.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_capture_topmessage.html') %>",

                attrs: {
                    "css": "ba-imagecapture",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_capture_topmessage.html') %>*/ })
        .register("ba-imagecapture-topmessage");
});