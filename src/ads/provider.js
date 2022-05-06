Scoped.define("module:Ads.AbstractVideoAdProvider", [
    "base:Class"
], function(Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(options) {
                inherited.constructor.call(this);
                this._options = options;
            },

            options: function() {
                return this._options;
            },

            _newPrerollAd: function(options) {},
            _initAdsLoader: function(options) {},
            _newAdsRequester: function(options) {},

            newPrerollAd: function(options) {
                return this._newPrerollAd(options);
            },

            /**
             * Implementing adsense loader initialization
             * @param options
             * @returns {Promise}
             */
            initAdsLoader: function(options) {
                return this._initAdsLoader(options);
            },

            /**
             * Will request and listen via ad loader
             * @param loader
             * @param dyn
             * @param position mid, pro or post
             * @returns {*}
             */
            newAdsRequester: function(loader, dyn, position) {
                return this._newAdsRequester(loader, dyn, position);
            },

            register: function(name) {
                this.cls.registry[name] = this;
            }

        };
    }, {

        registry: {}

    });
});