Scoped.define("module:Ads.IMALoader", [
    "base:Promise",
    "browser:Loader"
], function(Promise, Loader) {
    return {

        /**
         * @param options
         * @returns {*}
         */
        loadSDK: function(options) {
            var promise = Promise.create();
            // https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/architecture
            try {
                if (typeof google === "undefined") {
                    Loader.loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js', function() {
                        promise.asyncSuccess();
                    }, this);
                } else {
                    // Just in case, check if Google is relating IMA SDK, not another Google service
                    if (typeof google.ima === "undefined") {
                        Loader.loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js', function() {
                            promise.asyncSuccess();
                        }, this);
                    } else promise.asyncSuccess();
                }
            } catch (e) {
                promise.asyncError(e);
            }

            return promise;
        },

        loadIAS: function() {
            var promise = Promise.create();
            try {
                if (typeof googleImaVansAdapter === "undefined") {
                    Loader.loadScript('https://static.adsafeprotected.com/vans-adapter-google-ima.js', function() {
                        promise.asyncSuccess(true);
                    }, this);
                } else {
                    promise.asyncSuccess(true);
                }
            } catch (e) {
                promise.asyncError(e);
            }
            return promise;
        },
    };
});