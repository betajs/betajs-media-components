Scoped.define("module:AudioRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ShowPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_recorder_loader.html') %>",

                attrs: {
                    "css": "ba-audiorecorder",
                    "tooltip": "",
                    "label": "",
                    "message": "",
                    "hovermessage": ""
                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_recorder_loader.html') %>*/ })
        .register("ba-audiorecorder-loader")
        .attachStringTable(Assets.strings)
        .addStrings({});
});