Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
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
                "playbutton": false,
                "controlbar": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this._started();
        },

        _started: function() {},

        play: function() {
            this.dyn.set("autoplay", true);
        },

        uploadTextTrack: function(file) {
            try {
                this.next('TextTrackUploading', {
                    file: file
                });
            } catch (e) {
                console.warn("Error switch to text track uploading state. Message: ", e);
                this.nextPlayer();
            }
        },

        nextPlayer: function() {
            var _recorder = this.dyn.parent();
            if (typeof _recorder.record === 'function')
                _recorder.host.state().next("Player");
            else
                this.next("LoadPlayer");
        }
    }]);
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.TextTrackUploading", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "browser:Upload.FileUploader",
    "browser:Upload.MultiUploader",
    "base:Async",
    "base:Objs"
], function(State, FileUploader, MultiUploader, Async, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _locals: ["file"],
        dynamics: ['text-tracks', 'loading'],

        _started: function() {
            this.uploadTextTrackFile(this._file);
        },

        uploadTextTrackFile: function(file) {
            var _dynamics, _dataUploader, _uploader, _tracks, _player;
            _dynamics = this.dyn.parent();

            // Check either recoder or player dynamics
            if (typeof _dynamics.record !== 'function') {
                _dynamics = this.dyn;
            }
            // Set player
            // _player = _dynamics.player || this.dyn.player;

            // Get file url
            if (_dynamics.get("uploadoptions")) {
                filename = _dynamics.get("uploadoptions").textTracks;
                _dataUploader = _dynamics._dataUploader;
            } else {
                filename = "/text-track/" + file.value.split(/(\\|\/)/g).pop();
                _dataUploader = new MultiUploader();
            }

            try {
                _uploader = FileUploader.create(Objs.extend({
                    source: file
                }, filename));
                _uploader.upload();
                //_dataUploader.addUploader(_uploader);

                _uploader.on("success", function(response) {
                    Async.eventually(function() {
                        _tracks = _dynamics.get("tracktags") || [];
                        response = response.length > 0 ? JSON.parse(response) : {
                            lang: 'en',
                            label: 'English'
                        };
                        _tracks.push({
                            lang: response.lang,
                            label: response.label,
                            enabled: true,
                            src: _uploader._options.url
                        });
                        _dynamics.set("tracktags", _tracks);

                        this.nextPlayer();

                    }, this);
                }, this);

                _uploader.on("error", function(e) {
                    var bestError = _dynamics.string("uploading-failed");
                    try {
                        e.forEach(function(ee) {
                            for (var key in ee)
                                if (_dynamics.string("upload-error-" + key))
                                    bestError = this.dyn.string("upload-error-" + key);
                        }, this);
                    } catch (err) {}
                    _dynamics.set("player_active", false);
                    this.next("FatalError", {
                        message: bestError,
                        retry: "Player"
                    });
                }, this);

                _uploader.on("progress", function(uploaded, total) {

                }, this);

            } catch (e) {
                console.warn('Error occurred during uploading text track files. Message: ', e);
            }
        }
    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],
        _locals: ["message"],

        _started: function() {
            this.dyn.set("message", this._message || this.dyn.string("video-error"));
        }

    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
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


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:attach", function() {
                this.next("LoadError");
            }, this);
            this.listenOn(this.dyn, "error:poster", function() {
                if (!this.dyn.get("states").poster_error.ignore)
                    this.next("PosterError");
            }, this);
            this.listenOn(this.dyn, "attached", function() {
                this.next("PosterReady");
            }, this);
            this.dyn.reattachVideo();
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadPlayer");
            }, this);
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "module:PopupHelper",
    "base:Objs"
], function(State, PopupHelper, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["playbutton"],

        _started: function() {
            this.listenOn(this.dyn, "error:poster", function() {
                if (!this.dyn.get("states").poster_error.ignore)
                    this.next("PosterError");
            }, this);
            if (this.dyn.get("autoplay") || this.dyn.get("skipinitial"))
                this.play();
        },

        play: function() {
            if (!this.dyn.get("popup")) {
                this.next("Preroll");
                return;
            }
            var popup = this.auto_destroy(new PopupHelper());
            var dynamic = this.auto_destroy(new this.dyn.cls({
                element: popup.containerInner,
                attrs: Objs.extend(this.dyn.cloneAttrs(), this.dyn.popupAttrs())
            }));
            this._delegatedPlayer = dynamic;
            this.dyn.delegateEvents(null, dynamic);
            popup.on("hide", function() {
                this._delegatedPlayer = null;
                dynamic.destroy();
                popup.destroy();
            }, this);
            popup.show();
            dynamic.activate();
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Preroll", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: [],

        _started: function() {
            if (this.dyn._prerollAd) {
                this.dyn._prerollAd.once("finished", function() {
                    this.next("LoadVideo");
                }, this);
                this.dyn._prerollAd.once("adskipped", function() {
                    this.next("LoadVideo");
                }, this);
                // TODO: video height and width return NaN before ad start even when ba-width/ba-height are provided
                this.dyn._prerollAd.executeAd({
                    width: this.dyn.videoWidth(),
                    height: this.dyn.videoHeight()
                });
            } else
                this.next("LoadVideo");
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
            }, this);
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "base:Timers.Timer"
], function(State, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:video", function() {
                this.next("ErrorVideo");
            }, this);
            this.listenOn(this.dyn, "playing", function() {
                if (this.destroyed() || this.dyn.destroyed())
                    return;
                if (this.dyn.get("autoseek"))
                    this.dyn.execute("seek", this.dyn.get("autoseek"));
                this.next("PlayVideo");
            }, this);
            if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay"))
                this.next("PlayVideo");
            else {
                var counter = 10;
                this.auto_destroy(new Timer({
                    context: this,
                    fire: function() {
                        if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player)
                            this.dyn.player.play();
                        counter--;
                        if (counter === 0)
                            this.next("PlayVideo");
                    },
                    delay: 200,
                    immediate: true
                }));
            }
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadVideo");
            }, this);
        }

    });
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("autoplay", false);
            this.listenOn(this.dyn, "change:currentstream", function() {
                this.dyn.set("autoplay", true);
                this.dyn.set("autoseek", this.dyn.player.position());
                this.dyn.reattachVideo();
                this.next("LoadPlayer");
            }, this);
            this.listenOn(this.dyn, "ended", function() {
                this.dyn.set("autoseek", null);
                this.next("NextVideo");
            }, this);
            this.listenOn(this.dyn, "change:buffering", function() {
                this.dyn.set("loader_active", this.dyn.get("buffering"));
            }, this);
            this.listenOn(this.dyn, "error:video", function() {
                this.next("ErrorVideo");
            }, this);
        },

        play: function() {
            if (!this.dyn.get("playing"))
                this.dyn.player.play();
        }

    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.NextVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
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
                    this.dyn.set("poster", pl0.poster);
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    this.dyn.trigger("playlist-next", pl0);
                    this.dyn.reattachVideo();
                    this.dyn.set("autoplay", true);
                    this.next("LoadPlayer");
                    return;
                }
            }
            this.next("PosterReady");
        }

    });
});