Scoped.define("module:Ads.IMAManager", [
    "base:Objs",
    "browser:Dom"
], function(Objs, Dom) {
    return {

        /**
         * focus() - Puts the focus on the skip button, if present
         * getAdSkippableState() boolean
         * getRemainingTime()
         * getCuePoints() non-null Array of number // Returns an array of offsets 0-preroll -1-postroll
         * getVolume() number  0 (muted) to 1 (loudest).
         * isCustomPlaybackUsed () - boolean
         * start(), stop(), pause() resume(), setVolume(), skip(), resize(width, height, viewMode)
         * ViewMode - NORMAL, FULLSCREEN
         * updateAdsRenderingSettings(adsRenderingSettings)
         * @param adsManagerLoadedEvent
         * @param requester
         * @param preload
         * @returns {*}
         */
        onAdsManagerLoaded: function(adsManagerLoadedEvent, requester, preload) {
            var adRenderingSettings = new google.ima.AdsRenderingSettings();
            adRenderingSettings.enablePreloading = preload;
            adRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

            // getUserRequestContext
            var adsManager = adsManagerLoadedEvent.getAdsManager(
                requester._player, adRenderingSettings
            );

            // requester._eventHandler = requester.auto_destroy(this.cls());

            this._start(adsManager, requester);
            return adsManager;
        },

        /**
         * Start requested ad
         * @param adsManager
         * @param requester
         * @private
         */
        _start: function(adsManager, requester) {
            var dyn = requester._dyn;

            /**
             * Listen to error event
             */
            adsManager.addEventListener(
                google.ima.AdErrorEvent.Type.AD_ERROR,
                function(ev) {
                    return requester.onAdError(ev);
                }, false, this
            );

            /**
             * All events listed above in except error event which will be trigger separately
             */
            Objs.iter(this.__events(), function(event) {
                // requester._eventHandler.on(adManager, event, function() {
                //     return requester.onAdEvent(ev);
                // });
                adsManager.addEventListener(event, function(ev) {
                    return requester.onAdEvent(ev);
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
                initWidth = dyn.videoWidth();
                initHeight = dyn.videoHeight();
            }

            try {
                // init(width, height, viewMode, videoElement)
                adsManager.init(initWidth, initHeight, google.ima.ViewMode.NORMAL);
                adsManager.start();
            } catch (e) {
                requester.onAdError('Ad Manager Init', e);
            }
        },

        /**
         * Terminate and remove all event listeners
         * @param adsManager
         * @param controlbar
         */
        destroy: function(adsManager, controlbar) {
            // IF controlbar was generated
            // if (typeof controlbar === 'object' && controlbar) controlbar.destroy();
            // if (typeof adsManager === 'object' && adsManager) adsManager.destroy();

            // var events = this.__events();
            // events.push(google.ima.AdErrorEvent.Type.AD_ERROR);
            // var counter = events.length;
            // if (adsManager) {
            //     Objs.iter(events, function(event) {
            //         adsManager.removeEventListener(event);
            //         counter--;
            //         // After removing all listeners destroy self
            //         if (counter === 0) {
            //             adsManager.destroy();
            //         }
            //     }, this);
            // }
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
});