Scoped.define("module:VideoRecorder.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Templates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_recorder_message.html') %>",

                attrs: {
                    "css": "ba-videorecorder",
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
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
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/video_recorder_message.html') %>*/
        })
        .register("ba-videorecorder-message");
});