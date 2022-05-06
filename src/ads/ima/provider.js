Scoped.define("module:Ads.IMAProvider", [
    "module:Ads.AbstractVideoAdProvider",
    "module:Ads.IMALoader",
    "module:Ads.IMARequester"
], function(AbstractVideoAdProvider, IMALoader, IMARequester, scoped) {
    return AbstractVideoAdProvider.extend({
        scoped: scoped
    }, {

        __IMA_PRE_ROLL: 'pre',
        __IMA_POST_ROLL: 'post',

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
         * @param loader
         * @param options
         * @param dyn
         * @param position
         * @returns {*}
         * @private
         */
        _newAdsRequester: function(loader, options, dyn, position) {
            return new IMARequester(this, loader, options, dyn, position);
        }
    });
});