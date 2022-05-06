Scoped.define("module:Ads.IMARequester", [
    "base:Class",
    "browser:Info",
    "module:Ads.IMAManager",
    "base:Events.EventsMixin"
], function(Class, Info, AdsManager, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            /**
             * adsResponse; adTagUrl; contentDuration; contentKeywords; contentTitle;
             * forceNonLinearFullSlot; linearAdSlotHeight; linearAdSlotWidth;
             * liveStreamPrefetchSeconds; nonLinearAdSlotHeight; nonLinearAdSlotWidth;
             * omidAccessModeRules; OmidAccessMode - LIMITED, DOMAIN, FULL
             * VpaidMode - DISABLED, ENABLED, INSECURE
             * pageUrl; vastLoadTimeout;
             * setAdWillAutoPlay(boolean); setAdWillPlayMuted(bool);
             * setContinuousPlayback(boolean);
             * @param provider
             * @param loader
             * @param options
             * @param dyn
             * @param position
             */
            constructor: function(provider, loader, options, dyn, position) {

                inherited.constructor.call(this, loader, options, dyn, position);

                // init
                this._dyn = dyn;
                this._adsLoaded = false;
                this._position = position;
                this._adsLoader = loader;
                this._options = options;
                this._player = options.videoElement;
                this._adsManager = null;
                this._adControlbar = null;
                this._providerOptions = provider.options();

                this._adsRequest = new google.ima.AdsRequest();

                // google.ima.ImaSdkSettings.VpaidMode.DISABLED
                // DISABLED - VPAID ads will not play and an error will be returned.
                // ENABLED - VPAID ads are enabled using a cross domain iframe
                // INSECURE - This allows the ad access to the site via JavaScript.
                if (this._providerOptions.vpaidMode)
                    google.ima.settings.setVpaidMode(this._providerOptions.vpaidMode);

                // Call setLocale() to localize language text and downloaded swfs
                if (Info.language() !== "en" || this._providerOptions.locale)
                    google.ima.settings.setLocale(this._providerOptions.locale || Info.language());

                if (this._providerOptions.maxAllowedRedirects && Info.number(this._providerOptions.maxAllowedRedirects))
                    google.ima.settings.setNumRedirects(this._providerOptions.maxAllowedRedirects);


                // setAutoPlayAdBreaks(boolean)

                // For IOS skipable
                // google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);

                this._adsRequest = new google.ima.AdsRequest();

                // switch (position) {
                //     case provider.__IMA_PRE_ROLL:
                //         this._adsRequest.adTagUrl = this._providerOptions.adPreTagUrl || this._providerOptions.adTagUrl;
                //         break;
                //     case provider.__IMA_POST_ROLL:
                //         this._adsRequest.adTagUrl = this._providerOptions.adPostTagUrl || this._providerOptions.adTagUrl;
                //         break;
                //     default:
                //         this._adsRequest.adTagUrl = this._providerOptions._prepareMidURL() || this._providerOptions.adTagUrl;
                //         break;
                // }

                var self = this;
                this._adsRequest.adTagUrl = this._providerOptions.adTagUrl;
                this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function(err) {
                    self.onAdError(err.type, err.getError().toString());
                }, false);

                this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function(ev) {
                    // Preload if ad is preroll and user set preload option
                    self._adsManager = AdsManager.onAdsManagerLoaded(
                        ev, self, position === provider.__IMA_PRE_ROLL && options.preload
                    );
                }, false);
            },

            executeAd: function(options) {
                // Specify the linear and nonlinear slot sizes.
                // This helps the SDK to
                // select the correct creative if multiple are returned.
                this._adsRequest.linearAdSlotWidth = options.width;
                this._adsRequest.linearAdSlotHeight = options.height;
                // For non linear ads like image in te bottom side of the video
                this._adsRequest.nonLinearAdSlotWidth = options.width;
                this._adsRequest.nonLinearAdSlotHeight = options.height / 3;

                this._adsLoader.requestAds(this._adsRequest);
            },

            /**
             * TODO: IMPROVE FOR MID-ROLLS IF USER WANT SET DIFFERENT
             * @returns {null}
             * @private
             */
            _prepareMidURL: function() {
                return null;
            },

            /**
             * On Each IMA SDK events are triggered
             * @param ev
             * @private
             */
            onAdEvent: function(ev) {
                // Event type Priority: loaded, contentPauseRequested, start,
                // [firstQuartile, midpoint, thirdQuartile],
                // complete, contentResumeRequested, allAdsCompleted
                var data = typeof ev.getAd === 'function' ? ev.getAd() : null;
                switch (ev.type) {
                    case 'loaded':
                        this._adsLoaded = true;
                        this.trigger('ad-' + ev.type, data);
                        this._showIMAAdController(this, data);
                        break;
                    case 'allAdsCompleted':
                        this.trigger('finished');
                        break;
                    case 'contentPauseRequested':
                        if (this._dyn.get("playing")) this._dyn.pause();
                        this._options.adElement.style.display = "";
                        break;
                    case 'contentResumeRequested':
                        if (!this._dyn.get("playing")) this._dyn.play();
                        this._options.adElement.style.display = "none";
                        break;
                    default:
                        // Trigger events with ad- prefix
                        this.trigger('ad' + ev.type, typeof ev.getAd === 'function' ? ev.getAd() : null);

                }
            },

            /**
             * Show error if any occurecs
             * @param type
             * @param message
             * @private
             */
            onAdError: function(type, message) {
                if (this._adsManager) {
                    AdsManager.destroy(this._adsManager, this._adControlbar);
                }
                this.trigger('ad-error', message);
            },

            // destroy: function() {
            //     // if (this._adsManager)
            //     //     AdsManager.destroy(this._adsManager, this._adControlbar);
            //     // this._adsLoader.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR);
            //     // this._adsLoader.removeEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED);
            // },

            /**
             * @param requester IMA Ad requester
             * @param data IMA Ad data
             */
            _showIMAAdController: function(requester, data) {
                this._dyn.set("show-ad-controller", true);
                var controllerElement = this._dyn.activeElement().querySelector("[data-ads='controllbar']");
                if (controllerElement) {
                    this._adControlbar = new BetaJS.MediaComponents.Ads.IMA.Controllbar({
                        element: controllerElement,
                        attrs: {
                            requester: this,
                            data: data
                        }
                    });
                    this._adControlbar.activate();
                }
            }
        };
    }]);
});