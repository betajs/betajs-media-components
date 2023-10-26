Scoped.define("module:VideoPlayer.Dynamics.Sidebar", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Types",
    "browser:Dom",
    "module:Assets",
    "module:StylesMixin",
    "browser:DomMutation.MutationObserverNodeInsertObserver"
], [
    "module:Ads.Dynamics.ChoicesLink",
    "module:Ads.Dynamics.LearnMoreButton",
    "module:Common.Dynamics.CircleProgress"
], function(Class, Objs, Async, Types, DOM, Assets, StylesMixin, DomMutationObserver, scoped) {
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
                    showprogress: false,
                    nextindex: 1
                },

                events: {
                    "change:shownext": function(nextVisible) {
                        if (nextVisible && this.get("videos").count() > 0) {
                            this.__scrollTop();
                        }
                    },

                    "change:adsplaying": function(adsPlaying) {
                        if (!adsPlaying && this.get("videos").count() > 0) {
                            this.auto_destroy(Async.eventually(function() {
                                this.calculateHeight();
                            }, this, 200));
                        }
                    },

                    "changes:playlist": function(playlist) {
                        Objs.iter(playlist, function(pl, index) {
                            if (this.get('videos').get_by_secondary_index('index', index)) return;
                            if (Types.is_object(pl)) {
                                this.get("videos").add({
                                    index: pl.token || index,
                                    title: pl.title,
                                    poster: pl.poster,
                                    token: pl.token || null,
                                    height: 0,
                                    display: true,
                                    watched: false
                                });
                            }
                            this.calculateHeight();
                        }, this);
                    }
                },

                collections: {
                    videos: {}
                },

                create: function() {
                    this.__dyn = this.parent();
                    this.set("headerlogourl", this.get("sidebaroptions.headerlogourl") || null);
                    this.set("headerlogoimgurl", this.get("sidebaroptions.headerlogoimgurl") || null);
                    this.set("headerlogoname", this.get("sidebaroptions.headerlogoname") || "Brand's logo");
                    this.set("gallerytitletext", this.get("sidebaroptions.gallerytitletext") || this.string("up-next"));
                    this.set("afteradsendtext", this.get("sidebaroptions.afteradsendtext") || this.string("continue-on-ads-end"));
                    if (this.get("playlist").length > 0) {
                        Objs.iter(this.get("playlist"), function(pl, index) {
                            if (Types.is_object(pl)) {
                                this.get("videos").add({
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
                        this.get("videos").add_secondary_index("index");
                    }
                    this.__dyn.on("resize", function() {
                        this.__scrollTop();
                    }, this);

                    this.__dyn.channel("next").on("playNext", function() {
                        this.setNextVideoIndex();
                    }, this);
                },

                _afterActivate: function() {
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
                    if (this.get("videos").count() > 0) {
                        this.calculateHeight();
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
                    this.get("videos").iterate(function(v, i) {
                        if (index && v.get("index") === index) {
                            this.__dyn.set("next_video_from_playlist", index);
                            this.__dyn.channel("next").trigger("manualPlayNext");
                            this.__dyn.channel("next").trigger("playNext");
                            v.set("watched", true);
                            this.__scrollTop();
                        }
                    }, this);
                },

                setNextVideoIndex: function() {
                    let nextIndex;
                    const index = this.__dyn.get("next_video_from_playlist");
                    const lastIndex = this.get("videos").last().get("index");
                    this.get("videos").iterate(function(v, i) {
                        if (v.get("index") > index && !nextIndex && v.get("display") && !v.get("watched")) {
                            nextIndex = v.get("index");
                            this.set("nextindex", nextIndex);
                            this.__scrollTop();
                        }
                        if (lastIndex === i && !nextIndex) {
                            this.get("videos").iterate(function(v, _i) {
                                if (v.get("display")) {
                                    v.set("watched", false);
                                }
                                if (_i === lastIndex) {
                                    nextIndex = this.get("videos").queryOne({
                                        display: true
                                    }).get("index")
                                    this.__dyn.set("nextindex", index);
                                    this.__scrollTop();
                                }
                            }, this)
                        }
                    }, this)
                },

                calculateHeight: function() {
                    // Don't calculate when ads active
                    if (this.get("adsplaying")) return;
                    const _ = this;
                    // var element = this.activeElement().querySelect("li[data-index-selector='gallery-item-" + index + "']");
                    const elements = this.activeElement().querySelectorAll(`li.${this.get("cssgallerysidebar")}-list-item`);
                    if (elements && elements.length > 0) {
                        elements.forEach(function(el) {
                            const image = el.querySelector('img');
                            const currentIndex = el.dataset.index;
                            const elRelatedCollections = _.get("videos").get_by_secondary_index('index', parseInt(currentIndex), true);
                            if (elRelatedCollections && !elRelatedCollections.get("height") && image) {
                                image.onload = function() {
                                    elRelatedCollections.set("height", DOM.elementDimensions(el).height);
                                    _.__scrollTop();
                                }
                                image.onerror = function() {
                                    el.style.display = 'none';
                                    elRelatedCollections.set("display", false);
                                    _.__scrollTop();
                                }
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
                        var isMobile = this.get("mobileviewport");
                        if (
                            (this.get("floatingoptions.desktop.companionad") && !isMobile) ||
                            (this.get("floatingoptions.mobile.companionad") && isMobile) ||
                            (this.get("gallerysidebar") && this.get("sidebaroptions.showcompanionad") && !isMobile)
                        ) {
                            var dimensions = DOM.elementDimensions(this.activeElement());
                            var ar, closestIndex, closestAr;
                            ar = dimensions.width / dimensions.height;
                            Objs.iter(companionads, function(companion, index) {
                                var _data = companion.data;
                                var _ar = _data.width / _data.height;
                                var _currentDiff = Math.abs(_ar - ar);
                                if (index === 0 || closestAr > _currentDiff) {
                                    closestAr = _currentDiff;
                                    closestIndex = index;
                                }
                                if (companionads.length === index + 1) {
                                    var companionAd = companionads[closestIndex];
                                    this.set("companionadcontent", companionAd.getContent());
                                    var container = this.activeElement().querySelector("." + this.get("cssfloatingsidebar") + '-companion-container');
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
                    var textArea = document.createElement('textarea');
                    textArea.innerHTML = text;
                    return textArea.value;
                },

                __scrollTop: function() {
                    if (!this.activeElement()) return;
                    let topHeight = 0;
                    const container = this.activeElement().querySelector(`.${this.get("cssgallerysidebar")}-list-container`);
                    this.get("videos").iterate(function(video, index) {
                        const videoIndex = video.get("index");
                        const height = video.get("height");
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
