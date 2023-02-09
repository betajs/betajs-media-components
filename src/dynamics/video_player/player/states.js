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
        },

        executeAd: function(instanceKey, next) {
            var adInstance = this.dyn[instanceKey];
            if (!adInstance) return this.next(next);
            this.dyn._adsRoll = adInstance;

            adInstance.once("adloaded", function(ad) {
                if (typeof ad !== "undefined") {
                    // If ad type is non-linear like image banner needs to load video
                    if (!ad.isLinear()) {
                        this.next(next);
                    }
                }
            }, this);

            adInstance.on("adfinished", function(dyn) {
                dyn = this.dyn || dyn;
                if (dyn) {
                    if (typeof dyn._adsRoll.__cid !== "undefined") dyn._adsRoll.weakDestroy();
                    dyn._adsRoll = null;
                    if (dyn[instanceKey]) {
                        if (adInstance) adInstance.weakDestroy();
                        dyn[instanceKey] = null;
                        if (next) this.next(next);
                    }
                } else {
                    console.error("Error not be able get DYN instance on manually end event");
                }
            }, this);

            adInstance.once("adskipped", function() {
                this.dyn._adsRoll = null;
                if (this.dyn[instanceKey]) {
                    this.dyn[instanceKey] = null;
                    if (adInstance) adInstance.weakDestroy();
                    if (next) this.next(next);
                }
            }, this);

            adInstance.once("adcontentResumeRequested", function(ad) {
                if (next) this.next(next);
            }, this);

            adInstance.once("adendmanually", function(ad, dyn) {
                dyn = this.dyn || dyn;
                if (dyn) {
                    if (dyn[instanceKey] && dyn._adsRoll) {
                        if (typeof dyn._adsRoll.__cid !== "undefined")
                            dyn._adsRoll.weakDestroy();
                        dyn._adsRoll = null;
                    }
                    if (!dyn.get("playing") && !dyn.get("manuallypaused") && ad.isLinear()) {
                        console.warn("INS Sp pl ");
                        dyn.player.play();
                    }
                } else {
                    console.error("Error not be able get DYN instance on manually end event");
                }
            }, this);

            adInstance.once("ad-error", function(message) {
                console.error('Error during loading an ' + instanceKey + ' ad. Details: "' + message + '".');
                this.dyn._adsRoll = null;
                if (this.dyn[instanceKey]) {
                    this.dyn[instanceKey] = null;
                    if (adInstance) adInstance.weakDestroy();
                    if (next) this.next(next);
                }
            }, this);

            // TODO: video height and width return NaN before ad start even when ba-width/ba-height are provided
            adInstance.executeAd({
                width: this.dyn.parentWidth() || this.dyn.videoWidth(),
                height: this.dyn.parentHeight() || this.dyn.videoHeight(),
                autoplayAllowed: this.dyn.get("autoplay-allowed"),
                autoplayRequiresMuted: this.dyn.get("autoplay-requires-muted")
            });
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
            if (this.dyn.get("ready")) {
                this.next("LoadPlayer");
            } else {
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
            this.listenOn(this.dyn, "error:poster", function() {
                this.next("LoadPlayerDirectly");
            }, this);
            this.listenOn(this.dyn, "image-attached", function() {
                this.next("PosterReady");
            }, this);
            this.dyn.reattachImage();
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
    "base:Types"
], function(State, PopupHelper, Objs, Types, scoped) {
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
            if (this.dyn && ((this.dyn.get("skipinitial") && !this.dyn.get("autoplay")) || this.dyn.get("play-next"))) {
                this.play();
            }
            if (this.dyn.get("autoplay")) this.runAutoplay();
        },

        play: function() {
            this.dyn.set("silent_attach", false);
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
                });
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
            if (this.dyn.get("adprovider") && !this.dyn.get("ad-provider-ready")) {
                this.dyn.once("change:ad-provider-ready", this._started, this);
                return;
            }
            if (this.dyn._prerollAd /* && !(this.dyn.get("autoplay") || this.dyn.get("skipinitial"))*/ ) {
                if (!this.dyn.videoAttached()) this.dyn.reattachVideo();
                this.executeAd('_prerollAd', "LoadVideo");
            } else {
                this.next("LoadVideo");
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
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("autoplay", false);
            // As during a loop we will play player after ended event fire, need initial cover will be hidden
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
                if (this.dyn._postrollAd)
                    this.executeAd("_postrollAd", "NextVideo");
                else
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
            console.timeStamp('IS play inside PlayerStates.PlayVideo');
            // Will execute on, skip initial
            if (this.dyn.get("position") === 0 && this.dyn._prerollAd && (this.dyn.get("autoplay") || this.dyn.get("skipinitial"))) {
                this.executeAd('_prerollAd');
            }
            if (!this.dyn.get("playing")) {
                this.dyn.player.play();
            }
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
            this.next("PosterReady");
        },

        /**
         * Will start autoplay the next play list element
         * @param {object} pl
         * @private
         */
        _playNext: function(pl) {
            if (this.dyn.get("adprovider")) this.dyn.initAdProvider();
            this.dyn.trigger("playlist-next", pl);
            // this.dyn.reattachVideo();
            this.dyn.set("play-next", true);
            this.next("LoadPlayerDirectly");
        }
    });
});
