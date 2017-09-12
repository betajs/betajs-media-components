Scoped.define("module:VideoPlayer.Dynamics.Adplayer", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "base:Timers",
    "browser:Dom",
    "browser:Info",
    "browser:Events",
    "media:Player.VideoPlayerWrapper",
    "media:Player.Support",
    "module:Assets"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial"
], function(Class, TimeFormat, Comparators, Timers, Dom, Info, DOMEvents, VideoPlayerWrapper, PlayerSupport, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_adplayer.html') %>",

                attrs: {
                    "css": "ba-videoadplayer",
                    "lefttillskip": 0,
                    "adduration": 0,
                    "duration": 0,
                    "advolume": 1.0,
                    "adplaying": false,
                    "companionadvisible": false,
                    "skipbuttonvisible": false,
                    "canpause": false,
                    "fullscreen": true,
                    "fullscreened": false,
                    "disablepause": false,
                    "title": ""
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
                        this.trigger("play");
                    },

                    pause_ad: function() {
                        this._pauseLinearAd();
                    },

                    skip_ad: function() {
                        this.trigger("adskipped");
                    },

                    toggle_ad_volume: function() {
                        if (this.get("advolume") > 0) {
                            this.__oldVolume = this.get("advolume");
                            this.set("advolume", 0);
                        } else
                            this.set("advolume", this.__oldVolume || 1);
                        this.trigger("advolume", this.get("advolume"));
                    },

                    toggle_ad_fullscreen: function() {
                        this.trigger("fullscreen");
                    },

                    skip_linear_ad: function() {
                        this._stopLinearAd();
                    },

                    skip_companion_ad: function() {

                    },

                    ad_clicked: function() {

                    }
                },

                create: function() {
                    var _adElementHolder, _source, _duration, _adBlock;

                    this._dyn = this.parent();
                    _adBlock = this._dyn.activeElement().querySelector("[data-video='ad']");

                    _adBlock.style.display = 'none';
                    this._dyn._vast.once("adfire", function() {
                        _adElementHolder = this._dyn.activeElement().querySelector("[data-video='ad-video']");
                        _duration = this._dyn._vast.vastTracker.assetDuration;
                        _source = this._dyn._vast.sources[0];

                        this._attachLinearAd(_adElementHolder, _source, _duration);
                    }, this);

                    this._dyn._vast.on("adplaying", function() {
                        _adBlock.style.display = 'block';
                        if (this._dyn.get("playing")) {
                            this._dyn.player.pause();
                            this._dyn.set("playing", false);
                        }
                    }, this);

                    this._dyn._vast.on("resumeplayer", function() {
                        _adBlock.style.display = 'none';
                        this._dyn.activeElement().querySelector("[data-video='ad-video']").style.display = "none";
                        this._dyn.player.play();

                        this._dyn.set("adpodplaying", false);
                        this._dyn.set("adslot_active", false);
                        this._dyn.set("controlbar_active", true);

                        this._dyn.set("playing", true);
                    }, this);
                },

                _attachLinearAd: function(element, source, duration) {
                    VideoPlayerWrapper.create({
                        element: element,
                        source: source.src,
                        type: source.type
                    }).error(function(err) {
                        // trigger error related to loading video content
                        this._dyn._vast.trigger("resumeplayer");
                    }, this).success(function(instance) {
                        this.__adPlayer = instance;
                        this.set("adduration", duration * 1000);

                        this._dyn.set("controlbar_active", false);
                        this._dyn.set("adslot_active", true);
                        this._dyn.set("adpodplaying", true);

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
                    var timeLeft = this.get("adduration");
                    this.set("adduration", timeLeft - 1000);
                    if (this.get("adduration") === 0) {
                        this._dyn._vast.trigger("resumeplayer");
                        this._timer.destroy();
                    }
                },

                _playLinearAd: function() {
                    this.__adPlayer.play();
                    this.set("adplaying", true);
                    this._dyn._vast.trigger("adplaying");
                },

                _pauseLinearAd: function() {
                    if (this.__adPlayer.playing) {
                        this.__adPlayer.pause();
                        this._dyn._vast.trigger("adpaused");
                    }
                },

                _stopLinearAd: function() {
                    this.__adPlayer.stop();
                    this._dyn._vast.trigger("resumeplayer");
                }
            };
        })
        .register("ba-videoplayer-adslot")
        .attachStringTable(Assets.strings)
        .addStrings({
            "play-video": "Play",
            "pause-video": "Pause",
            "pause-video-disabled": "Pause not supported",
            "elapsed-time": "Elasped time",
            "fullscreen-video": "Enter fullscreen",
            "exit-fullscreen-video": "Exit fullscreen",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound"
        });
});