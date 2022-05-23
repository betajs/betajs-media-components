Scoped.define("module:Ads.IMARequester", [
    "base:Class",
    "base:Objs",
    "browser:Dom",
    "browser:Info",
    "base:Events.EventsMixin"
], function(Class, Objs, Dom, Info, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            /**
             * @param provider
             * @param dyn
             * @param {string} position
             * @param {boolean} autostart
             */
            constructor: function(provider, dyn, position, autostart) {
                inherited.constructor.call(this, dyn, position, autostart);

                // init
                this._dyn = dyn;
                this._adsLoaded = false;
                this._adsProvider = provider;
                this._adsPosition = position;
                this._autostart = autostart;
                this._adsLoader = dyn._adsLoader;
                this._options = dyn._adOptions;
                this._player = dyn._adOptions.videoElement;
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
                    // Preload if ad is preroll and user set preload optin
                    self.onAdsManagerLoaded(ev, provider.__IMA_PRE_ROLL || self._autostart);
                    self._adsLoaded = true;
                    if (self._autostart) self.startAd();
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
             * @param adsManagerLoadedEvent
             * @param {boolean} preload
             * @returns {*}
             */
            onAdsManagerLoaded: function(adsManagerLoadedEvent, preload) {
                var adRenderingSettings = new google.ima.AdsRenderingSettings();
                adRenderingSettings.enablePreloading = preload;
                adRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

                // getUserRequestContext
                this._adsManager = adsManagerLoadedEvent.getAdsManager(
                    this._player, adRenderingSettings
                );
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
                        this.trigger('ad' + ev.type, data);
                        this._showIMAAdController(this, data);
                        break;
                    case 'allAdsCompleted':
                        this.trigger('adfinished');
                        break;
                    case 'contentPauseRequested':
                        if (this._dyn.get("playing")) this._dyn.pause();
                        this._options.adElement.style.display = "";
                        break;
                    case 'contentResumeRequested':
                        this._options.adElement.style.display = "none";
                        break;
                    default:
                        // Trigger events with ad- prefix
                        this.trigger('ad' + ev.type, data);
                }
            },

            /**
             * Show error if any occurecs
             * @param type
             * @param message
             * @private
             */
            onAdError: function(type, message) {
                if (this._adControlbar) {
                    this._adControlbar.destroy();
                }
                this.trigger('ad-error', message);
            },

            /**
             * Destroy class
             */
            // destroy: function() {
            //     inherited.destroy.call(this);
            // },

            /**
             * Start requested ad
             * @private
             */
            startAd: function() {
                var dyn = this._dyn;

                /**
                 * Listen to error event
                 */
                this._adsManager.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    function(ev) {
                        return requester.onAdError(ev);
                    }, false, this
                );

                /**
                 * All events listed above in except error event which will be trigger separately
                 */
                Objs.iter(this.__events(), function(event) {
                    this._adsManager.addEventListener(event, function(ev) {
                        return this.onAdEvent(ev);
                    }, false, this);
                }, this);

                /**
                 * Set preferred video dimensions
                 */
                var initWidth, initHeight;
                if (dyn.get("fullscreened")) {
                    initWidth = Dom.elementDimensions(document.body).width;
                    initHeight = Dom.elementDimensions(document.body).height;
                } else {
                    initWidth = dyn.parentWidth();
                    initHeight = dyn.parentHeight();
                }

                try {
                    // init(width, height, viewMode, videoElement)
                    this._adsManager.init(initWidth, initHeight, google.ima.ViewMode.NORMAL);
                    this._adsManager.start();
                } catch (e) {
                    this.onAdError('Ad Manager Init Error: ', e);
                }
            },

            /**
             * @param data IMA Ad data
             */
            _showIMAAdController: function(data) {
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
            },

            /**
             * IMA SDK events
             * @returns {(*|number)[]}
             * @private
             *
             * CONTENT_PAUSE_REQUESTED
             * Fired when content should be paused. This usually happens right before an ad is about to cover the content.
             *
             * CONTENT_RESUME_REQUESTED
             * Fired when content should be resumed. This usually happens when an ad finishes or collapses.
             *
             * CLICK
             * Fired when the ad is clicked.
             *
             * VIDEO_CLICKED
             * Fired when the non-clickthrough portion of a video ad is clicked.
             *
             * VIDEO_ICON_CLICKED
             * Fired when a user clicks a video icon.
             *
             * STARTED
             * Fired when the ad starts playing.
             *
             * AD_PROGRESS
             * Fired when the ad's current time value changes. Calling getAdData() on this event will return an AdProgressData object.
             *
             * AD_BUFFERING
             * Fired when the ad has stalled playback to buffer.
             *
             * IMPRESSION
             * Fired when the impression URL has been pinged.
             *
             * PAUSED
             * Fired when the ad is paused.
             *
             * RESUMED
             * Fired when the ad is resumed.
             *
             * FIRST_QUARTILE
             * Fired when the ad playhead crosses first quartile.
             *
             * MIDPOINT
             * Fired when the ad playhead crosses midpoint.
             *
             * THIRD_QUARTILE
             * Fired when the ad playhead crosses third quartile.
             *
             * COMPLETE
             * Fired when the ad completes playing.
             *
             * DURATION_CHANGE
             * Fired when the ad's duration changes.
             *
             * USER_CLOSE
             * Fired when the ad is closed by the user.
             *
             * LOADED
             * Fired when ad data is available.
             *
             * ALL_ADS_COMPLETED
             * Fired when the ads manager is done playing all the valid ads in the ads response, or when the response doesn't return any valid ads.
             *
             * SKIPPED
             * Fired when the ad is skipped by the user.
             *
             * LINEAR_CHANGED
             * Fired when the displayed ad changes from linear to nonlinear, or vice versa.
             *
             * SKIPPABLE_STATE_CHANGED
             * Fired when the displayed ads skippable state is changed.
             *
             * AD_METADATA
             * Fired when an ads list is loaded.
             *
             * AD_BREAK_READY
             * Fired when an ad rule or a VMAP ad break would have played if autoPlayAdBreaks is false.
             *
             * LOG
             * Fired when a non-fatal error is encountered. The user need not take any action since the SDK will continue with the same or next ad playback depending on the error situation.
             *
             * VOLUME_CHANGED
             * Fired when the ad volume has changed.
             *
             * VOLUME_MUTED
             * Fired when the ad volume has been muted.
             *
             * INTERACTION
             * Fired when an ad triggers the interaction callback. Ad interactions contain an interaction ID string in the ad data.
             */
            __events: function() {
                return [
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
                    google.ima.AdEvent.Type.RESUMED, // ?? not trigger

                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.VIDEO_CLICKED,
                    google.ima.AdEvent.Type.AD_PROGRESS,
                    google.ima.AdEvent.Type.DURATION_CHANGE,
                    google.ima.AdEvent.Type.SKIPPED,
                    google.ima.AdEvent.Type.LINEAR_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_MUTED,

                    google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED
                ];
            }
        };
    }]);
});