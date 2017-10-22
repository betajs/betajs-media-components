Scoped.define("module:Ads.VAST.Response", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                this.ads = [];
                this.errorURLTemplates = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CompanionAd", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.width = 0;
                this.height = 0;
                this.type = null;
                this.staticResource = null;
                this.htmlRecource = null;
                this.iframeResource = null;
                this.altText = null;
                this.companionClickThroughURLTemplate = null;
                this.companionClickTrackingURLTemplates = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.Creative", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(creativeAttributes) {
                inherited.constructor.call(this);

                if (creativeAttributes === null) {
                    creativeAttributes = {};
                }

                this.id = creativeAttributes.id || null;
                this.adId = creativeAttributes.adId || null;
                this.sequence = creativeAttributes.sequence || null;
                this.apiFramework = creativeAttributes.apiFramework || null;

            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.type = "linear";
                this.duration = 0;
                this.skipDelay = null;
                this.mediaFiles = [];
                this.videoClickThroughURLTemplate = null;
                this.videoClickTrackingURLTemplates = [];
                this.videoCustomClickURLTemplates = [];
                this.adParameters = null;
                this.icons = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeNonLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.type = "nonlinear";
                this.variations = [];

            }
        };
    });
});

Scoped.define("module:Ads.VAST.AdExtension", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.attributes = {};
                this.children = [];
            }
        };
    });
});


Scoped.define("module:Ads.VAST.AdExtensionChild", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.name = null;
                this.value = null;
                this.attributes = {};
            }
        };
    });
});


Scoped.define("module:Ads.VAST.Icon", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.program = null;
                this.height = 0;
                this.width = 0;
                this.xPosition = 0;
                this.yPosition = 0;
                this.apiFramework = null;
                this.offset = null;
                this.duration = 0;
                this.type = null;
                this.staticResource = null;
                this.htmlResource = null;
                this.iframeResource = null;
                this.iconClickThroughURLTemplate = null;
                this.iconClickTrackingURLTemplates = [];
                this.iconViewTrackingURLTemplate = null;
            }
        };
    });
});

Scoped.define("module:Ads.VAST.MediaFile", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(inherited) {
                this.id = null;
                this.fileURL = null;
                this.deliveryType = "progressive";
                this.mimeType = null;
                this.codec = null;
                this.bitrate = 0;
                this.minBitrate = 0;
                this.maxBitrate = 0;
                this.width = 0;
                this.height = 0;
                this.apiFramework = null;
                this.scalable = null;
                this.maintainAspectRatio = null;
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeCompanion", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(inherited) {
                inherited.constructor.call(this);
                this.type = "companion";
                this.variations = [];

            }
        };
    });
});

Scoped.define("module:Ads.VAST.NonLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.width = 0;
                this.height = 0;
                this.expandedWidth = 0;
                this.expandedHeight = 0;
                this.scalable = true;
                this.maintainAspectRatio = true;
                this.minSuggestedDuration = 0;
                this.apiFramework = "static";
                this.type = null;
                this.staticResource = null;
                this.htmlResource = null;
                this.iframeResource = null;
                this.nonlinearClickThroughURLTemplate = null;
                this.nonlinearClickTrackingURLTemplates = [];
                this.adParameters = null;
            }
        };
    });
});