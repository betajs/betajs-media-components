Scoped.define("module:ImageViewer.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_viewer_topmessage.html') %>",

                attrs: {
                    "css": "ba-imageviewer",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/image_viewer_topmessage.html') %>*/
        })
        .register("ba-imageviewer-topmessage");
});