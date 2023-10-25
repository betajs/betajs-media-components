Scoped.define("module:Common.Dynamics.Settingsmenu", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatElementPartial"
], function(Class, Objs, Async, Timer, Dom, DomEvents, Assets, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {

        return {

            template: "<%= template(dirname + '/circle-progress.html') %>",

            attrs: {
                "css": "ba-common",
                "csscommon": "ba-commoncss",
                "cssplayer": "ba-player",
                "steps": 5,
                "stepelements": [],
                "showpercentage": false
            },

            events: {},

            /**
             * Initial Function After Render
             */
            create: function() {
                for (var i = 0; i < this.get("steps"); i++) {
                    this.get("stepsarray").push(i);
                }
            }

        };
    })
        .register("ba-circle-progress")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/circle-progress.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "fullscreen-video": "Enter fullscreen"
        });
});
