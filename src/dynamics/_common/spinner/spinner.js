Scoped.define("module:Common.Dynamics.Spinner", [
    "dynamics:Dynamic",
], [

], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {

            return {
                construct: function() {
                    inherited.constructor.call(this);
                },

                template: "<%= template(dirname + '/spinner.html') %>",

                attrs: {
                    css: "ba-common",
                    csscommon: "ba-commoncss",
                    cssplayer: "ba-player",
                    cssspinner: "ba-spinner",
                    speed: 1.4,
                    size: '50px',
                    linewidth: 10,
                    color: "white"
                },

                types: {
                    css: "string",
                    csscommon: "string",
                    cssplayer: "string",
                    cssspinner: "string",
                    speed: "number",
                    size: "string",
                    linewidth: "number",
                    color: "string"
                }
            };
        }).register("ba-spinner")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/spinner.html') %>*/
        });
});