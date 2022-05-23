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
            _newAdsRequester: function(dyn, position, autostart) {},

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
             * @param dyn
             * @param {string} position
             * @param {boolean} position
             * @returns {*}
             */
            newAdsRequester: function(dyn, position, autostart) {
                return this._newAdsRequester(dyn, position, autostart);
            },

            register: function(name) {
                this.cls.registry[name] = this;
            }

        };
    }, {

        registry: {}

    });
});