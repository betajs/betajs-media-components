Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "media:Player.VideoPlayerWrapper",
    "media:Player.Broadcasting",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates",
    "module:Ads.AbstractVideoAdProvider",
    "browser:Events"
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Share",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial"
], function(Class, Assets, Info, Dom, VideoPlayerWrapper, Broadcasting, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, AdProvider, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-videoplayer",
                    "iecss": "ba-videoplayer",
                    "cssplaybutton": "",
                    "cssloader": "",
                    "cssmessage": "",
                    "csstopmessage": "",
                    "csscontrolbar": "",
                    "width": "",
                    "height": "",
                    /* Themes */
                    "theme": "",
                    "csstheme": "",
                    "themecolor": "",
                    /* Dynamics */
                    "dynplaybutton": "videoplayer-playbutton",
                    "dynloader": "videoplayer-loader",
                    "dynmessage": "videoplayer-message",
                    "dyntopmessage": "videoplayer-topmessage",
                    "dyncontrolbar": "videoplayer-controlbar",
                    "dynshare": "videoplayer-share",
                    /* Templates */
                    "tmplplaybutton": "",
                    "tmplloader": "",
                    "tmplmessage": "",
                    "tmplshare": "",
                    "tmpltopmessage": "",
                    "tmplcontrolbar": "",
                    /* Attributes */
                    "poster": "",
                    "source": "",
                    "sources": [],
                    "sourcefilter": {},
                    "streams": [],
                    "currentstream": null,
                    "playlist": null,
                    "volume": 1.0,
                    "title": "",
                    "initialseek": null,
                    "fullscreened": false,
                    "sharevideo": [],
                    "sharevideourl": "",
                    "visibilityfraction": 0.8,

                    /* Configuration */
                    "forceflash": false,
                    "noflash": false,
                    "reloadonplay": false,
                    "playonclick": true,
                    /* Ads */
                    "adprovider": null,
                    "preroll": false,
                    /* Options */
                    "rerecordable": false,
                    "submittable": false,
                    "autoplay": false,
                    "preload": false,
                    "loop": false,
                    "nofullscreen": false,
                    "playfullscreenonmobile": false,
                    "ready": true,
                    "stretch": false,
                    "volumeafterinteraction": false,
                    "hideoninactivity": true,
                    "skipinitial": false,
                    "topmessage": "",
                    "totalduration": null,
                    "playwhenvisible": false,
                    "playedonce": false,
                    "manuallypaused": false,
                    "disablepause": false,
                    "disableseeking": false,
                    "airplay": false,
                    "airplaybuttonvisible": false,
                    "airplaydevicesavailable": false,
                    "chromecast": false,
                    "castbuttonvisble": false,

                    /* States */
                    "states": {
                        "poster_error": {
                            "ignore": false,
                            "click_play": true
                        }
                    }
                },

                types: {
                    "forceflash": "boolean",
                    "noflash": "boolean",
                    "rerecordable": "boolean",
                    "loop": "boolean",
                    "autoplay": "boolean",
                    "preload": "boolean",
                    "ready": "boolean",
                    "nofullscreen": "boolean",
                    "stretch": "boolean",
                    "preroll": "boolean",
                    "hideoninactivity": "boolean",
                    "skipinitial": "boolean",
                    "volume": "float",
                    "initialseek": "float",
                    "fullscreened": "boolean",
                    "sharevideo": "array",
                    "sharevideourl": "string",
                    "playfullscreenonmobile": "boolean",
                    "themecolor": "string",
                    "totalduration": "float",
                    "playwhenvisible": "boolean",
                    "playedonce": "boolean",
                    "manuallypaused": "boolean",
                    "disablepause": "boolean",
                    "disableseeking": "boolean",
                    "playonclick": "boolean",
                    "airplay": "boolean",
                    "airplaybuttonvisible": "boolean",
                    "chromecast": "boolean",
                    "castbuttonvisble": "boolean"
                },

                extendables: ["states"],

                computed: {
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
                        return result;
                    },
                    "buffering:buffered,position,last_position_change_delta,playing": function() {
                        return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    if (Info.isMobile() && (this.get("autoplay") || this.get("playwhenvisible"))) {
                        this.set("volume", 0.0);
                        this.set("volumeafterinteraction", true);
                        if (!(Info.isiOS() && Info.iOSversion().major >= 10)) {
                            this.set("autoplay", false);
                            this.set("loop", false);
                        }
                    }

                    if (this.get("theme") in Assets.playerthemes) {
                        Objs.iter(Assets.playerthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }

                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

                    if (this.get("adprovider")) {
                        this._adProvider = this.get("adprovider");
                        if (Types.is_string(this._adProvider))
                            this._adProvider = AdProvider.registry[this._adProvider];
                    }
                    if (this.get("playlist")) {
                        var pl0 = (this.get("playlist"))[0];
                        this.set("poster", pl0.poster);
                        this.set("source", pl0.source);
                        this.set("sources", pl0.sources);
                    }
                    if (this.get("streams") && !this.get("currentstream"))
                        this.set("currentstream", (this.get("streams"))[0]);

                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("firefox", Info.isFirefox());
                    this.set("duration", this.get("totalduration") || 0.0);
                    this.set("position", 0.0);
                    this.set("buffered", 0.0);
                    this.set("message", "");
                    this.set("fullscreensupport", false);
                    this.set("csssize", "normal");

                    this.set("loader_active", false);
                    this.set("playbutton_active", false);
                    this.set("controlbar_active", false);
                    this.set("message_active", false);

                    this.set("last_activity", Time.now());
                    this.set("activity_delta", 0);

                    this.set("playing", false);

                    this.__attachRequested = false;
                    this.__activated = false;
                    this.__error = null;
                    this.__currentStretch = null;

                    this.on("change:stretch", function() {
                        this._updateStretch();
                    }, this);
                    this.host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.playerStates())
                    });
                    this.host.dynamic = this;
                    this.host.initialize(InitialState);

                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 100,
                        start: true
                    });
                },

                state: function() {
                    return this.host.state();
                },

                videoAttached: function() {
                    return !!this.player;
                },

                videoLoaded: function() {
                    return this.videoAttached() && this.player.loaded();
                },

                videoError: function() {
                    return this.__error;
                },

                _error: function(error_type, error_code) {
                    this.__error = {
                        error_type: error_type,
                        error_code: error_code
                    };
                    this.trigger("error:" + error_type, error_code);
                    this.trigger("error", error_type, error_code);
                },

                _clearError: function() {
                    this.__error = null;
                },

                _detachVideo: function() {
                    this.set("playing", false);
                    if (this.player)
                        this.player.weakDestroy();
                    if (this._prerollAd)
                        this._prerollAd.weakDestroy();
                    this.player = null;
                },

                _attachVideo: function() {
                    if (this.videoAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.__attachRequested = false;
                    var video = this.activeElement().querySelector("[data-video='video']");
                    this._clearError();
                    VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: video,
                        forceflash: !!this.get("forceflash"),
                        noflash: !!this.get("noflash"),
                        preload: !!this.get("preload"),
                        loop: !!this.get("loop"),
                        reloadonplay: this.get('playlist') ? true : !!this.get("reloadonplay")
                    })).error(function(e) {
                        if (this.destroyed())
                            return;
                        this._error("attach", e);
                    }, this).success(function(instance) {
                        if (this.destroyed())
                            return;
                        if (this._adProvider && this.get("preroll")) {
                            this._prerollAd = this._adProvider.newPrerollAd({
                                videoElement: this.activeElement().querySelector("[data-video='video']"),
                                adElement: this.activeElement().querySelector("[data-video='ad']"),
                                dynamic: this
                            });
                        }
                        this.player = instance;

                        if (this.get("chromecast") || this.get("aiplay")) {
                            if (!this.get("skipinitial")) this.set("skipinitial", true);
                            this._broadcasting = new Broadcasting({
                                player: instance,
                                commonOptions: {
                                    title: this.get("title"),
                                    poster: this.player._element.poster,
                                    currentPosition: this.get("position")
                                },
                                castOptions: {
                                    canControlVolume: true,
                                    canPause: !this.get("disablepause"),
                                    canSeek: !this.get("disableseeking"),
                                    displayName: this.get("title"),
                                    //displayStatus: "Please wait connecting",
                                    duration: this.get("duration"),
                                    imageUrl: this.player._element.poster,
                                    isConnected: this.player._broadcastingState.googleCastConnected,
                                    isMuted: false,
                                    isPaused: !this.get("playing")
                                },
                                airplayOptions: {}
                            });
                            if (Info.isChrome() && this.get("chromecast")) {
                                this._broadcasting.attachGoggleCast();
                                this.player.on("cast-available", function(isCastDeviceAvailable) {
                                    this.set("castbuttonvisble", isCastDeviceAvailable);
                                }, this);
                                this.player.on("cast-loaded", function(castRemotePlayer, castRemotePlayerController) {
                                    //castRemotePlayer.currentMediaDuration = this.player;

                                    // If player already start to play
                                    if (this.get("position") > 0) {
                                        this._broadcasting.options.currentPosition = this.get("position");
                                    }

                                    //If local player playing stop it before
                                    if (this.get('playing')) this.stop();

                                    // Intial play button state
                                    if (!castRemotePlayer.isPaused) this.set('playing', true);

                                }, this);

                                this.player.on("cast-playpause", function(castPaused) {
                                    this.set("playing", !castPaused);
                                }, this);

                                this.player.on("cast-time-changed", function(currentTime, totalMediaDuration) {
                                    var position = Math.round(currentTime / totalMediaDuration * 100);
                                    this.set("buffered", totalMediaDuration);
                                    this.set("cahched", totalMediaDuration);
                                    this.set("duration", totalMediaDuration || 0.0);
                                    this.set("position", currentTime);
                                }, this);

                                this.player.on("proceed-when-ending-googlecast", function(position) {
                                    this.player._broadcastingState.googleCastConnected = false;
                                    this.set('playing', false);
                                }, this);

                            }
                            if (Info.isSafari() && Info.safariVersion() >= 9 && window.WebKitPlaybackTargetAvailabilityEvent && this.get("airplay")) {
                                this.set("airplaybuttonvisible", true);
                                this._broadcasting.attachAirplayEvent.call(this, video);
                            }
                        }

                        if (this.get("playwhenvisible")) {
                            var _self;
                            _self = this;
                            this.set("skipinitial", true);
                            if (Dom.isElementVisible(video, this.get("visibilityfraction"))) {
                                this.player.play();
                            }

                            this._visiblityScrollEvent = this.auto_destroy(new DomEvents());
                            this._visiblityScrollEvent.on(document, "scroll", function() {
                                if (!_self.get('playedonce') && !_self.get("manuallypaused")) {
                                    if (Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                                        _self.player.play();
                                    } else if (_self.get("playing")) {
                                        _self.player.pause();
                                    }
                                } else if (_self.get("playing") && !Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                                    _self.player.pause();
                                }
                            });
                        }
                        this.player.on("fullscreen-change", function(inFullscreen) {
                            this.set("fullscreened", inFullscreen);
                        }, this);
                        this.player.on("postererror", function() {
                            this._error("poster");
                        }, this);
                        this.player.on("playing", function() {
                            this.set("playing", true);
                            this.trigger("playing");
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("video", e);
                        }, this);
                        if (this.player.error())
                            this.player.trigger("error", this.player.error());
                        this.player.on("paused", function() {
                            this.set("playing", false);
                            this.trigger("paused");
                        }, this);
                        this.player.on("ended", function() {
                            this.set("playing", false);
                            this.set('playedonce', true);
                            this.trigger("ended");
                        }, this);
                        this.trigger("attached", instance);
                        this.player.once("loaded", function() {
                            var volume = Math.min(1.0, this.get("volume"));
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0.0);
                            this.trigger("loaded");
                            this.trigger("ready_to_play");
                            if (this.get("totalduration") || this.player.duration() < Infinity)
                                this.set("duration", this.get("totalduration") || this.player.duration());
                            this.set("fullscreensupport", this.player.supportsFullscreen());
                            this._updateStretch();
                            if (this.get("initialseek"))
                                this.player.setPosition(this.get("initialseek"));
                        }, this);
                        if (this.player.loaded())
                            this.player.trigger("loaded");
                        this._updateStretch();
                    }, this);
                },

                _getSources: function() {
                    var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
                    var poster = this.get("poster");
                    var source = this.get("source");
                    var sources = filter ? Objs.filter(this.get("sources"), function(source) {
                        return Objs.subset_of(filter, source);
                    }, this) : this.get("sources");
                    Objs.iter(sources, function(s) {
                        if (s.poster)
                            poster = s.poster;
                    });
                    return {
                        poster: poster,
                        source: source,
                        sources: sources
                    };
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachVideo();
                },

                /* In the feature if require to use promise player, Supports >Chrome50, >FireFox53
                _playWithPromise: function(dyn) {
                    var _player, _promise, _autoplayAllowed;
                    _player = dyn.player;
                    _autoplayAllowed = true;
                    if (_player._element)
                        _promise = _player._element.play();
                    else
                        _player.play();

                    if (_promise !== 'undefined' && !Info.isInternetExplorer()) {
                        _promise["catch"](function(err) {
                            // here can add some interaction like inform user to change settings in chrome://flags disable-gesture-requirement-for-media-playback
                            if (err.name === 'NotAllowedError')
                                _autoplayAllowed = false;
                            // Will try to run play anyway
                            _player.play();
                        });
                        _promise.then(function() {
                            if(_autoplayAllowed) {
                                // Inform user with UI that device is not allowed to play without interaction
                            }
                        });
                    } else if (!dyn.get("playing")) {
                        _player.play();
                    }
                }, */

                reattachVideo: function() {
                    this.set("reloadonplay", true);
                    this._detachVideo();
                    this._attachVideo();
                },

                object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],

                functions: {

                    user_activity: function(strong) {
                        this.set("last_activity", Time.now());
                        this.set("activity_delta", 0);
                        if (strong && this.get("volumeafterinteraction")) {
                            this.set_volume(1.0);
                        }
                    },

                    message_click: function() {
                        this.trigger("message:click");
                    },

                    playbutton_click: function() {
                        this.host.state().play();
                    },

                    play: function() {
                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("play-google-cast");
                            return;
                        }
                        this.host.state().play();
                    },

                    rerecord: function() {
                        if (!this.get("rerecordable"))
                            return;
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        if (!this.get("submittable"))
                            return;
                        this.trigger("submit");
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                    },

                    pause: function() {

                        if (this.get('disablepause')) return;

                        if (this.get("playing")) {
                            if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                                this._broadcasting.player.trigger("pause-google-cast");
                                return;
                            }
                            this.player.pause();
                        }

                        if (this.get("playwhenvisible"))
                            this.set("manuallypaused", true);
                    },

                    stop: function() {
                        if (!this.videoLoaded())
                            return;
                        if (this.get("playing"))
                            this.player.pause();
                        this.player.setPosition(0);
                        this.trigger("stopped");
                    },

                    seek: function(position) {
                        if (this.get('disableseeking')) return;
                        if (this.videoLoaded())
                            this.player.setPosition(position);
                        this.trigger("seek", position);
                    },

                    set_volume: function(volume) {
                        volume = Math.min(1.0, volume);

                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("change-google-cast-volume", volume);
                        }

                        this.set("volume", volume);
                        if (this.videoLoaded()) {
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0);
                        }
                    },

                    toggle_fullscreen: function() {
                        if (this.get("fullscreened"))
                            this.player.exitFullscreen();
                        else
                            this.player.enterFullscreen();
                        this.set("fullscreened", !this.get("fullscreened"));
                    },

                    toggle_player: function() {
                        if (!this.get("playonclick"))
                            return;
                        if (this.get('playing') && !this.get("disablepause")) {
                            if (!this.get("volumeafterinteraction"))
                                this.pause();
                            else
                                this.set("volumeafterinteraction", false);

                            if (this.get("playwhenvisible"))
                                this.set("manuallypaused", true);
                        } else
                            this.play();
                    }

                },

                destroy: function() {
                    this._timer.destroy();
                    this.host.destroy();
                    this._detachVideo();
                    inherited.destroy.call(this);
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        if (this.videoLoaded()) {
                            this.set("activity_delta", Time.now() - this.get("last_activity"));
                            var new_position = this.player.position();
                            if (new_position != this.get("position") || this.get("last_position_change"))
                                this.set("last_position_change", Time.now());
                            this.set("last_position_change_delta", Time.now() - this.get("last_position_change"));
                            this.set("position", new_position);
                            this.set("buffered", this.player.buffered());
                            var pld = this.player.duration();
                            if (0.0 < pld && pld < Infinity)
                                this.set("duration", this.player.duration());
                            else
                                this.set("duration", this.get("totalduration") || new_position);
                            this.set("fullscreened", this.player.isFullscreen());
                        }
                    } catch (e) {}
                    try {
                        this._updateStretch();
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                videoHeight: function() {
                    return this.videoAttached() ? this.player.videoHeight() : NaN;
                },

                videoWidth: function() {
                    return this.videoAttached() ? this.player.videoWidth() : NaN;
                },

                aspectRatio: function() {
                    return this.videoWidth() / this.videoHeight();
                },

                parentWidth: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).width;
                },

                parentHeight: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                _updateStretch: function() {
                    var newStretch = null;
                    if (this.get("stretch")) {
                        var ar = this.aspectRatio();
                        if (isFinite(ar)) {
                            var par = this.parentAspectRatio();
                            if (isFinite(par)) {
                                if (par > ar)
                                    newStretch = "height";
                                if (par < ar)
                                    newStretch = "width";
                            } else if (par === Infinity)
                                newStretch = "height";
                        }
                    }
                    if (this.__currentStretch !== newStretch) {
                        if (this.__currentStretch)
                            Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
                        if (newStretch)
                            Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
                    }
                    this.__currentStretch = newStretch;
                }

            };
        }, {

            playerStates: function() {
                return [PlayerStates];
            }

        }).register("ba-videoplayer")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/player.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "video-error": "An error occurred, please try again later. Click to retry."
        });
});