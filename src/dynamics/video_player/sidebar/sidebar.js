Scoped.define("module:VideoPlayer.Dynamics.Sidebar", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Types",
    "browser:Dom",
    "module:Assets",
    "base:Timers.Timer",
    "module:StylesMixin",
    "browser:DomMutation.MutationObserverNodeInsertObserver"
], [
    "module:Common.Dynamics.Spinner",
    "module:Ads.Dynamics.ChoicesLink",
    "module:Ads.Dynamics.LearnMoreButton",
    "module:Common.Dynamics.CircleProgress"
], function(Class, Objs, Async, Types, DOM, Assets, Timer, StylesMixin, DomMutationObserver, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/sidebar.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "cssadsplayer": "ba-adsplayer",
                    "cssgallerysidebar": "ba-gallery-sidebar",
                    "cssfloatingsidebar": "ba-floating-sidebar",
                    "sidebartitle": null,
                    "bodyelementtouched": false,
                    "bodyelementpadding": 114,
                    "companionadcontent": null,
                    "companionads": [],
                    "is_floating": false,
                    "gallerytitletext": null,
                    "headerlogourl": null,
                    "headerlogoname": null,
                    "afteradsendtext": null,
                    "adchoiceslink": null,
                    playlist: [],
                    blacklisted: [],
                    loaded: [],
                    watched: [],
                    showprogress: false,
                    nextindex: null,
                    previousindex: null,
                    currentindex: null,
                    loading: true,
                    hideloadingafter: 2500
                },

                events: {
                    "change:nextindex": function(nextindex) {
                        console.log("Will asd ", nextindex);
                        this.__checkIndexPlayability(nextindex);
                    },
                    "change:adsplaying": function(adsPlaying) {
                        if (!adsPlaying && this.get("videos").count() > 0) {
                            this.startLoader();
                        }
                    },
                    "change:fullscreened": function(fullscreened) {
                        if (!fullscreened) this.__scrollTop();
                    },
                    "change:is_floating": function(floating) {
                        if (!floating) this.__scrollTop();
                    }
                },

                computed: {
                    "showplaylist:playlist": function(playlist) {
                        const videos = this.get("videos");
                        const count = videos.count();

                        Objs.iter(playlist, function(pl, index) {
                            if (count > 0 && videos.get_by_secondary_index('index', index)) return;
                            if (Types.is_object(pl)) {
                                videos.add({
                                    index: index,
                                    title: pl.title,
                                    poster: pl.poster,
                                    token: pl.token || null,
                                    height: 0,
                                    display: true,
                                    watched: false
                                });
                            }
                        }, this);

                        const showSidebar = playlist.length > 0;
                        if (showSidebar) this.startLoader();
                        return showSidebar;
                    }
                },

                collections: {
                    videos: {}
                },

                create: function() {
                    this.__dyn = this.parent();
                    this.get("videos").add_secondary_index("index");
                    this.set("headerlogourl", this.get("sidebaroptions.headerlogourl") || null);
                    this.set("headerlogoimgurl", this.get("sidebaroptions.headerlogoimgurl") || null);
                    this.set("headerlogoname", this.get("sidebaroptions.headerlogoname") || "Brand's logo");
                    this.set("gallerytitletext", this.get("sidebaroptions.gallerytitletext") || this.string("up-next"));
                    this.set("afteradsendtext", this.get("sidebaroptions.afteradsendtext") || this.string("continue-on-ads-end"));
                    this.set("hidevideoafterplay", this.get("sidebaroptions.hidevideoafterplay") || false);

                    // On screen size changes, we need to go to the top of the list
                    this.__dyn.on("resize", function() {
                        this.__scrollTop();
                    }, this);

                    // When next video automatically played
                    this.__dyn.channel("next").on("playNext", function() {
                        this.__dyn.trigger("play_next", this.get("nextindex"));
                        this.__removeVideoFromList(this.get("previousindex"));
                    }, this);

                    // When next video actually starts to play
                    // Will trigger on both playNext and manualPlayNext
                    this.__dyn.on("playlist-next", function(pl) {
                        console.log("TIMESS 3333");
                        this.__setNextVideoIndex();
                    }, this);

                    this.__dyn.on("last-playlist-item", function() {
                        this.set("nextindex", null);
                    }, this);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    if (
                        this.get("floatingoptions.showcompanionad") && this.get("floatingsidebar") ||
                        (this.get("sidebaroptions.showcompanionad") && this.get("floatingsidebar"))
                    ) {
                        if (this.get("companionads") && this.get("companionads").length > 0) {
                            this.__generateCompanionAdContent();
                        } else {
                            this.on("change:companionads", function(companionads) {
                                this.__generateCompanionAdContent(companionads);
                            }, this);
                        }
                    }
                },

                functions: {
                    play_video: function(index) {
                        this.playNextVideo(index);
                    },

                    on_learn_more_click: function() {
                        this.pauseAds();
                    },

                    on_ads_choices_click: function() {
                        this.pauseAds();
                    }
                },

                pauseAds: function() {
                    if (this.get("adsplaying")) {
                        this.trigger("pause_ads");
                    }
                },

                playNextVideo: function(index) {
                    this.get("videos").iterate(function(v) {
                        if (index && v.get("index") === index) {
                            this.set("previousindex", this.__dyn.get("next_video_from_playlist"));
                            this.__dyn.set("next_video_from_playlist", index);
                            // Just for tracking
                            this.__dyn.channel("next").trigger("manualPlayNext");
                            this.__dyn.trigger("play_next", index);
                            v.set("watched", true);
                            this.__removeVideoFromList(this.get("previousindex"));
                            console.log("CALL 111");
                            this.__scrollTop();
                        }
                    }, this);
                },

                /**
                 * Will define and set next Video
                 */
                __setNextVideoIndex: function() {
                    let nextIndex = null;
                    const index = this.__dyn.get("next_video_from_playlist");
                    if (!this.get("currentindex")) {
                        this.set("currentindex", this.get("videos").first().get("index"))
                    }
                    const lastIndex = this.get("videos").last().get("index");
                    this.get("videos").iterate(function(v, i) {
                        const _videoIndex = v.get("index");
                        // if nextIndex not defined, and we have not watched video, we can set it as nextIndex
                        if (this.get("blacklisted").indexOf(_videoIndex) === -1 && _videoIndex > index && !nextIndex && v.get("display") && !v.get("watched")) {
                            nextIndex = v.get("index");
                            this.set("nextindex", nextIndex);
                            console.log("CALL 2222");
                            this.__scrollTop();
                        }
                        // If still we couldn't find next index, we need to reset playlist
                        if (lastIndex === i && !nextIndex) {
                            this.__resetPlaylist();
                        }
                    }, this);

                    // Preset last index if we don't set it before, or playlist was changed
                    if (lastIndex !== this.__dyn.get("lastplaylistindex")) {
                        this.__dyn.set("lastplaylistindex", lastIndex);
                    }
                },

                startLoader: function() {
                    this.set('loading', true);
                    this._containerCheckTimer = this.auto_destroy(new Timer({
                        delay: 100,
                        fire: function() {
                            if (this.get("hideloadingafter") <= 0 || (this.get("loading") && this.get("loaded").length > 3)) {
                                this.set('loading', false);
                                console.log("TIMESS 111");
                                this.__setNextVideoIndex();
                                this._containerCheckTimer.stop();
                            } else {
                                if (!this.__calculationStarted) this.__calculateHeight();
                            }
                            this.set('hideloadingafter', this.get("hideloadingafter") - 100);
                        }.bind(this),
                        context: this,
                        start: true,
                        immediate: true,
                        destroy_on_stop: true
                        // fire_max: this.get("hideloadingafter") / 100
                    }));
                },

                __calculateHeight: function() {
                    // Don't calculate when ads active
                    if (this.get("adsplaying") || this.get("videos").destroyed()) return;
                    const _ = this;
                    // var element = this.activeElement().querySelect("li[data-index-selector='gallery-item-" + index + "']");
                    const elements = this.activeElement().querySelectorAll(`li.${this.get("cssgallerysidebar")}-list-item`);
                    if (elements && elements.length > 0) {
                        this.__calculationStarted = true;
                        elements.forEach(function(el) {
                            const image = el.querySelector('img');
                            const currentIndex = el.dataset.index;
                            const elRelatedCollections = _.get("videos").get_by_secondary_index('index', parseInt(currentIndex), true);
                            if (elRelatedCollections && !elRelatedCollections.get("height") && image) {
                                image.onload = function() {
                                    if (!elRelatedCollections) return;
                                    elRelatedCollections.set("height", DOM.elementDimensions(el).height);

                                    console.log("CALLD 3333")
                                    _.__scrollTop();
                                    _.get("loaded").push(currentIndex);
                                }
                                image.onerror = function() {
                                    if (!elRelatedCollections || !el) return;
                                    _.get("blacklisted").push(currentIndex);
                                    elRelatedCollections.set("display", false);
                                    el.parentNode.removeChild(el);
                                    // We have to remove object to be sure getting correct first and last index
                                    _.get("videos").remove(elRelatedCollections);
                                    console.log("CALLD 44")
                                    _.__scrollTop();
                                }
                            }
                        });
                    }
                },

                __removeVideoFromList: function(index) {
                    if (!this.get("hidevideoafterplay") || !index) return;
                    const video = this.get("videos").get_by_secondary_index('index', index);
                    if (video) {
                        this.get("videos").remove(video);
                    }
                },

                /**
                 * Will check if index not blacklisted and watchable, if not will set next index
                 * @param index
                 * @private
                 */
                __checkIndexPlayability: function(index) {
                    index = index || this.get("nextindex");
                    const nextVideo = this.get("videos").get_by_secondary_index('index', index);
                    Async.eventually(function() {
                        console.log("WRIL", index, nextVideo, this.get("blacklisted").indexOf(index));
                        if (this.get("blacklisted").indexOf(index) > -1 || !nextVideo || (nextVideo && !nextVideo.get("display"))) {
                            console.log("TIMESS 222");
                            this.__setNextVideoIndex();
                        } else {
                            this.__dyn.set("next_video_from_playlist", index);
                        }
                    }, this, 200);
                },

                __resetPlaylist: function() {
                    this.get("videos").iterate(function(v, _i) {
                        if (v.get("display")) v.set("watched", false);
                        if (v.last()) {
                            let nextIndex = this.get("videos").queryOne({
                                display: true
                            }).get("index");
                            this.__dyn.set("nextindex", nextIndex);
                            console.log("CALLD 555")
                            this.__scrollTop();
                        }
                    }, this);
                },

                /**
                 * @param companionads
                 * @private
                 */
                __generateCompanionAdContent: function(companionads) {
                    companionads = companionads || this.get("companionads");
                    if (companionads && companionads.length > 0) {
                        const isMobile = this.get("mobileviewport");
                        if (
                            (this.get("floatingoptions.desktop.companionad") && !isMobile) ||
                            (this.get("floatingoptions.mobile.companionad") && isMobile) ||
                            (this.get("gallerysidebar") && this.get("sidebaroptions.showcompanionad") && !isMobile)
                        ) {
                            const dimensions = DOM.elementDimensions(this.activeElement());
                            let ar, closestIndex, closestAr;
                            ar = dimensions.width / dimensions.height;
                            Objs.iter(companionads, function(companion, index) {
                                const _data = companion.data;
                                const _ar = _data.width / _data.height;
                                const _currentDiff = Math.abs(_ar - ar);
                                if (index === 0 || closestAr > _currentDiff) {
                                    closestAr = _currentDiff;
                                    closestIndex = index;
                                }
                                if (companionads.length === index + 1) {
                                    const companionAd = companionads[closestIndex];
                                    this.set("companionadcontent", companionAd.getContent());
                                    const container = this.activeElement().querySelector("." + this.get("cssfloatingsidebar") + '-companion-container');
                                    if (container) this.__drawCompanionAdToContainer(container, companionAd, dimensions, ar, _ar);
                                }
                            }, this);
                        }
                    }
                },

                __drawCompanionAdToContainer: function(container, companionAd, dimensions, ar, _ar) {
                    container.innerHTML = this.get("companionadcontent");
                    var image = container.querySelector('img');
                    if (image && _ar && dimensions) {
                        _ar = companionAd.data.width / companionAd.data.height;
                        if (_ar < ar) {
                            image.height = dimensions.height;
                            image.width = dimensions.height * (_ar <= 1 ? _ar : companionAd.data.width / companionAd.data.height);
                        } else {
                            image.width = dimensions.width;
                            image.height = dimensions.width * (companionAd.data.height / companionAd.data.width);
                        }
                    }
                },

                __decodeHTML: function(text) {
                    const textArea = document.createElement('textarea');
                    textArea.innerHTML = text;
                    return textArea.value;
                },

                __scrollTop: function() {
                    if (!this.activeElement()) return;
                    let topHeight = 0;
                    const container = this.activeElement().querySelector(`.${this.get("cssgallerysidebar")}-list-container`);
                    this.get("videos").iterate(function(video) {
                        const height = video.get("height");
                        const videoIndex = video.get("index");
                        if (this.get("nextindex") === videoIndex) {
                            if (container && container.scrollTo) {
                                container.scrollTo({
                                    top: topHeight,
                                    left: 0,
                                    behavior: "smooth",
                                });
                            } else {
                                // TODO: in the future could be better replace Async.eventually calling in the adsplaying change event to MutationObserver
                            }
                        }
                        topHeight += height;
                    }, this);
                }
            };
        }])
        .register("ba-videoplayer-sidebar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/sidebar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "up-next": "Up Next",
            "continue-on-ads-end": "Content will resume after this video..."
        });
});