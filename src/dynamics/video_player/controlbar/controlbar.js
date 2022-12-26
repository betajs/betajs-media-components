Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "base:Maths",
    "base:Objs",
    "browser:Dom",
    "module:Assets",
    "browser:Info",
    "media:Player.Support",
    "base:Async",
    "base:Timers.Timer",
    "browser:Events"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatElementPartial"
], function(Class, TimeFormat, Comparators, Maths, Objs, Dom, Assets, Info, PlayerSupport, Async, Timer, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_controlbar.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "duration": 0,
                    "position": 0,
                    "cached": 0,
                    "volume": 1.0,
                    "expandedprogress": true,
                    "playing": false,
                    "rerecordable": false,
                    "submittable": false,
                    "manuallypaused": false,
                    "streams": [],
                    "currentstream": null,
                    "fullscreen": true,
                    "fullscreened": false,
                    "activitydelta": 0,
                    "hidebarafter": 5000,
                    "preventinteraction": false,
                    "revertposition": false,
                    "title": "",
                    "settingsmenubutton": false,
                    "hoveredblock": false, // Set true when mouse hovered
                    "allowtexttrackupload": false,
                    "thumbisvisible": false,
                    "chapterslist": [],
                    "showchaptertext": true,
                    "visibleindex": -1,
                    "title_show_class": ""
                },

                computed: {
                    "currentstream_label:currentstream": function() {
                        var cs = this.get("currentstream");
                        return cs ? (cs.label ? cs.label : PlayerSupport.resolutionToLabel(cs.width, cs.height)) : "";
                    }
                },

                events: {
                    "change:activitydelta": function(value) {
                        if (this.get("prominent_title")) {
                            this.set("title_show_class", "");
                        } else {
                            if (value > this.get("hidebarafter") && this.get("hideoninactivity")) {
                                this.set("title_show_class", this.get("cssplayer") + "-dashboard-hidden");
                            } else {
                                this.set("title_show_class", "");
                            }
                        }
                    }
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 0.1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdatePosition: function(event) {
                        if (this.get("disableseeking")) return;
                        event[0].preventDefault();
                        if (!this.__parent.get("playing") && this.__parent.player && !this.get("manuallypaused"))
                            this.__parent.player.play();

                        var target = event[0].currentTarget;
                        this.set("dimensions", target.getBoundingClientRect());

                        this.set("_updatePosition", true);
                        this.call("progressUpdatePosition", event[0]);

                        var events = this.get("events");
                        events.on(document, "mousemove touchmove", function(e) {
                            e.preventDefault();
                            this.call("progressUpdatePosition", e);
                        }, this);
                        events.on(document, "mouseup touchend", function(e) {
                            e.preventDefault();
                            this.call("stopUpdatePosition");
                            events.off(document, "mouseup touchend mousemove touchmove");
                        }, this);
                    },

                    progressUpdatePosition: function(event) {
                        var _dyn = this.__parent;

                        // Mouse or Touch Event
                        var clientX = event.clientX === 0 ? 0 : event.clientX || event.targetTouches[0].clientX;
                        var dimensions = this.get("dimensions");
                        var percentageFromStart = -1;
                        if (clientX < dimensions.left) percentageFromStart = 0;
                        else if (clientX > (dimensions.left + dimensions.width)) percentageFromStart = 1;
                        else {
                            percentageFromStart = (clientX - dimensions.left) / (dimensions.width || 1);
                        }
                        var onDuration = this.get("duration") * percentageFromStart;

                        if (!this.get("_updatePosition") && typeof _dyn.__trackTags === 'undefined')
                            return;

                        var player = _dyn.player;

                        if (typeof _dyn.__trackTags !== 'undefined') {
                            if (this.__parent.__trackTags.hasThumbs) {
                                if (this.get("visibleindex") > -1 && this.get("showchaptertext"))
                                    return;
                                var _index;
                                var _trackTags = _dyn.__trackTags;
                                var _cuesCount = _dyn.get("thumbcuelist").length;
                                if (onDuration > 0) {
                                    _index = Math.floor(_cuesCount * percentageFromStart);
                                    for (var i = _index - 2; i < _cuesCount; i++) {
                                        if (_dyn.get("thumbcuelist")[i]) {
                                            var _cue = _dyn.get("thumbcuelist")[i];
                                            if (_cue.startTime < onDuration && _cue.endTime > onDuration) {
                                                _trackTags.showDurationThumb(i, clientX, onDuration);
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    _index = Math.floor(_cuesCount * percentageFromStart);
                                    _trackTags.showDurationThumb(_index, clientX);
                                }

                                this.set("thumbisvisible", true);
                                this.activeElement().appendChild(_trackTags.thumbContainer);
                            }
                        }

                        if (this.get("_updatePosition")) {
                            this.set("position", onDuration);

                            if (typeof player._broadcastingState !== 'undefined') {
                                if (player._broadcastingState.googleCastConnected) {
                                    player.trigger('google-cast-seeking', this.get("position"));
                                    return;
                                }
                            }
                            this.trigger("position", this.get("position"));
                        }
                    },

                    stopUpdatePosition: function() {
                        this.set("_updatePosition", false);
                        this._hideThumb();
                    },

                    startUpdateVolume: function(args, element) {
                        var event = args[0];
                        var moveEvent = event.type === "mousedown" ? "mousemove" : "touchmove";
                        var stopEvent = event.type === "mousedown" ? "mouseup" : "touchend";
                        var domRect = element.getBoundingClientRect();
                        event.preventDefault();

                        var updateVolume = function(event) {
                            event.preventDefault();
                            if (domRect.width > domRect.height) {
                                // Horizontal slider
                                var x = event.clientX;
                                if (!x && Array.isArray(event.touches)) x = event.touches[0].clientX;
                                this.set("volume", Maths.clamp((x - domRect.x) / domRect.width, 0, 1));
                            } else {
                                // Vertical slider
                                var y = event.clientY;
                                if (!y && Array.isArray(event.touches)) y = event.touches[0].clientY;
                                this.set("volume", Maths.clamp((domRect.bottom - y) / domRect.height, 0, 1));
                            }
                            this.trigger("volume", this.get("volume"));
                        }.bind(this);

                        updateVolume(event);

                        document.addEventListener(moveEvent, updateVolume);
                        document.addEventListener(stopEvent, function() {
                            document.removeEventListener(moveEvent, updateVolume);
                        }, {
                            once: true
                        });
                    },

                    showChapterText: function(chapter) {
                        this.set("visibleindex", chapter.index);
                        this._hideThumb();
                    },

                    hideChapterText: function() {
                        this.set("visibleindex", -1);
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

                    toggle_player: function() {
                        this.trigger("toggle_player");
                    },

                    toggle_volume: function() {
                        if (this.get("volume") > 0) {
                            this.__oldVolume = this.get("volume");
                            this.set("volume", 0);
                        } else {
                            this.set("volume", this.__oldVolume || 1);
                        }

                        this.trigger("volume", this.get("volume"));
                    },

                    toggle_position_info: function() {
                        this.set("revertposition", !this.get("revertposition"));
                    },

                    toggle_fullscreen: function() {
                        this.trigger("fullscreen");
                    },

                    toggle_settings_menu: function() {
                        this.trigger("settings_menu");
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

                    select_frame: function() {
                        var player = this.parent().player;
                        var position = player.position();
                        var imageSelected = false;

                        player.pause();

                        var timer = new Timer({
                            context: this,
                            start: false,
                            fire: function() {
                                player.setPosition(position);
                                player.play();
                                player.pause();
                                if (player.loaded()) {
                                    player.createSnapshotPromise().success(function(blob) {
                                        timer.stop();
                                        if (!imageSelected) {
                                            imageSelected = true;
                                            this.parent().trigger("image-selected", blob);
                                        }
                                    }, this);
                                }
                            },
                            delay: 300,
                            fire_max: 5,
                            destroy_on_stop: true
                        });

                        if (player.loaded()) {
                            player.createSnapshotPromise().success(function(blob) {
                                this.parent().trigger("image-selected", blob);
                            }, this).error(function() {
                                timer.start();
                            }, this);
                        } else {
                            timer.start();
                        }

                    },

                    toggle_stream: function() {
                        var streams = this.get("streams");
                        var current = streams.length - 1;
                        streams.forEach(function(stream, i) {
                            if (Comparators.deepEqual(stream, this.get("currentstream")))
                                current = i;
                        }, this);
                        this.set("currentstream", streams[(current + 1) % streams.length]);
                    },

                    show_airplay_devices: function() {
                        var dynamic = this.__parent;
                        if (dynamic.player._broadcastingState.airplayConnected) {
                            dynamic._broadcasting.lookForAirplayDevices(dynamic.player._element);
                        }
                    },

                    // Start ro stop showing CC content
                    toggle_tracks: function() {
                        return this.parent().toggleTrackTags();
                    },

                    // Hover on CC button in controller
                    hover_cc: function(hover) {
                        // Not show CC on hover during settings block is open
                        // Reason why use parent not local settingsmenu_active,
                        // is that settings model also has to be aware it's state. So we need as a global variable
                        if (this.parent().get("settingsmenu_active")) return;
                        Async.eventually(function() {
                            this.parent().set("tracksshowselection", hover);
                        }, this, 300);
                    },

                    // Move between elements which has tabIndex attribute
                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        this.trigger("tab_index_move", ev[0], nextSelector, focusingSelector);
                    },

                    // Hover on block
                    hover_block: function(hover) {
                        Async.eventually(function() {
                            this.parent().set("hoveredblock", hover);
                        }, this, 300);
                    },

                    toggle_settings: function() {
                        this.trigger("toggle_settings");
                    },

                    trim: function() {
                        this.parent().trigger("video-trimmed", this.get("trimstart") || 0, this.get("trimend") || this.get("duration"));
                    },

                    addTrimmingEventListeners: function() {
                        var events = this.get("events");
                        var trimStartMarker = this.activeElement().querySelector('[data-selector="trim-start-marker"]');
                        var trimEndMarker = this.activeElement().querySelector('[data-selector="trim-end-marker"]');

                        events.on(trimStartMarker, "mousedown touchstart", function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            var boundingRect = this.get("progressbarElement").getBoundingClientRect();
                            this.call("updateTrimStart", e, boundingRect);

                            events.on(document, "mousemove touchmove", function(e) {
                                e.preventDefault();
                                this.call("updateTrimStart", e, boundingRect);
                            }, this);

                            events.on(document, "mouseup touchend", function(e) {
                                e.preventDefault();
                                events.off(document, "mouseup touchend mousemove touchmove");
                            }, this);
                        }, this);

                        events.on(trimEndMarker, "mousedown touchstart", function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            var boundingRect = this.get("progressbarElement").getBoundingClientRect();
                            this.call("updateTrimEnd", e, boundingRect);

                            events.on(document, "mousemove touchmove", function(e) {
                                e.preventDefault();
                                this.call("updateTrimEnd", e, boundingRect);
                            }, this);

                            events.on(document, "mouseup touchend", function(e) {
                                e.preventDefault();
                                events.off(document, "mouseup touchend mousemove touchmove");
                            }, this);
                        }, this);
                    },

                    updateTrimStart: function(event, boundingRect) {
                        var position = this.call("calculatePosition", event, boundingRect);
                        var trimEnd = this.get("trimend") || this.get("duration");
                        var timeMinLimit = this.get("timeminlimit") || 1;
                        if (position > trimEnd - timeMinLimit) {
                            this.set("trimstart", trimEnd - timeMinLimit);
                        } else {
                            this.set("trimstart", position);
                        }
                    },

                    updateTrimEnd: function(event, boundingRect) {
                        var position = this.call("calculatePosition", event, boundingRect);
                        var trimStart = this.get("trimstart") || 0;
                        var timeMinLimit = this.get("timeminlimit") || 1;
                        if (position < trimStart + timeMinLimit) {
                            this.set("trimend", trimStart + timeMinLimit);
                        } else {
                            this.set("trimend", position);
                        }
                    },

                    getClientX: function(event) {
                        return event.clientX === 0 ? 0 : event.clientX || event.targetTouches[0].clientX;
                    },

                    calculatePosition: function(event, dimensions) {
                        var clientX = this.call("getClientX", event);
                        var percentageFromStart = -1;
                        if (clientX < dimensions.left) percentageFromStart = 0;
                        else if (clientX > (dimensions.left + dimensions.width)) percentageFromStart = 1;
                        else {
                            percentageFromStart = (clientX - dimensions.left) / (dimensions.width || 1);
                        }
                        return this.get("duration") * percentageFromStart;
                    }
                },

                _hideThumb: function() {
                    if (typeof this.__parent.__trackTags !== "undefined") {
                        if (this.__parent.__trackTags.hasThumbs && this.get("thumbisvisible")) {
                            this.set("thumbisvisible", false);
                            this.__parent.__trackTags.hideDurationThumb();
                        }
                    }
                },

                create: function() {
                    this.set("ismobile", Info.isMobile());
                    this.set("events", new DomEvents());
                    this.set("progressbarElement", this.activeElement().querySelector('[data-selector="progress-bar-inner"]'));
                    if (this.get("trimmingmode"))
                        this.call("addTrimmingEventListeners");
                }
            };
        })
        .register("ba-videoplayer-controlbar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/video_player_controlbar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "video-progress": "Progress",
            "rerecord-video": "Redo?",
            "submit-video": "Confirm",
            "play-video": "Play",
            "pause-video": "Pause",
            "pause-video-disabled": "Pause not supported",
            "elapsed-time": "Elapsed time",
            "total-time": "Total length of",
            "fullscreen-video": "Enter fullscreen",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound",
            "change-resolution": "Change resolution",
            "exit-fullscreen-video": "Exit fullscreen",
            "close-tracks": "Close CC",
            "show-tracks": "Show CC",
            "player-speed": "Player speed",
            "settings": "Settings",
            "airplay": "Airplay",
            "airplay-icon": "Airplay icon.",
            "remaining-time": "Remaining time",
            "select-frame": "Select",
            "trim-video": "Trim"
        });
});