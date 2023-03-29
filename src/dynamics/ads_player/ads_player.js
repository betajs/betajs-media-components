Scoped.define("module:Ads.Dynamics.Player", [
    "base:Objs",
    "base:Async",
    "browser:Info",
    "base:Types",
    "module:Assets",
    "dynamics:Dynamic",
    "module:Ads.IMALoader",
    "module:Ads.IMA.AdsManager"
], [
    "module:Ads.Dynamics.Controlbar"
], function(Objs, Async, Info, Types, Assets, Class, IMALoader, AdsManager, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/ads_player.html') %>",

                attrs: {
                    dyncontrolbar: "ads-controlbar",
                    tmplcontrolbar: "",
                    cssadsplayer: "ba-adsplayer",
                    commoncss: "",
                    linear: true, // should be true to cover all the player container
                    playing: false,
                    currenttime: 0,
                    volume: 1,
                    isoutstream: false,
                    hidecontrolbar: false,
                    showactionbuttons: false
                },

                _deferActivate: function() {
                    if (this._loadedSDK) return false;
                    IMALoader.loadSDK().success(function() {
                        this._loadedSDK = true;
                        this.activate();
                    }, this);
                    return true;
                },

                _baseRequestAdsOptions: function() {
                    return {
                        adTagUrl: this.get("adtagurl"),
                        inlinevastxml: this.get("inlinevastxml"),
                        continuousPlayback: false, // TODO
                        linearAdSlotWidth: this.getAdWidth(),
                        linearAdSlotHeight: this.getAdHeight(),
                        nonLinearAdSlotWidth: this.getAdWidth(),
                        adWillAutoplay: this.getAdWillAutoplay(),
                        contentAutoplay: this.getContentAutoplay(),
                        adWillPlayMuted: this.getAdWillPlayMuted(),
                        nonLinearAdSlotHeight: this.getAdHeight() / 3
                    };
                },

                channels: {
                    "ads:load": function() {
                        this.call("load");
                    },
                    "ads:start": function(ev) {
                        this._onStart(ev);
                    },
                    "ads:allAdsCompleted": function() {
                        this.call("reset");
                    },
                    "ads:contentComplete": function() {
                        this.call("contentComplete");
                    },
                    "ads:loaded": function(event) {
                        this.set("ad", event.getAd());
                        this.set("addata", event.getAdData());
                        this.set("volume", this.adsManager.getVolume());
                        this.set("duration", event.getAdData().duration);
                    },
                    "ads:volumeChange": function() {
                        this.set("volume", this.adsManager.getVolume());
                    },
                    "ads:outstreamCompleted": function(dyn) {
                        this._outstreamCompleted(dyn);
                    },
                    "ads:outstreamStarted": function(dyn) {
                        this._outstreamStarted(dyn);
                    },
                    "ads:pause": function() {
                        this.set("playing", false);
                    },
                    "ads:resume": function() {
                        this.set("playing", true);
                    }
                },

                create: function() {
                    var dynamics = this.parent();
                    var adContainer = this.getAdContainer();
                    var adManagerOptions = {
                        adContainer: adContainer,
                        adsRenderingSettings: {
                            enablePreloading: true,
                            useStyledNonLinearAds: true,
                            restoreCustomPlaybackStateOnAdBreakComplete: true
                        }
                    };
                    this.set("isoutstream", !!this.get("outstream"));
                    if (!Info.isMobile() && this.getVideoElement() && !this.get("isoutstream")) {
                        // It's optionalParameter
                        adManagerOptions.videoElement = this.getVideoElement();
                    }
                    this.adsManager = this.auto_destroy(new AdsManager(adManagerOptions, dynamics));
                    this.adsManager.requestAds(this._baseRequestAdsOptions());
                    this.adsManager.on("all", function(event, data) {
                        this.channel("ads").trigger(event, data);
                    }, this);
                    if (dynamics) {
                        dynamics.on("resize", function(dimensions) {
                            // This part will listen to the resize even after adsManger will be destroyed
                            if (this.adsManager && typeof this.adsManager.resize === "function") {
                                this.adsManager.resize(
                                    dimensions.width, dimensions.height, google.ima.ViewMode.NORMAL
                                );
                            }
                        }, this);
                        dynamics.on("unmute-ads", function(volume) {
                            Async.eventually(function() {
                                // ads:volumeChange not trigger initially, only after change volume
                                this.set("volume", volume);
                                if (this.adsManager && typeof this.adsManager.setVolume === "function") {
                                    this.adsManager.setVolume(volume);
                                }
                            }, this, 300);
                        }, this);
                    }
                },

                functions: {
                    load: function() {
                        if (!this.adsManager) return this.once("dynamic-activated", function() {
                            this.call("load");
                        }, this);
                        this.adsManager.start({
                            width: this.getAdWidth(),
                            height: this.getAdHeight()
                        });
                    },
                    reset: function() {
                        this.set("linear", true);
                        this.adsManager.reset();
                        this.adsManager.requestAds(this._baseRequestAdsOptions());
                    },
                    requestAds: function(options) {
                        this.adsManager.requestAds(Objs.extend(this._baseRequestAdsOptions(), options));
                    },
                    contentComplete: function() {
                        this.adsManager.contentComplete();
                    },
                    pause: function() {
                        return this.adsManager.pause();
                    },
                    resume: function() {
                        return this.adsManager.resume();
                    },
                    setVolume: function(volume) {
                        volume = Math.min(volume, 1);
                        this.set("volume", volume);
                        return this.adsManager.setVolume(volume);
                    },
                    stop: function() {
                        return this.adsManager.stop();
                    },
                    replay: function() {
                        this._replay();
                    },
                    close: function() {
                        return this._hideContentPlayer(true);
                    }
                },

                getAdWidth: function() {
                    return this.activeElement().firstChild.clientWidth;
                },

                getAdHeight: function() {
                    return this.activeElement().firstChild.clientHeight;
                },

                getAdContainer: function() {
                    if (!this._adContainer) this._adContainer = this.activeElement().querySelector(".ba-ad-container");
                    return this._adContainer;
                },

                getVideoElement: function() {
                    if (!this._videoElement)
                        this._videoElement = this.parent() && this.parent().activeElement().querySelector("[data-video='video']"); // TODO video element for outstream
                    return this._videoElement;
                },

                getContentAutoplay: function() {
                    return this.parent() && this.parent().get("autoplay");
                },

                getAdWillAutoplay: function() {
                    return this.parent() && this.parent().get("autoplay-allowed");
                },

                getAdWillPlayMuted: function() {
                    return this.parent() && this.parent().get("autoplay-requires-muted");
                },

                _onStart: function(ev) {
                    this.set("playing", true);
                    this.set("currentTime", 0);
                    this.set("remaining", this.get("duration"));
                    this.set("showactionbuttons", false);

                    var isLinear = ev && ev.getAd && ev.getAd().isLinear();
                    this.set("linear", isLinear);
                    this.set("hidecontrolbar", !isLinear);
                    // if ad is outstream and
                    if (!isLinear && this.get("isoutstream")) {
                        this.adsManager.reset();
                    }
                },

                _outstreamCompleted: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _outstreamCompleted");
                    // this._hideContentPlayer(dyn);
                    // TODO: add option for selection
                    if (dyn.get("outstreamoptions")) {
                        if (!dyn.get("outstreamoptions").allowReply) {
                            this._hideContentPlayer(dyn);
                        } else {
                            this.set("showactionbuttons", true);
                            dyn.set("adshassource", false); // Be able to reattach ads_player
                        }
                    } else {
                        this._hideContentPlayer(dyn);
                    }
                },

                _outstreamStarted: function(dyn, options) {
                    this.set("isoutstream", true);
                },

                _replay: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _reply");
                    dyn.create();
                },

                _hideContentPlayer: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _hideContentPlayer");
                    dyn.activeElement().style.setProperty("display", "none");
                    dyn.weakDestroy(); // << Create will not work as expected
                }
            };
        }).register("ba-adsplayer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_player.html') %>*/
        }).attachStringTable(Assets.strings)
        .addStrings({
            "replay-ad": "Replay",
            "close-ad": "Close"
        });
});
