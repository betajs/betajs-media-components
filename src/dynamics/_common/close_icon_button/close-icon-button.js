Scoped.define("module:Common.Dynamics.CloseIconButton", [
    "dynamics:Dynamic",
    "module:Assets"
], [], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function() {

            return {

                template: "<%= template(dirname + '/close-icon-button.html') %>",

                attrs: {
                    "css": "ba-common",
                    "csscommon": "ba-commoncss",
                },

                types: {
                    "css": "string",
                    "csscommon": "string",
                },

                /**
                 * Initial Function After Render
                 */
                create: function() {},

                functions: {},
            };
        })
        .register("ba-close-icon-button")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/close-icon-button.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "close": "Close"
        });
});