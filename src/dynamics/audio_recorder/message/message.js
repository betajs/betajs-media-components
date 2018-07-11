Scoped.define("module:AudioRecorder.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Templates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_recorder_message.html') %>",

                attrs: {
                    "css": "ba-audiorecorder",
                    "message": '',
                    "links": null
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    },

                    linkClick: function(link) {
                        this.trigger("link", link);
                    }

                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_recorder_message.html') %>*/ })
        .register("ba-audiorecorder-message");
});