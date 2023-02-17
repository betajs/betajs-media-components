Scoped.define("module:Ads.IMARequester", [
    "base:Class",
    "base:Objs",
    "base:Timers",
    "browser:Dom",
    "browser:Info",
    "base:Events.EventsMixin",
    "module:Ads.IMA.Controlbar"
], function(Class, Objs, Timers, Dom, Info, EventsMixin, IMAControlbar, scoped) {
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
                this._isLoaded = false;
                this._adsProvider = provider;
                this._adsPosition = position;
                this._autostart = autostart;
                this._adsLoader = dyn._adsLoader;
                this._options = dyn._adOptions;
                this._player = dyn._adOptions.videoElement;
                this._adsManager = null;
                this._adControlbar = null;
                this._providerOptions = provider.options();
                this._allAdsCompelted = false;
                this._isLinear = null;
                this._isPlaying = false;
                this._linearExpected = position !== provider.__IMA_AD_TYPE_NON_LINEAR;

                this._adsRequest = new google.ima.AdsRequest();

                // google.ima.ImaSdkSettings.VpaidMode.DISABLED
                // DISABLED == 0 - VPAID ads will not play, and an error will be returned.
                // ENABLED == 1 - VPAID ads are enabled using a cross-domain iframe
                // INSECURE == 2 - This allows the ad access to the site via JavaScript.
                if (this._providerOptions.vpaidMode && [
                        google.ima.ImaSdkSettings.VpaidMode.DISABLED,
                        google.ima.ImaSdkSettings.VpaidMode.ENABLED,
                        google.ima.ImaSdkSettings.VpaidMode.INSECURE
                    ].includes(this._providerOptions.vpaidMode))
                    google.ima.settings.setVpaidMode(this._providerOptions.vpaidMode);
                else
                    google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

                // Call setLocale() to localize language text and downloaded swfs
                if (Info.language() !== "en" || this._providerOptions.locale)
                    google.ima.settings.setLocale(this._providerOptions.locale || Info.language());

                if (this._providerOptions.maxAllowedRedirects && Info.number(this._providerOptions.maxAllowedRedirects))
                    google.ima.settings.setNumRedirects(this._providerOptions.maxAllowedRedirects);

                // setAutoPlayAdBreaks(boolean)
                // google.ima.settings.setVpaidAllowed(true); // true will cause an issue

                // For IOS skip able
                if (Info.isiOS() && Info.safariVersion() >= 10)
                    google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true);

                this._adsRequest = new google.ima.AdsRequest();
                this._adsRequest.adsResponse = this._providerOptions.inlineVASTXML;
                switch (position) {
                    case provider.__IMA_AD_TYPE_NON_LINEAR:
                        this._adsRequest.adTagUrl = this._providerOptions.nonLinearAdTagUrl || this._providerOptions.adTagUrl;
                        break;
                    case provider.__IMA_PRE_ROLL:
                        this._adsRequest.adTagUrl = this._providerOptions.preAdTagUrl || this._providerOptions.adTagUrl;
                        break;
                    case provider.__IMA_MID_ROLL:
                        this._adsRequest.adTagUresumeAfterAdrl = this._providerOptions.midAdTagUrl || this._providerOptions.adTagUrl;
                        break;
                    case provider.__IMA_POST_ROLL:
                        this._adsRequest.adTagUrl = this._providerOptions.postAdTagUrl || this._providerOptions.adTagUrl;
                        break;
                    default:
                        this._adsRequest.adTagUrl = this._providerOptions.adTagUrl;
                        break;
                }

                var self = this;
                this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function(err) {
                    self.onAdError(err.type, err.getError().toString());
                }, false);

                this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function(ev) {
                    // Preload if ad is preroll and user set a preload option
                    self.onAdsManagerLoaded(ev, !!provider.__IMA_PRE_ROLL || self._autostart);
                    self._isLoaded = true;
                    if (self._autostart) self.startAd();
                }, false);
            },

            executeAd: function(options) {
                if (!this._adsRequest) return;
                // Specify the linear and nonlinear slot sizes.
                // This helps the SDK to
                // select the correct creative if multiple is returned.
                this._adsRequest.linearAdSlotWidth = +options.width;
                this._adsRequest.linearAdSlotHeight = +options.height;

                // For non-linear ads like image in te bottom side of the video
                this._adsRequest.nonLinearAdSlotWidth = +options.width;
                this._adsRequest.nonLinearAdSlotHeight = +options.height;

                if (options.autoplayAllowed && typeof options.autoplayAllowed === "boolean") {
                    this._adsRequest.setAdWillAutoPlay(options.autoplayAllowed);
                }
                if (options.autoplayRequiresMuted && typeof options.autoplayRequiresMuted === "boolean") {
                    // setAdWillPlayMuted -- is just an informative method
                    this._adsRequest.setAdWillPlayMuted(options.autoplayRequiresMuted);
                }
                this._autoPlayAllowed = !!options.autoplayRequiresMuted && !!options.autoplayAllowed;
                if (options.playlistVideo && typeof options.playlistVideo === "boolean")
                    this._adsRequest.setContinuousPlayback(options.playlistVideo);

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
                // mimeTypes == Only supported for linear video mime types
                // playAdsAfterTime == For VMAP and ad rules playlists, only play ad breaks scheduled after this time (in seconds)
                // Set to false if you wish to have fine-grained control over the positioning of all non-linear ads
                // adRenderingSettings.autoAlign = false;
                // uiElements [nullable Array of string] == Specifies whether the UI elements that should be displayed,
                //          The elements in this array are ignored for AdSense/AdX ads
                if (this._linearExpected) {
                    adRenderingSettings.enablePreloading = preload;
                } else {
                    // useStyledNonLinearAds == Render non-linear ads with a close and recall button.
                    adRenderingSettings.useStyledNonLinearAds = true;
                }
                adRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

                // getUserRequestContext
                this._adsManager = adsManagerLoadedEvent.getAdsManager(
                    this._player, adRenderingSettings
                );
                this._userContext = adsManagerLoadedEvent.getUserRequestContext();
            },

            /**
             * On Each IMA SDK event is triggered
             * @param ev
             * @private
             */
            onAdEvent: function(ev) {
                // Event type Priority: loaded, contentPauseRequested, start,
                // [firstQuartile, midpoint, thirdQuartile],
                // complete, contentResumeRequested, allAdsCompleted
                var ad = typeof ev.getAd === 'function' ? ev.getAd() : null;
                var player = this._dyn;

                if (player) player.trigger('ad-' + ev.type, ad);

                switch (ev.type) {
                    case google.ima.AdEvent.Type.LOADED:
                        this._isLinear = ad.isLinear();
                        this._allAdsCompelted = false;
                        this.trigger('adloaded', ad);
                        break;
                    case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                        if (this._adControlbar) {
                            this._adControlbar.weakDestroy();
                            this._adControlbar = undefined;
                        }
                        if (this._adsProvider && this._dyn) {
                            if (this._adsPosition === this._adsProvider.__IMA_POST_ROLL) {
                                this._dyn.stop();
                            }
                        }
                        this._allAdsCompelted = true;
                        try {
                            this._options.adElement.style.display = "none";
                        } catch (e) {}
                        this.resetAdsManager();
                        this.trigger('adfinished', this._dyn);
                        break;
                    case google.ima.AdEvent.Type.STARTED:
                        this._allAdsCompelted = false;
                        if (this._dyn) {
                            // Don't show NonLinear on post-roll
                            if (this._adsPosition !== this._adsProvider.__IMA_POST_ROLL && !ad.isLinear()) {
                                this._options.adElement.style.display = "";
                                this._dyn.set("linearadplayer", false);

                                this._leftSuggesstedDuration = ad.getMinSuggestedDuration() || this._providerOptions.nonLinearDuration || 10;
                                if (this._leftSuggesstedDuration > 0) {

                                    this._timer = this._auto_destroy(new Timers.Timer({
                                        context: this,
                                        fire: function() {
                                            // Show at least minSuggested duration
                                            // and freeze a timer if user set to pause or skip
                                            this._leftSuggesstedDuration--;
                                            if (this._leftSuggesstedDuration < 1 && this._dyn) {
                                                // If in the next iteration there's no ads roll still continue showing ad,
                                                // till it will not disappear itself
                                                if (this._dyn._adsRoll) {
                                                    this.manuallyEndAd();
                                                }
                                                this._dyn._adsRoll = null;
                                                this._timer.stop();
                                            }
                                        },
                                        delay: 1000,
                                        start: true,
                                        destroy_on_stop: true
                                    }, this));
                                }
                            }
                            if (this._dyn.get("companion-ad") && ad) {
                                this._showCompanionAd(ad, this._dyn);
                            }
                        }
                        this.trigger('ad' + ev.type, ad);
                        break;
                    case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                        if (ad.isLinear()) this._dyn.pause();
                        if ((ad.isLinear() && this._linearExpected) || (!ad.isLinear() && !this._linearExpected)) {
                            this._options.adElement.style.display = "";
                            if (!this._adControlbar) this._showIMAAdController(ad);
                        } else {
                            this.manuallyEndAd();
                        }
                        break;
                    case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                        if (this._options)
                            this._options.adElement.style.display = "none";
                        if (this._dyn && ad.isLinear()) {
                            if (!this._dyn.get("playing") && this._adsPosition !== this._adsProvider.__IMA_POST_ROLL) {
                                if (!this._dyn.videoAttached()) {
                                    this._dyn.on("attached", function(player) {
                                        if (!this.get("playing")) this.play();
                                    }, this._dyn);
                                } else {
                                    this._dyn.play();
                                }
                            }
                        }
                        this.trigger('ad' + ev.type, ad);
                        break;
                    case google.ima.AdEvent.Type.AD_PROGRESS:
                        // be sure player will not run in the background on linear ad
                        // if (this._dyn && this._isLinear && this._dyn.get("playing"))
                        //     this._dyn.pause();
                        break;
                    case google.ima.AdEvent.Type.PAUSED:
                        this._isPlaying = false;
                        this.trigger('ad' + ev.type, ad);
                        break;
                    case google.ima.AdEvent.Type.RESUMED:
                        this._isPlaying = true;
                        this.trigger('ad' + ev.type, ad);
                        break;
                    case google.ima.AdEvent.Type.USER_CLOSE:
                        this.manuallyEndAd();
                        this.trigger('ad' + ev.type, ad);
                        break;
                    default:
                        // Trigger events with a prefix ad
                        this.trigger('ad' + ev.type, ad);
                }
            },

            /**
             * Show error if any occurred
             * @param type
             * @param message
             * @private
             */
            onAdError: function(type, message) {
                if (this._options && this._options.adElment)
                    this._options.adElment.style.display = "none";
                if (this._adControlbar) {
                    this._adControlbar.weakDestroy();
                    this._adControlbar = undefined;
                }
                if (typeof type.getError === "function") {
                    var error = type.getError();
                    if (error) {
                        message = error.getMessage() + ' Code: ' + error.getErrorCode();
                    }
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
                var requester = this;

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
                    initWidth = Dom.elementDimensions(dyn.activeElement()).width || dyn.parentWidth();
                    initHeight = Dom.elementDimensions(dyn.activeElement()).height || dyn.parentHeight();
                }

                try {
                    // init(width, height, viewMode, videoElement)
                    this._adsManager.init(initWidth, initHeight, google.ima.ViewMode.NORMAL);
                    // Play if browser allows playing without sound
                    // this._adsRequest.setAdWillPlayMuted(true);
                    if (dyn.get("autoplay-requires-muted") && dyn.get("autoplay-allowed") && dyn.get("autoplay")) {
                        this._adsManager.setVolume(0);
                    }
                    this._adsManager.start();
                } catch (e) {
                    this.onAdError('Ad Manager Init Error: ', e);
                }
            },

            manuallyEndAd: function() {
                // Skip the current ad when AdsManager.getAdSkippableState() is true.
                // this._adsManager.skip();

                // Stop playing the ads. Calling this will get publisher back to the content.
                // this._adsManager.stop();

                // If an ad break is currently playing, discard it and resume content.
                // this._adsManager.discardAdBreak();

                this.resetAdsManager();

                if (this._options)
                    this._options.adElement.style.display = "none";
                this.trigger('adendmanually', this._adsManager && this._adsManager.getCurrentAd ? this._adsManager.getCurrentAd() : undefined, this._dyn);
            },

            // Will get a new AdsManager when will make next request.
            resetAdsManager: function() {
                // Removes ad assets loaded at runtime that need to be properly removed at the time of ad completion
                // and stops the ad and all tracking
                if (this._adsManager) {
                    this._adsManager.destroy();
                    this._adsManager = undefined;
                }

                // Signals to the SDK that the content is finished.
                // This will allow the SDK to play post-roll ads if any are loaded via ad rules.
                if (this._adsLoader) this._adsLoader.contentComplete();
            },

            /**
             * @param data IMA Ad data
             */
            _showIMAAdController: function(data) {
                if (data) this._dyn.set("linearadplayer", data.isLinear());
                var controllerElement = this._dyn.activeElement().querySelector("[data-ads='controlbar']");
                if (controllerElement) {
                    this._adControlbar = new IMAControlbar({
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
             * @param ad IMA Ad data
             * @param dyn
             */
            _showCompanionAd: function(ad, dyn) {
                var element, playerElement, position, selector, options, height, width;
                playerElement = dyn.activeElement();
                options = dyn.get("companion-ad");
                if (options.split('|').length > 0) {
                    position = options.split('|')[1] || 'bottom';
                }
                options = options.replace(/\].*/g, "$'").split('[');
                selector = options[0];
                if (selector) {
                    element = document.getElementById(selector);
                } else {
                    element = document.createElement('div');
                }
                if (!element) return;
                var dimensions = options[1].split(',');
                var isFluid = dimensions[0] === 'fluid';
                // dimensions = dimensions.split(',');
                if (!isFluid) {
                    width = Number((dimensions && dimensions[0] && dimensions[0] > 0) ?
                        dimensions[0] : Dom.elementDimensions(playerElement).width);
                    height = Number((dimensions && dimensions[1] && dimensions[1] > 0) ?
                        dimensions[1] : Dom.elementDimensions(playerElement).height);
                }
                var selectionCriteria = new google.ima.CompanionAdSelectionSettings();
                // HTML,IFRAME,STATIC,ALL
                selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.ALL;
                // CreativeType:IMAGE, FLASH, ALL
                selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.ALL;
                var companionAds = [];

                // SizeCriteria: IGNORE, SELECT_EXACT_MATCH, SELECT_NEAR_MATCH, SELECT_FLUID
                if (!isFluid) {
                    // nearMatchPercent
                    selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;
                    if (width && height) {
                        // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
                        companionAds = ad.getCompanionAds(width, height, selectionCriteria);
                    }
                } else {
                    selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.SELECT_FLUID;
                    companionAds = ad.getCompanionAds(0, 0, selectionCriteria);
                }


                if (typeof companionAds[0] === "undefined") return;

                var companionAd = companionAds[0];
                // Get HTML content from the companion ad.
                // Write the content to the companion ad slot.
                element.innerHTML = companionAd.getContent();
                if (position && !selector) {
                    switch (position) {
                        case 'left':
                            // Prevent on click though taking all the width of the div element
                            element.style.display = 'inline-block';
                            element.style['float'] = 'left';
                            playerElement.parentNode.prepend(element);
                            break;
                        case 'top':
                            playerElement.parentNode.prepend(element);
                            break;
                        case 'right':
                            // Prevent on click though taking all the width of the div element
                            element.style.display = 'inline-block';
                            playerElement.style['float'] = 'left';
                            playerElement.parentNode.append(element);
                            break;
                        default:
                            playerElement.parentNode.append(element);
                    }
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
                    google.ima.AdEvent.Type.RESUMED, // ?? not trigger

                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.VIDEO_CLICKED,
                    google.ima.AdEvent.Type.AD_PROGRESS,
                    google.ima.AdEvent.Type.DURATION_CHANGE,
                    google.ima.AdEvent.Type.SKIPPED,
                    google.ima.AdEvent.Type.LINEAR_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_MUTED,

                    google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,


                    google.ima.AdEvent.Type.INTERACTION,
                    google.ima.AdEvent.Type.USER_CLOSE,
                    google.ima.AdEvent.Type.VIDEO_ICON_CLICKED,
                    google.ima.AdEvent.Type.AD_BUFFERING,
                    google.ima.AdEvent.Type.AD_METADATA,
                    google.ima.AdEvent.Type.AD_BREAK_READY
                    // ,google.ima.AdEvent.Type.LOG
                ];
            }
        };
    }]);
});