Scoped.define("module:Ads.AbstractVideoAdProvider", ["base:Class"], function(
    Class, scoped) {
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

            newPrerollAd: function(options) {
                return this._newPrerollAd(options);
            },

            register: function(name) {
                this.cls.registry[name] = this;
            }

        };
    }, {

        registry: {}

    });
});


Scoped.define("module:Ads.AbstractPrerollAd", ["base:Class", "base:Events.EventsMixin"], function(Class, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this);
                this._provider = provider;
                this._options = options;
            },

            /**
             * Case when SDK loaded and ready to start for manage ads
             */
            adManagerLoaded: function() {
                this.trigger('ad-loaded');
            },

            /**
             * Case when any error occurred when try to load ad
             */
            adError: function() {
                this._options.adElement.style.display = "none";
                this.trigger('ad-error');
            },

            /**
             * When new ad is starting and need pause main player
             */
            pauseContentPlayer: function() {

            },

            /**
             * When ad completed and need play the main video player
             */
            resumeContentPlayer: function() {

            },

            /**
             * When all ads which should be shows was completed
             */
            allAdsCompleted: function() {

            },

            executeAd: function(options) {
                this._options.adElement.style.display = "";
                this._executeAd(options);
            },

            _adFinished: function() {
                this._options.adElement.style.display = "none";
                this.trigger("finished");
            },

            _adSkipped: function() {
                this._options.adElement.style.display = "none";
                this.trigger("adskipped");
            }

        };
    }]);
});