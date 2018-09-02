Scoped.define("module:ImageCapture.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Templates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_capture_message.html') %>",

                attrs: {
                    "css": "ba-imagecapture",
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
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_capture_message.html') %>*/ })
        .register("ba-imagecapture-message");
});