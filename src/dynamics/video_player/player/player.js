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
    "base:Async",
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
    "module:VideoPlayer.Dynamics.Tracks",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, Info, Dom, VideoPlayerWrapper, Broadcasting, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Async, InitialState, PlayerStates, AdProvider, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-videoplayer",
                    "iecss": "ba-videoplayer",
                    "cssplaybutton": "ba-videoplayer-playbutton",
                    "cssloader": "",
                    "cssmessage": "",
                    "csstopmessage": "",
                    "csscontrolbar": "",
                    "csstracks": "",
                    "width": "",
                    "height": "",
                    "popup-width": "",
                    "popup-height": "",
                    /* Themes */
                    "theme": "ba-videoplayer",
                    "csstheme": "",
                    "themecolor": "",
                    /* Dynamics */
                    "dynplaybutton": "videoplayer-playbutton",
                    "dynloader": "videoplayer-loader",
                    "dynmessage": "videoplayer-message",
                    "dyntopmessage": "videoplayer-topmessage",
                    "dyncontrolbar": "videoplayer-controlbar",
                    "dynshare": "videoplayer-share",
                    "dyntracks": "videoplayer-tracks",
                    /* Templates */
                    "tmplplaybutton": "",
                    "tmplloader": "",
                    "tmplmessage": "",
                    "tmplshare": "",
                    "tmpltopmessage": "",
                    "tmplcontrolbar": "",
                    "tmpltracks": "",
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
                    "popup": false,
                    "nofullscreen": false,
                    "playfullscreenonmobile": false,
                    "ready": true,
                    "stretch": false,
                    "popup-stretch": false,
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
                    "skipseconds": 5,
                    "tracktags": null,
                    "tracktagssupport": false,
                    "tracktagsstyled": true,
                    "tracktaglang": 'en',
                    "tracksshowselection": false,
                    "initialoptions": {
                        "hideoninactivity": null
                    },

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
                    "popup": "boolean",
                    "popup-stretch": "boolean",
                    "popup-width": "int",
                    "popup-height": "int",
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
                    "castbuttonvisble": "boolean",
                    "skipseconds": "integer",
                    "tracktags": "array",
                    "tracktagsstyled": "boolean"
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

                    // Set initial options for further help actions
                    this.set("initialoptions", {
                        hideoninactivity: this.get("hideoninactivity")
                    });
                    this.activeElement().onkeydown = this._keyDownActivity.bind(this, this.activeElement());

                    this.on("change:tracktags", this.__initializeTrackTags);

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

                __initializeTrackTags: function() {
                    this.set("tracktagssupport", this.get("tracktags") && this.get("tracktags").length > 0 && ('track' in document.createElement('track')));
                    if (!this.__video || !this.get("tracktags") || this.get("tracktags").length === 0)
                        return;
                    this._loadTrackTags();
                    // To be able play default subtitle in with custom style
                    if (this.get("tracktagsstyled"))
                        this._setDefaultTrackOnPlay();

                    if (this.get("tracktags").length > 1) {
                        this.on("switch-track", function(selectedTrack) {
                            this.set("tracktextvisible", true);
                            this.set("trackcuetext", null);
                            this._setSelectedTag(selectedTrack);
                        });
                    }
                },

                _loadTrackTags: function() {
                    if (!this.get("tracktagssupport")) return;
                    var _flag = true;
                    Objs.iter(this.get("tracktags"), function(subtitle, index) {
                        var _trackTag = document.createElement("track");
                        _trackTag.id = 'tack' + index;
                        _trackTag.kind = subtitle.kind || 'subtitles';
                        _trackTag.label = subtitle.label || 'English';
                        _trackTag.srclang = subtitle.lang || 'en';
                        _trackTag.src = subtitle.src || null;
                        try {
                            if (subtitle.content && !subtitle.src)
                                _trackTag.src = URL.createObjectURL(new Blob([subtitle.content], {
                                    type: 'text/plain'
                                }));
                        } catch (e) {}
                        if (subtitle.enabled && _flag) {
                            _trackTag.setAttribute('default', '');
                            this.set("tracktaglang", subtitle.lang);
                            this.set("tracktextvisible", true);
                        }
                        _trackTag.setAttribute('data-selector', 'track-tag');
                        _trackTag.addEventListener("load", function() {
                            if (subtitle.enabled && _flag) {
                                // 0 (TextTrack.OFF in spec, TextTrack.DISABLED in Chrome), 1 (TextTrack.HIDDEN) or 2 (TextTrack.SHOWING)
                                this.mode = "showing";
                                if (this.__video)
                                    this.__video.textTracks[index].mode = "showing"; // Firefox
                                _flag = false;
                            } else {
                                this.mode = "hidden";
                                if (this.__video)
                                    this.__video.textTracks[index].mode = "hidden"; // Firefox
                            }
                        });
                        this.__video.appendChild(_trackTag);
                    }, this);
                },

                _showTracksInCustomElement: function(track, lang) {
                    var _lang = lang || this.get("tracktaglang");
                    var _self = this;
                    if (track.language === _lang) {
                        var _cues = track.cues;
                        Objs.iter(_cues, function(cue, index) {
                            if (typeof _cues[index] === 'object' && _cues[index]) {
                                cue.onenter = function(ev) {
                                    track.mode = 'hidden';
                                    if (_self.get("tracktextvisible"))
                                        _self.set("trackcuetext", this.text);
                                };
                                cue.onexit = function(ev) {
                                    _self.set("trackcuetext", null);
                                };
                            }
                        }, this);
                    }
                },

                toggleTrackTags: function(status) {
                    var _lang = this.get("tracktaglang");
                    var _customStyled = this.get("tracktagsstyled");
                    var _status = status ? 'showing' : 'disabled';
                    _status = (status && _customStyled) ? 'hidden' : _status;
                    if (!status && this.get("tracktagsstyled"))
                        this.set("trackcuetext", null);

                    Objs.iter(this.__video.textTracks, function(track, index) {
                        if (typeof this.__video.textTracks[index] === 'object' && this.__video.textTracks[index]) {
                            var _track = this.__video.textTracks[index];
                            // If set custom style to true show cue text in our element
                            if (_track.language === _lang) {
                                _track.mode = _status;
                                this.set("tracktextvisible", status);
                                this._triggerTrackChange(this.__video, _track, _status, _lang);
                            }
                        }
                    }, this);
                },

                _setDefaultTrackOnPlay: function() {
                    this.player.once("playing", function() {
                        Objs.iter(this.get("tracktags"), function(track, index) {
                            var _track = this.__video.textTracks[index];
                            if (typeof _track === 'object' && _track) {
                                if (_track.mode === 'showing')
                                    this._showTracksInCustomElement(_track, _track.language);
                            }
                        }, this);
                    }, this);
                },

                _setSelectedTag: function(selectedTrack) {
                    var _status = null;
                    var _track = null;
                    Objs.iter(this.__video.textTracks, function(track, index) {
                        _track = this.__video.textTracks[index];
                        if (typeof _track === 'object' && _track) {
                            _status = _track.language === selectedTrack.lang ? (this.get("tracktagsstyled") ? 'hidden' : 'showing') : 'disabled';
                            if (!this.get("tracktextvisible")) _status = 'disabled';
                            _track.mode = _status;
                            if (_track.language === selectedTrack.lang)
                                this._triggerTrackChange(this.__video, _track, _status, selectedTrack.lang);
                        }
                    }, this);
                },

                // Fixed issue when unable switch directly to showing from disabled
                _triggerTrackChange: function(video, track, status, lang) {
                    var _self = this;
                    var _trackElement = video.querySelector("#" + track.id);
                    var _flag = true;
                    if (track.oncuechange !== undefined && !((Info.isInternetExplorer() || Info.isEdge()) && this.get("tracktagsstyled"))) {
                        track.oncuechange = function(ev) {
                            if (_flag) {
                                if (status.length) track.mode = status;
                                if (_self.get("tracktagsstyled"))
                                    _self._showTracksInCustomElement(track, lang);
                                else if (_trackElement) {
                                    _trackElement.mode = status;
                                    // _trackElement.setAttribute('default', '');
                                }
                                _flag = false;
                            }
                        };
                    } else {
                        video.ontimeupdate = function(ev) {
                            if (status.length) track.mode = status;
                            if (_self.get("tracktagsstyled"))
                                _self._showTracksInCustomElement(track, lang);
                        };
                    }
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
                    this.__video = null;
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
                        this.__video = video;
                        this.__initializeTrackTags();

                        if (this.get("chromecast")) {
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
                            if (!inFullscreen && (this.get('hideoninactivity') !== this.get("initialoptions").hideoninactivity)) {
                                this.set("hideoninactivity", this.get("initialoptions").hideoninactivity);
                            }
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

                _keyDownActivity: function(element, ev) {
                    var _keyCode = ev.which || ev.keyCode;
                    // Prevent whitespace browser center scroll and arrow buttons behaviours
                    if (_keyCode === 32 || _keyCode === 37 || _keyCode === 38 || _keyCode === 39 || _keyCode === 40) ev.preventDefault();

                    if (_keyCode === 32 || _keyCode === 13 || _keyCode === 9) {
                        this._resetActivity();
                        if (this.get("fullscreened") && this.get("hideoninactivity")) this.set("hideoninactivity", false);
                    }

                    if (_keyCode === 9 && ev.shiftKey) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        }, -1);
                    } else if (_keyCode === 9) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        });
                    }
                },

                _findNextTabStop: function(parentElement, ev, callback, direction) {
                    var _currentIndex, _direction, _tabIndexes, _tabIndexesArray, _maxIndex, _minIndex, _looked, _tabIndex, _delta, _element, _videoPlayersCount;
                    _maxIndex = _minIndex = 0;
                    _direction = direction || 1;
                    _element = ev.target;
                    _currentIndex = _element.tabIndex;
                    _tabIndexes = parentElement.querySelectorAll('[tabindex]');
                    _tabIndexesArray = Array.prototype.slice.call(_tabIndexes, 0);
                    _tabIndexes = _tabIndexesArray
                        .filter(function(element) {
                            if ((element.clientWidth > 0 || element.clientHeight > 0) && (element.tabIndex !== -1)) {
                                if (_maxIndex <= element.tabIndex) _maxIndex = element.tabIndex;
                                if (_minIndex >= element.tabIndex) _minIndex = element.tabIndex;
                                return true;
                            } else return false;
                        });

                    if ((_direction === 1 && _currentIndex === _maxIndex) || (direction === -1 && _currentIndex === _minIndex) || _maxIndex === 0) {
                        _videoPlayersCount = document.querySelectorAll('ba-videoplayer').length;
                        if (_videoPlayersCount > 1) {
                            if (this.get("playing")) this.player.pause();
                            parentElement.tabIndex = -1;
                            parentElement.blur();
                        }
                        return;
                    }

                    for (var i = 0; i < _tabIndexes.length; i++) {
                        if (!_tabIndexes[i])
                            continue;
                        _tabIndex = _tabIndexes[i].tabIndex;
                        _delta = _tabIndex - _currentIndex;
                        if (_tabIndex < _minIndex || _tabIndex > _maxIndex || Math.sign(_delta) !== _direction)
                            continue;

                        if (!_looked || Math.abs(_delta) < Math.abs(_looked.tabIndex - _currentIndex))
                            _looked = _tabIndexes[i];
                    }

                    if (_looked) {
                        ev.preventDefault();
                        callback(_looked, _looked.tabIndex);
                    }
                },

                _resetActivity: function() {
                    this.set("last_activity", Time.now());
                    this.set("activity_delta", 0);
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
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("play");
                            return;
                        }
                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("play-google-cast");
                            return;
                        }
                        this.host.state().play();
                    },

                    rerecord: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("rerecord");
                            return;
                        }
                        if (!this.get("rerecordable"))
                            return;
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("submit");
                            return;
                        }
                        if (!this.get("submittable"))
                            return;
                        this.trigger("submit");
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                    },

                    pause: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("pause");
                            return;
                        }

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
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("stop");
                            return;
                        }
                        if (!this.videoLoaded())
                            return;
                        if (this.get("playing"))
                            this.player.pause();
                        this.player.setPosition(0);
                        this.trigger("stopped");
                    },

                    seek: function(position) {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("seek", position);
                            return;
                        }
                        if (this.get('disableseeking')) return;
                        if (this.videoLoaded()) {
                            if (position > this.player.duration())
                                this.player.setPosition(this.player.duration() - this.get("skipseconds"));
                            else {
                                this.player.setPosition(position);
                                this.trigger("seek", position);
                            }
                        }
                    },

                    set_volume: function(volume) {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("set_volume", volume);
                            return;
                        }
                        volume = Math.min(1.0, volume);
                        volume = volume <= 0 ? 0 : volume; // Don't allow negative value

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
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("toggle_fullscreen");
                            return;
                        }
                        if (this.get("fullscreened"))
                            this.player.exitFullscreen();
                        else
                            this.player.enterFullscreen();
                        this.set("fullscreened", !this.get("fullscreened"));
                    },

                    toggle_player: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("toggle_player");
                            return;
                        }
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
                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        var _targetElement, _activeElement, _selector, _keyCode;
                        _keyCode = ev.which || ev.keyCode;
                        _activeElement = this.activeElement();
                        if (_keyCode === 13 || _keyCode === 32) {
                            if (focusingSelector) {
                                _selector = "[data-selector='" + focusingSelector + "']";
                                _targetElement = _activeElement.querySelector(_selector);
                                if (_targetElement)
                                    Async.eventually(function() {
                                        this.trigger("keyboardusecase", _activeElement);
                                        _targetElement.focus({
                                            preventScroll: false
                                        });
                                    }, this, 100);
                            } else {
                                _selector = '[data-video="video"]';
                                _targetElement = _activeElement.querySelector(_selector);
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: true
                                    });
                                }, this, 100);
                            }
                        } else if (_keyCode === 9 && nextSelector) {
                            _selector = "[data-selector='" + nextSelector + "']";
                            _targetElement = _activeElement.querySelector(_selector);
                            if (_targetElement)
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: false
                                    });
                                }, this, 100);

                        }
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
                },

                cloneAttrs: function() {
                    return Objs.map(this.attrs, function(value, key) {
                        return this.get(key);
                    }, this);
                },

                popupAttrs: function() {
                    return {
                        autoplay: true,
                        popup: false,
                        width: this.get("popup-width"),
                        height: this.get("popup-height"),
                        stretch: this.get("popup-stretch")
                    };
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