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
                    showrepeatbutton: true,
                    adscompleted: false,
                    moredetailslink: null,
                    moredetailstext: null,
                    repeatbuttontext: null,
                    adsplaying: false,
                    companionads: [],
                    companionadcontent: null
                },

                events: {
                    "change:volume": function(volume) {
                        this.call("setVolume", this.get("muted") ? 0 : volume);
                    },
                    "change:muted": function(muted) {
                        this.call("setVolume", muted ? 0 : this.get("volume"));
                    }
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
                        continuousPlayback: true,
                        linearAdSlotWidth: this.getAdWidth(),
                        linearAdSlotHeight: this.getAdHeight(),
                        nonLinearAdSlotWidth: this.getAdWidth(),
                        nonLinearAdSlotHeight: this.getAdHeight() / 3,
                        adWillAutoplay: this.getAdWillAutoplay(),
                        adWillPlayMuted: this.getAdWillPlayMuted(),
                        autoPlayAdBreaks: true,
                        width: this.getAdWidth(),
                        height: this.getAdHeight(),
                        volume: this.get("repeatedplayer") ? 1 : (this.getAdWillPlayMuted() ? 0 : this.get("volume"))
                    };
                },

                channels: {
                    "ads:ad-error": function() {
                        this.set("adsplaying", false);
                        if (this.parent().get("outstream")) {
                            this.parent().hidePlayerContainer();
                        }
                    },
                    "ads:load": function() {
                        this.call("load");
                        this.set("quartile", "first");
                    },
                    "ads:firstQuartile": function() {
                        this.set("quartile", "second");
                    },
                    "ads:midpoint": function() {
                        this.set("quartile", "third");
                    },
                    "ads:thirdQuartile": function() {
                        this.set("quartile", "fourth");
                    },
                    "ads:start": function(ev) {
                        this._onStart(ev);
                    },
                    "ads:complete": function(ev) {
                        this._onAdComplete(ev);
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
                        if (this.get("adsplaying")) {
                            this.call("pause");
                        }
                    },
                    "ads:resume": function() {
                        this.set("playing", true);
                        if (!this.get("adsplaying")) {
                            this.call("resume");
                        }
                    },
                    "ads:contentResumeRequested": function() {
                        this.set("adsplaying", false);
                    },
                    "ads:contentPauseRequested": function() {
                        this.set("adsplaying", true);
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
                        },
                        IMASettings: this.get("imasettings")
                    };
                    if (!Info.isMobile() && this.getVideoElement()) {
                        // It's optionalParameter
                        adManagerOptions.videoElement = this.getVideoElement();
                    }
                    this.adsManager = this.auto_destroy(new AdsManager(adManagerOptions, dynamics));
                    this.adsManager.requestAds(this._baseRequestAdsOptions());
                    this.adsManager.on("all", function(event, data) {
                        if (event === "adsManagerLoaded") this.set("adsmanagerloaded", true);
                        this.channel("ads").trigger(event, data);
                    }, this);
                    if (dynamics) {
                        dynamics.on("resize", function(dimensions) {
                            // This part will listen to the resize even after adsManger will be destroyed
                            if (this.adsManager && typeof this.adsManager.resize === "function") {
                                this.adsManager.resize(
                                    this.getAdWidth(),
                                    this.getAdHeight(),
                                    google.ima.ViewMode.NORMAL
                                );
                            }
                        }, this);
                        dynamics.on("unmute-ads", function(volume) {
                            Async.eventually(function() {
                                // ads:volumeChange not trigger initially, only after change volume
                                this.set("volume", volume);
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
                            volume: this.get("repeatedplayer") ? 1 : (this.getAdWillPlayMuted() ? 0 : this.get("volume"))
                        });
                        // if (!this.adsManager.adDisplayContainerInitialized) this.adsManager.initializeAdDisplayContainer();
                        // this.call("requestAds");
                    },
                    reset: function() {
                        this.set("linear", true);
                        this.set("adscompleted", true);
                        this.set("adsplaying", false);
                        this.adsManager.reset();
                        // this.adsManager.contentComplete();
                        this.adsManager.requestAds(this._baseRequestAdsOptions());
                    },
                    reload: function() {
                        // this.adsManager.reset();
                        // this.adsManager.contentComplete();
                        this.call("requestAds");
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
                        if (!this.adsManager || !this.adsManager.setVolume) return;
                        if (volume > 0 && this.parent() && this.parent().get("unmuteonclick")) return setTimeout(function() {
                            this.adsManager.setVolume(Maths.clamp(volume, 0, 1));
                        }.bind(this));
                        return this.adsManager.setVolume(Maths.clamp(volume, 0, 1));
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
                    if (!this.activeElement()) return null;
                    if (this.get("floating") && this.parent()) {
                        return Dom.elementDimensions(this.parent().__playerContainer).width;
                    }
                    return this.activeElement().firstChild ? this.activeElement().firstChild.clientWidth : this.activeElement().clientWidth;
                },

                getAdHeight: function() {
                    if (!this.activeElement()) return null;
                    if (this.get("floating") && this.parent()) {
                        return +parseFloat(this.get("containerstyle").height).toFixed() || Dom.elementDimensions(this.parent().activeElement().firstChild).height;
                    }
                    return this.activeElement().firstChild ? this.activeElement().firstChild.clientHeight : this.activeElement().clientHeight;
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
                    return this.get("muted") || this.get("volume") === 0;
                },

                _onStart: function(ev) {
                    this.set("playing", true);
                    this.set("currenttime", 0);
                    this.set("remaining", this.get("duration"));
                    this.set("showactionbuttons", false);
                    this.set("adscompleted", false);

                    if (ev && Types.is_function(ev.getAd)) {
                        var ad = ev.getAd();
                        var isLinear = ad.isLinear();
                        this.set("linear", isLinear);
                        this.set("hidecontrolbar", !isLinear);
                        if (!isLinear) {
                            this.set("non-linear-min-suggestion", ad.getMinSuggestedDuration());
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

                        // this.set("minSuggestedDuration", ev);
                        // if ad is outstream and
                        if (!isLinear && this.get("isoutstream")) {
                            this.adsManager.reset();
                        }

                        // Set companion ads array and render for normal content player viewport
                        if (ad) {
                            this._getCompanionAds(ad);
                            if (this.get("companionad")) this._renderCompanionAd(ad);
                        }
                    }
                },

                _onAdComplete: function(ev) {
                    if (this.get("companionads").length > 0) this.set("companionads", []);
                    if (this.__companionAdElement) {
                        this.__companionAdElement.innerHTML = "";
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
                        if (dyn.get("outstreamoptions").allowRepeat) {
                            this.set("showrepeatbutton", !!dyn.get("outstreamoptions").allowRepeat);
                        }
                        if (dyn.get("outstreamoptions").repeatText) {
                            this.set("repeatbuttontext", dyn.get("outstreamoptions").repeatText);
                        }
                    }
                    this.set("showactionbuttons", true);
                },

                /**
                 * @param ad
                 * @private
                 */
                _getCompanionAds: function(ad) {
                    ad = ad || this.get("ad");
                    var companionAds = [];
                    if (google && google.ima && ad && Types.is_function(ad.getCompanionAds)) {
                        // if options is not boolean, then we have provided more options, like size and selector
                        var selectionCriteria = new google.ima.CompanionAdSelectionSettings();
                        // HTML,IFRAME,STATIC,ALL
                        selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.ALL;
                        // CreativeType:IMAGE, FLASH, ALL
                        selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.ALL;
                        // get all companionads
                        selectionCriteria.sizeCriteria = google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE;
                        // get all available companion ads
                        companionAds = ad.getCompanionAds(0, 0, selectionCriteria);
                        if (companionAds && companionAds.length > 0) {
                            this.set("companionads", companionAds);
                        }
                        return companionAds;
                    } else {
                        return [];
                    }
                },

                /**
                 * @param ad
                 * @param options
                 * @return void
                 */
                _renderCompanionAd: function(ad, options) {
                    // Do not render anything if options is boolean and false
                    if (Types.is_boolean(options) && !Boolean(options)) return;

                    var playerElement, position, selector, height, width, companionAdDimensions,
                        isFluid, containerDimensions, selectionCriteria, expectedAR,
                        companionAd, closestIndex, closestAr, parentStyles, companionAdContainerStyles, excludeStyles;
                    var companionAds = [];
                    options = options || this.get("companionad");
                    if (Types.is_string(options)) {
                        if (options.split('|').length > 0) {
                            position = options.split('|')[1] || 'bottom';
                        }
                        options = options.replace(/\].*/g, "$'").split('[');
                        selector = options[0];
                    } else {
                        // if it's floating and floatingoptions.device.companionad is set to boolean true,
                        // then it will be handled by floating_sidebar.js
                        position = this.get("floating") && this.get("withsidebar") ? null : 'bottom';
                    }
                    if (selector) {
                        this.__companionAdElement = document.getElementById(selector);
                    } else {
                        this.__companionAdElement = this.__companionAdElement || document.createElement('div');
                    }
                    if (!this.__companionAdElement) return;
                    // reset companion ad container
                    this.__companionAdElement.innerHTML = "";
                    // playerElement = this.get("floating") ? this.parent().activeElement().firstChild : this.parent().activeElement();
                    playerElement = this.parent().activeElement();
                    containerDimensions = Dom.elementDimensions(playerElement.firstChild);
                    if (this.get("companionads").length <= 0) {
                        companionAdDimensions = options[1] ? options[1].split(',') : [0, 0];
                        isFluid = companionAdDimensions[0] === 'fluid';
                        // companionAdDimensions = companionAdDimensions.split(',');
                        if (!isFluid) {
                            width = Number((companionAdDimensions && companionAdDimensions[0] && companionAdDimensions[0] > 0) ?
                                companionAdDimensions[0] : containerDimensions.width);
                            height = Number((companionAdDimensions && companionAdDimensions[1] && companionAdDimensions[1] > 0) ?
                                companionAdDimensions[1] : containerDimensions.height);
                        }

                        selectionCriteria = new google.ima.CompanionAdSelectionSettings();
                        // HTML,IFRAME,STATIC,ALL
                        selectionCriteria.resourceType = google.ima.CompanionAdSelectionSettings.ResourceType.ALL;
                        // CreativeType:IMAGE, FLASH, ALL
                        selectionCriteria.creativeType = google.ima.CompanionAdSelectionSettings.CreativeType.ALL;
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
                    } else {
                        companionAds = this.get("companionads");
                    }
                    expectedAR = containerDimensions.width / containerDimensions.height;
                    Objs.iter(companionAds, function(companion, index) {
                        var _data = companion.data;
                        var _ar = _data.width / _data.height;
                        var _currentDiff = Math.abs(_ar - expectedAR);
                        if (index === 0 || closestAr > _currentDiff) {
                            closestAr = _currentDiff;
                            closestIndex = index;
                        }
                        if (companionAds.length === index + 1) {
                            companionAd = companionAds[closestIndex];
                        }
                    }, this);

                    // Get HTML content from the companion ad.
                    // Write the content to the companion ad slot.
                    this.__companionAdElement.innerHTML = companionAd.getContent();
                    Dom.elementAddClass(this.__companionAdElement, this.get("cssplayer") + "-companion-ad-container" + (this.get("mobileviewport") ? '-mobile' : '-desktop'));
                    var applyFloatingStyles = this.get("floating") && !this.get("withsidebar");
                    if (applyFloatingStyles) {
                        // Mobile has to show in the sidebar
                        position = this.get("mobileviewport") ? null : 'top';
                        parentStyles = this.parent().get("containerSizingStyles");
                        // var floatingoptions = this.get("mobileviewport") ? this.get("floatingoptions.mobile") : this.get("floatingoptions.desktop");
                        companionAdContainerStyles = {
                            position: 'relative'
                        };
                        var image = this.__companionAdElement.querySelector('img');
                        if (image && containerDimensions && companionAd.data) {
                            var _ar = companionAd.data.width / companionAd.data.height;
                            var _h = containerDimensions.width * (_ar <= 1 ? _ar : companionAd.data.height / companionAd.data.width);
                            image.width = containerDimensions.width;
                            image.height = _h;
                            companionAdContainerStyles.bottom = (_h + 20) + 'px';
                        }
                    } else {
                        this.__companionAdElement.removeAttribute('style');
                    }
                    if (this.get("floating") && !this.get("mobileviewport") && applyFloatingStyles) {
                        // On floating desktop attach to the player element
                        var _pl = this.parent().activeElement().querySelector('.ba-player-content');
                        if (_pl) playerElement = _pl;
                    }
                    if (position) {
                        switch (position) {
                            case 'left':
                                // Prevent on click though taking all the width of the div element
                                this.__companionAdElement.style.display = 'inline-block';
                                this.__companionAdElement.style['float'] = 'left';
                                playerElement.insertAdjacentElement("beforebegin", this.__companionAdElement);
                                break;
                            case 'top':
                                if (applyFloatingStyles && parentStyles) {
                                    this.parent()._applyStyles(this.__companionAdElement, companionAdContainerStyles);
                                }
                                playerElement.insertAdjacentElement("beforebegin", this.__companionAdElement);
                                break;
                            case 'right':
                                // Prevent on click though taking all the width of the div element
                                this.__companionAdElement.style.display = 'inline-block';
                                playerElement.style['float'] = 'left';
                                playerElement.insertAdjacentElement("afterend", this.__companionAdElement);
                                break;
                            default:
                                playerElement.insertAdjacentElement("afterend", this.__companionAdElement);
                        }
                    }
                },

                _outstreamStarted: function(dyn, options) {
                    this.set("isoutstream", true);
                },

                _replay: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _reply");
                    dyn.set("adsplayer_active", false); // Be able to reattach ads_player
                    this.set("repeat", true);
                    dyn.create(true);
                },

                _hideContentPlayer: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _hideContentPlayer");
                    dyn.hidePlayerContainer();
                    // dyn.weakDestroy(); // << Create will not work as expected
                }
            };
        }).register("ba-adsplayer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/ads_player.html') %>*/
        }).attachStringTable(Assets.strings)
        .addStrings({
            "replay-ad": "Replay Video",
            "close-ad": "Close",
            "ad-choices": "Ad Choices",
            "learn-more": "Learn More"
        });
});