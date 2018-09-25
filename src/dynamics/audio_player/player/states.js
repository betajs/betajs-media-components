Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function(State, ListenMixin, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, [ListenMixin, {

        dynamics: [],

        _start: function() {
            this.dyn = this.host.dynamic;
            Objs.iter(Objs.extend({
                "loader": false,
                "message": false,
                "controlbar": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this._started();
        },

        _started: function() {},

        play: function() {
            this.dyn.set("autoplay", true);
        }

    }]);
});


Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.FatalError", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],
        _locals: ["message"],

        _started: function() {
            this.dyn.set("message", this._message || this.dyn.string("audio-error"));
        }

    });
});


Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.Initial", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            if (this.dyn.get("ready"))
                this.next("LoadPlayer");
            else {
                this.listenOn(this.dyn, "change:ready", function() {
                    this.next("LoadPlayer");
                });
            }
        }
    });
});


Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.LoadPlayer", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:attach", function() {
                this.next("LoadError");
            }, this);
            this.listenOn(this.dyn, "attached", function() {
                this.next("LoadAudio");
            }, this);
            this.dyn.reattachAudio();
        }

    });
});



Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.LoadError", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("audio-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadPlayer");
            }, this);
        }

    });
});





Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.LoadAudio", [
    "module:AudioPlayer.Dynamics.PlayerStates.State",
    "browser:Info",
    "browser:Dom",
    "base:Timers.Timer"
], function(State, Info, Dom, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:audio", function() {
                this.next("ErrorAudio");
            }, this);
            this.listenOn(this.dyn, "playing", function() {
                if (this.destroyed() || this.dyn.destroyed())
                    return;
                if (this.dyn.get("autoseek"))
                    this.dyn.execute("seek", this.dyn.get("autoseek"));
                this.next("PlayAudio");
            }, this);
            if (!this.dyn.get("autoplay"))
                this.next("PlayAudio");
            else {
                // Mute audio to reference Chrome policy changes after October 2018
                if (Info.isChromiumBased) {
                    var audio = this.dyn.__audio;
                    audio.isMuted = true;
                    Dom.userInteraction(function() {
                        audio.isMuted = false;
                        this._runTimer();
                    }, this);
                } else {
                    this._runTimer();
                }
            }
        },

        _runTimer: function() {
            var counter = 10;
            this.auto_destroy(new Timer({
                context: this,
                fire: function() {
                    if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player)
                        this.dyn.player.play();
                    counter--;
                    if (counter === 0)
                        this.next("PlayAudio");
                },
                delay: 200,
                immediate: true
            }));
        }

    });
});



Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.ErrorAudio", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("audio-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadAudio");
            }, this);
        }

    });
});




Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.PlayAudio", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("autoplay", false);
            this.listenOn(this.dyn, "ended", function() {
                this.dyn.set("autoseek", null);
                this.next("NextAudio");
            }, this);
            this.listenOn(this.dyn, "change:buffering", function() {
                this.dyn.set("loader_active", this.dyn.get("buffering"));
            }, this);
            this.listenOn(this.dyn, "error:audio", function() {
                this.next("ErrorAudio");
            }, this);
        },

        play: function() {
            if (!this.dyn.get("playing"))
                this.dyn.player.play();
        }

    });
});


Scoped.define("module:AudioPlayer.Dynamics.PlayerStates.NextAudio", [
    "module:AudioPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            if (this.dyn.get("playlist")) {
                var list = this.dyn.get("playlist");
                var head = list.shift();
                if (this.dyn.get("loop"))
                    list.push(head);
                this.dyn.set("playlist", list);
                if (list.length > 0) {
                    var pl0 = list[0];
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    this.dyn.trigger("playlist-next", pl0);
                    this.dyn.reattachAudio();
                    this.dyn.set("autoplay", true);
                    this.next("LoadPlayer");
                    return;
                }
            }
            this.next("LoadPlayer");
        }

    });
});