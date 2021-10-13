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
            if (this.dyn.parent()) {
                if (this.dyn.parent().record !== 'undefined' && this.dyn.parent().host !== 'undefined') {
                    this.dyn._isRecorder = true;
                    this.dyn._recorderDyn = this.dyn.parent();
                    this.dyn._recorderHost = this.dyn._recorderDyn.host;
                }
            }
            this._started();
        },

        _started: function() {},

        play: function() {
            this.dyn.set("autoplay", true);
        },

        nextToChooser: function(message) {
            var _dyn = this.dyn;

            if (!_dyn._isRecorder)
                return false;

            if (typeof _dyn._recorderHost.next === 'function') {
                _dyn._recorderHost.next("FatalError", {
                    message: message,
                    retry: "Chooser"
                });
                return true;
            } else
                return false;
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
            this.dyn.set("audioelement_active", false);
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
            if (!this.dyn.get("audioelement_active")) {
                this.listenOn(this.dyn, "error:attach", function() {
                    this.next("LoadError");
                }, this);
                this.listenOn(this.dyn, "attached", function() {
                    this.__loadAudio();
                }, this);
                this.dyn.reattachAudio();
            } else {
                this.__loadAudio();
            }
        },

        __loadAudio: function() {
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
            if (!this.dyn.get("autoplay")) {
                this.next("PlayAudio");
            } else {
                var counter = 10;
                this.auto_destroy(new Timer({
                    context: this,
                    fire: function() {
                        if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player) {
                            try {
                                var promise = this.dyn.player.play();
                                if (promise) {
                                    promise.success(function() {
                                        this.next("PlayAudio");
                                    });
                                }
                            } catch (e) {
                                // browsers released before 2019 may not return promise on play()
                            }
                        }
                        counter--;
                        if (counter === 0)
                            this.next("PlayAudio");
                    },
                    delay: 200,
                    immediate: true
                }));
            }
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
                if (!this.nextToChooser(this.dyn.get("message")))
                    this.next("LoadAudio");
                else
                    this.next("Initial");
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
            // As during loop we will play player after ended event fire, need initial cover will be hidden
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
                var pl0, initialPlaylist;
                var list = this.dyn.get("playlist");
                var head = list.shift();
                this.dyn.get("initialoptions").playlist.push(head);
                if (list.length > 0) {
                    pl0 = list[0];
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    return this._playNext(pl0);
                } else {
                    initialPlaylist = this.dyn.get("initialoptions").playlist;
                    this.dyn.set("lastplaylistitem", true);
                    this.dyn.trigger("last-playlist-item");
                    this.dyn.set("playlist", initialPlaylist);
                    this.dyn.get("initialoptions").playlist = [];

                    pl0 = initialPlaylist[0];
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    if (this.dyn.get("loopall"))
                        return this._playNext(pl0);
                    else
                        this.dyn.reattachAudio();
                }
            } else {
                // If user will set loopall as true, single audio also will be played
                if (this.dyn.get("loopall")) {
                    this.dyn.set("loop", true);
                    this.dyn.set("autoplay", true);
                    this.dyn.reattachAudio();
                }
            }

            this.next("LoadPlayer");
        },

        /**
         * Will start auto play the next play list element
         * @param {object} pl
         * @private
         */
        _playNext: function(pl) {
            this.dyn.trigger("playlist-next", pl);
            this.dyn.set("autoplay", true);
            // this.next("LoadPlayer") will reattach audio which cause twice player bidings
            // as a result old duration is set as a new one;
            this.next("LoadAudio");
        }
    });
});