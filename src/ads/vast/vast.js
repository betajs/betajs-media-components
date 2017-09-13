Scoped.define("module:Ads.VAST.VAST", [
        "base:Class",
        "module:Ads.VAST.Client",
        "module:Ads.VAST.Tracker",
        "module:Ads.VAST.Ad",
        "base:Objs",
        "base:Promise",
        "base:Events.EventsMixin"
    ],
    function(Class, VASTClient, VASTTracker, VASTAd, Objs, Promise, EventsMixin, scoped) {
        return Class.extend({
            scoped: scoped
        }, [EventsMixin, function(inherited) {
            return {
                constructor: function(options, requestOptions) {
                    inherited.constructor.call(this);
                    var vastClient, _promise, _self;
                    this.vastServerResponses = [];
                    this.timeout = 5000;
                    this.adPodTimeout = 100;
                    this.companion = undefined;
                    this.sources = [];
                    this.companion = {};

                    _self = this;
                    _promise = Promise.create();

                    vastClient = new VASTClient(options);

                    Objs.iter(options, function(vast) {
                        if (vast.adServer) {
                            if (vast.skipAfter) {
                                _self.skipAdAfter = vast.skipAfter;
                            }
                            vastClient.getAd(vast.adServer, requestOptions, function(err, response) {
                                if (err) {
                                    var _errorMessage = 'Error occurred during loading provided link. ' + err;
                                    _promise.asyncError({
                                        message: _errorMessage
                                    });
                                } else {
                                    _self.vastServerResponses.push(response);
                                    _promise.asyncSuccess(_self.vastServerResponses);
                                }
                            });
                        } else {
                            _promise.asyncError({
                                message: 'Video Ad options are not correct, asServer are required'
                            });
                        }
                    }, this);

                    _promise.success(function(responses) {
                        this.executeAd(responses[0]);
                    }, this);

                    _promise.error(function(error) {
                        this.trigger("adresponseerror", error);
                    }, this);
                },

                executeAd: function(response) {
                    var _ad, _adIds, _crIds, _creative, _foundCreative, _foundCompanion, _self;
                    _self = this;

                    if (response)
                        for (_adIds = 0; _adIds < response.ads.length; _adIds++) {
                            _ad = response.ads[_adIds];
                            for (_crIds = 0; _crIds < _ad.creatives.length; _crIds++) {
                                _creative = _ad.creatives[_crIds];
                                _foundCreative = false;
                                _foundCompanion = false;

                                if (_creative.type === 'linear' && !_foundCreative) {
                                    if (_creative.skipDelay > 0)
                                        this.skipAdAfter = _creative.skipDelay;

                                    if (_creative.mediaFiles.length) {

                                        this.sources = this.createSourceObjects(_creative.mediaFiles);

                                        if (!this.sources.length) {
                                            _self.trigger("adcanceled");
                                            return;
                                        }

                                        this.vastTracker = new VASTTracker(_ad, _creative);
                                        _foundCreative = true;
                                    }
                                }

                                if (_creative.type === 'companion' && !_foundCompanion) {
                                    this.companion = _creative;
                                    _foundCompanion = true;
                                }
                            }
                            if (this.vastTracker) {
                                _self.trigger("vastready");
                                break;
                            } else {
                                VASTAd.trackAd(_ad.errorURLTemplates, {
                                    ERRORCODE: 403
                                });
                            }
                        }

                    if (!this.vastTracker) {
                        this.trigger("adcanceled");
                    }
                },

                createSourceObjects: function(mediaFiles) {
                    var _sources, _mediaFile, _source;
                    _sources = [];
                    for (var i = 0, j = mediaFiles.length; i < j; i++) {
                        _mediaFile = mediaFiles[i];
                        _source = {
                            type: _mediaFile.mimeType,
                            src: _mediaFile.fileURL
                        };

                        if (this._canPlaySource(_source)) {
                            _sources[i] = ({
                                type: _mediaFile.mimeType,
                                src: _mediaFile.fileURL,
                                width: _mediaFile.width,
                                height: _mediaFile.height
                            });
                        }
                    }

                    return _sources;
                },

                _canPlaySource: function(source) {
                    var _ext, _mimeType, _allowedMimeTypes;
                    _allowedMimeTypes = [
                        "application/vnd.apple.mpegurl",
                        "video/3gpp",
                        "video/mp4",
                        "video/mpeg",
                        "video/ogg",
                        "video/quicktime",
                        "video/webm",
                        "video/x-m4v",
                        "video/ms-asf",
                        "video/x-ms-wmv",
                        "video/x-msvideo"
                    ];

                    if (source.type) {
                        _mimeType = source.type;
                    } else if (source.src) {
                        _ext = this._ext(source.src);
                        _mimeType = 'video/' + _ext;
                    } else {
                        return false;
                    }

                    return Objs.contains_value(_allowedMimeTypes, _mimeType);
                },

                _ext: function(url) {
                    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."));
                },

                /**
                 * Runs the callback at the next available opportunity.
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/window.setImmediate
                 */
                setImmediate: function(cb) {
                    return (
                        window.setImmediate ||
                        window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.setTimeout
                    )(cb, 0);
                },

                /**
                 * Clears a callback previously registered with `setImmediate`.
                 * @param {id} id The identifier of the callback to abort
                 */
                clearImmediate: function(id) {
                    return (window.clearImmediate ||
                        window.cancelAnimationFrame ||
                        window.webkitCancelAnimationFrame ||
                        window.mozCancelAnimationFrame ||
                        window.clearTimeout)(id);
                }
            };
        }]);
    }
);

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