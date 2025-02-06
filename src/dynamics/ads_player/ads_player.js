Scoped.define("module:Ads.Dynamics.Player", [
    "base:Objs",
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
], function(Objs, Info, Maths, Types, Timers, Dom, Assets, Class, IMALoader, AdsManager, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            const SUPPORTED_VAST_TAG_PARAMS = new Set([
                "aconp",
                "ad_rule",
                "ad_type",
                "addtl_consent",
                "afvsz",
                "allcues",
                "an",
                "ciu_szs",
                "correlator",
                "cmsid",
                "cust_params",
                "description_url",
                "env",
                "excl_cat",
                "gdfp_req",
                "gdpr",
                "gdpr_consent",
                "hl",
                "iabexcl",
                "idtype",
                "ipd",
                "ipe",
                "is_lat",
                "iu",
                "lip",
                "ltd",
                "max_ad_duration",
                "min_ad_duration",
                "mridx",
                "msid",
                "nofb",
                "npa",
                "omid_p",
                "output",
                "plcmt",
                "pmad",
                "pmnd",
                "pmxd",
                "pod",
                "pp",
                "ppt",
                "ppid",
                "ppos",
                "ppsj",
                "ptpl",
                "ptpln",
                "pubf",
                "pvid",
                "pvid_s",
                "pvtf",
                "rdid",
                "rdp",
                "scor",
                "sdk_apis",
                "sdmax",
                "sid",
                "ssss",
                "sz",
                "tfcd",
                "trt",
                "unviewed_position_start",
                "url",
                "vad_type",
                "vconp",
                "vid",
                "vid_d",
                "vpa",
                "vpi",
                "vpmute",
                "vpos",
                "wta",
            ]);
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
                    volume: 0,
                    isoutstream: false,
                    hidecontrolbar: false,
                    showactionbuttons: false,
                    showrepeatbutton: true,
                    showlearnmore: false,
                    hideclosebutton: false,
                    adscompleted: false,
                    moredetailslink: null,
                    moredetailstext: null,
                    repeatbuttontext: null,
                    adsplaying: false,
                    companionads: [],
                    companionadcontent: null,
                    custom_clickthrough: null,
                    persistentcompanionad: false,
                    ads_loaded: false,
                    ads_load_started: false,
                    adurl_fallback_attempted: false,
                },

                events: {
                    "change:volume": function(volume) {
                        // Muted should be pass only from the parent
                        if (!this.adsManager || !this.adsManager.setVolume) return;
                        volume = Maths.clamp(volume, 0, 1);
                        if (volume > 0 && this.get("unmuteonclick")) {
                            return setTimeout(function() {
                                if (!this.adsManager || !this.adsManager.setVolume) return;
                                this.adsManager.setVolume(volume);
                            }.bind(this), 200);
                        } else {
                            return this.adsManager.setVolume(volume);
                        }
                    },
                    "change:imaadsrenderingsetting": function(settings) {
                        if (!this.adsManager || !Types.is_object(settings)) return;
                        this.adsManager.updateAdsRenderingSettings(settings);
                    }
                },

                _deferActivate: function() {
                    if (this._loadedSDK) return false;
                    IMALoader.loadSDK({
                        debug: this.get("debug_ima")
                    }).success(function() {
                        if (this.__iasConfig()) {
                            IMALoader.loadIAS().success(function() {
                                this._loadedSDK = true;
                                this.activate();
                            }, this);
                        } else {
                            this._loadedSDK = true;
                            this.activate();
                        }
                    }, this);
                    return true;
                },

                /**
                 * @typedef {Object} RequestAdsOptions
                 * @property {Object} adTagParams - supported query params from adTagUrl
                 * @property {string} adTagUrl
                 * @property {boolean} adWillAutoPlay
                 * @property {boolean} adWillPlayMuted
                 * @property {boolean} autoPlayAdBreaks
                 * @property {boolean} continuousPlayback
                 * @property {number} height
                 * @property {Object} IMASettings - IMA settings object configuration
                 * @property {string} inlinevastxml
                 * @property {number} linearAdSlotHeight
                 * @property {number} linearAdSlotWidth
                 * @property {number} nonLinearAdSlotHeight
                 * @property {number} nonLinearAdSlotWidth
                 * @property {number} vastLoadTimeout
                 * @property {number} volume
                 * @property {number} width
                 */

                /**
                 *
                 * @returns {RequestAdsOptions}
                 * @private
                 */
                _baseRequestAdsOptions: function() {
                    const adTagUrl = this.get("adtagurl");
                    /** @type {RequestAdsOptions} */
                    const requestAdsOptions = {
                        adTagUrl: adTagUrl,
                        adTagParams: adTagUrl && this._adTagUrlParamsToMap(adTagUrl),
                        IMASettings: this.get("imasettings"),
                        inlinevastxml: this.get("inlinevastxml"),
                        continuousPlayback: true,
                        adWillAutoPlay: this.getAdWillAutoPlay(),
                        adWillPlayMuted: this.getAdWillPlayMuted(),
                        autoPlayAdBreaks: true,
                        width: this.getAdWidth(),
                        height: this.getAdHeight(),
                        volume: this.getAdWillPlayMuted() ? 0 : this.get("volume"),
                        options: this.get("ads_request_options"),
                    };
                    if (this.get("adsrendertimeout") && this.get("adsrendertimeout") > 0)
                        requestAdsOptions.vastLoadTimeout = this.get("adsrendertimeout");
                    return requestAdsOptions;
                },

                channels: {
                    "ads:impression": function() {
                        if (this.parent()?.get("outstream")) {
                            this.parent().handleOutstreamAdImpression();
                        }
                    },
                    "ads:adCanPlay": function() {
                        if (!this.get("adsplaying")) {
                            console.log("Ad can play");
                            this.set("adsplaying", true);
                        }
                    },
                    "ads:ad-error": function() {
                        const fallbackUrl = this.parent()?.get('adtagurlfallbacks')
                        const fallbackAttempted = this.get('adurl_fallback_attempted')

                        if (fallbackUrl && !fallbackAttempted) {
                            this.set('adtagurl', fallbackUrl)
                            this.set('adurl_fallback_attempted', true)
                            this.adsManager.requestAds(this._baseRequestAdsOptions());
                        } else {
                            this.set(`adsplaying`, false);
                            this.set(`ads_loaded`, false);
                            this.set(`ads_load_started`, false);
                            if (this.parent()?.get("outstream")) {
                                this.parent().handleOutstreamAdError();
                            }
                            this.trackAdsPerformance(`ad-error`);
                        }
                    },
                    "ads:render-timeout": function() {
                        this.set(`adsplaying`, false);
                        this.set(`ads_loaded`, false);
                        this.set(`ads_load_started`, false);
                        if (this.adsManager && typeof this.adsManager.destroy === "function" && !this.adsManager.destroyed()) {
                            this.adsManager.destroy();
                        }
                        this.trackAdsPerformance(`ads-render-timeout`);
                    },
                    "ads:load": function(autoPlay = true) {
                        this.set("skipvisible", false);
                        this.call("load", autoPlay);
                        this.set("quartile", "first");
                        this.trackAdsPerformance(`ads-load-start`);
                        this.set(`ads_load_started`, true);
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
                        if (this.get('custom_clickthrough')) {
                            this.get('custom_clickthrough').style.display = 'block';
                        }
                        this._onStart(ev);
                        this.trackAdsPerformance(`ads-start`);
                        this.set(`ads_loaded`, false);
                        // Mute again to prevent edge case with VPAID creatives unmuting the player and not synching with IMA SDK.
                        if (this.get('muted') || this.get('volume') === 0) {
                            this.adsManager.setVolume(0);
                        }
                    },
                    "ads:skippableStateChanged": function(event) {
                        this.set("skipvisible", true);
                    },
                    "ads:complete": function(ev) {
                        this._onAdComplete(ev);
                    },
                    "ads:allAdsCompleted": function() {
                        this.set(`ads_load_started`, false);
                        this.trackAdsPerformance(`ads-all-completed`);
                        if (this.parent() && (
                                this.parent().get("outstreamoptions").noEndCard ||
                                this.parent().get("outstreamoptions.allowRepeat")
                            )) return;
                        this.call("reset");
                    },
                    "ads:discardAdBreak": function() {
                        this.call("discardAdBreak");
                    },
                    "ads:contentComplete": function() {
                        this.call("contentComplete");
                    },
                    "ads:loaded": function(event) {
                        const ad = event.getAd();
                        this.set("ad", ad);
                        this.setEndCardBackground(this.getAdWidth(), this.getAdHeight());
                        const adData = event.getAdData();
                        const clickthroughUrl = adData.clickThroughUrl;
                        this.set("addata", adData);
                        // even we're asking ads via adWillPlayMuted:false and volume:1, it's always respond muted
                        if (this.get('adsunmuted')) {
                            this.adsManager.setVolume(this.get('volume'));
                        }
                        this._setVolume(this.adsManager.getVolume(), false);
                        this.set("duration", adData.duration);
                        this.set("moredetailslink", clickthroughUrl);
                        this.set("adsclicktroughurl", clickthroughUrl);
                        this.set(`ads_loaded`, true);
                        this.set(`ads_load_started`, false);
                        this.trackAdsPerformance(`ads-loaded`);
                        this._onLoaded(event);
                    },
                    "ads:outstreamCompleted": function(dyn) {
                        this._outstreamCompleted(dyn);
                    },
                    "ads:outstreamStarted": function(dyn) {
                        this._outstreamStarted(dyn);
                    },
                    "ads:pause": function() {
                        if (this.get("playing")) {
                            this.call("pause");
                            this.set("playing", false);
                        }
                    },
                    "ads:resume": function() {
                        if (!this.get("playing")) {
                            this.call("resume");
                            this.set("playing", true);
                        }
                    },
                    "ads:contentResumeRequested": function() {
                        this.set("adsplaying", false);
                        if (this.get('custom_clickthrough')) {
                            this.get('custom_clickthrough').style.display = 'none';
                        }
                    },
                    "ads:contentPauseRequested": function() {
                        // outstream ads will be visible on ads can play event
                        this.set("adsplaying", !this.get("isoutstream"));
                        this.trackAdsPerformance(`ads-content-pause-requested`);
                    }
                },

                __iasConfig: function() {
                    return this.parent().get("ias-config");
                },

                create: function() {
                    const dynamics = this.parent();
                    const adContainer = this.getAdContainer();
                    const IMASettings = this.get("imasettings");
                    let adManagerOptions = {
                        adContainer: adContainer,
                        adsRenderingSettings: this.get("imaadsrenderingsetting"),
                        videoElement: this.getVideoElement() || null,
                        IMASettings
                    }

                    if (Info.isMobile()) {
                        this.set('isMobile', true);
                        adManagerOptions = this.normalizeOptionsForMobile(adManagerOptions);
                    }

                    this.adsManager = this.auto_destroy(new AdsManager(adManagerOptions, dynamics));
                    try {
                        this.adsManager.requestAds(this._baseRequestAdsOptions());
                        this.channel("ads").trigger(`requested`, adManagerOptions);
                    } catch (e) {
                        this.channel("ads").trigger(`request-error`, e, adManagerOptions);
                    }
                    // Will list events which are require some additional actions,
                    // ignore events like adsProgress for additional statement checks
                    this.adsManager.on("all", function(event, ad, ...rest) {
                        if (event === "adsManagerLoaded") {
                            dynamics.set(`adsinitialized`, true);
                            this.set("adsmanagerloaded", true);
                            if (this.__iasConfig() && typeof googleImaVansAdapter !== "undefined") {
                                googleImaVansAdapter.init(google, this.adsManager, this.getVideoElement(), Objs.extend({
                                    "campId": (this.getAdWidth() || 640) + "x" + (this.getAdHeight() || 360)
                                }, this.__iasConfig));
                            }
                            // If we're getting ad-error no need to set loadVideoTimeout
                            this._setLoadVideoTimeout();
                        }
                        this.channel("ads").trigger(event, ad, rest);
                    }, this);

                    if (this.shouldShowFirstFrameAsEndcard()) {
                        // attach listener to set endcard image
                        this.on("change:endcardbackgroundsrc", function(endcardbackgroundsrc) {
                            if (endcardbackgroundsrc) {
                                this.getAdContainer().style.backgroundImage = `url("${endcardbackgroundsrc}")`;
                            }
                        });
                    }

                    if (dynamics) {
                        // if we've already not started timer, we should start it here
                        dynamics.initAdsRenderFailTimeout();
                        dynamics.on("resize", function(dimensions) {
                            const width = this.getAdWidth();
                            const height = this.getAdHeight();
                            if (width && height) {
                                // This part will listen to the resize even after adsManger will be destroyed
                                if (this.adsManager && typeof this.adsManager.resize === "function") {
                                    this.adsManager.resize(
                                        width,
                                        height,
                                        google.ima.ViewMode.NORMAL
                                    );
                                }
                                this.setEndCardBackground(width, height);
                            }
                        }, this);
                    }
                },

                functions: {
                    load: function(autoPlay) {
                        if (!this.adsManager) return this.once("dynamic-activated", function() {
                            this.call("load", autoPlay);
                        }, this);
                        this.adsManager.start(this._adsManagerRunOptions(autoPlay));
                    },
                    play: function() {
                        if (!this.adsManager) this.call("load", true);
                        if (this.get("adsplaying") || !this.get(`ads_loaded`)) {
                            console.warn(`Ads already playing or ads not loaded yet.`);
                            return;
                        }
                        if (this.adsManager) {
                            this.adsManager.playLoadedAd(this._adsManagerRunOptions(true));
                        }
                    },
                    reset: function() {
                        this.set("linear", true);
                        this.set("adscompleted", true);
                        this.set("adsplaying", false);
                        this.set('adurl_fallback_attempted', true)
                        this.adsManager.reset();
                        // this.adsManager.contentComplete();
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
                        this.checkIfAdHasMediaUrl();
                        return this.adsManager.pause();
                    },
                    resume: function() {
                        return this.adsManager.resume();
                    },
                    set_volume: function(volume) {
                        this._onPlayerEngaged();
                        this._setVolume(Maths.clamp(volume, 0, 1), true);
                    },
                    stop: function() {
                        return this.adsManager.stop();
                    },
                    fullscreen: function() {
                        this.trigger('fullscreen');
                    },
                    toggle_volume: function() {
                        this._onPlayerEngaged();
                    },
                    replay: function() {
                        this._replay();
                    },
                    redirect: function(moredetailslink) {
                        if (moredetailslink) {
                            window.open(moredetailslink, '_blank');
                        }
                    },
                    close: function() {
                        return this._hideContentPlayer();
                    },
                    hideCompanionAd: function() {
                        return this._hideCompanionAd();
                    },
                    renderCompanionAd: function() {
                        return this._renderCompanionAd();
                    },
                    removeBackImageFromAds: function() {
                        if (Info.isSafari() && this.getAdContainer().style.backgroundImage && !this.get("endcardbackgroundsrc")) {
                            this.getAdContainer().style.backgroundImage = 'none';
                        }
                    }
                },

                normalizeOptionsForMobile: function(adManagerOptions) {
                    if (this._isIos10Plus()) {
                        adManagerOptions.IMASettings.iOS10Plus = true;
                    }

                    const clickElId = adManagerOptions.IMASettings.customClickElementId;
                    if (clickElId) {
                        const clickThroughEl = document.getElementById(clickElId);

                        if (clickThroughEl) {
                            this.set('custom_clickthrough', clickThroughEl);
                            adManagerOptions.customClickthroughEl = clickThroughEl;
                        }
                    }
                    return adManagerOptions;
                },
                getAdWidth: function() {
                    if (!this.activeElement()) return null;
                    if ((this.get("sidebar_active") || (this.get("sticky") || this.get("floating"))) && this.parent()) {
                        return Dom.elementDimensions(this.parent().__playerContainer).width;
                    }
                    return this.activeElement().firstChild ? this.activeElement().firstChild.clientWidth : this.activeElement().clientWidth;
                },
                getAdHeight: function() {
                    if (!this.activeElement()) return null;
                    if ((this.get("sticky") || this.get("floating")) && this.parent()) {
                        return Dom.elementDimensions(this.parent().activeElement().firstChild).height;
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
                isImageBlack: function(ctx, width, height) {
                    var imageData = ctx.getImageData(0, 0, width, height);
                    var pixels = imageData.data;
                    for (var i = 0; i < pixels.length; i += 4) {
                        var r = pixels[i];
                        var g = pixels[i + 1];
                        var b = pixels[i + 2];
                        if (r !== 0 || g !== 0 || b !== 0) {
                            return false;
                        }
                    }
                    return true;
                },
                getMediaUrl: function(adObj) {
                    let adMediaUrl = adObj?.data?.mediaUrl;
                    if (adMediaUrl) {
                        return adMediaUrl;
                    }
                    // backup plan if mediaurl is not in data object
                    if (adObj?.data?.traffickingParameters) {
                        try {
                            const mediaFiles = JSON.parse(adObj.data.traffickingParameters)?.mediaFiles;
                            if (Array.isArray(mediaFiles)) {
                                const mediaFile = mediaFiles.find(file => !!file?.uri).uri;
                                return mediaFile || "";
                            }
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    return "";
                },
                checkIfAdHasMediaUrl: function() {
                    const adObj = this.get("ad");
                    let adMediaUrl = adObj?.data?.mediaUrl;
                    if (!adMediaUrl) {
                        adMediaUrl = this.getMediaUrl(adObj);
                    }

                    if (Info.isSafari() && adMediaUrl) {
                        this.renderVideoFrame(adMediaUrl, this.getAdWidth(), this.getAdHeight())
                    }
                },
                renderVideoFrame: function(mediaUrl, width, height) {
                    const video = document.createElement("video");
                    video.crossOrigin = "anonymous";
                    video.src = mediaUrl;
                    video.muted = true;
                    video.setAttribute("playsinline", true)
                    video.play();
                    video.addEventListener("loadeddata", (event) => {
                        this.parent()._drawFrame(video, this.get('currenttime'), width, height, (canvas, ctx) => {
                            if (this.isImageBlack(ctx, width, height)) {
                                this.getAdContainer().style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
                            }
                        })
                    })
                },

                captureAdEndCardBackground: function(width, height) {
                    const ad = this.get("ad");

                    if (ad?.data && !ad.data.mediaUrl) {
                        ad.data.mediaUrl = this.getMediaUrl(ad);
                    }

                    if (ad) {
                        this.generateEndCardImage(ad, width, height);
                    }
                },

                setEndCardBackground: function(width, height) {
                    if (this.shouldShowFirstFrameAsEndcard()) {
                        if (width && height) {
                            this.captureAdEndCardBackground(width, height);
                        }
                    }
                },

                generateEndCardImage: function(ad, width, height) {
                    // if we already captured the endcard once already
                    if (this._video && this._canvas && this._mediaUrl) {
                        this.resizeCanvas(width, height);
                        return;
                    }
                    this._video = document.createElement("video");
                    this._canvas = document.createElement("canvas");
                    this._mediaUrl = ad?.data?.mediaUrl;
                    if (this._mediaUrl) {
                        fetch(this._mediaUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                this._video.src = URL.createObjectURL(blob);
                                this._video.crossOrigin = "anonymous";
                                this._video.muted = true;
                                this._video.setAttribute("playsinline", true);
                                return this._video.play();
                            })
                            .then(() => {
                                // add a small delay to handle cases where the beginning of video is a black screen
                                // 800ms delay + drawFrame has a timeout of 200ms = 1s into video
                                this.parent()._drawFrame(this._video, 0.8, width, height, (canvas, _ctx) => {
                                    this._canvas = canvas;
                                    this.set("endcardbackgroundsrc", this._canvas.toDataURL("image/png"));
                                    this._video.pause();
                                });
                            }).catch((e) => console.log(`Error: ${e}`));
                    }
                },

                resizeCanvas: function(newWidth, newHeight) {
                    this._canvas.width = newWidth;
                    this._canvas.height = newHeight;
                    this._canvas
                        .getContext("2d")
                        .drawImage(this._video, 0, 0, this._canvas.width, this._canvas.height);
                    this.set("endcardbackgroundsrc", this._canvas.toDataURL("image/png"))
                },

                shouldShowFirstFrameAsEndcard: function() {
                    const dyn = this.parent();
                    const showEndCard = !dyn.get("outstreamoptions").noEndCard;
                    const noRepeat = !dyn.get("outstreamoptions.allowRepeat");
                    const showFirstFrameAsEndCard = dyn.get("outstreamoptions.firstframeasendcard");
                    return dyn && (showEndCard || noRepeat) && showFirstFrameAsEndCard;
                },

                getAdWillAutoPlay: function() {
                    return this.parent() && (!!this.parent().get("autoplay-allowed") || this.parent().get("autoplay"));
                },

                getAdWillPlayMuted: function() {
                    // there is a delay for parent volume propagating to the ad player so we check if volume for both
                    return this.get("muted") || (this.get("volume") === 0 && this.parent().get("volume") === 0);
                },

                trackAdsPerformance: function(name) {
                    if (this.parent()) {
                        this.parent()._recordPerformance(name);
                    }
                },

                _onStart: function(ev) {
                    // Set companion ads array and render for normal content player viewport
                    if (ev.ad) {
                        this._getCompanionAds(ev.ad);
                    }

                    this.set("playing", true);
                    this.set("currenttime", 0);
                    this.set("remaining", this.get("duration"));
                    this.set("showactionbuttons", false);
                    this.set("adscompleted", false);
                    this.set("hidecontrolbar", !this.get(`linear`) || this.get("hideadscontrolbar"));
                },

                _onLoaded: function(ev) {
                    if (ev && Types.is_function(ev.getAd)) {
                        var ad = ev.getAd();
                        var isLinear = ad.isLinear();
                        this.set("linear", isLinear);
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
                            this.adsManager.requestAds(this._baseRequestAdsOptions());
                        }
                    }

                    // reset adsrendertimeout
                    this.parent().stopAdsRenderFailTimeout(true);
                    // and set a new videoLoaded timeout for midroll and post-roll
                    this._setLoadVideoTimeout();
                },

                _onAdComplete: function(ev) {
                    // NOTE: As below codes only companion ads related code will be better return.
                    // Non companion ads code should be applied above of this line
                    if (this.get("persistentcompanionad")) return;
                    if (this.get("companionads") && this.get("companionads").length > 0) this.set("companionads", []);
                    if (this.get("multicompanionads") && this.get("multicompanionads").length > 0) {
                        Objs.iter(this.get("multicompanionads"), function(element, index) {
                            element.innerHTML = "";
                            delete this.get("multicompanionads")[index];
                        }, this);
                    }
                    if (this.__companionAdElement) {
                        this.__companionAdElement.innerHTML = "";
                    }
                },

                _setLoadVideoTimeout: function() {
                    if (this.get("adsrendertimeout") > 0 && this.get("adsrendertimeout") !== this.get("imaadsrenderingsetting.loadVideoTimeout")) {
                        const dyn = this.parent();
                        if (dyn) {
                            // If we've set or timer still exists
                            dyn.set("imaadsrenderingsetting", {
                                ...dyn.get("imaadsrenderingsetting"),
                                loadVideoTimeout: dyn.get("adsrendertimeout")
                            });
                        }
                    }
                },

                _onPlayerEngaged: function() {
                    const parentDyn = this.parent();
                    if (parentDyn && Types.is_function(parentDyn.setPlayerEngagement)) {
                        parentDyn.setPlayerEngagement();
                    }
                },

                _outstreamCompleted: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _outstreamCompleted");
                    // TODO: add option for selection

                    if (dyn.get("outstreamoptions")) {
                        // Will handle via player State on ads completion
                        if (dyn.get("outstreamoptions.hideOnCompletion")) {
                            this._hideContentPlayer(dyn);
                            return;
                        } else {
                            const moreDetailsLink = dyn.get("outstreamoptions.moredetailslink");
                            if (dyn.get("outstreamoptions.noEndCard")) return;
                            if (dyn.get("outstreamoptions.moreText")) {
                                this.set("moredetailstext", dyn.get("outstreamoptions.moreText"));
                            }
                            this.set("showrepeatbutton", !!dyn.get("outstreamoptions.allowRepeat"));
                            if (dyn.get("outstreamoptions.repeatText")) {
                                this.set("repeatbuttontext", dyn.get("outstreamoptions.repeatText"));
                            }
                            if (moreDetailsLink) {
                                this.set("moredetailslink", moreDetailsLink);
                            }
                            this.set("hideclosebutton", !!dyn.get("outstreamoptions.hideclose"));
                            this.set("showlearnmorebutton", !!dyn.get("outstreamoptions.showlearnmore"));
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
                    let companionAds = [];
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

                    ad = ad || this.get("ad");
                    options = options || this.get("companionad");

                    var playerElement, position, selector, height, width, companionAdDimensions,
                        isFluid, containerDimensions, selectionCriteria, expectedAR,
                        companionAd, closestIndex, closestAr, parentStyles, companionAdContainerStyles;
                    var companionAds = [];
                    if (Types.is_string(options)) {
                        if (options.split('|').length > 0) {
                            position = options.split('|')[1] || 'bottom';
                        }
                        options = options.replace(/\].*/g, "$'").split('[');
                        selector = options[0];
                    } else {
                        // if it's floating and floatingoptions.device.companionad is set to boolean true,
                        // then it will be handled by sidebar.js
                        position = (this.get("sticky") || this.get("floating")) && this.get("withsidebar") ? null : 'bottom';
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
                    if (this.get("companionads") && this.get("companionads").length <= 0) {
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

                    this.set("companionadcontainer", this.__companionAdElement);
                    // Get HTML content from the companion ad.
                    // Write the content to the companion ad slot.
                    this.__companionAdElement.innerHTML = companionAd.getContent();
                    Dom.elementAddClass(this.__companionAdElement, this.get("cssplayer") + "-companion-ad-container" + (this.get("mobileviewport") ? '-mobile' : '-desktop'));
                    var applyFloatingStyles = (this.get("sticky") || this.get("floating")) && !this.get("withsidebar");
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
                    if ((this.get("sticky") || this.get("floating")) && !this.get("mobileviewport") && applyFloatingStyles) {
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

                _hideCompanionAd: function() {
                    if (this.get("persistentcompanionad")) return;
                    // If there is any content in the companion ad container, remove it
                    if (this.__companionAdElement && Types.is_function(this.__companionAdElement.remove)) {
                        this.__companionAdElement.remove();
                    }
                },

                _outstreamStarted: function(dyn, options) {
                    this.set("isoutstream", true);
                    if (Types.is_defined(this.get("outstreamoptions.persistentcompanionad"))) {
                        this.set("persistentcompanionad", this.get("outstreamoptions.persistentcompanionad"));
                    }
                },

                _replay: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _reply");
                    this.set("repeat", true);
                    this.channel("ads").trigger("replayOutstream");
                },

                _hideContentPlayer: function(dyn) {
                    dyn = dyn || this.parent();
                    if (Types.is_undefined(dyn.activeElement))
                        throw Error("Wrong dynamics instance was provided to _hideContentPlayer");
                    this._hideCompanionAd();
                    dyn.hidePlayerContainer(true);
                    // dyn.weakDestroy(); // << Create will not work as expected
                },

                /**
                 * @param {number} volume
                 * @param {boolean | null} applyToParent
                 * @private
                 */
                _setVolume: function(volume, applyToParent) {
                    applyToParent = applyToParent || false;
                    if (applyToParent && this.parent()) {
                        this.parent().set("volume", volume);
                        this.parent().set('muted', volume <= 0);
                    }
                    this.set("volume", volume);
                    this.set("adsunmuted", volume > 0);
                },

                _adsManagerRunOptions: function(autoPlay) {
                    return {
                        width: this.getAdWidth(),
                        height: this.getAdHeight(),
                        volume: this.getAdWillPlayMuted() ? 0 : this.get("volume"),
                        adWillAutoPlay: Types.is_defined(autoPlay) ? autoPlay : true
                    }
                },

                /**
                 *
                 * @private
                 * @param {string} url
                 * @return {Object} param key value map
                 */
                _adTagUrlParamsToMap: function(url) {
                    return new URL(url) // convert URL string to URL object
                        .searchParams.toString() // grab query url string
                        .split("&") //down to each query param pair
                        .reduce((acc, current) => {
                            const [key, value] = current.split("=");
                            if (SUPPORTED_VAST_TAG_PARAMS.has(key)) {
                                acc[key] = value;
                            }
                            return acc
                        }, {});
                },

                /**
                 * returns true if the user agent string is an iOS device with major version greater than 10
                 * @param {string} userAgent
                 * @private
                 * @returns {boolean}
                 */
                _isIos10Plus: function() {
                    const userAgent = Info.getNavigator().userAgent;

                    // Using a different iOS check instead of Info.isiOS() because it has false positives leading to
                    // a thrown exception
                    // regex taken from https://github.com/faisalman/ua-parser-js/blob/master/src/main/ua-parser.js#L857C14-L857C64
                    // regex modified to ignore opera agent string since they don't have OS version
                    const isIosInBrowser = !!userAgent.match(/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac)/i);
                    const iosInAppBrowserMatch = userAgent.match(/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i)
                    const isIosInAppBrowser = !!iosInAppBrowserMatch;

                    let majorVersion = 0;
                    try {
                        if (isIosInBrowser) {
                            // Info.iOSversion() throws an exception if unable to parse version
                            majorVersion = Info.iOSversion().major;
                        } else if (isIosInAppBrowser) {
                            // we do this check second because the regex can have a false positive against the
                            // in-browser regex and in-app browsers have a different version format string to parse
                            // that is dot-delimited
                            let versionString = iosInAppBrowserMatch[1].split(".")[0];
                            if (versionString) {
                                majorVersion = parseInt(versionString, 10);
                            }
                        }
                    } catch (e) {
                        Debug.log(e);
                    }

                    return majorVersion > 10;
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
