Scoped.define("module:AudioPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Assets",
    "module:AudioVisualisation",
    "browser:Info",
    "browser:Dom",
    "media:AudioPlayer.AudioPlayerWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Async",
    "module:AudioPlayer.Dynamics.PlayerStates.Initial",
    "module:AudioPlayer.Dynamics.PlayerStates",
    "browser:Events"
], [
    "module:AudioPlayer.Dynamics.Message",
    "module:AudioPlayer.Dynamics.Loader",
    "module:AudioPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, AudioVisualisation, Info, Dom, AudioPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Async, InitialState, PlayerStates, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-audioplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "iecss": "ba-audioplayer",
                    "cssloader": "",
                    "cssmessage": "",
                    "csscontrolbar": "",
                    "width": "",
                    "height": "",
                    /* Themes */
                    "theme": "",
                    "csstheme": "",
                    "themecolor": "",
                    /* Dynamics */
                    "dynloader": "audioplayer-loader",
                    "dynmessage": "audioplayer-message",
                    "dyncontrolbar": "audioplayer-controlbar",
                    /* Templates */
                    "tmplloader": "",
                    "tmplmessage": "",
                    "tmplcontrolbar": "",
                    /* Attributes */
                    "source": "",
                    "sources": [],
                    "sourcefilter": {},
                    "playlist": null,
                    "volume": 1.0,
                    "title": "",
                    "initialseek": null,
                    "visibilityfraction": 0.8,
                    "unmuted": false, // Reference to Chrome renewed policy, we have to setup mute for auto plyed players.

                    /* Configuration */
                    "forceflash": false,
                    "noflash": false,
                    "reloadonplay": false,
                    "playonclick": true,
                    /* Options */
                    "rerecordable": false,
                    "submittable": false,
                    "autoplay": false,
                    "preload": false,
                    "loop": false,
                    "ready": true,
                    "stretch": false,
                    "totalduration": null,
                    "playwhenvisible": false,
                    "playedonce": false,
                    "manuallypaused": false,
                    "disablepause": false,
                    "disableseeking": false,
                    "postervisible": false,
                    "visualeffectvisible": false,
                    "visualeffectsupported": false,
                    "visualeffectheight": 120,
                    "skipseconds": 5
                },

                types: {
                    "forceflash": "boolean",
                    "noflash": "boolean",
                    "rerecordable": "boolean",
                    "loop": "boolean",
                    "autoplay": "boolean",
                    "preload": "boolean",
                    "ready": "boolean",
                    "stretch": "boolean",
                    "volume": "float",
                    "initialseek": "float",
                    "themecolor": "string",
                    "totalduration": "float",
                    "playwhenvisible": "boolean",
                    "playedonce": "boolean",
                    "manuallypaused": "boolean",
                    "disablepause": "boolean",
                    "disableseeking": "boolean",
                    "playonclick": "boolean",
                    "skipseconds": "integer",
                    "visualeffectvisible": "boolean",
                    "visualeffectheight": "integer"
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

                events: {
                    "change:visualeffectsupported": function(value) {
                        if (!value) {
                            // If after checking we found that AudioAnalyzer not supported we should remove canvas
                            if (this.audioVisualisation) {
                                this.audioVisualisation.destroy();
                                this.audioVisualisation.canvas.remove();
                            }
                        }
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    if (Info.isMobile() && (this.get("autoplay") || this.get("playwhenvisible"))) {
                        this.set("volume", 0.0);
                        if (!(Info.isiOS() && Info.iOSversion().major >= 10)) {
                            this.set("autoplay", false);
                            this.set("loop", false);
                        }
                    }

                    if (this.get("theme") in Assets.audioplayerthemes) {
                        Objs.iter(Assets.audioplayerthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }

                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

                    if (this.get("playlist")) {
                        var pl0 = (this.get("playlist"))[0];
                        this.set("source", pl0.source);
                        this.set("sources", pl0.sources);
                    }

                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("duration", this.get("totalduration") || 0.0);
                    this.set("position", 0.0);
                    this.set("buffered", 0.0);
                    this.set("message", "");
                    this.set("csssize", "normal");

                    this.set("loader_active", false);
                    this.set("controlbar_active", false);
                    this.set("message_active", false);

                    this.set("playing", false);

                    this.__attachRequested = false;
                    this.__activated = false;
                    this.__error = null;

                    this.activeElement().onkeydown = this._keyDownActivity.bind(this, this.activeElement());

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

                audioAttached: function() {
                    return !!this.player;
                },

                audioLoaded: function() {
                    return this.audioAttached() && this.player.loaded();
                },

                audioError: function() {
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

                _detachAudio: function() {
                    this.set("playing", false);
                    if (this.player)
                        this.player.weakDestroy();
                    this.player = null;
                    this.__audio = null;
                },

                _attachAudio: function() {
                    if (this.audioAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.__attachRequested = false;
                    var audio = this.activeElement().querySelector("[data-audio='audio']");
                    this._clearError();
                    AudioPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: audio,
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

                        this.player = instance;
                        this.__audio = audio;
                        // Draw audio visualisation effect
                        if (this.get("visualeffectvisible") && AudioVisualisation.supported()) {
                            this.audioVisualisation = new AudioVisualisation(audio, {
                                height: this.get('visualeffectheight'),
                                element: this.activeElement()
                            });

                            // To be able set width of the canvas element
                            Async.eventually(function() {
                                try {
                                    this.audioVisualisation.initializeVisualEffect();
                                    this.set("visualeffectsupported", true);
                                } catch (e) {
                                    this.set("visualeffectsupported", false);
                                    console.warn(e);
                                }
                            }, this, 100);
                        }
                        if (this.get("playwhenvisible")) {
                            if (Info.isChromiumBased() && !this.get("unmuted")) {
                                audio.isMuted = true;
                                Dom.userInteraction(function() {
                                    audio.isMuted = false;
                                    this.set("unmuted", true);
                                    this._playWhenVisible(audio);
                                });
                            } else
                                this._playWhenVisible(audio);
                        }
                        this.player.on("playing", function() {
                            this.set("playing", true);
                            this.trigger("playing");
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("audio", e);
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
                            if (this.get("initialseek"))
                                this.player.setPosition(this.get("initialseek"));
                        }, this);
                        if (this.player.loaded())
                            this.player.trigger("loaded");
                    }, this);
                },

                _getSources: function() {
                    var filter = this.get("sourcefilter");
                    var source = this.get("source");
                    var sources = filter ? Objs.filter(this.get("sources"), function(source) {
                        return Objs.subset_of(filter, source);
                    }, this) : this.get("sources");
                    return {
                        source: source,
                        sources: sources
                    };
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachAudio();
                },

                _playWhenVisible: function(audio) {
                    var _self = this;

                    if (Dom.isElementVisible(audio, this.get("visibilityfraction"))) {
                        this.player.play();
                    }

                    this._visiblityScrollEvent = this.auto_destroy(new DomEvents());
                    this._visiblityScrollEvent.on(document, "scroll", function() {
                        if (!_self.get('playedonce') && !_self.get("manuallypaused")) {
                            if (Dom.isElementVisible(audio, _self.get("visibilityfraction"))) {
                                _self.player.play();
                            } else if (_self.get("playing")) {
                                _self.player.pause();
                            }
                        } else if (_self.get("playing") && !Dom.isElementVisible(audio, _self.get("visibilityfraction"))) {
                            _self.player.pause();
                        }
                    });

                },

                reattachAudio: function() {
                    this.set("reloadonplay", true);
                    this._detachAudio();
                    this._attachAudio();
                },

                _keyDownActivity: function(element, ev) {
                    var _keyCode = ev.which || ev.keyCode;
                    // Prevent whitespace browser center scroll and arrow buttons behaviours
                    if (_keyCode === 32 || _keyCode === 37 || _keyCode === 38 || _keyCode === 39 || _keyCode === 40) ev.preventDefault();


                    if (_keyCode === 9 && ev.shiftKey) {
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        }, -1);
                    } else if (_keyCode === 9) {
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        });
                    }
                },

                _findNextTabStop: function(parentElement, ev, callback, direction) {
                    var _currentIndex, _direction, _tabIndexes, _tabIndexesArray, _maxIndex, _minIndex, _looked, _tabIndex, _delta, _element, _audioPlayersCount;
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
                        _audioPlayersCount = document.querySelectorAll('ba-audioplayer').length;
                        if (_audioPlayersCount > 1) {
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

                object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],

                functions: {

                    message_click: function() {
                        this.trigger("message:click");
                    },

                    play: function() {
                        this.host.state().play();
                        // Draw visual effect
                        if (this.get('visualeffectsupported'))
                            this.audioVisualisation.renderFrame();
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
                            this.player.pause();
                        }

                        if (this.get("visualeffectsupported") && this.audioVisualisation) {
                            if (this.audioVisualisation.frameID)
                                this.audioVisualisation.cancelFrame(this.audioVisualisation.frameID);
                            else
                                this.set("visualeffectsupported", false);
                        }

                        if (this.get("playwhenvisible"))
                            this.set("manuallypaused", true);
                    },

                    stop: function() {
                        if (!this.audioLoaded())
                            return;
                        if (this.get("playing"))
                            this.player.pause();
                        this.player.setPosition(0);
                        this.trigger("stopped");
                    },

                    seek: function(position) {
                        if (this.get('disableseeking')) return;
                        if (this.audioLoaded()) {
                            if (position > this.player.duration())
                                this.player.setPosition(this.player.duration() - this.get("skipseconds"));
                            else {
                                this.player.setPosition(position);
                                this.trigger("seek", position);
                            }
                        }
                    },

                    set_volume: function(volume) {
                        volume = Math.min(1.0, volume);
                        volume = volume <= 0 ? 0 : volume; // Don't allow negative value

                        this.set("volume", volume);
                        if (this.audioLoaded()) {
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0);
                        }
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
                                _selector = '[data-audio="audio"]';
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
                    this._detachAudio();
                    inherited.destroy.call(this);
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        if (this.audioLoaded()) {
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
                        }
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                cloneAttrs: function() {
                    return Objs.map(this.attrs, function(value, key) {
                        return this.get(key);
                    }, this);
                }

            };
        }, {

            playerStates: function() {
                return [PlayerStates];
            }

        }).register("ba-audioplayer")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/player.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "audio-error": "An error occurred, please try again later. Click to retry."
        });
});