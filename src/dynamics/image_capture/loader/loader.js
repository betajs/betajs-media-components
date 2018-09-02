Scoped.define("module:ImageCapture.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ShowPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_capture_loader.html') %>",

                attrs: {
                    "css": "ba-imagecapture",
                    "tooltip": "",
                    "label": "",
                    "message": "",
                    "hovermessage": ""
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_capture_loader.html') %>*/ })
        .register("ba-imagecapture-loader")
        .attachStringTable(Assets.strings)
        .addStrings({});
});