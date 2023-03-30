Scoped.define("module:Ads.IMA.AdsManager", [
    "base:Class",
    "base:Objs",
    "base:Events.EventsMixin"
], function(Class, Objs, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(options) {
                inherited.constructor.call(this, options);
                if (!options.adContainer) throw Error("Missing adContainer");
                if (!options.videoElement) throw Error("Missing videoElement");
                this._options = options;
                this._adDisplayContainer = new google.ima.AdDisplayContainer(options.adContainer, options.videoElement);
                this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);
                this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this), false);
                this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded.bind(this), false);
            },

            destroy: function() {
                if (this._adsManager) {
                    this._adsManager.destroy();
                    this._adsManager = null;
                }
                inherited.destroy.call(this);
            },

            requestAds: function(options) {
                this._adsRequest = new google.ima.AdsRequest();
                if (options.adTagUrl) this._adsRequest.adTagUrl = options.adTagUrl;
                else if (options.inlinevastxml) this._adsRequest.adsResponse = options.inlinevastxml;
                this._adsRequest.linearAdSlotWidth = options.linearAdSlotWidth;
                this._adsRequest.linearAdSlotHeight = options.linearAdSlotHeight;
                this._adsRequest.nonLinearAdSlotWidth = options.nonLinearAdSlotWidth;
                this._adsRequest.nonLinearAdSlotHeight = options.nonLinearAdSlotHeight;
                this._adsRequest.setAdWillAutoPlay(options.adWillAutoPlay);
                this._adsRequest.setAdWillPlayMuted(options.adWillPlayMuted);
                this._adsRequest.setContinuousPlayback(options.continuousPlayback);
                this._adsLoader.requestAds(this._adsRequest);
            },

            onAdsManagerLoaded: function(adsManagerLoadedEvent) {
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                if (this._options && this._options.adsRenderingSettings) {
                    for (var setting in this._options.adsRenderingSettings) {
                        adsRenderingSettings[setting] = this._options.adsRenderingSettings[setting];
                    }
                }
                this._adsManager = adsManagerLoadedEvent.getAdsManager(
                    this._options.videoElement, adsRenderingSettings
                );
                this.addEventListeners();
                this.__methods().forEach(function(method) {
                    this[method] = this._adsManager[method].bind(this._adsManager);
                }.bind(this));
                this.trigger(adsManagerLoadedEvent.type, adsManagerLoadedEvent);
            },

            onAdEvent: function(event) {
                this.trigger(event.type, event);
            },

            onAdError: function(event) {
                var message = event.message || event.errorMessage || event;
                if (event.getError) {
                    var error = event.getError();
                    if (error) {
                        message = error.getMessage() + ' Code: ' + error.getErrorCode();
                    }
                }
                this.trigger('ad-error', message);
            },

            addEventListeners: function() {
                Objs.iter(this.__events(), function(eventType) {
                    this._adsManager.addEventListener(eventType, function(event) {
                        if (event.type === google.ima.AdErrorEvent.Type.AD_ERROR) return this.onAdError(event);
                        if (event.type === google.ima.AdEvent.Type.LOG) {
                            var data = event.getAdData();
                            if (data.adError) console.warn("Non fatal ad error", data.adError.getMessage());
                            return;
                        }
                        return this.onAdEvent(event);
                    }, false, this);
                }, this);
            },

            contentComplete: function() {
                if (this._adsLoader) this._adsLoader.contentComplete();
            },

            reset: function() {
                if (this._adsManager) this._adsManager.destroy();
            },

            start: function(options) {
                if (!this._adsManager) {
                    return this.once("adsManagerLoaded", function() {
                        this.start(options);
                    }, this);
                }
                try {
                    this._adDisplayContainer.initialize();
                    this._adsManager.init(options.width, options.height, google.ima.ViewMode.NORMAL);
                    if (this._requestOptions && this._requestOptions.contentAutoplay && this._requestOptions.adWillPlayMuted) {
                        this._adsManager.setVolume(0);
                    }
                    this._adsManager.start();
                } catch (e) {
                    this.onAdError(e);
                    throw e;
                }
            },

            __methods: function() {
                return [
                    "collapse",
                    "discardAdBreak",
                    "focus",
                    "getAdSkippableState",
                    "getCuePoints",
                    "getCurrentAd",
                    "getRemainingTime",
                    "getVolume",
                    "isCustomClickTrackingUsed",
                    "isCustomPlaybackUsed",
                    "pause",
                    "resize",
                    "resume",
                    "setVolume",
                    "skip",
                    "stop",
                    "updateAdsRenderingSettings"
                ];
            },

            __events: function() {
                return [
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    google.ima.AdEvent.Type.AD_CAN_PLAY,
                    google.ima.AdEvent.Type.IMPRESSION,
                    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, // contentPauseRequested
                    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, // contentResumeRequested
                    google.ima.AdEvent.Type.LOADED, // loaded
                    google.ima.AdEvent.Type.STARTED, // start
                    google.ima.AdEvent.Type.FIRST_QUARTILE, // firstQuartile
                    google.ima.AdEvent.Type.MIDPOINT, // midpoint
                    google.ima.AdEvent.Type.THIRD_QUARTILE, // thirdQuartile
                    google.ima.AdEvent.Type.COMPLETE, // complete
                    google.ima.AdEvent.Type.ALL_ADS_COMPLETED, // allAdsCompleted
                    google.ima.AdEvent.Type.PAUSED, // pause
                    google.ima.AdEvent.Type.RESUMED,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.VIDEO_CLICKED,
                    google.ima.AdEvent.Type.AD_PROGRESS,
                    google.ima.AdEvent.Type.DURATION_CHANGE,
                    google.ima.AdEvent.Type.SKIPPED,
                    google.ima.AdEvent.Type.LINEAR_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_CHANGED, // volumeChange
                    google.ima.AdEvent.Type.VOLUME_MUTED,
                    google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,
                    google.ima.AdEvent.Type.INTERACTION,
                    google.ima.AdEvent.Type.USER_CLOSE,
                    google.ima.AdEvent.Type.VIDEO_ICON_CLICKED,
                    google.ima.AdEvent.Type.AD_BUFFERING,
                    google.ima.AdEvent.Type.AD_METADATA,
                    google.ima.AdEvent.Type.AD_BREAK_READY,
                    google.ima.AdEvent.Type.LOG
                ];
            }
        };
    }]);
});