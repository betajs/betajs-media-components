Scoped.define("module:VideoPlayer.Dynamics.Adplayer", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Timers",
    "browser:Dom",
    "media:Player.VideoPlayerWrapper",
    "module:Assets"
], function(Class, TimeFormat, Timers, Dom, VideoPlayerWrapper, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_adplayer.html') %>",

                attrs: {
                    "css": "ba-adplayer",
                    "csstheme": "",
                    "lefttillskip": -1,
                    "adduration": 0,
                    "duration": 0,
                    "advolume": 1.0,
                    "adplaying": false,
                    "companionadvisible": false,
                    "skipbuttonvisible": false,
                    "canskip": false,
                    "adskiped": false,
                    "disablepause": false
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdateAdVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateAdVolume", true);
                        this.call("progressUpdateAdVolume", event);
                    },

                    progressUpdateAdVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateAdVolume"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("advolume", (clientX - offset.left) / (dimensions.width || 1));
                        this.trigger("advolume", this.get("advolume"));
                    },

                    stopUpdateAdVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },

                    play_ad: function() {
                        this.trigger("playad");
                    },

                    pause_ad: function() {
                        this.trigger("pausead");
                        this._pauseLinearAd();
                    },

                    toggle_ad_volume: function() {
                        if (this.get("advolume") > 0) {
                            this.__oldVolume = this.get("advolume");
                            this.set("advolume", 0);
                        } else
                            this.set("advolume", this.__oldVolume || 1);
                        this.trigger("advolume", this.get("advolume"));
                    },

                    skip_linear_ad: function() {
                        if (!this.get("canskip") && this._vast)
                            return;
                        this.set("adskiped", true);
                        this._vast.trigger("resumeplayer");
                    },

                    skip_companion_ad: function() {},

                    ad_clicked: function() {
                        if (this._vast.vastTracker) {
                            this._vast.vastTracker.clickAd();
                        }
                    }
                },

                create: function() {
                    this._vast.once("vastready", function() {
                        this._adBehaviour();
                    }, this);
                    this._vast.once("adcanceled", function() {
                        this._preroll._adSkipped();
                    }, this);
                },

                _adBehaviour: function() {
                    var _adElementHolder, _source, _duration, _volume;

                    _adElementHolder = this.activeElement().querySelector("video");
                    _duration = this._vast.vastTracker.assetDuration;
                    _source = this._vast.sources[0];

                    if (this._vast.skipAdAfter && this._vast.skipAdAfter > 0) {
                        this.set("skipbuttonvisible", true);
                        this.set("lefttillskip", this._vast.skipAdAfter);
                    }

                    this._attachLinearAd(_adElementHolder, _source, _duration);

                    this._vast.on("resumeplayer", function() {

                        this._stopLinearAd();

                        this._timer.weakDestroy();

                        if (this.get("adskiped")) {
                            this._vast.vastTracker.skipAd();
                            this._preroll._adSkipped();
                        } else {
                            this._vast.vastTracker.completeAd();
                            this._preroll._adFinished();
                        }

                    }, this);

                    this.on("pausead", function() {
                        if (!this._timer || !this.__adPlayer)
                            return;
                        this._timer.stop();
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                    });

                    this.on("playad", function() {
                        if (!this._timer || !this.__adPlayer)
                            return;
                        this._timer.start();
                        this.__adPlayer.play();
                        this.set("adplaying", true);
                    });

                    this.on("advolume", function() {
                        if (!this.__adPlayer)
                            return;
                        _volume = Math.min(1.0, this.get("advolume"));
                        this.__adPlayer.setVolume(_volume);
                        this.__adPlayer.setMuted(_volume <= 0.0);
                    });
                },

                _attachLinearAd: function(element, source, duration) {
                    VideoPlayerWrapper.create({
                        element: element,
                        source: source.src,
                        type: source.type
                    }).error(function(err) {
                        // trigger error related to loading video content
                        this._vast.trigger("resumeplayer");
                    }, this).success(function(instance) {
                        this.__adPlayer = instance;
                        duration = isNaN(duration) ? this.get("maxadduration") : duration;
                        this.set("adduration", duration);


                        this._playLinearAd();
                        this._timer = new Timers.Timer({
                            context: this,
                            fire: this._timerFire,
                            delay: 1000,
                            start: true
                        });
                    }, this);
                },

                _timerFire: function() {
                    var _timeLeft, _leftTillSkip;
                    _timeLeft = this.get("adduration");
                    _leftTillSkip = this.get("lefttillskip") || -1;

                    this.set("adduration", --_timeLeft);

                    if (_leftTillSkip >= 0) {
                        this.set("skipbuttonvisible", true);
                        this.set("lefttillskip", --_leftTillSkip);

                        if (_leftTillSkip === 0)
                            this.set("canskip", true);
                    }

                    this._vast.vastTracker.setAdProgress(_timeLeft);

                    if (this.get("adduration") === 0) {
                        this._vast.trigger("resumeplayer");
                    }
                },

                _playLinearAd: function() {
                    this.__adPlayer.play();
                    this.set("adplaying", true);
                    this._vast.trigger("adplaying");
                },

                _pauseLinearAd: function() {
                    if (!this.get("adplaying")) {
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                        this._vast.vastTracker.setAdPaused(true);
                        this._vast.trigger("adpaused");
                        this._vast.once("playad", function() {
                            this._vast.vastTracker.setAdPaused(false);
                        }, this);
                    }
                },

                _stopLinearAd: function() {
                    if (this.__adPlayer && this.get("adplaying")) {
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                    }
                },

                skip_ad: function() {
                    if (this.__adPlayer)
                        this.trigger("resumeplayer");
                }
            };
        })
        .register("ba-videoplayer-adslot")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_adplayer.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "elapsed-time": "Elasped time",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound",
            "ad-will-end-after": "Ad will end after %s",
            "can-skip-after": "Skip after %d",
            "skip-ad": "Skip ad"
        });
});