Scoped.define("module:VideoCall.Dynamics.CallViewer", [
    "dynamics:Dynamic"
], function(Dynamic, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, {
            template: "<%= template(dirname + '/call_view.html') %>"
        })
        .register("ba-call-view")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/call_view.html') %>*/
        });
});