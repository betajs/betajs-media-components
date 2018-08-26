Scoped.define("module:AudioPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "browser:Dom",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function(Class, TimeFormat, Dom, Assets, Info, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_player_controlbar.html') %>",

                attrs: {
                    "css": "ba-audioplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "csstheme": "ba-audiooplayer-default-theme",
                    "duration": 0,
                    "position": 0,
                    "cached": 0,
                    "volume": 1.0,
                    "expandedprogress": true,
                    "playing": false,
                    "rerecordable": false,
                    "submittable": false,
                    "title": ""
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdatePosition: function(event) {
                        if (this.get("disableseeking")) return;
                        event[0].preventDefault();
                        this.set("_updatePosition", true);
                        this.call("progressUpdatePosition", event);
                    },

                    progressUpdatePosition: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updatePosition"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("position", this.get("duration") * (clientX - offset.left) / (dimensions.width || 1));

                        var player = this.__parent.player;

                        this.trigger("position", this.get("position"));
                    },

                    stopUpdatePosition: function(event) {
                        event[0].preventDefault();
                        this.set("_updatePosition", false);
                    },

                    startUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", true);
                        this.call("progressUpdateVolume", event);
                    },

                    progressUpdateVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateVolume"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("volume", (clientX - offset.left) / (dimensions.width || 1));
                        this.trigger("volume", this.get("volume"));
                    },

                    stopUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },

                    startVerticallyUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", true);
                        this.call("progressVerticallyUpdateVolume", event);
                    },

                    progressVerticallyUpdateVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateVolume"))
                            return;
                        var pageY = ev.pageY;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("volume", 1 - (pageY - offset.top) / dimensions.height);
                        this.trigger("volume", this.get("volume"));
                    },

                    stopVerticallyUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },


                    play: function() {
                        this.trigger("play");
                    },

                    pause: function() {
                        this.trigger("pause");
                    },

                    toggle_volume: function() {
                        if (this.get("volume") > 0) {
                            this.__oldVolume = this.get("volume");
                            this.set("volume", 0);
                        } else
                            this.set("volume", this.__oldVolume || 1);
                        this.trigger("volume", this.get("volume"));
                    },

                    rerecord: function() {
                        this.trigger("rerecord");
                    },

                    seek: function(position) {
                        this.trigger("seek", position);
                    },

                    set_volume: function(volume) {
                        this.trigger("set_volume", volume);
                    },

                    submit: function() {
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                        this.trigger("submit");
                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        this.trigger("tab_index_move", ev[0], nextSelector, focusingSelector);
                    }
                },

                create: function() {
                    this.set("ismobile", Info.isMobile());
                }
            };
        })
        .register("ba-audioplayer-controlbar")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_player_controlbar.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "audio-progress": "Progress",
            "rerecord-audio": "Redo?",
            "submit-audio": "Confirm",
            "play-audio": "Play",
            "pause-audio": "Pause",
            "pause-audio-disabled": "Pause not supported",
            "elapsed-time": "Elasped time",
            "total-time": "Total length of",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound"
        });
});