Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, TimeFormat, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/playbutton.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csstheme": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "rerecordable": false,
                    "submittable": false,
                    "showduration": false
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
                    },

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        if (time > 3600) {
                            return TimeFormat.format(TimeFormat.ELAPSED_HOURS_MINUTES_SECONDS, time * 1000);
                        } else {
                            return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                        }
                    }
                }
            };
        })
        .register("ba-videoplayer-playbutton")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/playbutton.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Click to play.",
            "rerecord": "Redo",
            "submit-video": "Confirm video"
        });
});