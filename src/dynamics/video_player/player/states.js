Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function(State, ListenMixin, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, [ListenMixin, {

        dynamics: ["loader"],

        _start: function() {
            this.dyn = this.host.dynamic;
            Objs.iter(Objs.extend({
                "adscontrolbar": false,
                "loader": false,
                "message": false,
                "playbutton": false,
                "controlbar": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            if (this.dyn.parent()) {
                if (this.dyn.parent().record !== undefined && this.dyn.parent().host !== undefined) {
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

        uploadTextTrack: function(file, locale) {
            try {
                this.next('TextTrackUploading', {
                    file: file,
                    locale: locale
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
                // !Don't uncomment will brock host
                // _dyn._recorderDyn.set("player_active", false);
                return true;
            } else
                return false;
        }

    }]);
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.TextTrackUploading", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "browser:Upload.FileUploader",
    "browser:Upload.MultiUploader",
    "browser:Blobs",
    "base:Async",
    "base:Objs"
], function(State, FileUploader, MultiUploader, Blobs, Async, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _locals: ["file", "locale"],
        dynamics: ['text-tracks', 'loading'],

        _started: function() {
            this.uploadTextTrackFile(this._file, this._locale);
        },

        uploadTextTrackFile: function(file, locale) {
            var _dynamics, _uploader, _initialTracks, _counter;
            _dynamics = this.dyn.parent();

            // Check either recorder or player dynamics
            if (typeof _dynamics.record !== 'function') {
                _dynamics = this.dyn;
            }
            _initialTracks = _dynamics.get('tracktags');

            // Get file url
            if (_dynamics.get("uploadoptions")) {
                filename = {
                    url: _dynamics.get("uploadoptions").textTracks
                };
            } else {
                filename = {
                    url: "/text-track/" + file.value.split(/(\\|\/)/g).pop() + "/lang/" + locale.lang + "/label/" + locale.label
                };
            }

            try {
                _uploader = FileUploader.create(Objs.extend({
                    source: file,
                    data: {
                        lang: locale.lang,
                        label: locale.label
                    }
                }, filename));
                _uploader.upload();

                _uploader.on("success", function(response) {
                    _counter = 1;
                    _dynamics.set("tracktags", null);
                    Blobs.loadFileIntoString(file).success(function(content) {
                        response = response.length > 0 ? JSON.parse(response) : {
                            lang: locale.lang,
                            label: locale.label
                        };

                        _initialTracks.push({
                            lang: response.lang,
                            label: response.label,
                            kind: "subtitles",
                            enabled: true,
                            content: content
                        });

                        Objs.iter(_initialTracks, function(value) {
                            if (_counter === _initialTracks.length) {
                                _dynamics.set("tracktags", _initialTracks);
                                this.nextPlayer();
                            }
                            _counter++;
                        }, this);

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
            this.dyn.set("imageelement_active", false);
            this.dyn.set("videoelement_active", false);
            this.dyn.set("adsplayer_active", this.dyn.get("adshassource") && (this.dyn.get("adsplaypreroll") || this.dyn.get("outstream") || this.dyn.get("vmapads")));
            if (this.dyn.get("ready")) {
                this.next("LoadPlayer");
            } else {
                this.listenOn(this.dyn, "change:ready", function() {
                    this.next("LoadPlayer");
                }, this);
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
            if (this.dyn.get("outstream")) {
                this.dyn.set("autoplay", true);
                this.next("Outstream");
            } else {
                this.listenOn(this.dyn, "error:poster", function() {
                    this.next("LoadPlayerDirectly");
                }, this);
                this.listenOn(this.dyn, "image-attached", function() {
                    this.next("PosterReady");
                }, this);
                this.dyn.reattachImage();
            }
        }
    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayerDirectly", [
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
                this.next("Initial");
            }, this);
        }

    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "module:PopupHelper",
    "base:Objs",
    "base:Types",
    "browser:Dom"
], function(State, PopupHelper, Objs, Types, Dom, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["playbutton"],

        _started: function() {
            this.dyn.set("placeholderstyle", "");
            // Will attach video silently without starting playing the video
            if (!this.dyn.get("skipinitial") && this.dyn.get("preload")) {
                this.dyn._attachVideo(true);
            }
            this.dyn.trigger("ready_to_play");
            this.dyn.trigger("loaded");
            this.listenOn(this.dyn, "error:poster", function() {
                if (!this.dyn.get("states").poster_error.ignore && !this.dyn.get("popup"))
                    this.next("PosterError");
            }, this);
            if (this.dyn && (this.dyn.get("skipinitial") && !this.dyn.get("autoplay"))) {
                this.play();
            }
            if (this.dyn && this.dyn.get("autoplay")) {
                if (this.dyn.get("autoplaywhenvisible")) {
                    Dom.onScrollIntoView(this.dyn.activeElement(), this.dyn.get("visibilityfraction"), function() {
                        if (!this.destroyed())
                            this.runAutoplay();
                    }, this);
                } else {
                    this.runAutoplay();
                }
            }
        },

        play: function() {
            if (!this.dyn.get("popup")) {
                if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay")) this.next("LoadVideo");
                else this.next("LoadAds");
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
        },

        runAutoplay: function() {
            // If the ready state launches later
            if (Types.is_defined(this.dyn.get("wait-user-interaction"))) {
                if (this.dyn.get("wait-user-interaction")) {
                    this.dyn.once("user-has-interaction", function() {
                        this.play();
                    }, this);
                } else {
                    this.play();
                }
            } else {
                if (!this.dyn.videoAttached()) this.dyn.reattachVideo();
                this.listenOn(this.dyn, "change:wait-user-interaction", function(wait) {
                    if (wait) {
                        this.dyn.once("user-has-interaction", function() {
                            this.play();
                        }, this);
                    } else {
                        this.play();
                    }
                }, this);
            }
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
            if ((this.dyn.get("skipinitial") && !this.dyn.get("autoplay")) || !(this.dyn.get("adsplaypreroll") || this.dyn.get("vmapads")))
                this.next("LoadVideo");
            else this.next("LoadAds");
        }

    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Outstream", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "browser:Dom"
], function(State, Dom, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: [],

        _started: function() {
            if (!this.dyn.get("adshassource"))
                throw Error("Please provide ad source for the outstream");

            this.listenOn(this.dyn.channel("ads"), "adsManagerLoaded", function() {
                Dom.onScrollIntoView(this.dyn.activeElement(), this.dyn.get("visibilityfraction"), function() {
                    if (!this.destroyed())
                        this.next("LoadAds", {
                            position: 'outstream'
                        });
                }, this);
            });
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadAds", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],
        _locals: ["position"],

        _started: function() {
            if (this.dyn.get("adshassource")) {
                this.dyn.channel("ads").trigger("load");
                this.listenOn(this.dyn.channel("ads"), "loaded", function() {
                    this.next(this._nextState());
                }, this);
                this.listenOn(this.dyn.channel("ads"), "ad-error", function() {
                    this.next(this._nextState());
                }, this);
            } else this.next(this._nextState());
        },

        _nextState: function() {
            if (this._position && this._position === 'outstream')
                return "PlayOutstream";
            if (this.dyn.get("autoplay") || (this._position && this._position === 'mid'))
                return "PlayVideo";
            return "LoadVideo";
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayOutstream", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["adscontrolbar"],

        _started: function() {
            this.dyn._outstreamCompleted = false;
            if (this.dyn.get("sticky")) this.dyn.stickyHandler.start();

            this.dyn.channel("ads").trigger("outstreamStarted", this.dyn);

            this.listenOn(this.dyn.channel("ads"), "allAdsCompleted", function() {
                this.afterAdCompleted();
            }, this);

            /* if this trigger before allAdsCompleted, setTimeout error shows in console
            // In case, if ad contains nonLinear and requests to resume playing the content
            this.listenOn(this.dyn.channel("ads"), "contentResumeRequested", function() {
                this.afterAdCompleted();
            }, this);*/
        },

        afterAdCompleted: function() {
            if (!this.dyn || this.dyn._outstreamCompleted)
                return;
            this.dyn._outstreamCompleted = true;
            this.dyn.trigger("outstream-completed");
            this.dyn.channel("ads").trigger("outstreamCompleted", this.dyn);
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ReloadAds", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "base:Timers.Timer"
], function(State, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            if (this.dyn.get("adshassource") && (this.dyn.get("vmapads") || this.dyn.get("adsplaypostroll"))) {
                // if VAST/VMAP has postroll which was already loaded in advance, so no need for reset
                // In case if we want to launch it manually via settings "adsposition: 'post'" or after re-attach on playlist,
                // then we need reset ads manager and wait for adsManager Loaded
                if (this.dyn.get("adsplaypostroll")) {
                    this.dyn.set("adsplayer_active", true);
                }
                this.listenOn(this.dyn.channel("ads"), "adsManagerLoaded", function() {
                    this.next("LoadAds", {
                        position: 'post'
                    });
                });
                this.listenOn(this.dyn.channel("ads"), "ad-error", function() {
                    this.next("NextVideo");
                });
            } else {
                this.next("NextVideo");
            }
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
    "browser:Info",
    "browser:Dom",
    "base:Timers.Timer"
], function(State, Info, Dom, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn.channel("ads"), "contentPauseRequested", function() {
                this.next("PrerollAd");
            }, this);
            this.dyn.set("hasnext", this.dyn.get("loop") || this.dyn.get("loopall") || this.dyn.get("playlist") && this.dyn.get("playlist").length > 1);
            if (!this.dyn.get("videoelement_active")) {
                this.listenOn(this.dyn, "error:attach", function() {
                    this.next("LoadError");
                }, this);
                this.listenOn(this.dyn, "error:poster", function() {
                    if (!this.dyn.get("states").poster_error.ignore)
                        this.next("PosterError");
                }, this);
                this.listenOn(this.dyn, "attached", function() {
                    this.__loadVideo();
                }, this);
                this.dyn.reattachVideo();
            } else
                this.__loadVideo();
        },

        __loadVideo: function() {
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
            if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay")) {
                this.next("PlayVideo");
            } else {
                var counter = 10;
                this.__started = false;
                this.auto_destroy(new Timer({
                    context: this,
                    fire: function() {
                        if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player && !this.__started) {
                            this.dyn.player.play();
                            this.__started = true;
                        }
                        counter--;
                        if (counter === 0) this.next("PlayVideo");
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
                if (!this.nextToChooser(this.dyn.get("message")))
                    this.next("LoadVideo");
            }, this);
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "base:Objs",
    "base:Timers.Timer"
], function(State, Objs, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("autoplay", false);
            if (this.dyn.get("adshassource")) {
                // As during a loop, we will play player after ended event fire, need initial cover will be hidden
                this.listenOn(this.dyn.channel("ads"), "contentPauseRequested", function() {
                    this.dyn.pause();
                    var position = this.dyn.getCurrentPosition();
                    if (position === 0) {
                        this.next("PrerollAd");
                    } else {
                        if (Math.abs(this.dyn.getCurrentPosition() - this.dyn.get("duration")) < 0.1) {
                            this.next("PostrollAd");
                        } else this.next("MidrollAd");
                    }
                }, this);

                this.listenOn(this.dyn, "playnextmidroll", function() {
                    if (!this.dyn.get("adsplayer_active")) {
                        this.dyn.set("adsplayer_active", true);
                    }
                    // INFO: could be improved via using reset, but currently it's providing some console errors on reset execution
                    // this.next("ReloadAds", { hard: true });
                    this.listenOnce(this.dyn.channel("ads"), "adsManagerLoaded", function() {
                        this.next("LoadAds", {
                            position: 'mid'
                        });
                    });
                }, this);
            }
            if (this.dyn.get("loop"))
                this.dyn.set("skipinitial", true);
            this.listenOn(this.dyn, "change:currentstream", function() {
                this.dyn.set("autoplay", true);
                this.dyn.set("autoseek", this.dyn.player.position());
                this.dyn.reattachVideo();
                this.next("LoadPlayer");
            }, this);
            this.listenOn(this.dyn, "ended", function() {
                this.dyn.set("autoseek", null);
                this.dyn.channel("ads").trigger("contentComplete");
                // waiting a bit for postroll
                this.auto_destroy(new Timer({
                    once: true,
                    fire: function() {
                        this.next("ReloadAds"); // << if no adshassource, redirect to the NextVideo
                    }.bind(this),
                    delay: 50
                }));
            }, this);
            this.listenOn(this.dyn, "change:buffering", function() {
                this.dyn.set("loader_active", this.dyn.get("buffering"));
            }, this);
            this.listenOn(this.dyn, "error:video", function() {
                this.next("ErrorVideo");
            }, this);
        },

        play: function() {
            if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay") && this.dyn.get("adshassource") && this.dyn.get("position") === 0) {
                // w/o position === 0 condition player will reload on toggle player
                this.next("LoadAds");
            } else {
                this.dyn.player.play();
            }
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayAd", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["adscontrolbar"],

        _started: function() {
            if (this.state_name() === "PlayAd")
                throw Error("PlayAd should be an abstract state.");
            this._showbuiltincontroller = this.dyn.get("showbuiltincontroller");
            this.dyn.set("showbuiltincontroller", true);
            this.listenOn(this.dyn, "playing", function() {
                this.dyn.player.pause();
            }, this);
            this.listenOn(this.dyn.channel("ads"), "contentResumeRequested", function() {
                this.dyn.set("showbuiltincontroller", this._showbuiltincontroller);
                this.resume();
            }, this);
        },

        resume: function() {
            if (this.dyn && this.dyn.player)
                this.dyn.player.play();
            this.next("PlayVideo");
        }
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PrerollAd", [
    "module:VideoPlayer.Dynamics.PlayerStates.PlayAd"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            _started: function() {
                if (this.dyn.get("sticky"))
                    this.dyn.stickyHandler.start();
                inherited._started.call(this);
            }
        };
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.MidrollAd", [
    "module:VideoPlayer.Dynamics.PlayerStates.PlayAd"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    });
});

Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PostrollAd", [
    "module:VideoPlayer.Dynamics.PlayerStates.PlayAd"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {
        resume: function() {
            this.dyn.set("adsplayer_active", false);
            this.next("NextVideo");
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
            if (this.dyn.get("playlist") && this.dyn.get("playlist").length > 0) {
                var pl0, initialPlaylist;
                var list = this.dyn.get("playlist");
                var head = list.shift();
                this.dyn.get("initialoptions").playlist.push(head);
                this.dyn.set("passed-quarter", 0);
                this.dyn.set("played-seconds", 0);
                this.dyn.set("last-played-position", 0);
                if (list.length > 0) {
                    pl0 = list[0];
                    this.dyn.set("poster", pl0.poster);
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    this.dyn.set("hasnext", this.dyn.get("loop") || this.dyn.get("loopall") || list.length > 1);
                    return this._playNext(pl0);
                } else {
                    initialPlaylist = this.dyn.get("initialoptions").playlist;
                    this.dyn.set("lastplaylistitem", true);
                    this.dyn.set("hasnext", this.dyn.get("loop") || this.dyn.get("loopall") || initialPlaylist.length > 1);
                    this.dyn.trigger("last-playlist-item");
                    this.dyn.set("playlist", initialPlaylist);
                    this.dyn.get("initialoptions").playlist = [];

                    pl0 = initialPlaylist[0];
                    this.dyn.set("poster", pl0.poster);
                    this.dyn.set("source", pl0.source);
                    this.dyn.set("sources", pl0.sources);
                    if (this.dyn.get("loopall")) {
                        return this._playNext(pl0);
                    } else {
                        this.dyn.reattachVideo();
                    }
                }
            } else {
                // If a user set loopall as true, a single video also be played
                if (this.dyn.get("loopall")) {
                    this.dyn.set("loop", true);
                    this.dyn.set("autoplay", true);
                    this.dyn.reattachVideo();
                }
            }

            this.next("LoadVideo");
        },

        /**
         * Will start autoplay the next play list element
         * @param {object} pl
         * @private
         */
        _playNext: function(pl) {
            this.dyn.trigger("playlist-next", pl);
            if (this.dyn.get("adshassource")) {
                this.dyn.initAdSources();
                this.dyn.reattachVideo();
                this.dyn.set("autoplay", true);
                this.dyn.set("adsplayer_active", true);
                this.next("Preroll");
            } else {
                this.next("LoadPlayerDirectly");
            }
        }
    });
});