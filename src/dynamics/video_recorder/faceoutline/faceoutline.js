Scoped.define("module:VideoRecorder.Dynamics.Faceoutline", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/faceoutline.html') %>"

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/faceoutline.html') %>*/ })
        .register("ba-recorderfaceoutline");
});