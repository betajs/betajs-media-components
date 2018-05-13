Scoped.define("module:ImageViewer.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_viewer_message.html') %>",

                attrs: {
                    "css": "ba-imageviewer",
                    "message": ''
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    }

                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_viewer_message.html') %>*/ })
        .register("ba-imageviewer-message");
});