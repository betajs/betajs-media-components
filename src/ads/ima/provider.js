Scoped.define("module:Ads.IMAProvider", [
    "module:Ads.AbstractVideoAdProvider",
    "module:Ads.IMALoader",
    "module:Ads.IMARequester"
], function(AbstractVideoAdProvider, IMALoader, IMARequester, scoped) {
    return AbstractVideoAdProvider.extend({
        scoped: scoped
    }, {

        __IMA_PRE_ROLL: 'pre',
        __IMA_MID_ROLL: 'mid',
        __IMA_POST_ROLL: 'post',
        __IMA_AD_TYPE_LINEAR: 'linear',
        __IMA_AD_TYPE_NON_LINEAR: 'non-linear',

        /**
         *
         * @param options
         * @returns {Promise}
         * @private
         */
        _initAdsLoader: function(options) {
            return IMALoader.loadSDK(options);
        },

        /**
         *
         * @param dyn
         * @param {string} position
         * @param {boolean} autostart
         * @returns {*}
         * @private
         */
        _newAdsRequester: function(dyn, position, autostart) {
            return new IMARequester(this, dyn, position, autostart);
        }
    });
});