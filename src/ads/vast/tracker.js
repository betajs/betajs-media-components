Scoped.define("module:Ads.VAST.Tracker", [
        "module:Ads.VAST.Ad",
        "module:Ads.VAST.CreativeLinear",
        "module:Ads.VAST.NonLinear",
        "module:Ads.VAST.CompanionAd",
        "module:Ads.VAST.Client",
        "base:Events.ListenMixin"
    ],
    function(VASTAd, VASTCreativeLinear, VASTNonLinear, VASTCompanionAd, VASTClient, ListenMixin, scoped) {
        return VASTAd.extend({
            scoped: scoped
        }, [ListenMixin, function(inherited) {
            return {
                constructor: function(ad, creative, variation) {
                    inherited.constructor.call(this, ad, creative, variation);
                    var eventName, events, trackingEvents;
                    this.ad = ad;
                    this.creative = creative;
                    this.variation = variation || null;
                    this.muted = false;
                    this.impressed = false;
                    this.skipable = false;
                    this.skipDelayDefault = -1;

                    this.emitAlwaysEvents = ['creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'rewind', 'skip', 'closeLinear', 'close'];
                    trackingEvents = creative ? creative.trackingEvents : {};

                    for (eventName in trackingEvents) {
                        events = trackingEvents[eventName];
                        if (events)
                            this.trackingEvents[eventName] = events.slice(0);
                    }

                    if (creative instanceof VASTCreativeLinear) {
                        this.setAdDuration(this.creative.duration);
                        this.skipDelay = creative.skipDelay;
                        this.linear = true;
                        this.clickThroughURLTemplate = creative.videoClickThroughURLTemplate;
                        this.clickTrackingURLTemplate = creative.videoClickTrackingURLTemplate;
                    } else {
                        this.skipDelay = -1;
                        this.linear = false;
                        if (this.variation) {
                            if (this.variation instanceof VASTNonLinear) {
                                this.clickThroughURLTemplate = this.variation.nonlinearClickThroughURLTemplate;
                                this.clickTrackingURLTemplates = this.variation.nonlinearClickTrackingURLTemplates;
                            } else if (this.variation instanceof VASTCompanionAd) {
                                this.clickThroughURLTemplate = this.variation.companionClickThroughURLTemplate;
                                this.clickTrackingURLTemplates = this.variation.companionClickTrackingURLTemplates;
                            }
                        }
                    }

                    this.on('adstart', function() {
                        VASTClient.lastSuccessfullAd = +new Date();
                    });


                },

                setAdDuration: function(duration) {
                    this.assetDuration = duration;
                    this.quartiles = {
                        'firstQuartile': Math.round(25 * this.assetDuration) / 100,
                        'midpoint': Math.round(50 * this.assetDuration) / 100,
                        'thirdQuartile': Math.round(75 * this.assetDuration) / 100
                    };
                    return this.quartiles;
                },

                setAdProgress: function(progress) {
                    var eventName, events, i, len, percent, quartile, ref, skipDelay, time;
                    skipDelay = this.skipDelay === null ? this.skipDelayDefault : this.skipDelay;
                    if (skipDelay !== -1 && !this.skipable) {
                        if (skipDelay > progress) {
                            this.trigger('adskip-countdown', skipDelay - progress);
                        } else {
                            this.skipable = true;
                            this.trigger('adskip-countdown', 0);
                        }
                    }
                    if (this.linear && this.assetDuration > 0) {
                        events = [];
                        if (progress > 0) {
                            events.push("start");
                            percent = Math.round(progress / this.assetDuration * 100);
                            events.push("progress-" + percent + "%");
                            events.push("progress-" + (Math.round(progress)));
                            ref = this.quartiles;
                            for (quartile in ref) {
                                time = ref[quartile];
                                if ((time <= progress && progress <= (time + 1))) {
                                    events.push(quartile);
                                }
                            }
                        }
                        for (i = 0, len = events.length; i < len; i++) {
                            eventName = events[i];
                            if (eventName !== null)
                                this.track(eventName, true);
                        }
                        if (progress < this.progress) {
                            this.track("rewind");
                        }
                    }
                    this.progress = progress;
                    return progress;
                },

                setAdMuted: function(muted) {
                    if (this.muted !== muted) {
                        this.track(muted ? "mute" : "unmute");
                    }
                    this.muted = muted;
                    return muted;
                },

                setAdPaused: function(paused) {
                    if (this.paused !== paused) {
                        this.track(paused ? "pause" : "resume");
                    }
                    this.paused = paused;
                    return paused;
                },

                setAdFullscreen: function(fullscreen) {
                    if (this.fullscreen !== fullscreen) {
                        this.track(fullscreen ? "fullscreen" : "exitFullscreen");
                    }
                    this.fullscreen = fullscreen;
                    return fullscreen;
                },

                setAdExpand: function(expanded) {
                    if (this.expanded !== expanded) {
                        this.track(expanded ? "expand" : "collapse");
                    }
                    this.expanded = expanded;
                    return expanded;
                },

                setAdSkipDelay: function(duration) {
                    if (typeof duration === 'number') {
                        this.skipDelay = duration;
                        return duration;
                    }
                },

                loadAd: function() {
                    if (!this.impressed) {
                        this.impressed = true;
                        this.trackAdURLs(this.ad.impressionURLTemplates);
                        return this.track("creativeView");
                    }
                },

                errorAdWithCode: function(errorCode) {
                    return this.trackAdURLs(this.ad.errorURLTemplates, {
                        ERRORCODE: errorCode
                    });
                },

                errorAdWithCodeAndMessage: function(errorCode, errorMessage) {
                    return this.trackAdURLs(this.ad.errorURLTemplates, {
                        ERRORCODE: errorCode,
                        ERRORMESSAGE: errorMessage
                    });
                },

                completeAd: function() {
                    return this.track("completeAd");
                },

                closeAd: function() {
                    return this.track(this.linear ? "closeLinear" : "close");
                },

                stopAd: function() {},

                skipAd: function() {
                    this.track("skip");
                    this.trackingEvents = [];
                    return this.trackingEvents;
                },

                clickAd: function() {
                    var clickThroughURL, ref, variables;
                    if ((ref = this.clickTrackingURLTemplates) !== null ? ref.length : void 0) {
                        this.trackAdURLs(this.clickTrackingURLTemplates);
                    }
                    if (this.clickThroughURLTemplate !== null) {
                        if (this.linear) {
                            variables = {
                                CONTENTPLAYHEAD: this.adProgressFormated()
                            };
                        }
                        clickThroughURL = VASTAd.resolveURLTemplates([this.clickThroughURLTemplate], variables)[0];
                        return this.trigger("clickthrough", clickThroughURL);
                    }
                },

                track: function(eventName, once) {
                    var idx, trackingURLTemplates;
                    if (!once) {
                        once = false;
                    }
                    if (eventName === 'closeLinear' && ((!this.trackingEvents[eventName]) && (this.trackingEvents.close))) {
                        eventName = 'close';
                    }
                    trackingURLTemplates = this.trackingEvents[eventName];
                    idx = this.emitAlwaysEvents.indexOf(eventName);
                    if (trackingURLTemplates) {
                        this.trigger(eventName, '');
                        this.trackAdURLs(trackingURLTemplates);
                    } else if (idx !== -1) {
                        this.trigger(eventName, '');
                    }
                    if (once === true) {
                        delete this.trackingEvents[eventName];
                        delete this.trackingEvents[eventName];
                        if (idx > -1) {
                            this.emitAlwaysEvents.splice(idx, 1);
                        }
                    }
                },

                trackAdURLs: function(URLTemplates, variables) {
                    var _ref;
                    if (!variables) {
                        variables = {};
                    }
                    if (this.linear) {
                        if (((_ref = this.creative.mediaFiles[0]) !== null ? _ref.fileURL : void 0) !== null) {
                            variables.ASSETURI = this.creative.mediaFiles[0].fileURL;
                        }
                        variables.CONTENTPLAYHEAD = this.adProgressFormated();
                    }
                    return VASTAd.trackAd(URLTemplates, variables);
                },

                adProgressFormated: function() {
                    var h, m, ms, s, seconds;
                    seconds = parseInt(this.progress, 10);
                    h = seconds / (60 * 60);
                    if (h.length < 2) {
                        h = "0" + h;
                    }
                    m = seconds / 60 % 60;
                    if (m.length < 2) {
                        m = "0" + m;
                    }
                    s = seconds % 60;
                    if (s.length < 2) {
                        s = "0" + m;
                    }
                    ms = parseInt((this.progress - seconds) * 100, 10);
                    return h + ":" + m + ":" + s + "." + ms;
                }
            };
        }]);
    });