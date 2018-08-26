Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ShowPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_recorder_loader.html') %>",

                attrs: {
                    "css": "ba-videorecorder",
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
                    "tooltip": "",
                    "label": "",
                    "message": "",
                    "hovermessage": ""
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_recorder_loader.html') %>*/ })
        .register("ba-videorecorder-loader")
        .attachStringTable(Assets.strings)
        .addStrings({});
});