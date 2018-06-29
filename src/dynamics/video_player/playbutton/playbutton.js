Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/playbutton.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csstheme": "ba-videoplayer",
                    "cssplaybutton": "ba-videoplayer-playbutton",
                    "rerecordable": false,
                    "submittable": false
                },

                functions: {

                    play: function() {
                        this.trigger("play");
                    },

                    submit: function() {
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                        this.trigger("submit");
                    },

                    rerecord: function() {
                        this.trigger("rerecord");
                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        this.trigger("tab_index_move", ev[0], nextSelector, focusingSelector);
                    }
                }
            };
        })
        .register("ba-videoplayer-playbutton")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/playbutton.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Click to play.",
            "rerecord": "Redo",
            "submit-video": "Confirm video"
        });
});