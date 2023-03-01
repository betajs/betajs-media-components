Scoped.define("module:Ads.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Ads.IMALoader",
    "module:Ads.IMA.AdsManager"
], [
    "module:Ads.Dynamics.Controlbar"
], function(Class, IMALoader, AdsManager, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/ads_player.html') %>",

                attrs: {
                    dyncontrolbar: "ads-controlbar",
                    tmplcontrolbar: ""
                },

                _deferActivate: function() {
                    if (this._loadedSDK) return false;
                    IMALoader.loadSDK().success(function() {
                        this._loadedSDK = true;
                        this.activate();
                    }, this);
                    return true;
                },

                channels: {
                    "ads:load": function() {
                        this.call("load");
                    },
                    "ads:contentComplete": function() {
                        this.call("contentComplete");
                    },
                    "ads:loaded": function(event) {
                        this.set("volume", this.adsManager.getVolume());
                        this.set("duration", event.getAdData().duration);
                    },
                    "ads:volumeChange": function() {
                        this.set("volume", this.adsManager.getVolume());
                    }
                },

                create: function() {
                    var adContainer = this.getAdContainer();
                    var videoElement = this.getVideoElement();
                    this.adsManager = this.auto_destroy(new AdsManager({
                        adContainer: adContainer,
                        videoElement: videoElement,
                        adsRenderingSettings: {
                            enablePreloading: true,
                            useStyledNonLinearAds: true,
                            restoreCustomPlaybackStateOnAdBreakComplete: true
                        }
                    }));
                    this.adsManager.requestAds({
                        adTagUrl: this.get("adtagurl"),
                        adWillAutoPlay: true, // TODO
                        adWillAutoPlayMuted: false, // TODO
                        continuousPlayback: false, // TODO
                        linearAdSlotWidth: this.getAdWidth(),
                        linearAdSlotHeight: this.getAdHeight(),
                        nonLinearAdSlotWidth: this.getAdWidth(),
                        nonLinearAdSlotHeight: this.getAdHeight() / 3
                    });
                    this.adsManager.on("all", function(event, data) {
                        this.channel("ads").trigger(event, data);
                    }, this);
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
                        return this.adsManager.setVolume(Math.min(volume, 1));
                    },
                    stop: function() {
                        return this.adsManager.stop();
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
                    if (!this._videoElement) this._videoElement = this.parent() && this.parent().activeElement().querySelector("[data-video='video']"); // TODO video element for outstream
                    return this._videoElement;
                }
            };
        }).register("ba-adsplayer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_player.html') %>*/
        });
});