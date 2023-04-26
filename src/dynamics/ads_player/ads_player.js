Scoped.define("module:Ads.Dynamics.Player", [
    "base:Objs",
    "base:Async",
    "browser:Info",
    "base:Maths",
    "base:Types",
    "base:Timers",
    "browser:Dom",
    "module:Assets",
    "dynamics:Dynamic",
    "module:Ads.IMALoader",
    "module:Ads.IMA.AdsManager"
], [
    "module:Ads.Dynamics.Controlbar"
], function(Objs, Async, Info, Maths, Types, Timers, Dom, Assets, Class, IMALoader, AdsManager, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/ads_player.html') %>",

                events: {
                    "change:volume": function(volume) {
                        this.call("setVolume", this.get("muted") ? 0 : volume);
                    },
                    "change:muted": function(muted) {
                        this.call("setVolume", muted ? 0 : this.get("volume"));
                    }
                },

                attrs: {
                    dyncontrolbar: "ads-controlbar",
                    tmplcontrolbar: "",
                    cssadsplayer: "ba-adsplayer",
                    commoncss: "",
                    linear: true, // should be true to cover all the player container
                    playing: false,
                    currenttime: 0,
                    volume: 1,
                    isoutstream: false,
                    hidecontrolbar: false,
                    showactionbuttons: false,
                    adscompleted: false,
                    moredetailslink: null,
                    moredetailstext: null,
                    adchoiceslink: null
                },

                _deferActivate: function() {
                    if (this._loadedSDK) return false;
                    IMALoader.loadSDK().success(function() {
                        this._loadedSDK = true;
                        this.activate();
                    }, this);
                    return true;
                },

                _baseRequestAdsOptions: function() {
                    return {
                        adTagUrl: this.get("adtagurl"),
                        IMASettings: this.get("imasettings"),
                        inlinevastxml: this.get("inlinevastxml"),
                        continuousPlayback: false, // TODO
                        linearAdSlotWidth: this.getAdWidth(),
                        linearAdSlotHeight: this.getAdHeight(),
                        nonLinearAdSlotWidth: this.getAdWidth(),
                        nonLinearAdSlotHeight: this.getAdHeight() / 3,
                        adWillAutoplay: this.getAdWillAutoplay(),
                        adWillPlayMuted: this.getAdWillPlayMuted()
                    };
                },

                channels: {
                    "ads:load": function() {
                        this.call("load");
                    },
                    "ads:start": function(ev) {
                        this._onStart(ev);
                    },
                    "ads:allAdsCompleted": function() {
                        this.call("reset");
                    },
                    "ads:discardAdBreak": function() {
                        this.call("discardAdBreak");
                    },
                    "ads:contentComplete": function() {
                        this.call("contentComplete");
                    },
                    "ads:loaded": function(event) {
                        this.set("ad", event.getAd());
                        this.set("addata", event.getAdData());
                        this.set("volume", this.adsManager.getVolume());
                        this.set("duration", event.getAdData().duration);
                        this.set("moredetailslink", event.getAdData().clickThroughUrl);
                    },
                    "ads:volumeChange": function() {
                        this.set("volume", this.adsManager.getVolume());
                    },
                    "ads:outstreamCompleted": function(dyn) {
                        this._outstreamCompleted(dyn);
                    },
                    "ads:outstreamStarted": function(dyn) {
                        this._outstreamStarted(dyn);
                    },
                    "ads:pause": function() {
                        this.set("playing", false);
                    },
                    "ads:resume": function() {
                        this.set("playing", true);
                    }
                },

                create: function() {
                    var dynamics = this.parent();
                    var adContainer = this.getAdContainer();
                    var adManagerOptions = {
                        adContainer: adContainer,
                        adsRenderingSettings: {
                            enablePreloading: true,
                            useStyledNonLinearAds: true,
                            restoreCustomPlaybackStateOnAdBreakComplete: true
                        }
                    };
                    if (!Info.isMobile() && this.getVideoElement()) {
                        // It's optionalParameter
                        adManagerOptions.videoElement = this.getVideoElement();
                    }
                    this.adsManager = this.auto_destroy(new AdsManager(adManagerOptions, dynamics));
                    this.adsManager.requestAds(this._baseRequestAdsOptions());
                    this.adsManager.on("all", function(event, data) {
                        this.channel("ads").trigger(event, data);
                    }, this);
                    if (dynamics) {
                        dynamics.on("resize", function(dimensions) {
                            // This part will listen to the resize even after adsManger will be destroyed
                            if (this.adsManager && typeof this.adsManager.resize === "function") {
                                this.adsManager.resize(
                                    dimensions.width, dimensions.height,
                                    google.ima.ViewMode.NORMAL
                                );
                            }
                        }, this);
                        dynamics.on("unmute-ads", function(volume) {
                            Async.eventually(function() {
                                // ads:volumeChange not trigger initially, only after change volume
                                this.set("volume", volume);
                                if (this.adsManager && typeof this.adsManager.setVolume === "function") {
                                    this.adsManager.setVolume(volume);
                                }
                            }, this, 300);
                        }, this);
                    }
                },

                functions: {
                    load: function() {
                        if (!this.adsManager) return this.once("dynamic-activated", function() {
                            this.call("load");
                        }, this);
                        this.adsManager.start({
                            width: this.getAdWidth(),
                            height: this.getAdHeight(),
                            volume: this.getAdWillPlayMuted() ? 0 : this.get("volume")
                        });
                    },
                    reset: function() {
                        this.set("linear", true);
                        this.set("adscompleted", true);
                        this.adsManager.reset();
                        this.adsManager.requestAds(this._baseRequestAdsOptions());
                    },
                    discardAdBreak: function() {
                        this.adsManager.discardAdBreak();
                    },
                    requestAds: function(options) {
                        this.adsManager.requestAds(Objs.extend(this._baseRequestAdsOptions(), options));
                    },
                    contentComplete: function() {
                        this.adsManager.contentComplete();
                    },
                    pause: function() {
                        return this.adsManager.pause();
                    },
                    resume: function() {
                        return this.adsManager.resume();
                    },
                    setVolume: function(volume) {
                        return this.adsManager && this.adsManager.setVolume && this.adsManager.setVolume(Maths.clamp(volume, 0, 1));
                    },
                    stop: function() {
                        return this.adsManager.stop();
                    },
                    replay: function() {
                        this._replay();
                    },
                    close: function() {
                        return this._hideContentPlayer();
                    }
                },

                getAdWidth: function() {
                    return this.activeElement().firstChild.clientWidth;
                },

                getAdHeight: function() {
                    return this.activeElement().firstChild.clientHeight;
                },

                getAdContainer: function() {
                    if (!this._adContainer) this._adContainer = this.activeElement().querySelector(".ba-ad-container");
                    return this._adContainer;
                },

                getVideoElement: function() {
                    if (!this._videoElement)
                        this._videoElement = this.parent() && this.parent().activeElement().querySelector("[data-video='video']"); // TODO video element for outstream
                    return this._videoElement;
                },

                getAdWillAutoplay: function() {
                    return this.parent() && this.parent().get("autoplay-allowed");
                },

                getAdWillPlayMuted: function() {
                    return this.get("muted");
                },

                _onStart: function(ev) {
                    this.set("playing", true);
                    this.set("currenttime", 0);
                    this.set("remaining", this.get("duration"));
                    this.set("showactionbuttons", false);
                    this.set("adscompleted", false);

                    if (ev && Types.is_function(ev.getAd)) {
                        var adData = ev.getAd();
                        var isLinear = adData.isLinear();
                        this.set("linear", isLinear);
                        this.set("hidecontrolbar", !isLinear);
                        if (!isLinear) {
                            this.set("non-linear-min-suggestion", adData.getMinSuggestedDuration());
                            // decrease a non-linear suggestion period, be able to show midroll
                            this._minSuggestionCalcualationTimer = this.auto_destroy(new Timers.Timer({ // This is being fired right before toggle_player
                                delay: 1000,
                                fire: function() {
                                    if (this.get("non-linear-min-suggestion") < 0) {
                                        this._minSuggestionCalcualationTimer.destroy();
                                    } else {
                                        this.set("non-linear-min-suggestion", this.get("non-linear-min-suggestion") - 1);
                                    }
                                }.bind(this)
                            }));
                        }

                        if (this.get("companionad") && adData) {
                            this._showCompanionAd(adData, this.get("companionad"));
                        }

                        // this.set("minSuggestedDuration", ev);
                        // if ad is outstream and
                        if (!isLinear && this.get("isoutstream")) {
                            this.adsManager.reset();
                        }
                    }
                },

                _outstreamCompleted: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _outstreamCompleted");
                    // this._hideContentPlayer(dyn);
                    // TODO: add option for selection
                    if (dyn.get("outstreamoptions")) {
                        if (dyn.get("outstreamoptions").hideOnCompletion) {
                            this._hideContentPlayer(dyn);
                            return;
                        }
                        if (dyn.get("outstreamoptions").moreURL) {
                            this.set("moredetailslink", dyn.get("outstreamoptions").moreURL);
                        }
                        if (dyn.get("outstreamoptions").moreText) {
                            this.set("moredetailstext", dyn.get("outstreamoptions").moreText);
                        }
                    }
                    this.set("showactionbuttons", true);
                },

                _outstreamStarted: function(dyn, options) {
                    this.set("isoutstream", true);
                },

                _replay: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _reply");
                    dyn.set("adsplayer_active", false); // Be able to reattach ads_player
                    dyn.create();
                },

                _hideContentPlayer: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _hideContentPlayer");
                    dyn.activeElement().style.setProperty("display", "none");
                    dyn.weakDestroy(); // << Create will not work as expected
                },

                /**
                 * @param ad IMA Ad data
                 * @param options
                 */
                _showCompanionAd: function(ad, options) {
                    var dyn, element, playerElement, position, selector, height, width;
                    dyn = this.parent();
                    if (!dyn || !(Types.is_defined(google) && google.ima))
                        throw Error("Parent dynamics or google not defined, to attach companion ad");
                    playerElement = dyn.activeElement();
                    if (options.split('|').length > 0) {
                        position = options.split('|')[1] || 'bottom';
                    }
                    options = options.replace(/\].*/g, "$'").split('[');
                    selector = options[0];
                    if (selector) {
                        element = document.getElementById(selector);
                    } else {
                        element = document.createElement('div');
                    }
                    if (!element) return;
                    var dimensions = options[1].split(',');
                    var isFluid = dimensions[0] === 'fluid';
                    // dimensions = dimensions.split(',');
                    if (!isFluid) {
                        width = Number((dimensions && dimensions[0] && dimensions[0] > 0) ?
                            dimensions[0] : Dom.elementDimensions(playerElement).width);
                        height = Number((dimensions && dimensions[1] && dimensions[1] > 0) ?
                            dimensions[1] : Dom.elementDimensions(playerElement).height);
                    }
                    var selectionCriteria = new google.ima.CompanionAdSelectionSettings();
                    // HTML,IFRAME,STATIC,ALL
                    selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.ALL;
                    // CreativeType:IMAGE, FLASH, ALL
                    selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.ALL;
                    var companionAds = [];

                    // SizeCriteria: IGNORE, SELECT_EXACT_MATCH, SELECT_NEAR_MATCH, SELECT_FLUID
                    if (!isFluid) {
                        // nearMatchPercent
                        selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;
                        if (width && height) {
                            // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
                            companionAds = ad.getCompanionAds(width, height, selectionCriteria);
                        }
                    } else {
                        selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.SELECT_FLUID;
                        companionAds = ad.getCompanionAds(0, 0, selectionCriteria);
                    }


                    if (typeof companionAds[0] === "undefined") return;

                    var companionAd = companionAds[0];
                    // Get HTML content from the companion ad.
                    // Write the content to the companion ad slot.
                    element.innerHTML = companionAd.getContent();
                    if (position && !selector) {
                        switch (position) {
                            case 'left':
                                // Prevent on click though taking all the width of the div element
                                element.style.display = 'inline-block';
                                element.style['float'] = 'left';
                                playerElement.parentNode.prepend(element);
                                break;
                            case 'top':
                                playerElement.parentNode.prepend(element);
                                break;
                            case 'right':
                                // Prevent on click though taking all the width of the div element
                                element.style.display = 'inline-block';
                                playerElement.style['float'] = 'left';
                                playerElement.parentNode.append(element);
                                break;
                            default:
                                playerElement.parentNode.append(element);
                        }
                    }
                }
            };
        }).register("ba-adsplayer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_player.html') %>*/
        }).attachStringTable(Assets.strings)
        .addStrings({
            "replay-ad": "Replay",
            "close-ad": "Close",
            "ad-choices": "Ad Choices",
            "learn-more": "Learn More"
        });
});