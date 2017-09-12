Scoped.define("module:Ads.VAST.Parser", [
        "module:Ads.VAST.Ad",
        "module:Ads.VAST.URLHandler",
        "module:Ads.VAST.Response",
        "module:Ads.VAST.CreativeLinear",
        "module:Ads.VAST.MediaFile",
        "module:Ads.VAST.CreativeCompanion",
        "module:Ads.VAST.CreativeNonLinear",
        "module:Ads.VAST.CompanionAd",
        "module:Ads.VAST.AdExtension",
        "module:Ads.VAST.AdExtensionChild",
        "module:Ads.VAST.NonLinear"
    ],
    function(VASTAd, URLHandler, VASTResponse, VASTCreativeLinear, VASTMediaFile, VASTCreativeCompanion, VASTCreativeNonLinear, VASTCompanionAd, VASTAdExtension, VASTAdExtensionChild, VASTNonLinear, scoped) {
        return VASTAd.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                constructor: function() {
                    inherited.constructor.call(this);
                    this.URLTemplateFilters = [];
                },

                _indexOf: function(item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                },

                addURLTemplateFilter: function(func) {
                    if (typeof func === 'function') {
                        URLTemplateFilters.push(func);
                    }
                },

                removeURLTemplateFilter: function() {
                    return URLTemplateFilters.pop();
                },

                countURLTemplateFilters: function() {
                    return URLTemplateFilters.length;
                },

                clearUrlTemplateFilters: function() {
                    URLTemplateFilters = [];
                    return URLTemplateFilters;
                },

                parse: function(url, options, cb) {
                    if (!cb) {
                        if (typeof options === 'function') {
                            cb = options;
                        }
                        options = {};
                    }
                    return this._parse(url, null, options, function(err, response) {
                        return cb(err, response);
                    });
                },

                track: function(templates, errorCode) {
                    // TODO: remove after development
                    //this.trigger('VAST-error', errorCode);
                    console.warn('Error code related vast video:', errorCode);
                    return this.trackAd(templates, errorCode);
                },

                _parse: function(url, parentURLs, options, cb) {
                    var filter, i, len, urlHandler;
                    urlHandler = new URLHandler();

                    if (!cb) {
                        if (typeof options === 'function') {
                            cb = options;
                        }
                        options = {};
                    }

                    for (i = 0, len = this.URLTemplateFilters.length; i < len; i++) {
                        filter = URLTemplateFilters[i];
                        url = filter(url);
                    }

                    if (parentURLs === null) {
                        parentURLs = [];
                    }
                    parentURLs.push(url);

                    return urlHandler.get(url, options, (function(_this) {
                        return function(err, xml) {
                            if (err !== null) {
                                return cb(err, null);
                            }
                            return _this.parseXmlDocument(url, parentURLs, options, xml, cb);
                        };
                    })(this));
                },

                __indexOf: [].indexOf || function(item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                },

                parseXmlDocument: function(url, parentURLs, options, xml, cb) {
                    var ad, complete, i, j, len, len1, loopIndex, node, ref, ref1, response, _self;
                    _self = this;
                    response = new VASTResponse();
                    if (!(((xml !== null ? xml.documentElement : void 0) !== null) && xml.documentElement.nodeName === "VAST")) {
                        return cb(new Error('Invalid VAST XMLDocument'));
                    }

                    ref = xml.documentElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        node = ref[i];
                        if (node.nodeName === 'Error') {
                            response.errorURLTemplates.push(this.parseNodeText(node));
                        }
                    }

                    ref1 = xml.documentElement.childNodes;
                    for (j = 0, len1 = ref1.length; j < len1; j++) {
                        node = ref1[j];
                        if (node.nodeName === 'Ad') {
                            ad = this.parseAdElement(node);
                            if (ad !== null) {
                                response.ads.push(ad);
                            } else {
                                this.track(response.errorURLTemplates, {
                                    ERRORCODE: 101,
                                    ERRORMESSAGE: 'VAST schema validation error.'
                                });
                            }
                        }
                    }

                    complete = function(error, errorAlreadyRaised) {
                        var k, len2, noCreatives, ref2;
                        if (error === null) {
                            error = null;
                        }
                        if (errorAlreadyRaised === null) {
                            errorAlreadyRaised = false;
                        }
                        if (!response) {
                            return;
                        }
                        noCreatives = true;
                        ref2 = response.ads;
                        for (k = 0, len2 = ref2.length; k < len2; k++) {
                            ad = ref2[k];
                            if (ad.nextWrapperURL) {
                                return;
                            }
                            if (ad.creatives.length > 0) {
                                noCreatives = false;
                            }
                        }
                        if (noCreatives) {
                            if (!errorAlreadyRaised) {
                                _self.track(response.errorURLTemplates, {
                                    ERRORCODE: 303,
                                    ERRORMESSAGE: 'No VAST response after one or more Wrappers (No creatives)'
                                });
                            }
                        }
                        if (response.ads.length === 0) {
                            response = null;
                        }
                        return cb(error, response);
                    };

                    loopIndex = response.ads.length;
                    while (loopIndex--) {
                        ad = response.ads[loopIndex];
                        if (!ad.nextWrapperURL) {
                            continue;
                        }
                        this._handleComplete.call(this, ad, url, response, parentURLs, options, complete);
                    }
                    return complete();
                },


                _handleComplete: function(ad, url, response, parentURLs, options, complete) {
                    var _ref2;
                    if (parentURLs.length > (options.wrapperLimit ? options.wrapperLimit : 9) || (_ref2 = ad.nextWrapperURL, this.__indexOf.call(parentURLs, _ref2) >= 0)) {
                        this.track(ad.errorURLTemplates, {
                            ERRORCODE: 302,
                            ERRORMESSAGE: 'Wrapper limit reached, as defined by the video player. Too many Wrapper responses have been received with no InLine response.'
                        });
                        response.ads.splice(response.ads.indexOf(ad), 1);
                        complete(new Error("Wrapper limit reached, as defined by the video player"));
                        return;
                    }

                    if (url) {
                        ad.nextWrapperURL = this.resolveVastAdTagURI(ad.nextWrapperURL, url);
                    }

                    return this._parse(ad.nextWrapperURL, parentURLs, options, function(err, wrappedResponse) {
                        var _errorAlreadyRaised, _index, _k, _len2, _ref3, _wrappedAd;
                        _errorAlreadyRaised = false;
                        if (err) {
                            this.track(ad.errorURLTemplates, {
                                ERRORCODE: 301,
                                ERRORMESSAGE: 'Timeout of VAST URI provided in Wrapper element, or of VAST URI provided in a subsequent Wrapper element. (URI was either unavailable or reached a timeout as defined by the video player.)'
                            });
                            response.ads.splice(response.ads.indexOf(ad), 1);
                            _errorAlreadyRaised = true;
                        } else if (!wrappedResponse) {
                            this.track(ad.errorURLTemplates, {
                                ERRORCODE: 303,
                                ERRORMESSAGE: 'No VAST response after one or more Wrappers'
                            });
                            response.ads.splice(response.ads.indexOf(ad), 1);
                            _errorAlreadyRaised = true;
                        } else {
                            response.errorURLTemplates = response.errorURLTemplates.concat(wrappedResponse.errorURLTemplates);
                            _index = response.ads.indexOf(ad);
                            response.ads.splice(_index, 1);
                            _ref3 = wrappedResponse.ads;
                            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                                _wrappedAd = _ref3[_k];
                                this.mergeWrapperAdData(_wrappedAd, ad);
                                response.ads.splice(++_index, 0, _wrappedAd);
                            }
                        }
                        delete ad.nextWrapperURL;
                        return complete(err, _errorAlreadyRaised);
                    });
                },

                resolveVastAdTagURI: function(vastAdTagUrl, originalUrl) {
                    var baseURL, protocol;
                    if (vastAdTagUrl.indexOf('//') === 0) {
                        protocol = location.protocol;
                        return "" + protocol + vastAdTagUrl;
                    }
                    if (vastAdTagUrl.indexOf('://') === -1) {
                        baseURL = originalUrl.slice(0, originalUrl.lastIndexOf('/'));
                        return baseURL + "/" + vastAdTagUrl;
                    }
                    return vastAdTagUrl;
                },

                mergeWrapperAdData: function(wrappedAd, ad) {
                    var base, creative, eventName, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, results, urls;
                    wrappedAd.errorURLTemplates = ad.errorURLTemplates.concat(wrappedAd.errorURLTemplates);
                    wrappedAd.impressionURLTemplates = ad.impressionURLTemplates.concat(wrappedAd.impressionURLTemplates);
                    wrappedAd.extensions = ad.extensions.concat(wrappedAd.extensions);
                    ref = wrappedAd.creatives;
                    for (i = 0, len = ref.length; i < len; i++) {
                        creative = ref[i];
                        if (((ref1 = ad.trackingEvents) !== null ? ref1[creative.type] : void 0) !== null) {
                            ref2 = ad.trackingEvents[creative.type];
                            for (eventName in ref2) {
                                urls = ref2[eventName];
                                if (creative.trackingEvents[eventName]) {
                                    base[eventName] = creative.trackingEvents[eventName];
                                } else {
                                    base[eventName] = [];
                                }
                                creative.trackingEvents[eventName] = creative.trackingEvents[eventName].concat(urls);
                            }
                        }
                    }
                    if ((ref3 = ad.videoClickTrackingURLTemplates) !== null ? ref3.length : void 0) {
                        ref4 = wrappedAd.creatives;
                        for (j = 0, len1 = ref4.length; j < len1; j++) {
                            creative = ref4[j];
                            if (creative.type === 'linear') {
                                creative.videoClickTrackingURLTemplates = creative.videoClickTrackingURLTemplates.concat(ad.videoClickTrackingURLTemplates);
                            }
                        }
                    }
                    if ((ref5 = ad.videoCustomClickURLTemplates) ? ref5.length : void 0) {
                        ref6 = wrappedAd.creatives;
                        for (k = 0, len2 = ref6.length; k < len2; k++) {
                            creative = ref6[k];
                            if (creative.type === 'linear') {
                                creative.videoCustomClickURLTemplates = creative.videoCustomClickURLTemplates.concat(ad.videoCustomClickURLTemplates);
                            }
                        }
                    }
                    if (ad.videoClickThroughURLTemplate) {
                        ref7 = wrappedAd.creatives;
                        results = [];
                        for (l = 0, len3 = ref7.length; l < len3; l++) {
                            creative = ref7[l];
                            if (creative.type === 'linear' && (creative.videoClickThroughURLTemplate === null)) {
                                results.push(creative.videoClickThroughURLTemplate = ad.videoClickThroughURLTemplate);
                            } else {
                                results.push(void 0);
                            }
                        }
                        return results;
                    }
                },

                childByName: function(node, name) {
                    var child, i, len, ref;
                    ref = node.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        child = ref[i];
                        if (child.nodeName === name) {
                            return child;
                        }
                    }
                },

                childsByName: function(node, name) {
                    var child, childs, i, len, ref;
                    childs = [];
                    ref = node.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        child = ref[i];
                        if (child.nodeName === name) {
                            childs.push(child);
                        }
                    }
                    return childs;
                },

                parseAdElement: function(adElement) {
                    var adTypeElement, i, len, ref, ref1;
                    ref = adElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        adTypeElement = ref[i];
                        if ((ref1 = adTypeElement.nodeName) !== "Wrapper" && ref1 !== "InLine") {
                            continue;
                        }
                        this.copyNodeAttribute("id", adElement, adTypeElement);
                        this.copyNodeAttribute("sequence", adElement, adTypeElement);
                        if (adTypeElement.nodeName === "Wrapper") {
                            return this.parseWrapperElement(adTypeElement);
                        } else if (adTypeElement.nodeName === "InLine") {
                            return this.parseInLineElement(adTypeElement);
                        }
                    }
                },

                parseWrapperElement: function(wrapperElement) {
                    var ad, base, base1, eventName, i, item, j, k, l, len, len1, len2, len3, name1, ref, ref1, ref2, ref3, ref4, url, urls, wrapperCreativeElement, wrapperURLElement;
                    ad = this.parseInLineElement(wrapperElement);
                    wrapperURLElement = this.childByName(wrapperElement, "VASTAdTagURI");
                    if (wrapperURLElement) {
                        ad.nextWrapperURL = this.parseNodeText(wrapperURLElement);
                    } else {
                        wrapperURLElement = this.childByName(wrapperElement, "VASTAdTagURL");
                        if (wrapperURLElement) {
                            ad.nextWrapperURL = this.parseNodeText(this.childByName(wrapperURLElement, "URL"));
                        }
                    }
                    ref = ad.creatives;
                    for (i = 0, len = ref.length; i < len; i++) {
                        wrapperCreativeElement = ref[i];
                        if ((ref1 = wrapperCreativeElement.type) === 'linear' || ref1 === 'nonlinear') {
                            if (wrapperCreativeElement.trackingEvents) {
                                ad.trackingEvents = ad.trackingEvents ? ad.trackingEvents : {};
                                name1 = wrapperCreativeElement.type;
                                base[name1] = ad.trackingEvents[name1] ? ad.trackingEvents[name1] : {};
                                ref2 = wrapperCreativeElement.trackingEvents;
                                for (eventName in ref2) {
                                    urls = ref2[eventName];
                                    if (urls !== null) {
                                        base1[eventName] = ad.trackingEvents[wrapperCreativeElement.type][eventName] ? ad.trackingEvents[wrapperCreativeElement.type][eventName] : [];
                                        for (j = 0, len1 = urls.length; j < len1; j++) {
                                            url = urls[j];
                                            ad.trackingEvents[wrapperCreativeElement.type][eventName].push(url);
                                        }
                                    }
                                }
                            }
                            if (wrapperCreativeElement.videoClickTrackingURLTemplates) {
                                ad.videoClickTrackingURLTemplates = ad.videoClickTrackingURLTemplates || [];
                                ref3 = wrapperCreativeElement.videoClickTrackingURLTemplates;
                                for (k = 0, len2 = ref3.length; k < len2; k++) {
                                    item = ref3[k];
                                    ad.videoClickTrackingURLTemplates.push(item);
                                }
                            }
                            if (wrapperCreativeElement.videoClickThroughURLTemplate) {
                                ad.videoClickThroughURLTemplate = wrapperCreativeElement.videoClickThroughURLTemplate;
                            }
                            if (wrapperCreativeElement.videoCustomClickURLTemplates) {
                                ad.videoCustomClickURLTemplates = ad.videoCustomClickURLTemplates || [];
                                ref4 = wrapperCreativeElement.videoCustomClickURLTemplates;
                                for (l = 0, len3 = ref4.length; l < len3; l++) {
                                    item = ref4[l];
                                    ad.videoCustomClickURLTemplates.push(item);
                                }
                            }
                        }
                    }
                    if (ad.nextWrapperURL) {
                        return ad;
                    }
                },

                parseInLineElement: function(inLineElement) {
                    var ad, creative, creativeAttributes, creativeElement, creativeTypeElement, i, j, k, len, len1, len2, node, ref, ref1, ref2;
                    ad = new VASTAd();
                    ad.id = inLineElement.getAttribute("id") || null;
                    ad.sequence = inLineElement.getAttribute("sequence") || null;
                    ref = inLineElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        node = ref[i];
                        switch (node.nodeName) {
                            case "Error":
                                ad.errorURLTemplates.push(this.parseNodeText(node));
                                break;
                            case "Impression":
                                ad.impressionURLTemplates.push(this.parseNodeText(node));
                                break;
                            case "Creatives":
                                ref1 = this.childsByName(node, "Creative");
                                for (j = 0, len1 = ref1.length; j < len1; j++) {
                                    creativeElement = ref1[j];
                                    creativeAttributes = {
                                        id: creativeElement.getAttribute('id') || null,
                                        adId: this.parseCreativeAdIdAttribute(creativeElement),
                                        sequence: creativeElement.getAttribute('sequence') || null,
                                        apiFramework: creativeElement.getAttribute('apiFramework') || null
                                    };
                                    ref2 = creativeElement.childNodes;
                                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                                        creativeTypeElement = ref2[k];
                                        switch (creativeTypeElement.nodeName) {
                                            case "Linear":
                                                creative = this.parseCreativeLinearElement(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                                break;
                                            case "NonLinearAds":
                                                creative = this.parseNonLinear(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                                break;
                                            case "CompanionAds":
                                                creative = this.parseCompanionAd(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                        }
                                    }
                                }
                                break;
                            case "Extensions":
                                this.parseExtension(ad.extensions, this.childsByName(node, "Extension"));
                                break;
                            case "AdSystem":
                                ad.system = {
                                    value: this.parseNodeText(node),
                                    version: node.getAttribute("version") || null
                                };
                                break;
                            case "AdTitle":
                                ad.title = this.parseNodeText(node);
                                break;
                            case "Description":
                                ad.description = this.parseNodeText(node);
                                break;
                            case "Advertiser":
                                ad.advertiser = this.parseNodeText(node);
                                break;
                            case "Pricing":
                                ad.pricing = {
                                    value: this.parseNodeText(node),
                                    model: node.getAttribute("model") || null,
                                    currency: node.getAttribute("currency") || null
                                };
                                break;
                            case "Survey":
                                ad.survey = this.parseNodeText(node);
                        }
                    }
                    return ad;
                },

                parseExtension: function(collection, extensions) {
                    var childNode, ext, extChild, extChildNodeAttr, extNode, extNodeAttr, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2, results, txt;
                    results = [];
                    for (i = 0, len = extensions.length; i < len; i++) {
                        extNode = extensions[i];
                        ext = new VASTAdExtension();
                        if (extNode.attributes) {
                            ref = extNode.attributes;
                            for (j = 0, len1 = ref.length; j < len1; j++) {
                                extNodeAttr = ref[j];
                                ext.attributes[extNodeAttr.nodeName] = extNodeAttr.nodeValue;
                            }
                        }
                        ref1 = extNode.childNodes;
                        for (k = 0, len2 = ref1.length; k < len2; k++) {
                            childNode = ref1[k];
                            txt = this.parseNodeText(childNode);
                            if (childNode.nodeName !== '#comment' && txt !== '') {
                                extChild = new VASTAdExtensionChild();
                                extChild.name = childNode.nodeName;
                                extChild.value = txt;
                                if (childNode.attributes) {
                                    ref2 = childNode.attributes;
                                    for (l = 0, len3 = ref2.length; l < len3; l++) {
                                        extChildNodeAttr = ref2[l];
                                        extChild.attributes[extChildNodeAttr.nodeName] = extChildNodeAttr.nodeValue;
                                    }
                                }
                                ext.children.push(extChild);
                            }
                        }
                        results.push(collection.push(ext));
                    }
                    return results;
                },

                parseCreativeLinearElement: function(creativeElement, creativeAttributes) {
                    var adParamsElement, base, clickTrackingElement, creative, customClickElement, eventName, htmlElement, i, icon, iconClickTrackingElement, iconClicksElement, iconElement, iconsElement, iframeElement, j, k, l, len, len1, len10, len2, len3, len4, len5, len6, len7, len8, len9, m, maintainAspectRatio, mediaFile, mediaFileElement, mediaFilesElement, n, o, offset, p, percent, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, scalable, skipOffset, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate, videoClicksElement;
                    creative = new VASTCreativeLinear(creativeAttributes);
                    creative.duration = this.parseDuration(this.parseNodeText(this.childByName(creativeElement, "Duration")));
                    if (creative.duration === -1 && creativeElement.parentNode.parentNode.parentNode.nodeName !== 'Wrapper') {
                        return null;
                    }
                    skipOffset = creativeElement.getAttribute("skipoffset");
                    if (skipOffset === null) {
                        creative.skipDelay = null;
                    } else if (skipOffset.charAt(skipOffset.length - 1) === "%") {
                        percent = parseInt(skipOffset, 10);
                        creative.skipDelay = creative.duration * (percent / 100);
                    } else {
                        creative.skipDelay = this.parseDuration(skipOffset);
                    }
                    videoClicksElement = this.childByName(creativeElement, "VideoClicks");
                    if (videoClicksElement) {
                        creative.videoClickThroughURLTemplate = this.parseNodeText(this.childByName(videoClicksElement, "ClickThrough"));
                        ref = this.childsByName(videoClicksElement, "ClickTracking");
                        for (i = 0, len = ref.length; i < len; i++) {
                            clickTrackingElement = ref[i];
                            creative.videoClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        ref1 = this.childsByName(videoClicksElement, "CustomClick");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            customClickElement = ref1[j];
                            creative.videoCustomClickURLTemplates.push(this.parseNodeText(customClickElement));
                        }
                    }
                    adParamsElement = this.childByName(creativeElement, "AdParameters");
                    if (adParamsElement) {
                        creative.adParameters = this.parseNodeText(adParamsElement);
                    }
                    ref2 = this.childsByName(creativeElement, "TrackingEvents");
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                        trackingEventsElement = ref2[k];
                        ref3 = this.childsByName(trackingEventsElement, "Tracking");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            trackingElement = ref3[l];
                            eventName = trackingElement.getAttribute("event");
                            trackingURLTemplate = this.parseNodeText(trackingElement);
                            if (eventName && trackingURLTemplate) {
                                if (eventName === "progress") {
                                    offset = trackingElement.getAttribute("offset");
                                    if (!offset) {
                                        continue;
                                    }
                                    if (offset.charAt(offset.length - 1) === '%') {
                                        eventName = "progress-" + offset;
                                    } else {
                                        eventName = "progress-" + (Math.round(this.parseDuration(offset)));
                                    }
                                }
                                if ((base = creative.trackingEvents)[eventName] === null) {
                                    base[eventName] = [];
                                }

                                if (creative.trackingEvents[eventName]) {
                                    creative.trackingEvents[eventName].push(trackingURLTemplate);
                                }

                            }
                        }
                    }
                    ref4 = this.childsByName(creativeElement, "MediaFiles");
                    for (m = 0, len4 = ref4.length; m < len4; m++) {
                        mediaFilesElement = ref4[m];
                        ref5 = this.childsByName(mediaFilesElement, "MediaFile");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            mediaFileElement = ref5[n];
                            mediaFile = new VASTMediaFile();
                            mediaFile.id = mediaFileElement.getAttribute("id");
                            mediaFile.fileURL = this.parseNodeText(mediaFileElement);
                            mediaFile.deliveryType = mediaFileElement.getAttribute("delivery");
                            mediaFile.codec = mediaFileElement.getAttribute("codec");
                            mediaFile.mimeType = mediaFileElement.getAttribute("type");
                            mediaFile.apiFramework = mediaFileElement.getAttribute("apiFramework");
                            mediaFile.bitrate = parseInt(mediaFileElement.getAttribute("bitrate") || 0, 10);
                            mediaFile.minBitrate = parseInt(mediaFileElement.getAttribute("minBitrate") || 0, 10);
                            mediaFile.maxBitrate = parseInt(mediaFileElement.getAttribute("maxBitrate") || 0, 10);
                            mediaFile.width = parseInt(mediaFileElement.getAttribute("width") || 0, 10);
                            mediaFile.height = parseInt(mediaFileElement.getAttribute("height") || 0, 10);
                            scalable = mediaFileElement.getAttribute("scalable");
                            if (scalable && typeof scalable === "string") {
                                scalable = scalable.toLowerCase();
                                if (scalable === "true") {
                                    mediaFile.scalable = true;
                                } else if (scalable === "false") {
                                    mediaFile.scalable = false;
                                }
                            }
                            maintainAspectRatio = mediaFileElement.getAttribute("maintainAspectRatio");
                            if (maintainAspectRatio && typeof maintainAspectRatio === "string") {
                                maintainAspectRatio = maintainAspectRatio.toLowerCase();
                                if (maintainAspectRatio === "true") {
                                    mediaFile.maintainAspectRatio = true;
                                } else if (maintainAspectRatio === "false") {
                                    mediaFile.maintainAspectRatio = false;
                                }
                            }
                            creative.mediaFiles.push(mediaFile);
                        }
                    }
                    iconsElement = this.childByName(creativeElement, "Icons");
                    if (iconsElement) {
                        ref6 = this.childsByName(iconsElement, "Icon");
                        for (o = 0, len6 = ref6.length; o < len6; o++) {
                            iconElement = ref6[o];
                            icon = new VASTIcon();
                            icon.program = iconElement.getAttribute("program");
                            icon.height = parseInt(iconElement.getAttribute("height") || 0, 10);
                            icon.width = parseInt(iconElement.getAttribute("width") || 0, 10);
                            icon.xPosition = this.parseXPosition(iconElement.getAttribute("xPosition"));
                            icon.yPosition = this.parseYPosition(iconElement.getAttribute("yPosition"));
                            icon.apiFramework = iconElement.getAttribute("apiFramework");
                            icon.offset = this.parseDuration(iconElement.getAttribute("offset"));
                            icon.duration = this.parseDuration(iconElement.getAttribute("duration"));
                            ref7 = this.childsByName(iconElement, "HTMLResource");
                            for (p = 0, len7 = ref7.length; p < len7; p++) {
                                htmlElement = ref7[p];
                                icon.type = htmlElement.getAttribute("creativeType") || 'text/html';
                                icon.htmlResource = this.parseNodeText(htmlElement);
                            }
                            ref8 = this.childsByName(iconElement, "IFrameResource");
                            for (q = 0, len8 = ref8.length; q < len8; q++) {
                                iframeElement = ref8[q];
                                icon.type = iframeElement.getAttribute("creativeType") || 0;
                                icon.iframeResource = this.parseNodeText(iframeElement);
                            }
                            ref9 = this.childsByName(iconElement, "StaticResource");
                            for (r = 0, len9 = ref9.length; r < len9; r++) {
                                staticElement = ref9[r];
                                icon.type = staticElement.getAttribute("creativeType") || 0;
                                icon.staticResource = this.parseNodeText(staticElement);
                            }
                            iconClicksElement = this.childByName(iconElement, "IconClicks");
                            if (iconClicksElement) {
                                icon.iconClickThroughURLTemplate = this.parseNodeText(this.childByName(iconClicksElement, "IconClickThrough"));
                                ref10 = this.childsByName(iconClicksElement, "IconClickTracking");
                                for (s = 0, len10 = ref10.length; s < len10; s++) {
                                    iconClickTrackingElement = ref10[s];
                                    icon.iconClickTrackingURLTemplates.push(this.parseNodeText(iconClickTrackingElement));
                                }
                            }
                            icon.iconViewTrackingURLTemplate = this.parseNodeText(this.childByName(iconElement, "IconViewTracking"));
                            creative.icons.push(icon);
                        }
                    }
                    return creative;
                },

                parseNonLinear: function(creativeElement, creativeAttributes) {
                    var adParamsElement, base, clickTrackingElement, creative, eventName, htmlElement, i, iframeElement, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, nonlinearAd, nonlinearResource, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate;
                    creative = new VASTCreativeNonLinear(creativeAttributes);
                    ref = this.childsByName(creativeElement, "TrackingEvents");
                    for (i = 0, len = ref.length; i < len; i++) {
                        trackingEventsElement = ref[i];
                        ref1 = this.childsByName(trackingEventsElement, "Tracking");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            trackingElement = ref1[j];
                            eventName = trackingElement.getAttribute("event");
                            trackingURLTemplate = this.parseNodeText(trackingElement);
                            if (eventName && trackingURLTemplate) {
                                if ((base = creative.trackingEvents)[eventName] === null) {
                                    base[eventName] = [];
                                }

                                if (creative.trackingEvents[eventName] && trackingURLTemplate !== null) {
                                    creative.trackingEvents[eventName].push(trackingURLTemplate);
                                }
                            }
                        }
                    }
                    ref2 = this.childsByName(creativeElement, "NonLinear");
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                        nonlinearResource = ref2[k];
                        nonlinearAd = new VASTNonLinear();
                        nonlinearAd.id = nonlinearResource.getAttribute("id") || null;
                        nonlinearAd.width = nonlinearResource.getAttribute("width");
                        nonlinearAd.height = nonlinearResource.getAttribute("height");
                        nonlinearAd.expandedWidth = nonlinearResource.getAttribute("expandedWidth");
                        nonlinearAd.expandedHeight = nonlinearResource.getAttribute("expandedHeight");
                        nonlinearAd.scalable = this.parseBoolean(nonlinearResource.getAttribute("scalable"));
                        nonlinearAd.maintainAspectRatio = this.parseBoolean(nonlinearResource.getAttribute("maintainAspectRatio"));
                        nonlinearAd.minSuggestedDuration = this.parseDuration(nonlinearResource.getAttribute("minSuggestedDuration"));
                        nonlinearAd.apiFramework = nonlinearResource.getAttribute("apiFramework");
                        ref3 = this.childsByName(nonlinearResource, "HTMLResource");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            htmlElement = ref3[l];
                            nonlinearAd.type = htmlElement.getAttribute("creativeType") || 'text/html';
                            nonlinearAd.htmlResource = this.parseNodeText(htmlElement);
                        }
                        ref4 = this.childsByName(nonlinearResource, "IFrameResource");
                        for (m = 0, len4 = ref4.length; m < len4; m++) {
                            iframeElement = ref4[m];
                            nonlinearAd.type = iframeElement.getAttribute("creativeType") || 0;
                            nonlinearAd.iframeResource = this.parseNodeText(iframeElement);
                        }
                        ref5 = this.childsByName(nonlinearResource, "StaticResource");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            staticElement = ref5[n];
                            nonlinearAd.type = staticElement.getAttribute("creativeType") || 0;
                            nonlinearAd.staticResource = this.parseNodeText(staticElement);
                        }
                        adParamsElement = this.childByName(nonlinearResource, "AdParameters");
                        if (adParamsElement) {
                            nonlinearAd.adParameters = this.parseNodeText(adParamsElement);
                        }
                        nonlinearAd.nonlinearClickThroughURLTemplate = this.parseNodeText(this.childByName(nonlinearResource, "NonLinearClickThrough"));
                        ref6 = this.childsByName(nonlinearResource, "NonLinearClickTracking");
                        for (o = 0, len6 = ref6.length; o < len6; o++) {
                            clickTrackingElement = ref6[o];
                            nonlinearAd.nonlinearClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        creative.variations.push(nonlinearAd);
                    }
                    return creative;
                },

                parseCompanionAd: function(creativeElement, creativeAttributes) {
                    var base, child, clickTrackingElement, companionAd, companionResource, creative, eventName, htmlElement, i, iframeElement, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate;
                    creative = new VASTCreativeCompanion(creativeAttributes);
                    ref = this.childsByName(creativeElement, "Companion");
                    for (i = 0, len = ref.length; i < len; i++) {
                        companionResource = ref[i];
                        companionAd = new VASTCompanionAd();
                        companionAd.id = companionResource.getAttribute("id") || null;
                        companionAd.width = companionResource.getAttribute("width");
                        companionAd.height = companionResource.getAttribute("height");
                        companionAd.companionClickTrackingURLTemplates = [];
                        ref1 = this.childsByName(companionResource, "HTMLResource");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            htmlElement = ref1[j];
                            companionAd.type = htmlElement.getAttribute("creativeType") || 'text/html';
                            companionAd.htmlResource = this.parseNodeText(htmlElement);
                        }
                        ref2 = this.childsByName(companionResource, "IFrameResource");
                        for (k = 0, len2 = ref2.length; k < len2; k++) {
                            iframeElement = ref2[k];
                            companionAd.type = iframeElement.getAttribute("creativeType") || 0;
                            companionAd.iframeResource = this.parseNodeText(iframeElement);
                        }
                        ref3 = this.childsByName(companionResource, "StaticResource");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            staticElement = ref3[l];
                            companionAd.type = staticElement.getAttribute("creativeType") || 0;
                            ref4 = this.childsByName(companionResource, "AltText");
                            for (m = 0, len4 = ref4.length; m < len4; m++) {
                                child = ref4[m];
                                companionAd.altText = this.parseNodeText(child);
                            }
                            companionAd.staticResource = this.parseNodeText(staticElement);
                        }
                        ref5 = this.childsByName(companionResource, "TrackingEvents");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            trackingEventsElement = ref5[n];
                            ref6 = this.childsByName(trackingEventsElement, "Tracking");
                            for (o = 0, len6 = ref6.length; o < len6; o++) {
                                trackingElement = ref6[o];
                                eventName = trackingElement.getAttribute("event");
                                trackingURLTemplate = this.parseNodeText(trackingElement);
                                if (eventName && trackingURLTemplate) {
                                    if ((base = companionAd.trackingEvents)[eventName] === null) {
                                        base[eventName] = [];
                                    }
                                    companionAd.trackingEvents[eventName].push(trackingURLTemplate);
                                }
                            }
                        }
                        ref7 = this.childsByName(companionResource, "CompanionClickTracking");
                        for (p = 0, len7 = ref7.length; p < len7; p++) {
                            clickTrackingElement = ref7[p];
                            companionAd.companionClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        companionAd.companionClickThroughURLTemplate = this.parseNodeText(this.childByName(companionResource, "CompanionClickThrough"));
                        companionAd.companionClickTrackingURLTemplate = this.parseNodeText(this.childByName(companionResource, "CompanionClickTracking"));
                        creative.variations.push(companionAd);
                    }
                    return creative;
                },

                parseDuration: function(durationString) {
                    var durationComponents, hours, minutes, seconds, secondsAndMS;
                    if (!(durationString)) {
                        return -1;
                    }
                    if (VASTAd.isNumeric(durationString)) {
                        return parseInt(durationString, 10);
                    }
                    durationComponents = durationString.split(":");
                    if (durationComponents.length !== 3) {
                        return -1;
                    }
                    secondsAndMS = durationComponents[2].split(".");
                    seconds = parseInt(secondsAndMS[0], 10);
                    if (secondsAndMS.length === 2) {
                        seconds += parseFloat("0." + secondsAndMS[1]);
                    }
                    minutes = parseInt(durationComponents[1] * 60, 10);
                    hours = parseInt(durationComponents[0] * 60 * 60, 10);
                    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || minutes > 60 * 60 || seconds > 60) {
                        return -1;
                    }
                    return hours + minutes + seconds;
                },

                parseXPosition: function(xPosition) {
                    if (xPosition === "left" || xPosition === "right") {
                        return xPosition;
                    }
                    return parseInt(xPosition || 0, 10);
                },

                parseYPosition: function(yPosition) {
                    if (yPosition === "top" || yPosition === "bottom") {
                        return yPosition;
                    }
                    return parseInt(yPosition || 0, 10);
                },

                parseBoolean: function(booleanString) {
                    return booleanString === 'true' || booleanString === 'TRUE' || booleanString === '1';
                },

                parseNodeText: function(node) {
                    return node && (node.textContent || node.text || '').trim();
                },

                copyNodeAttribute: function(attributeName, nodeSource, nodeDestination) {
                    var attributeValue;
                    attributeValue = nodeSource.getAttribute(attributeName);
                    if (attributeValue) {
                        return nodeDestination.setAttribute(attributeName, attributeValue);
                    }
                },

                parseCreativeAdIdAttribute: function(creativeElement) {
                    return creativeElement.getAttribute('AdID') || creativeElement.getAttribute('adID') || creativeElement.getAttribute('adId') || null;
                }
            };
        });
    });