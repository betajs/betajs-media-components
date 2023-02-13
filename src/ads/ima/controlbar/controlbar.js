Scoped.define("module:Ads.IMA.Controlbar", [
    "dynamics:Dynamic",
    "browser:Dom",
    "browser:Info",
    "base:Types",
    "base:Time",
    "base:Timers",
    "base:TimeFormat",
    "module:Assets",
    "browser:Events"
], function(Dynamic, Dom, Info, Types, Time, Timers, TimeFormat, Assets, DomEvents, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/controlbar.html') %>",

                attrs: {
                    css: "ba-videoplayer",
                    cssplayer: "ba-player",
                    csscommon: "ba-commoncss",
                    adplayercss: 'ba-videoadplayer',
                    showcontrolbar: true,
                    showbanner: false,
                    media: null,
                    skipable: false,
                    'allow-skip': false,
                    dyn: null,
                    requester: null,
                    ad: null,
                    playing: false,
                    duration: 0,
                    remaining: 0,
                    volume: 1,
                    disablepause: false,
                    title: null,
                    pausedonclick: false,
                    clickthroughurl: null,
                    fullscreened: false,
                    supportsfullscreen: false,
                    hidebarafter: 5000,
                    // if controlbar is hidden, touch on screen should make it visible,
                    // and not handle click trough action, as user may want to use controlbar options
                    controlbarisvisible: true,
                    skippable: false, // Set when skip not exists in XML file and user set
                    skipoffset: -1
                },

                create: function() {
                    // , destroy, focus, getCuePoints
                    // getCuePoints, resize, skip, start, stop,
                    // discardAdBreak

                    this._adsRequester = this.get("requester");
                    this._contentPlayer = this._adsRequester._dyn;
                    this._adsManager = this._adsRequester._adsManager;
                    this._ads = this._adsManager && this._adsManager.getCurrentAd ? this._adsManager.getCurrentAd() : undefined;
                    this._element = this._adsRequester._options.adContainer;
                    this.set("last_activity", Time.now());

                    if (this._ads) {
                        if (this._ads.isLinear()) {
                            if (this._contentPlayer.get("playing")) {
                                this._contentPlayer.pause();
                            }
                        } else {
                            this.set("showcontrolbar", false);
                            var _bannerContainer = this.activeElement().querySelector("[data-ads='banner-ad-container']");
                            if (_bannerContainer) {
                                this.set("showbanner", true);
                                this.set("media", this._ads.getMediaUrl());
                            }
                        }
                    } else {
                        console.warn("Ad is undefined in IMA controlbar");
                        return;
                    }
                    this.set("supportsfullscreen", Dom.elementSupportsFullscreen(this._element));

                    var key = Object.keys(this._ads)[0] || null;
                    if (key && this._ads[key]) {
                        this.set("clickthroughurl", this._ads[key].clickThroughUrl);
                    }

                    this._domEvents = this.auto_destroy(new DomEvents());

                    this.set("ad", this._ads);
                    this.set("title", this._ads.getTitle());
                    this.set("duration", this._ads.getDuration());
                    // this.set("skippable", this._adsManager.getAdSkippableState());
                    this.set("skipoffset", this._ads.getSkipTimeOffset());
                    var podInfo = this._ads.getAdPodInfo();
                    this.set("pods", {
                        index: podInfo.getPodIndex(),
                        position: podInfo.getAdPosition(),
                        total: podInfo.getTotalAds(),
                        maxDuration: podInfo.getMaxDuration(),
                        timeOffset: podInfo.getTimeOffset()
                    });
                    this.set("volume", this._adsManager.getVolume());
                    this.set("remaining", this._adsManager.getRemainingTime());
                    // vastMediaBitrate: 360 // vastMediaHeight: 300 // vastMediaWidth: 400
                    /*
                    this.set("width", this._contentPlayer.videoWidth());
                    this.set("height", this._contentPlayer.videoHeight());
                    */

                    // If a skipoffset attribute does not exist in XML, but user set own skip after
                    if (!this._ads.isSkippable() && Types.isNumber(this._adsRequester._providerOptions.skipAfter)) {
                        this.set("skippable", true);
                        this.set("skipoffset", this._adsRequester._providerOptions.skipAfter);
                        this.set("lefttillskip", this.get("skipoffset"));
                    }

                    this._adsRequester.on("adstart", function() {
                        this.set("playing", true);
                    }, this);
                    this._adsRequester.on("adpause", function() {
                        this.set("playing", false);
                    }, this);
                    this._adsRequester.on("adresume", function() {
                        this.set("playing", true);
                    }, this);
                    this._adsRequester.on("skippableStateChanged", function() {
                        console.log("Skip state was changed!!!");
                    }, this);

                    this._domEvents.on(this._element, 'fullscreenchange', function(ev) {
                        var element = ev.target;
                        var _mode, _width = element.offsetWidth,
                            _height = element.offsetHeight;
                        // if (document.fullscreenElement || document.webkitFullscreenElement)
                        this.set("fullscreened", Dom.elementIsFullscreen(element));
                        _mode = this.get("fullscreened") ? google.ima.ViewMode.FULLSCREEN : google.ima.ViewMode.NORMAL;
                        this._adsManager.resize(_width, _height, _mode);
                    }, this);

                    // On user over
                    this._domEvents.on(this._element, 'mouseover', function(ev) {
                        this.set("last_activity", Time.now());
                    }, this);

                    this._domEvents.on(this._element, 'tap', function(ev) {
                        this.set("last_activity", Time.now());
                    }, this);

                    // Below listener also can do the job, only user activity will pause as progress fire onlu on playing ad
                    // this._adsRequester.on("adadProgress", function(ev) {}, this);
                    this._timer = this._auto_destroy(new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 200,
                        start: true
                    }, this));
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", true);
                        this.call("progressUpdateVolume", event);
                    },

                    progressUpdateVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateVolume"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("volume", (clientX - offset.left) / (dimensions.width || 1));
                        this._adsManager.setVolume(this.get("volume") > 1 ? 1 : this.get("volume"));
                    },

                    stopUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },

                    play: function() {
                        this._adsManager.start();
                    },

                    resume: function() {
                        this._adsManager.resume();
                    },

                    toggle_player: function() {
                        // NO NEED: we are listening for this: this.set("playing", !this.get("playing"));
                        if (this.get("playing")) {
                            this._adsManager.pause();
                        } else {
                            this._adsManager.resume();
                        }
                    },

                    pause: function() {
                        this._adsManager.pause();
                    },

                    set_volume: function(value) {
                        this.set("volume", value);
                        this._adsManager.setVolume(this.get("volume") > 1 ? 1 : this.get("volume"));
                    },

                    toggle_volume: function() {
                        this.set("volume", this._adsManager.getVolume() === 0 ? 1 : 0);
                        this._adsManager.setVolume(this.get("volume"));
                    },

                    skip_linear_ad: function() {
                        if (this.get("lefttillskip") > 0)
                            return;
                        // ad skip works only if adSkippableState is true and it will be shown by default, we have to use stop
                        // this._adsManager.skip();
                        this._adsManager.stop();
                    },

                    skip_non_linear_ad: function() {
                        this._adsRequester.manuallyEndAd();
                    },

                    toggle_fullscreen: function() {
                        var fullscreenElement = this._element;
                        if (this.get("fullscreened")) {
                            Dom.documentExitFullscreen(fullscreenElement);
                        } else {
                            Dom.elementEnterFullscreen(fullscreenElement);
                        }
                    },

                    ad_clicked: function() {
                        // this._ads.initialUserAction();
                        if (this.get("clickthroughurl") && !this.get('pausedonclick') && this.get('controlbarisvisible')) {
                            this._adsManager.pause();
                            // this._adsManager.dispatch(google.ima.AdEvent.Type.CLICK);
                            var linkElement = document.createElement('a');
                            linkElement.href = this.get("clickthroughurl");
                            linkElement.target = '_blank';
                            linkElement.click();
                            this.set('pausedonclick', true);
                        } else {
                            // When second time click on ad resume playe
                            this._adsManager.resume();
                            this.set('pausedonclick', false);
                            this.set('controlbarisvisible', true);
                        }
                    }
                },

                _timerFire: function() {
                    var _now = Time.now();
                    this.set("activity_delta", _now - this.get("last_activity"));
                    // While video will not be loaded, activity_delta in th player will not be launched
                    if (!this._contentPlayer.videoLoaded())
                        this._contentPlayer.set("activity_delta", this.get("activity_delta"));

                    this.set("remaining", this._adsManager.getRemainingTime());
                    this.set("played", this.get("duration") - this.get("remaining"));

                    if (this.get("skipoffset") > 0 && this.get("skippable")) {
                        this.set("lefttillskip", Math.floor(this.get("skipoffset") - (this.get("duration") - this.get("remaining"))));
                    }

                    this.set("controlbarisvisible", this.get("activity_delta") < this.get("hidebarafter"));
                }
            };
        }).register("ba-ads-controlbar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/controlbar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "elapsed-time": "Elapsed time",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound",
            "ad-will-end-after": "Ad will end after %s",
            "can-skip-after": "Skip after %d",
            "skip-ad": "Skip ad"
        });
});