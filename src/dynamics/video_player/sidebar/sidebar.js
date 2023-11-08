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
                    hideloaderafter: 1700,
                    states: {},
                    shownextloader: false
                },

                events: {
                    "change:nextindex": function(nextindex) {
                        this.__hasNotPlayedNextVideoIndex = false;
                        this.checkIndexPlayability(nextindex);
                    },
                    "change:adsplaying": function(adsPlaying) {
                        if (!adsPlaying && this.get("videos").count() > 0) {
                            this.scrollTop();
                        }
                    },
                    "change:fullscreened": function(fullscreened) {
                        if (!fullscreened && !this.get("adsplaying")) this.scrollTop();
                    },
                    "change:is_floating": function(floating) {
                        if (!floating) this.scrollTop();
                    }
                },

                computed: {
                    "shownextloader:nextactive": function(nextactive) {
                        if (nextactive) this.scrollTop();
                        return !!nextactive;
                    },
                    "showplaylist:playlist": function(playlist) {
                        if (!playlist) return false;
                        const showSidebar = playlist.length > 0;
                        if (!showSidebar) return false;
                        const videos = this.get("videos");
                        const count = videos.count();
                        this.__loaderStarted = false;

                        // These listeners will be applied only once on creation,
                        // and don't move to the create or afterActivate methods
                        if (count === 0) {
                            videos.on("add", function(item) {
                                this.__checkVideoPoster(item);
                                if (playlist.length === this.get("videos").count())
                                    this.proceedWithLoader();
                            }, this);
                        }

                        Objs.iter(playlist, function(pl, index) {
                            if (count > 0 && videos.get_by_secondary_index('index', index)) return;
                            if (Types.is_object(pl)) {
                                videos.add({
                                    index: index,
                                    title: pl.title,
                                    poster: pl.poster,
                                    source: pl.source,
                                    token: pl.token || null,
                                    height: null,
                                    display: false,
                                    watched: false
                                });
                            }
                        }, this);

                        return true;
                    }
                },

                collections: {
                    videos: {}
                },

                create: function() {
                    this.__dyn = this.parent();
                    this.__hasNotPlayedNextVideoIndex = false;
                    this.get("videos").add_secondary_index("index");
                    this.set("states.shownext", this.get("shownext"));
                    this.set("states.gallerysidebar", this.get("gallerysidebar"));
                    this.set("headerlogourl", this.get("sidebaroptions.headerlogourl") || null);
                    this.set("headerlogoimgurl", this.get("sidebaroptions.headerlogoimgurl") || null);
                    this.set("headerlogoname", this.get("sidebaroptions.headerlogoname") || "Brand's logo");
                    this.set("gallerytitletext", this.get("sidebaroptions.gallerytitletext") || this.string("up-next"));
                    this.set("afteradsendtext", this.get("sidebaroptions.afteradsendtext") || this.string("continue-on-ads-end"));
                    this.set("hidevideoafterplay", this.get("sidebaroptions.hidevideoafterplay") || false);

                    if (this.get("gallerysidebar") && !this.get("adsplaying")) {
                        this.initSidebarGallery();
                    }
                },

                /**
                 * Will initialize sidebar gallery related listeners
                 */
                initSidebarGallery: function() {
                    const checkErrors = ["attach", "source", "video"];
                    Objs.iter(checkErrors, function(error) {
                        this.auto_destroy(this.__dyn.on(`error:${error}`, function(err) {
                            console.warn(`Error on ${error}`, err);
                            this.setNextVideoIndex(true);
                        }, this));
                    }, this);

                    // When next video actually starts to play
                    // Will trigger on both playNext and manualPlayNext
                    this.__dyn.on("playlist-next", function(pl) {
                        this.set("shownextloader", false);
                        const video = this.get("videos").queryOne({
                            source: pl.source
                        });
                        if (video) video.set("watched", true);
                        this.setNextVideoIndex();
                    }, this);

                    // Will conflict with local next video change
                    // this.__dyn.on("change:next_video_from_playlist", function(index) {}, this);

                    // On screen size changes, we need to go to the top of the list
                    this.__dyn.on("resize", function() {
                        if (this.get('adsplaying')) return;
                        this.scrollTop();
                    }, this);
                    // When video will be set as watched collection will be updated
                    this.get("videos").on("update", () => this.scrollTop(), this);
                    // When there will be error on poster image, we need to remove it from the collection list
                    this.get("videos").on("removed", (item) => this.scrollTop(), this);
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

                /**
                 * Will trigger when learn more and ad choices clicked
                 */
                pauseAds: function() {
                    if (this.get("adsplaying")) {
                        this.trigger("pause_ads");
                    }
                },

                /**
                 * Called when user clicks on poster image play button
                 * @param index
                 */
                playNextVideo: function(index) {
                    this.get("videos").iterate(function(v) {
                        if (index && v.get("index") === index) {
                            this.set("previousindex", this.__dyn.get("next_video_from_playlist"));
                            this.__dyn.set("next_video_from_playlist", index);
                            this.__dyn.trigger("play_next", index);
                            // Just for tracking
                            this.__dyn.channel("next").trigger("manualPlayNext");
                            v.set("watched", true);
                            this.removeVideoFromList(this.get("previousindex"));
                            this.scrollTop();
                        }
                    }, this);
                },

                /**
                 * Will define and set next Video
                 */
                setNextVideoIndex: function(triggerNext) {
                    triggerNext = triggerNext || false;
                    let nextVideo, videoFromTop, indexFromTop, nextIndex = null;
                    const currentVideo = this.get("videos").queryOne({
                        source: this.__dyn.get("source"),
                    });
                    const currentIndex = currentVideo ? currentVideo.get("index") : null;
                    if (currentIndex === this.get("currentindex") && currentVideo && currentVideo.get("display") && !currentVideo.get("watched")) {
                        this.__hasNotPlayedNextVideoIndex = true;
                    }
                    if (this.__hasNotPlayedNextVideoIndex) return;
                    const iterator = this.get("videos").iterator();
                    while (iterator.hasNext()) {
                        const v = iterator.next();
                        const _videoIndex = v.get("index");
                        // if nextIndex not defined, and we have not watched video, we can set it as nextIndex
                        if (this.get("blacklisted").indexOf(_videoIndex) === -1 && v.get("display") && !v.get("watched")) {
                            if (_videoIndex > currentIndex && !nextIndex) {
                                nextVideo = v;
                                nextIndex = v.get("index");
                            }
                            if (!indexFromTop && _videoIndex < currentIndex) {
                                videoFromTop = v;
                                indexFromTop = v.get("index");
                            }
                        }
                        if (!iterator.hasNext()) {
                            nextIndex = nextIndex || indexFromTop;
                            nextVideo = nextVideo || videoFromTop;
                            // Preset last index if we don't set it before, or playlist was changed
                            if (!nextIndex) {
                                this.resetPlaylist();
                            } else {
                                this.set("nextindex", nextIndex);
                                this.scrollTop();
                                if (triggerNext) {
                                    if (this.__dyn.__listeningOnPlayNext) {
                                        this.__dyn.trigger("play_next");
                                    } else {
                                        // TODO: need to be improved, this part runs only if first video from the playlist has error
                                        this.__dyn.setAll({
                                            poster: nextVideo.get("poster"),
                                            source: nextVideo.get("source"),
                                        });
                                        this.__dyn.trigger("message:click");
                                    }
                                }
                            }
                        }
                    }
                },

                /**
                 * On first load, we need to show loader for some time
                 */
                proceedWithLoader: function() {
                    this.set('loading', true);
                    this.__loaderStarted = true;
                    this.__drawInProcess = false;
                    this._containerCheckTimer = this.auto_destroy(new Timer({
                        delay: 200,
                        fire: function() {
                            if (this.get("adsplaying")) return;
                            // If time pass and there is no video loaded, we need to stop timer
                            // If some videos loaded, we need to stop timer
                            if ((this.get("hideloaderafter") <= 0 && this.get("loaded").length > 0) || (this.get("loading") && this.get("loaded").length > 5)) {
                                this.set('loading', false);
                                this.setNextVideoIndex();
                                this.__drawListedVideos();
                                this._containerCheckTimer.stop();
                            }
                            this.set('hideloaderafter', this.get("hideloaderafter") - 100);
                        }.bind(this),
                        context: this,
                        start: true,
                        immediate: true,
                        destroy_on_stop: true
                        // fire_max: this.get("hideloaderafter") / 100
                    }));
                },

                /**
                 * Remove video collection from the list
                 * @param index
                 */
                removeVideoFromList: function(index) {
                    if (!this.get("hidevideoafterplay") || !index) return;
                    const video = this.get("videos").get_by_secondary_index('index', index);
                    if (video) {
                        video.set("display", false);
                        // this.get("videos").remove(video);
                    }
                },

                /**
                 * Will check if index not blacklisted and watchable, if not will set next index
                 * @param index
                 * @private
                 */
                checkIndexPlayability: function(index) {
                    index = index || this.get("nextindex");
                    const nextVideo = this.get("videos").get_by_secondary_index('index', index);
                    Async.eventually(function() {
                        if (this.get("blacklisted").indexOf(index) !== -1 || !nextVideo) {
                            this.setNextVideoIndex();
                        } else {
                            this.__dyn.set("next_video_from_playlist", index);
                        }
                    }, this, 200);
                },

                /**
                 * Rest playlist to start from the top
                 * @private
                 */
                resetPlaylist: function() {
                    const iterator = this.get("videos").iterator();
                    let firstPlayableIndex = null;
                    while (iterator.hasNext()) {
                        const v = iterator.next();
                        if (v.get("display")) {
                            v.set("watched", false);
                            if (!firstPlayableIndex) firstPlayableIndex = v.get("index");
                        }
                        if (!iterator.hasNext()) {
                            this.set("nextindex", firstPlayableIndex || 0);
                            this.scrollTop();
                        }
                    }
                },

                scrollTop: function() {
                    if (!this.activeElement() || !this.get("videos")) return;
                    let topHeight = 0;
                    const container = this.activeElement().querySelector(`.${this.get("cssgallerysidebar")}-list-container`);
                    this.get("videos").iterate(function(video, _i) {
                        const height = video.get("height");
                        const videoIndex = video.get("index");
                        if (!video.get("display")) return;
                        if (!height || height === 0) {
                            this.__recalculateHeight(video);
                            return;
                        }
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
                },

                /**
                 * Check if poster image is valid, source provided and set display to true
                 * @param video
                 * @private
                 */
                __checkVideoPoster: function(video) {
                    const _ = this;
                    const index = video.get("index");
                    const poster = video.get("poster");
                    const source = video.get("source");
                    // Will not set to display if poster is not defined
                    if (!poster || !source) return;
                    const image = new Image();
                    image.onload = function() {
                        video.set("display", true);
                        _.get("loaded").push(index);
                    }
                    image.onerror = function() {
                        _.get("blacklisted").push(index);
                    }
                    image.src = poster;
                },

                __recalculateHeight: function(video) {
                    const index = video.get("index");
                    const itemElement = this.activeElement().querySelector(`li[data-index-selector="gallery-item-${index}"]`);
                    if (itemElement) {
                        const height = DOM.elementDimensions(itemElement).height;
                        if (height > 0) {
                            video.setAll({
                                height: height,
                                display: true
                            });
                        }
                    }
                },

                /**
                 * Draw and get each item height
                 * @private
                 */
                __drawListedVideos: function() {
                    const _ = this;
                    // Don't draw when ads active
                    if (this.get("adsplaying") || this.get("videos").destroyed() || this.__drawInProcess) return;
                    const elements = this.activeElement().querySelectorAll(`li.${this.get("cssgallerysidebar")}-list-item`);
                    if (elements && elements.length > 0) {
                        this.__drawInProcess = true;
                        elements.forEach(function(el) {
                            const currentIndex = el.dataset.index;
                            const elRelatedCollections = _.get("videos").get_by_secondary_index('index', parseInt(currentIndex), true);
                            if (!_.get("blacklisted").includes(currentIndex)) {
                                elRelatedCollections.setAll({
                                    height: DOM.elementDimensions(el).height
                                });
                                _.scrollTop();
                            }
                        });
                    }
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

                /**
                 * Will draw companion ads
                 * @param container
                 * @param companionAd
                 * @param dimensions
                 * @param ar
                 * @param _ar
                 * @private
                 */
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
