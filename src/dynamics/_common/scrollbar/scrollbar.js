Scoped.define("module:Common.Dynamics.Scrollbar", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events",
], [], function(Class, Objs, Async, Timer, Dom, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {

            return {

                template: "<%= template(dirname + '/scrollbar.html') %>",

                attrs: {
                    "css": "ba-common",
                    "cssplayer": "ba-player",
                    "csscommon": "ba-commoncss",
                    "cssscrollbar": "ba-scrollbar",
                },

                events: {},

                create: function() {},

                // _afterActivate: function() {},
            };
        })
        .register("scrollbar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/scrollbar.html') %>*/
        });
});