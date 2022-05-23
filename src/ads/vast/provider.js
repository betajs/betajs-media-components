Scoped.define("module:Ads.VastVideoAdProvider", [
        "module:Ads.AbstractVideoAdProvider",
        "module:Ads.VastPrerollAd"
    ],
    function(AbstractVideoAdProvider, VastPrerollAd, scoped) {
        return AbstractVideoAdProvider.extend({
            scoped: scoped
        }, {

            _newPrerollAd: function(options) {
                return new VastPrerollAd(this, options);
            }

        });
    });


Scoped.define("module:Ads.VastPrerollAd", [
    "module:Ads.AbstractPrerollAd",
    "module:Ads.VAST.VAST"
], function(AbstractVideoPrerollAd, VAST, scoped) {
    return AbstractVideoPrerollAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this, provider, options);
                this._vast = new VAST(this._provider.options(), {});
                this._vast.once("adresponseerror", function(err) {
                    // some error actions, no respond from ad server
                }, this);
            },

            _executeAd: function(options) {
                this._adplayer = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Adplayer({
                    element: this._options.adElement,
                    attrs: {
                        css: this._options.dynamic.get("css")
                    }
                });
                this._adplayer._vast = this._vast;
                this._adplayer._preroll = this;
                this._adplayer.activate();
            },

            _adFinished: function() {
                this._options.adElement.style.display = "none";
                this.trigger("adfinished");
            },

            _adSkipped: function() {
                this._options.adElement.style.display = "none";
                this.trigger("adskipped");
            }

        };
    });
});