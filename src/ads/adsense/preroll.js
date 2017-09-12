Scoped.define("module:Ads.AdSenseVideoAdProvider", [
        "module:Ads.AbstractVideoAdProvider", "module:Ads.AdSensePrerollAd"
    ],
    function(AbstractVideoAdProvider, AdSensePrerollAd, scoped) {
        return AbstractVideoAdProvider.extend({
            scoped: scoped
        }, {

            _newPrerollAd: function(options) {
                return new AdSensePrerollAd(this, options);
            }

        });
    });


Scoped.define("module:Ads.AdSensePrerollAd", [
    "module:Ads.AbstractPrerollAd"
], function(AbstractVideoPrerollAd, scoped) {
    return AbstractVideoPrerollAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this, provider, options);
                this._adDisplayContainer = new google.ima.AdDisplayContainer(this._options.adElement, this._options.videoElement);
                // Must be done as the result of a user action on mobile
                this._adDisplayContainer.initialize();
                //Re-use this AdsLoader instance for the entire lifecycle of your page.
                this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);

                var self = this;
                this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function() {
                    self._adError();
                }, false);
                this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function() {
                    self._adLoaded.apply(self, arguments);
                }, false);

                this._adsRequest = new google.ima.AdsRequest();
                this._adsRequest.adTagUrl = this._provider.options().adTagUrl;
            },

            _executeAd: function(options) {
                // Specify the linear and nonlinear slot sizes. This helps the SDK to
                // select the correct creative if multiple are returned.
                this._adsRequest.linearAdSlotWidth = options.width;
                this._adsRequest.linearAdSlotHeight = options.height;
                // adsRequest.nonLinearAdSlotWidth = 640;
                // adsRequest.nonLinearAdSlotHeight = 150;

                this._adsLoader.requestAds(this._adsRequest);
            },

            _adError: function() {
                if (this._adsManager)
                    this._adsManager.destroy();
                this._adFinished();
            },

            _adLoaded: function(adsManagerLoadedEvent) {
                // Get the ads manager.
                this._adsManager = adsManagerLoadedEvent.getAdsManager(this._options.videoElement);
                // See API reference for contentPlayback

                try {
                    // Initialize the ads manager. Ad rules playlist will start at this time.
                    this._adsManager.init(this._adsRequest.linearAdSlotWidth, this._adsRequest.linearAdSlotHeight, google.ima.ViewMode.NORMAL);
                    // Call start to show ads. Single video and overlay ads will
                    // start at this time; this call will be ignored for ad rules, as ad rules
                    // ads start when the adsManager is initialized.
                    this._adsManager.start();
                } catch (adError) {
                    // An error may be thrown if there was a problem with the VAST response.
                }

                var self = this;
                // Add listeners to the required events.
                this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function() {
                    self._adError();
                }, false);

                //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
                this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function() {
                    self._adFinished();
                });

                //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
                this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, function() {
                    self._adSkipped();
                });
            }

        };
    });
});