Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Assets",
    "module:StickyHandler",
    "module:StylesMixin",
    "module:TrackTags",
    "browser:Info",
    "browser:Dom",
    "media:Player.VideoPlayerWrapper",
    "media:Player.Broadcasting",
    "media:Player.Support",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Collections.Collection",
    "base:Time",
    "base:Timers",
    "base:TimeFormat",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Async",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates",
    "module:Ads.AbstractVideoAdProvider",
    "module:Ads.IMARequester",
    "browser:Events"
], [
    "module:Common.Dynamics.Settingsmenu",
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Share",
    "module:VideoPlayer.Dynamics.Controlbar",
    "module:VideoPlayer.Dynamics.Topmessage",
    "module:VideoPlayer.Dynamics.Tracks",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial",
    "module:VideoPlayer.Dynamics.PlayerStates.TextTrackUploading",
    "module:VideoPlayer.Dynamics.PlayerStates.FatalError",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadPlayerDirectly",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadError",
    "module:VideoPlayer.Dynamics.PlayerStates.PosterReady",
    "module:VideoPlayer.Dynamics.PlayerStates.Preroll",
    "module:VideoPlayer.Dynamics.PlayerStates.PosterError",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.PlayVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.NextVideo"
], function(Class, Assets, StickyHandler, StylesMixin, TrackTags, Info, Dom, VideoPlayerWrapper, Broadcasting, PlayerSupport, Types, Objs, Strings, Collection, Time, Timers, TimeFormat, Host, ClassRegistry, Async, InitialState, PlayerStates, AdProvider, IMARequester, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: function() {
                    return {
                        /* CSS */
                        brightness: 0,
                        sample_brightness: false,
                        sample_brightness_rate: 10, // times per second
                        sample_brightness_sample_size: 250,
                        "css": "ba-videoplayer",
                        "csscommon": "ba-commoncss",
                        "cssplayer": "ba-player",
                        "iecss": "ba-videoplayer",
                        "cssplaybutton": "",
                        "cssloader": "",
                        "cssmessage": "",
                        "csstopmessage": "",
                        "csscontrolbar": "",
                        "csstracks": "",
                        "width": "",
                        "height": "",
                        "popup-width": "",
                        "popup-height": "",
                        "aspectratio": null,
                        "fallback-width": 480,
                        "fallback-height": 270,
                        /* Themes */
                        "theme": "",
                        "csstheme": "",
                        "themecolor": "",
                        /* Dynamics */
                        "dynplaybutton": "videoplayer-playbutton",
                        "dynloader": "videoplayer-loader",
                        "dynmessage": "videoplayer-message",
                        "dyntopmessage": "videoplayer-topmessage",
                        "dyncontrolbar": "videoplayer-controlbar",
                        "dynshare": "videoplayer-share",
                        "dyntracks": "videoplayer-tracks",
                        "dynsettingsmenu": "common-settingsmenu",
                        "dyntrimmer": "videorecorder-trimmer",

                        /* Templates */
                        "tmplplaybutton": "",
                        "tmplloader": "",
                        "tmplmessage": "",
                        "tmplshare": "",
                        "tmpltopmessage": "",
                        "tmplcontrolbar": "",
                        "tmpltracks": "",
                        "tmplsettingsmenu": "",

                        /* Attributes */
                        "poster": "",
                        "source": "",
                        "sources": [],
                        "sourcefilter": {},
                        "streams": [],
                        "currentstream": null,
                        "hasnext": false,
                        "playlist": null,
                        "volume": 1.0,
                        "title": "",
                        "description": "",
                        "uploaddate": "",
                        "contenturl": "",
                        "thumbnailurl": "",
                        "initialseek": null,
                        "sharevideo": [],
                        "sharevideourl": "",
                        "share_active": true,
                        "visibilityfraction": 0.8,
                        /* Configuration */
                        "reloadonplay": false,
                        "playonclick": true,
                        "pauseonclick": true,

                        /* Ads */
                        "adprovider": null,
                        "preroll": false,
                        "linear": null,
                        "non-linear": null,
                        "companion-ad": null,
                        "linearadplayer": true,
                        "customnonlinear": false, // Currently, not fully supported
                        "minadintervals": 5,
                        "non-linear-min-duration": 10,
                        "mid-linear-ad": [],
                        "non-linear-ad": [],

                        /* Options */
                        "allowpip": true, // Picture-In-Picture Mode
                        "rerecordable": false,
                        "submittable": false,
                        "autoplay": false,
                        "preload": false,
                        "loop": false,
                        "loopall": false,
                        "popup": false,
                        "nofullscreen": false,
                        "fullscreenmandatory": false,
                        "playfullscreenonmobile": false,
                        "fitonwidth": false,
                        "fitonheight": false,
                        "hideoninactivity": true,
                        "hidebarafter": 5000,
                        "preventinteraction": false,
                        "skipinitial": false,
                        "topmessage": "",
                        "totalduration": null,
                        "playwhenvisible": false,
                        "disablepause": false,
                        "disableseeking": false,
                        "tracktextvisible": false,
                        "airplay": false,
                        "chromecast": false,
                        "broadcasting": false,
                        "chromecastreceiverappid": null, // Could be published custom App ID https://cast.google.com/publish/#/overview
                        "skipseconds": 5,
                        "sticky": false,
                        "sticky-position": "bottom-right",
                        "tracktags": [],
                        "tracktagsstyled": true,
                        "tracktaglang": 'en',
                        "tracksshowselection": false,
                        "showchaptertext": true,
                        "thumbimage": {},
                        "thumbcuelist": [],
                        "showduration": false,
                        "showsettingsmenu": true, // As a property show/hide from users
                        "posteralt": "",
                        "hidevolumebar": false,
                        "hidecontrolbar": false,
                        "allowtexttrackupload": false,
                        "useAspectRatioFallback": (Info.isSafari() && Info.safariVersion() < 15) || Info.isInternetExplorer(),
                        "uploadtexttracksvisible": false,
                        "acceptedtracktexts": null,
                        "uploadlocales": [{
                            lang: 'en',
                            label: 'English'
                        }],
                        "ttuploadervisible": false,
                        "videofitstrategy": "pad",
                        "posterfitstrategy": "crop",
                        "slim": false,

                        /* States (helper variables which are controlled by application itself not set by user) */
                        "showbuiltincontroller": false,
                        "airplaybuttonvisible": false,
                        "castbuttonvisble": false,
                        "fullscreened": false,
                        "initialoptions": {
                            "hideoninactivity": null,
                            "volumelevel": null,
                            "playlist": [],
                            "autoplay": null
                        },
                        "silent_attach": false,
                        "inpipmode": false,
                        "lastplaylistitem": false,
                        "manuallypaused": false,
                        "playedonce": false,
                        "preventinteractionstatus": false, // need to prevent `Unexpected token: punc (()` Uglification issue
                        "ready": true,
                        "tracktagssupport": false,
                        "playbackcount": 0,
                        "playbackended": 0,
                        "currentchapterindex": 0,
                        "chapterslist": [],
                        // If settings are open and visible
                        "states": {
                            "poster_error": {
                                "ignore": false,
                                "click_play": true
                            },
                            "dimensions": {
                                "width": null,
                                "height": null
                            }
                        },
                        "placeholderstyle": "",
                        "hasplaceholderstyle": false,
                        "playerorientation": undefined,
                        // Reference to Chrome renewed policy, we have to setup mute for auto-playing players.
                        // If we do it forcibly, then we will set as true
                        "forciblymuted": false,
                        "autoplay-allowed": false,
                        "autoplay-requires-muted": true,
                        "autoplay-requires-playsinline": null,
                        // When volume was unmuted, by the user himself, not automatically
                        "volumeafterinteraction": false,
                        "prominent-title": false,
                        "closeable-title": false
                    };
                },

                types: {
                    "allowpip": "boolean",
                    "hasnext": "boolean",
                    "hidecontrolbar": "boolean",
                    "rerecordable": "boolean",
                    "loop": "boolean",
                    "loopall": "boolean",
                    "autoplay": "boolean",
                    "preload": "boolean",
                    "ready": "boolean",
                    "nofullscreen": "boolean",
                    "fullscreenmandatory": "boolean",
                    "preroll": "boolean",
                    "hideoninactivity": "boolean",
                    "hidebarafter": "integer",
                    "preventinteraction": "boolean",
                    "skipinitial": "boolean",
                    "volume": "float",
                    "popup": "boolean",
                    "popup-width": "int",
                    "popup-height": "int",
                    "aspectratio": "float",
                    "fallback-width": "int",
                    "fallback-height": "int",
                    "initialseek": "float",
                    "fullscreened": "boolean",
                    "sharevideo": "array",
                    "sharevideourl": "string",
                    "playfullscreenonmobile": "boolean",
                    "themecolor": "string",
                    "totalduration": "float",
                    "playwhenvisible": "boolean",
                    "playedonce": "boolean",
                    "manuallypaused": "boolean",
                    "disablepause": "boolean",
                    "disableseeking": "boolean",
                    "playonclick": "boolean",
                    "pauseonclick": "boolean",
                    "airplay": "boolean",
                    "airplaybuttonvisible": "boolean",
                    "chromecast": "boolean",
                    "chromecastreceiverappid": "string",
                    "skipseconds": "integer",
                    "sticky": "boolean",
                    "streams": "jsonarray",
                    "sources": "jsonarray",
                    "tracktags": "jsonarray",
                    "tracktagsstyled": "boolean",
                    "allowtexttrackupload": "boolean",
                    "uploadtexttracksvisible": "boolean",
                    "acceptedtracktexts": "string",
                    "uploadlocales": "array",
                    "playerspeeds": "array",
                    "playercurrentspeed": "float",
                    "showsettings": "boolean",
                    "showduration": "boolean",
                    "visibilityfraction": "float",
                    "showchaptertext": "boolean",
                    "title": "string",
                    "description": "string",
                    "uploaddate": "string",
                    "contenturl": "string",
                    "thumbnailurl": "string",
                    "videofitstrategy": "string",
                    "posterfitstrategy": "string",
                    "linear": "string",
                    "non-linear": "string",
                    "minadintervals": "int",
                    "non-linear-min-duration": "int",
                    "companion-ad": "string",
                    "slim": "boolean",
                    "prominent-title": "boolean",
                    "closeable-title": "boolean"
                },

                extendables: ["states"],

                scopes: {
                    settingsmenu: ">[tagname='ba-common-settingsmenu']"
                },

                events: {
                    "change:uploaddate": function(value) {
                        if (typeof value === "number")
                            this.set("uploaddate", TimeFormat.format("yyyy-mm-dd", value * 1000));
                    },
                    "change:starttime": function(startTime) {
                        if (startTime > this.getCurrentPosition()) {
                            this.player.setPosition(startTime);
                        }
                    },
                    "change:endtime": function(endTime) {
                        if (!endTime || endTime === this.get("duration")) {
                            if (this.get("_timeUpdateEventHandler")) {
                                this.get("_timeUpdateEventHandler").clear();
                            }
                        } else {
                            if (endTime < this.getCurrentPosition()) {
                                this.player.setPosition(endTime);
                            }
                            if (!this.get("_timeUpdateEventHandler")) {
                                this.set("_timeUpdateEventHandler", this.auto_destroy(new DomEvents()));
                            }
                            if (!this.get("_timeUpdateEventHandler").__callbacks.timeupdate) {
                                this.get("_timeUpdateEventHandler").on(this.player._element, "timeupdate", function() {
                                    var position = this.getCurrentPosition();
                                    if (position >= this.get("endtime")) {
                                        this.player.trigger("ended");
                                        if (!this.get("loop")) {
                                            this.player.pause();
                                        }
                                    }
                                }, this);
                            }
                        }
                    },
                    "change:placeholderstyle": function(value) {
                        this.set("hasplaceholderstyle", value.length > 10);
                    }
                },

                computed: {
                    "aspectRatioFallback:aspectratio,fallback-width,fallback-height": function(aspectRatio, fallbackWidth, fallbackHeight) {
                        return {
                            paddingTop: 100 / (aspectRatio || (fallbackWidth / fallbackHeight)) + "%"
                        };
                    },
                    "aspect_ratio:aspectratio,fallback-width,fallback-height": function(aspectRatio, fallbackWidth, fallbackHeight) {
                        return aspectRatio || fallbackWidth + "/" + fallbackHeight;
                    },
                    "containerSizingStyles:aspect_ratio,height,width": function(aspectRatio, height, width) {
                        var styles = {
                            aspectRatio: aspectRatio
                        };
                        if (height) styles.height = typeof height === "string" && height[height.length - 1] === "%" ? height : height + "px";
                        if (width) styles.width = typeof width === "string" && width[width.length - 1] === "%" ? width : width + "px";
                        if (this.activeElement()) {
                            this._applyStyles(this.activeElement(), styles, this.__lastContainerSizingStyles);
                        }
                        this.__lastContainerSizingStyles = styles;
                        return styles;
                    },
                    "buffering:buffered,position,last_position_change_delta,playing": function(buffered, position, ld, playing) {
                        if (playing) this.__playedStats(position, this.get("duration"));
                        return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    this.set("prominent_title", this.get("prominent-title"));
                    this.set("closeable_title", this.get("closeable-title"));
                    this._observer = new ResizeObserver(function(entries) {
                        for (var i = 0; i < entries.length; i++) {
                            this.trigger("resize", {
                                width: entries[i].contentRect.width,
                                height: entries[i].contentRect.height
                            });
                        }
                    }.bind(this));
                    this._observer.observe(this.activeElement().firstChild);
                    this._validateParameters();
                    // Will set volume initial state
                    this.set("initialoptions", Objs.tree_merge(this.get("initialoptions"), {
                        volumelevel: this.get("volume"),
                        autoplay: this.get("autoplay")
                    }));
                    if (this.get("sample_brightness")) {
                        this.__brightnessSampler = this.auto_destroy(new Timers.Timer({
                            delay: 1000 / (this.get("sample_brightness_rate") || 10),
                            fire: function() {
                                if (!this.player) return;
                                var lightLevel = this.player.lightLevel(this.get("sample_brightness_sample_size"), this.get("sample_brightness_sample_areas"));
                                if (Array.isArray(lightLevel)) lightLevel = lightLevel.map(function(level) {
                                    return level * 100 / 255;
                                });
                                else lightLevel = lightLevel * 100 / 255;
                                this.set("brightness", lightLevel);
                            }.bind(this),
                            start: false
                        }));
                    }
                    if (this.get("fullscreenmandatory")) {
                        if (!(document.fullscreenEnabled || document.mozFullscreenEnabled ||
                                document.webkitFullscreenEnabled || document.msFullscreenEnabled)) {
                            this.set("skipinitial", true);
                            this.set("showbuiltincontroller", true);
                        }
                    }

                    if (this.get("autoplay") || this.get("playwhenvisible")) {
                        // check in which option player allow autoplay
                        this.__testAutoplayOptions();
                        // Safari is behaving differently on the Desktop and Mobile
                        // preload in desktop allow autoplay. In mobile, it's preventing autoplay
                        if (Info.isSafari()) this.set("preload", !Info.isMobile());
                        // In Safari Desktop can cause trouble on preload, if user will
                    }

                    if (this.get("theme")) this.set("theme", this.get("theme").toLowerCase());
                    if (this.get("theme") in Assets.playerthemes) {
                        Objs.iter(Assets.playerthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }

                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

                    if (this.get("adprovider")) this.initAdProvider();
                    if (this.get("playlist") && this.get("playlist").length > 0) {
                        var pl0 = (this.get("playlist"))[0];
                        if (pl0 && Types.is_object(pl0)) {
                            this.set("poster", pl0.poster);
                            this.set("source", pl0.source);
                            this.set("sources", pl0.sources);
                        }
                    }
                    if (this.get("streams") && !this.get("currentstream"))
                        this.set("currentstream", (this.get("streams"))[0]);

                    // Set `hideoninactivity` initial options for further help actions
                    if (this.get("preventinteraction") && !this.get("hideoninactivity")) {
                        this.set("hideoninactivity", true);
                        this.set("initialoptions", Objs.tree_merge(this.get("initialoptions"), {
                            hideoninactivity: true
                        }));
                    } else {
                        // Set initial options for further help actions
                        this.set("initialoptions", Objs.tree_merge(this.get("initialoptions"), {
                            hideoninactivity: this.get("hideoninactivity")
                        }));
                    }

                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("firefox", Info.isFirefox());
                    this.set("mobileview", Info.isMobile());
                    this.set("hasnext", this.get("loop") || this.get("loopall") || this.get("playlist") && this.get("playlist").length > 1);
                    // For Apple it's very important that their users always remain in control of the volume of the sounds their devices emit
                    this.set("hidevolumebar", (Info.isMobile() && Info.isiOS()));
                    this.set("duration", this.get("totalduration") || 0.0);
                    this.set("position", 0.0);
                    this.set("buffered", 0.0);
                    this.set("passed-quarter", 0);
                    this.set("played-seconds", 0);
                    this.set("last-played-position", 0);
                    this.set("player-started", false);
                    this.set("last-seen-position", this.get("volume") > 0.2 ? 1 : 0);
                    this.set("message", "");
                    this.set("fullscreensupport", false);
                    this.set("csssize", "normal");

                    // this.set("loader_active", false);
                    // this.set("playbutton_active", false);
                    // this.set("controlbar_active", false);
                    // this.set("message_active", false);
                    // this.set("settingsmenu_active", false);

                    this.set("last_activity", Time.now());
                    this.set("activity_delta", 0);
                    this.set("passed_after_play", 0);

                    this.set("playing", false);

                    this.__attachRequested = false;
                    this.__activated = false;
                    this.__error = null;

                    if (document.onkeydown)
                        this.activeElement().onkeydown = this._keyDownActivity.bind(this, this.activeElement());

                    this.on("change:tracktags", function() {
                        if (typeof this.__video !== 'undefined')
                            this.__trackTags = new TrackTags({}, this);
                    }, this);

                    this.host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.playerStates())
                    });
                    this.host.dynamic = this;
                    this.host.initialize(this._initialState);

                    this.__adControlPosition = 0;
                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 100,
                        start: true
                    });

                    this.activeElement().style.setProperty("display", "inline-block");
                    this._applyStyles(this.activeElement(), this.get("containerSizingStyles"));

                    if (this.get("sticky")) {
                        var stickyOptions = {
                            paused: true,
                            position: this.get("sticky-position")
                        };
                        this.stickyHandler = this.auto_destroy(new StickyHandler(
                            this.activeElement().firstChild,
                            this.activeElement(),
                            stickyOptions
                        ));
                        this.stickyHandler.init();
                    }
                },

                initAdProvider: function() {
                    var adInitOptions, adContainer;
                    this._adProvider = this.get("adprovider");
                    adContainer = this.activeElement().querySelector("[data-video='ima-ad-container']");
                    if (Types.is_string(this._adProvider))
                        this._adProvider = AdProvider.registry[this._adProvider];

                    if (this._adProvider) {
                        if (!adContainer.hasChildNodes()) {
                            this.set("ad-provider-ready", false);
                            adInitOptions = {
                                videoElement: this.activeElement().querySelector("[data-video='video']"),
                                adElement: this.activeElement().querySelector("[data-video='ad']"),
                                adContainer: this.activeElement().querySelector("[data-video='ima-ad-container']"),
                                dynamic: this
                            };
                            if (this.get("preroll")) {
                                this._prerollAd = this._adProvider.newPrerollAd(adInitOptions);
                                this.set("ad-provider-ready", true);
                            }
                        }

                        if ((this.get("adprovider") === 'ima' || this.get("adprovider").__IMA_PRE_ROLL) && (this.get("linear") || this.get("non-linear"))) {
                            var schedules = [],
                                nonLinearSchedules = [];
                            // Split all via comma exclude inside brackets
                            if (this.get("linear")) {
                                schedules = Objs.map(this.get("linear").split(/(?![^)(]*\([^)(]*?\)\)),(?![^\[]*\])/), function(item) {
                                    return item.trim();
                                }, this);
                            }

                            if (this.get("non-linear")) {
                                // TODO: add non-linear schedule as well
                                nonLinearSchedules = Objs.map(this.get("non-linear").split(/(?![^)(]*\([^)(]*?\)\)),(?![^\[]*\])/), function(item) {
                                    var items = item.trim().split(/[\[\]]/);
                                    if (items[0]) {
                                        var position = items[0].split('%');
                                        position = position.length > 1 ? parseFloat((position[0] / 100).toFixed(2)) : +items[0];
                                        if (position > 0) {
                                            var output = {
                                                position: position,
                                                width: null,
                                                height: null
                                            };
                                            if (items[1]) {
                                                var dimensions = items[1].split(',');
                                                if (dimensions.length > 0) {
                                                    output.width = dimensions[0] ? dimensions[0] : null;
                                                    output.height = dimensions[1] ? dimensions[1] : null;
                                                }
                                                return output;
                                            } else {
                                                return output;
                                            }
                                        }
                                    }
                                }, this);
                                // If user just set this setting will aplly it in 50% of the player
                                if (nonLinearSchedules.length === 0) {
                                    nonLinearSchedules = [{
                                        position: 0.5,
                                        width: null,
                                        height: null
                                    }];
                                }
                            }
                            // On iOS and Android devices, video playback must begin in a user action.
                            // In mobile could be require wait user interaction before init container and loader
                            // Dom.userInteraction(function() {}, this);

                            if (schedules.length > 0 || nonLinearSchedules.length > 0) {
                                this.set("mid-linear-ad", []);
                                this.__adMinIntervals = this.get("minadintervals");
                                if (Types.is_undefined(this._adsLoader) && adInitOptions) {
                                    this._adProvider.initAdsLoader(adInitOptions)
                                        .success(function(loader) {
                                            this._adsLoader = loader;
                                            this._adOptions = adInitOptions;
                                            this.__prepareAdSchedule(schedules, nonLinearSchedules);
                                        }, this)
                                        .error(function(err) {
                                            console.error("Error could not be able init adsense container. Err: ", err);
                                        }, this)
                                        .callback(function() {
                                            // on IMS SDK related URLs are loaded
                                            this.set("ad-provider-ready", true);
                                        }, this);
                                } else {
                                    // This will be called in the next video cases
                                    this.__prepareAdSchedule(schedules, nonLinearSchedules);
                                    this.__adControlPosition = 0;
                                    if ((this.get("mid-linear-ad").length > 0 || this.get('non-linear-ad').length > 0) && this._adsCollection) {
                                        this._adsCollection.destroy();
                                        this._adsCollection = null;
                                    }
                                }
                            }
                        }
                    }
                },

                getMediaType: function() {
                    return "video";
                },

                _initialState: InitialState,

                state: function() {
                    return this.host.state();
                },

                videoAttached: function() {
                    return !!this.player;
                },

                videoLoaded: function() {
                    return this.videoAttached() && this.player.loaded();
                },

                videoError: function() {
                    return this.__error;
                },

                /**
                 *
                 * @param {object} settingObject
                 */
                addSettingsMenuItem: function(settingObject) {
                    this.__settingsMenu.execute('add_new_settings_item', settingObject);
                },

                /**
                 *
                 * @param {string} id
                 * @param {object} updatedSettingObject
                 */
                updateSettingsMenuItem: function(id, updatedSettingObject) {
                    this.__settingsMenu.execute('update_new_settings_item', id, updatedSettingObject);
                },

                /**
                 *
                 * @param {string} id
                 */
                removeSettingsMenuItem: function(id) {
                    this.__settingsMenu.execute('remove_settings_item', id);
                },

                toggle_pip: function() {
                    if (this.player.isInPIPMode())
                        this.player.exitPIPMode();
                    else
                        this.player.enterPIPMode();
                },

                _error: function(error_type, error_code) {
                    this.__error = {
                        error_type: error_type,
                        error_code: error_code
                    };
                    this.trigger("error:" + error_type, error_code);
                    this.trigger("error", error_type, error_code);
                },

                _clearError: function() {
                    this.__error = null;
                },

                _detachImage: function() {
                    this.set("imageelement_active", false);
                },

                _attachImage: function() {
                    var isLocal = typeof this.get("poster") === 'object';
                    if (!this.get("poster")) {
                        this.trigger("error:poster");
                        return;
                    }
                    var img = this.activeElement().querySelector("[data-image='image']");
                    this._clearError();
                    var self = this;
                    img.onerror = function() {
                        self.trigger("error:poster");
                    };
                    img.onload = function() {
                        self.set("imageelement_active", true);
                        self.trigger("image-attached");
                    };
                    // If type of source of image is Blob object, convert it to URL
                    img.src = isLocal ? (window.URL || window.webkitURL).createObjectURL(this.get("poster")) : this.get("poster");
                },

                _detachVideo: function() {
                    this.set("playing", false);
                    if (this.player)
                        this.player.weakDestroy();
                    // if the same instance
                    if (this._prerollAd && !this.get("hasnext")) {
                        if (typeof this._prerollAd._allAdsCompelted !== "undefined") {
                            if (this._prerollAd._allAdsCompelted) {
                                this._prerollAd.weakDestroy();
                                if (typeof this._adsRoll.__cid !== "undefined")
                                    this._adsRoll.weakDestroy();
                                this._adsRoll = null;
                                this._prerollAd = this._adsRoll;
                            }
                        } else {
                            this._prerollAd.weakDestroy();
                            this._adsRoll = null;
                        }
                    }

                    if (this._postrollAd && !this.get("hasnext")) {
                        this._postrollAd.weakDestroy();
                        this._postrollAd = null;
                    }
                    this.player = null;
                    this.__video = null;
                    this.set("videoelement_active", false);
                },

                _validateParameters: function() {
                    var fitStrategies = ["crop", "pad", "original"];
                    var stickyPositions = ["top-left", "top-right", "bottom-right", "bottom-left"];
                    if (!fitStrategies.includes(this.get("videofitstrategy"))) {
                        console.warn("Invalid value for videofitstrategy: " + this.get("videofitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }
                    if (!fitStrategies.includes(this.get("posterfitstrategy"))) {
                        console.warn("Invalid value for posterfitstrategy: " + this.get("posterfitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }

                    if (this.get("stretch") || this.get("stretchwidth") || this.get("stretchheight")) {
                        console.warn("Stretch parameters were deprecated, your player will stretch to the full container width by default.");
                    }
                    if (this.get("sticky") && !stickyPositions.includes(this.get("sticky-position"))) {
                        console.warn("Invalid option for attribute sticky-position: " + this.get("sticky-position"));
                        console.warn("Please choose one of the following values instead:", stickyPositions);
                        this.set("sticky-position", "bottom-right");
                    }

                    var deprecatedCSS = ["minheight", "minwidth", "minheight", "minwidth"];
                    deprecatedCSS.forEach(function(parameter) {
                        if (this.get(parameter)) console.warn(parameter + " parameter was deprecated, please use CSS instead.");
                    }.bind(this));
                },

                getCurrentPosition: function() {
                    if (this.videoAttached()) {
                        return this.player._element.currentTime;
                    } else {
                        return NaN;
                    }
                },

                _attachVideo: function(silent) {
                    if (this.videoAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.__attachRequested = false;
                    this.set("videoelement_active", true);
                    var video = this.activeElement().querySelector("[data-video='video']");
                    this._clearError();
                    // Just in case, be sure that player's controllers will be hidden
                    video.controls = this.get("showbuiltincontroller");
                    if (!this.get("allowpip"))
                        video.disablePictureInPicture = true;
                    VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: video,
                        onlyaudio: this.get("onlyaudio"), // Will fix only audio local playback bug
                        preload: !!this.get("preload"),
                        loop: !!this.get("loop") || (this.get("lastplaylistitem") && this.get("loopall")),
                        reloadonplay: this.get('playlist') && this.get("playlist").length > 0 ? true : !!this.get("reloadonplay"),
                        fullscreenedElement: this.activeElement().childNodes[0],
                        loadmetadata: Info.isChrome() && this.get("skipinitial")
                    })).error(function(e) {
                        if (this.destroyed())
                            return;
                        this._error("attach", e);
                    }, this).success(function(instance) {
                        if (this.destroyed())
                            return;
                        this.player = instance;
                        this.__video = video;
                        // On autoplay video, silent attach should be false
                        this.set("silent_attach", (silent && !this.get("autoplay")) || this._prerollAd || false);

                        if (this.get("chromecast")) {
                            if (!this.get("skipinitial")) this.set("skipinitial", true);
                            this._broadcasting = new Broadcasting({
                                player: instance,
                                commonOptions: {
                                    title: this.get("title"),
                                    poster: this.player._element.poster,
                                    currentPosition: this.get("position"),
                                    chromecastReceiverAppId: this.get("chromecastreceiverappid")
                                },
                                castOptions: {
                                    canControlVolume: true,
                                    canPause: !this.get("disablepause"),
                                    canSeek: !this.get("disableseeking"),
                                    displayName: this.get("title"),
                                    //displayStatus: "Please wait connecting",
                                    duration: this.get("duration"),
                                    imageUrl: this.player._element.poster,
                                    isConnected: this.player._broadcastingState.googleCastConnected,
                                    isMuted: false,
                                    isPaused: !this.get("playing")
                                },
                                airplayOptions: {}
                            });
                            if (Info.isChrome() && this.get("chromecast")) {
                                this._broadcasting.attachGoggleCast();
                                this.player.on("cast-state-changed", function(status, states) {
                                    // Other states: CONNECTED, CONNECTING, NOT_CONNECTED
                                    this.set("castbuttonvisble", status !== states.NO_DEVICES_AVAILABLE);
                                    this.set("chromecasting", status === states.CONNECTED);
                                }, this);
                                this.player.on("cast-loaded", function(castRemotePlayer, castRemotePlayerController) {
                                    this.set("broadcasting", true);
                                    // If player already start to play
                                    if (this.get("position") > 0) {
                                        this._broadcasting._seekToGoogleCast(this.get("position"));
                                        this._broadcasting._googleCastRemotePlay();
                                    }

                                    //If local player playing stop it before
                                    if (this.get('playing')) this.pause();

                                    // Initial play button state
                                    this.player.on("cast-paused", function(castPaused) {
                                        this.set("playing", !castPaused);
                                    }, this);
                                }, this);

                                this.player.on("cast-playpause", function(castPaused) {
                                    this.set("playing", !castPaused);
                                }, this);

                                this.player.on("cast-time-changed", function(currentTime, totalMediaDuration) {
                                    if (!Types.is_defined(currentTime) || currentTime === 0)
                                        return;
                                    if (totalMediaDuration) {
                                        this.set("cahched", totalMediaDuration);
                                        this.set("duration", totalMediaDuration || 0.0);
                                    }
                                    this.set("position", currentTime);
                                    this.set("videoelement_active", false);
                                    this.set("imageelement_active", true);
                                }, this);

                                this.player.on("proceed-when-ending-googlecast", function(position, isPaused) {
                                    this.set("broadcasting", false);
                                    this.set("videoelement_active", true);
                                    this.set("imageelement_active", false);
                                    this.player._broadcastingState.googleCastConnected = false;
                                    this.set("playing", false);
                                    this.trigger("seek", position);
                                    this.player.setPosition(position);
                                }, this);
                            }
                            if (Info.isSafari() && Info.safariVersion() >= 9 && window.WebKitPlaybackTargetAvailabilityEvent && this.get("airplay")) {
                                this.set("airplaybuttonvisible", true);
                                this._broadcasting.attachAirplayEvent.call(this, video);
                            }
                        }

                        if (this.get("playwhenvisible")) {
                            this.set("skipinitial", true);
                            this._playWhenVisible(video);
                        }
                        this.player.on("fullscreen-change", function(inFullscreen) {
                            this.set("fullscreened", inFullscreen);
                            if (!inFullscreen && (this.get('hideoninactivity') !== this.get("initialoptions").hideoninactivity)) {
                                this.set("hideoninactivity", this.get("initialoptions").hideoninactivity);
                            }
                        }, this);

                        // All conditions below appear on autoplay only
                        // If the browser not allows unmuted autoplay,
                        // and we have manually forcibly muted player
                        this._checkAutoPlay(this.__video);
                        this.player.on("postererror", function() {
                            this._error("poster");
                        }, this);
                        this.player.on("playing", function() {
                            if (this.get("sample_brightness")) this.__brightnessSampler.start();
                            if (this.get("sticky")) this.stickyHandler.start();
                            this.set("playing", true);
                            this.trigger("playing");
                            if (this.get("playedonce") === false) {
                                this.set("playbackcount", 1);
                            } else {
                                this.set("playbackcount", this.get("playbackended") + 1);
                            }
                        }, this);
                        this.player.on("loaded", function() {
                            if (this.get("sample_brightness")) this.__brightnessSampler.fire();
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("video", e);
                        }, this);
                        if (this.player.error())
                            this.player.trigger("error", this.player.error());
                        this.player.on("paused", function() {
                            if (this.get("sample_brightness")) this.__brightnessSampler.stop();
                            this.set("playing", false);
                            this.trigger("paused");
                        }, this);
                        this.player.on("ended", function() {
                            if (this.get("sample_brightness")) this.__brightnessSampler.stop();
                            this.set("playing", false);
                            this.set('playedonce', true);
                            this.set("playbackended", this.get('playbackended') + 1);
                            this.set("settingsmenu_active", false);
                            if (this.get("starttime")) {
                                this.player.setPosition(this.get("starttime") || 0);
                            }
                            this.trigger("ended");
                        }, this);
                        if (this.player._qualityOptions) {
                            this.addSettingsMenuItem({
                                id: "sourcequality",
                                label: "source-quality",
                                showicon: true,
                                visible: true, // TODO add parameter for setting source quality settings visibility
                                value: this.player._currentQuality.label,
                                options: this.player._qualityOptions.map(function(option) {
                                    return option.label;
                                }),
                                func: function(_, label) {
                                    this.player.trigger("setsourcequality", this.player._qualityOptions.find(function(option) {
                                        return option.label === label;
                                    }).id);
                                }
                            });
                            this.player.on("qualityswitched", function(currentQuality) {
                                this.updateSettingsMenuItem("sourcequality", {
                                    value: currentQuality.label
                                });
                            }.bind(this));
                        }
                        this.trigger("attached", instance);
                        this.player.once("loaded", function() {
                            var volume = Math.min(1.0, this.get("volume"));
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0.0);
                            if (!this.__trackTags && this.get("tracktags").length)
                                this.__trackTags = new TrackTags({}, this);
                            if (this.get("totalduration") || this.player.duration() < Infinity)
                                this.set("duration", this.get("totalduration") || this.player.duration());
                            this.set("fullscreensupport", this.player.supportsFullscreen(this.activeElement().childNodes[0]));
                            // As duration is credential, we're waiting to get duration info
                            this.on("chaptercuesloaded", function(chapters, length) {
                                this.set("chapterslist", chapters);
                            }, this);
                            if (this.get("initialseek"))
                                this.player.setPosition(this.get("initialseek"));
                            if (this.get("allowpip")) {
                                this.addSettingsMenuItem({
                                    id: 'pip',
                                    label: 'Picture-in-Picture',
                                    showicon: true,
                                    visible: this.player.supportsPIP(),
                                    func: function(settings) {
                                        this.player.on("pip-mode-change", function(ev, inPIPMode) {
                                            this.set("inpipmode", inPIPMode);
                                            this.updateSettingsMenuItem('pip', {
                                                value: inPIPMode
                                            });
                                        }, this);
                                        return !!this.toggle_pip();
                                    }
                                });
                            }
                        }, this);
                        if (this.player.loaded())
                            this.player.trigger("loaded");
                    }, this);
                },

                _getSources: function() {
                    var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
                    var poster = this.get("poster");
                    var source = this.get("source");
                    var sources = filter ? Objs.filter(this.get("sources"), function(source) {
                        return Objs.subset_of(filter, source);
                    }, this) : this.get("sources");
                    Objs.iter(sources, function(s) {
                        if (s.poster)
                            poster = s.poster;
                    });
                    return {
                        poster: poster,
                        source: source,
                        sources: sources
                    };
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;

                    this.__settingsMenu = this.scopes.settingsmenu;
                    if (this.__settingsMenu.get('settings'))
                        this.set("hassettings", true);

                    if (this.__attachRequested)
                        this._attachVideo();

                    this.activeElement().classList.add(this.get("csscommon") + "-full-width");

                    if (this.get("slim") === true) {
                        // We should add the CSS codes and we are adding it here, to mark the player
                        this.activeElement().classList.add(this.get("csscommon") + "-slim");
                        // Makes player a block, so we can position it in the page more easily
                        this.activeElement().style.setProperty("display", "block");
                    }

                    var img = this.activeElement().querySelector('img[data-image="image"]');
                    var imgEventHandler = this.auto_destroy(new DomEvents());
                    imgEventHandler.on(img, "load", function() {
                        this.set("fallback-width", img.naturalWidth);
                        this.set("fallback-height", img.naturalHeight);
                        imgEventHandler.destroy();
                    }, this);
                },

                _playWhenVisible: function(video) {
                    var _self = this;

                    if (Dom.isElementVisible(video, this.get("visibilityfraction"))) {
                        this.player.play();
                    }

                    this._visiblityScrollEvent = this.auto_destroy(new DomEvents());
                    this._visiblityScrollEvent.on(document, "scroll", function() {
                        if (!_self.get('playedonce') && !_self.get("manuallypaused")) {
                            if (Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                                _self.player.play();
                            } else if (_self.get("playing")) {
                                _self.player.pause();
                            }
                        } else if (_self.get("playing") && !Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                            _self.player.pause();
                        }
                    });
                },

                toggleFullscreen: function() {
                    this.call("toggle_fullscreen");
                },

                getPlaybackCount: function() {
                    return this.get("playbackcount");
                },

                /* In the future if require to use promise player, Supports >Chrome50, >FireFox53
                _playWithPromise: function(dyn) {
                    var _player, _promise, _autoplayAllowed;
                    _player = dyn.player;
                    _autoplayAllowed = true;
                    if (_player._element)
                        _promise = _player._element.play();
                    else
                        _player.play();

                    if (_promise !== 'undefined' && !Info.isInternetExplorer()) {
                        _promise["catch"](function(err) {
                            // here can add some interaction like inform user to change settings in chrome://flags disable-gesture-requirement-for-media-playback
                            if (err.name === 'NotAllowedError')
                                _autoplayAllowed = false;
                            // Will try to run play anyway
                            _player.play();
                        });
                        _promise.then(function() {
                            if(_autoplayAllowed) {
                                // Inform user with UI that device is not allowed to play without interaction
                            }
                        });
                    } else if (!dyn.get("playing")) {
                        _player.play();
                    }
                }, */

                reattachVideo: function() {
                    this.set("reloadonplay", true);
                    this._detachVideo();
                    this._attachVideo();
                },

                reattachImage: function() {
                    this._detachImage();
                    this._attachImage();
                },

                /**
                 * Click CC buttons will trigger
                 */
                toggleTrackTags: function() {
                    if (!this.__trackTags) return;
                    this.set("tracktextvisible", !this.get("tracktextvisible"));
                    var status = this.get("tracktextvisible");
                    var _lang = this.get("tracktaglang"),
                        _customStyled = this.get("tracktagsstyled"),
                        _status = status ? 'showing' : 'disabled';
                    _status = (status && _customStyled) ? 'hidden' : _status;
                    if (!status && this.get("tracktagsstyled")) this.set("trackcuetext", null);

                    Objs.iter(this.__video.textTracks, function(track, index) {
                        if (typeof this.__video.textTracks[index] === 'object' && this.__video.textTracks[index]) {
                            var _track = this.__video.textTracks[index];
                            // If set custom style to true show cue text in our element
                            if (_track.kind !== 'metadata') {
                                if (_track.language === _lang) {
                                    _track.mode = _status;
                                    this.set("tracktextvisible", status);
                                    this.__trackTags._triggerTrackChange(this.__video, _track, _status, _lang);
                                }
                            }
                        }
                    }, this);
                },

                _keyDownActivity: function(element, ev) {
                    if (this.get("preventinteractionstatus")) return;
                    var _keyCode = ev.which || ev.keyCode;
                    // Prevent white-space browser center scroll and arrow buttons behaviours
                    if (_keyCode === 32 || _keyCode === 37 || _keyCode === 38 || _keyCode === 39 || _keyCode === 40) ev.preventDefault();

                    if (_keyCode === 32 || _keyCode === 13 || _keyCode === 9) {
                        this._resetActivity();
                        if (this.get("fullscreened") && this.get("hideoninactivity")) this.set("hideoninactivity", false);
                    }

                    if (_keyCode === 9 && ev.shiftKey) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        }, -1);
                    } else if (_keyCode === 9) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        });
                    }
                },

                _findNextTabStop: function(parentElement, ev, callback, direction) {
                    var _currentIndex, _direction, _tabIndexes, _tabIndexesArray, _maxIndex, _minIndex, _looked, _tabIndex, _delta, _element, _videoPlayersCount;
                    _maxIndex = _minIndex = 0;
                    _direction = direction || 1;
                    _element = ev.target;
                    _currentIndex = _element.tabIndex;
                    _tabIndexes = parentElement.querySelectorAll('[tabindex]');
                    _tabIndexesArray = Array.prototype.slice.call(_tabIndexes, 0);
                    _tabIndexes = _tabIndexesArray
                        .filter(function(element) {
                            if ((element.clientWidth > 0 || element.clientHeight > 0) && (element.tabIndex !== -1)) {
                                if (_maxIndex <= element.tabIndex) _maxIndex = element.tabIndex;
                                if (_minIndex >= element.tabIndex) _minIndex = element.tabIndex;
                                return true;
                            } else return false;
                        });

                    if ((_direction === 1 && _currentIndex === _maxIndex) || (direction === -1 && _currentIndex === _minIndex) || _maxIndex === 0) {
                        _videoPlayersCount = document.querySelectorAll('ba-videoplayer').length;
                        if (_videoPlayersCount > 1) {
                            if (this.get("playing")) this.player.pause();
                            parentElement.tabIndex = -1;
                            parentElement.blur();
                        }
                        return;
                    }

                    for (var i = 0; i < _tabIndexes.length; i++) {
                        if (!_tabIndexes[i])
                            continue;
                        _tabIndex = _tabIndexes[i].tabIndex;
                        _delta = _tabIndex - _currentIndex;
                        if (_tabIndex < _minIndex || _tabIndex > _maxIndex || Math.sign(_delta) !== _direction)
                            continue;

                        if (!_looked || Math.abs(_delta) < Math.abs(_looked.tabIndex - _currentIndex))
                            _looked = _tabIndexes[i];
                    }

                    if (_looked) {
                        ev.preventDefault();
                        callback(_looked, _looked.tabIndex);
                    }
                },

                // Couldn't use for uglification issue `Unexpected token: punc (()`
                // _preventInteraction() {
                //      if(this.get('preventinteraction') && (this.get('hidebarafter') < (Time.now() - this.get("last_activity"))) && this.get('playing'));
                // },

                _resetActivity: function() {
                    if (!this.get('preventinteractionstatus')) {
                        this.set("last_activity", Time.now());
                    }
                    this.set("activity_delta", 0);
                },

                object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume", "set_speed", "toggle_tracks"],

                functions: {

                    user_activity: function(strong) {
                        if (strong && !this.get("volumeafterinteraction")) {
                            // User interacted with player, and set player's volume level/un-mute
                            // So we will play voice as soon as player visible for user
                            this.set_volume(this.get("initialoptions").volumelevel);
                            this.set("volumeafterinteraction", true);
                            if (this.get("forciblymuted")) this.set("forciblymuted", false);
                        }
                        if (this.get('preventinteractionstatus')) return;
                        this._resetActivity();
                    },

                    message_click: function() {
                        this.trigger("message:click");
                    },

                    playbutton_click: function() {
                        this.host.state().play();
                    },

                    play: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("play");
                            return;
                        }
                        if (this.player && this.get("broadcasting")) {
                            this._broadcasting.player.trigger("play-google-cast");
                            return;
                        }
                        this.host.state().play();
                        this.set("manuallypaused", false);
                    },

                    rerecord: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("rerecord");
                            return;
                        }
                        if (!this.get("rerecordable"))
                            return;
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("submit");
                            return;
                        }
                        if (!this.get("submittable"))
                            return;
                        this.trigger("submit");
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                    },

                    pause: function() {
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("pause");
                            return;
                        }

                        if (this.get('disablepause')) return;

                        if (this.get("playing")) {
                            if (this.player && this.get("broadcasting")) {
                                this._broadcasting.player.trigger("pause-google-cast");
                                return;
                            }
                            this.player.pause();
                        }

                        this.set("manuallypaused", true);
                    },

                    stop: function() {
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("stop");
                            return;
                        }
                        if (!this.videoLoaded())
                            return;
                        if (this.get("playing"))
                            this.player.pause();
                        this.player.setPosition(0);
                        this.trigger("stopped");
                    },

                    seek: function(position) {
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("seek", position);
                            return;
                        }
                        if (this.get('disableseeking')) return;
                        if (this.videoLoaded()) {
                            if (position > this.player.duration())
                                this.player.setPosition(this.player.duration() - this.get("skipseconds"));
                            else if (this.get("starttime") && position < this.get("starttime")) {
                                this.player.setPosition(this.get("starttime"));
                            } else {
                                this.player.setPosition(position);
                                this.trigger("seek", position);
                            }
                        }
                        // In midroll ads we need recheck next ad position
                        if (this._adsCollection) {
                            if (this._adsCollection.count() > 0) {
                                this._adsCollection.iterate(function(curr) {
                                    if (curr.get("position") < position)
                                        this._nextRollPosition = null;
                                }, this);
                            }
                        }
                        this.__playedStats(position, this.get("duration"));
                    },

                    set_speed: function(speed, from_ui) {
                        if (!this.player) return false;
                        this.player.setSpeed(speed);
                        if (!from_ui) this.updateSettingsMenuItem("playerspeeds", {
                            value: parseFloat(speed.toFixed(2))
                        });
                        return speed;
                    },

                    set_volume: function(volume) {
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("set_volume", volume);
                            return;
                        }
                        volume = Math.min(1.0, volume);

                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("change-google-cast-volume", volume);
                        }

                        this.set("volume", volume);
                        if (this.videoLoaded()) {
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0);
                        }
                    },

                    toggle_settings_menu: function() {
                        this.set("settingsmenu_active", !this.get("settingsmenu_active"));
                    },

                    toggle_share: function() {
                        this.set("share_active", !this.get("share_active"));
                    },

                    toggle_fullscreen: function() {
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("toggle_fullscreen");
                            return;
                        }
                        if (!this.player) return;
                        if (this.get("fullscreened")) {
                            this.player.exitFullscreen();
                        } else {
                            if (Info.isSafari())
                                this.player.enterFullscreen(this.activeElement().querySelector('video'));
                            else
                                this.player.enterFullscreen(this.activeElement().childNodes[0]);
                        }
                        this.set("fullscreened", !this.get("fullscreened"));
                    },

                    toggle_player: function() {
                        if (this.get("sticky") && this.stickyHandler.isDragging()) {
                            this.stickyHandler.stopDragging();
                            return;
                        }
                        if (this.get("playing") && this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("toggle_player");
                            return;
                        }
                        if (this.get("playing") && this.get("pauseonclick")) {
                            this.pause();
                        } else if (!this.get("playing") && this.get("playonclick")) {
                            this.play();
                        }
                    },

                    toggle_ad_player: function() {
                        Objs.iter(['_prerollAd', '_adsRoll', '_postrollAd'], function(key) {
                            var _ad = this[key];
                            if (Types.is_defined(_ad) && _ad) {
                                var _manager = _ad._adsManager;
                                if (_manager && typeof _manager.getCurrentAd === 'function') {
                                    var _currentAd = _manager.getCurrentAd();
                                    if (_currentAd) {
                                        if (_currentAd.isLinear()) {
                                            _manager.clicked();
                                            if (_ad._adsRequest._isPlaying) {
                                                _manager.pause();
                                                // _manager.dispatchEvent(google.ima.AdEvent.Type.PAUSED);
                                            } else {
                                                _manager.resume();
                                                // _manager.dispatchEvent(google.ima.AdEvent.Type.RESUMED);
                                            }
                                        } else {
                                            // As it's not trigger onUserExpand, can't control pause/play
                                            this.functions.toggle_player.apply(this);
                                        }
                                    }
                                }
                            }
                        }, this);

                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        if (this.get("preventinteractionstatus")) return;
                        var _targetElement, _activeElement, _selector, _keyCode;
                        _keyCode = ev.which || ev.keyCode;
                        _activeElement = this.activeElement();
                        if (_keyCode === 13 || _keyCode === 32) {
                            if (focusingSelector) {
                                _selector = "[data-selector='" + focusingSelector + "']";
                                _targetElement = _activeElement.querySelector(_selector);
                                if (_targetElement)
                                    Async.eventually(function() {
                                        this.trigger("keyboardusecase", _activeElement);
                                        _targetElement.focus({
                                            preventScroll: false
                                        });
                                    }, this, 100);
                            } else {
                                _selector = '[data-video="video"]';
                                _targetElement = _activeElement.querySelector(_selector);
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: true
                                    });
                                }, this, 100);
                            }
                        } else if (_keyCode === 9 && nextSelector) {
                            _selector = "[data-selector='" + nextSelector + "']";
                            _targetElement = _activeElement.querySelector(_selector);
                            if (_targetElement)
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: false
                                    });
                                }, this, 100);
                        }
                    },

                    upload_text_tracks: function(file, locale) {
                        return this.host.state().uploadTextTrack(file, locale);
                    },

                    move_to_option: function(currentElement, nextSelector) {
                        var _classPrefix, _hiddenOptionsSelector, _visibleOptionsSelector, _moveToSelector,
                            _targetElement, _currentElementParent, _topParent;
                        nextSelector = nextSelector || 'initial-options-list'; // If next element is empty return to main options
                        _classPrefix = this.get('csscommon') + "-";
                        _moveToSelector = "." + _classPrefix + nextSelector;
                        _hiddenOptionsSelector = _classPrefix + 'options-list-hidden';
                        _visibleOptionsSelector = _classPrefix + 'options-list-visible';
                        _targetElement = this.activeElement().querySelector(_moveToSelector);
                        _topParent = this.activeElement().querySelector(_classPrefix + 'text-tracks-overlay');

                        // Look if target element is hidden
                        if (Dom.elementHasClass(_targetElement, _hiddenOptionsSelector)) {
                            // Search for visible closest parent element
                            _currentElementParent = Dom.elementFindClosestParent(currentElement, _visibleOptionsSelector, _classPrefix + 'text-tracks-overlay');
                            // We should have parent element with visible class
                            if (Dom.elementHasClass(_currentElementParent, _visibleOptionsSelector)) {
                                Dom.elementReplaceClasses(_targetElement, _hiddenOptionsSelector, _visibleOptionsSelector);
                                Dom.elementReplaceClasses(_currentElementParent, _visibleOptionsSelector, _hiddenOptionsSelector);
                            }
                            if (_topParent)
                                _topParent.focus({
                                    preventScroll: true
                                });
                            else
                                _currentElementParent.focus({
                                    preventScroll: true
                                });
                        }
                    },

                    toggle_interaction_option: function(turn_switch) {
                        if (typeof turn_switch === 'boolean') {
                            this.set("preventinteractionstatus", turn_switch);
                        } else {
                            this.set("preventinteractionstatus", !this.get("preventinteractionstatus"));
                        }
                    },

                    toggle_tracks: function() {
                        this.toggleTrackTags(!this.get('tracktextvisible'));
                    }
                },

                destroy: function() {
                    if (this._observer) this._observer.disconnect();
                    this._timer.destroy();
                    this.host.destroy();
                    this._detachVideo();
                    inherited.destroy.call(this);
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        if (this.videoLoaded()) {
                            var _now = Time.now();
                            this.set("activity_delta", _now - this.get("last_activity"));
                            var new_position = this.player.position();
                            if (new_position !== this.get("position") || this.get("last_position_change"))
                                this.set("last_position_change", _now);

                            // var midPreAdRolls = (this._adsRoll || this._prerollAd);
                            // // Check in the last 3 seconds if nonLinear is showing and disable it
                            // if ((this.get("duration") > 0 && new_position > 10) && (this.get("duration") - new_position) > 3) {
                            //     if (midPreAdRolls && typeof midPreAdRolls.manuallyEndAd === "function" && !midPreAdRolls._isLinear) {
                            //         midPreAdRolls.manuallyEndAd();
                            //     }
                            // }
                            // If play action will not set the silent_attach to false.
                            if (new_position > 0.0 && this.get("silent_attach")) {
                                this.set("silent_attach", false);
                            }
                            // In case if prevent interaction with controller set to true
                            if (this.get('preventinteraction')) {
                                // set timer since player started to play
                                if (this.get("passed_after_play") < 0.001) {
                                    this.set("passed_after_play", _now);
                                } else {
                                    var _passed = _now - this.get("passed_after_play");
                                    if (_passed > _now - 1000) {
                                        this.set("passed_after_play", _passed);
                                    }
                                    if ((this.get('hidebarafter') < _passed) && this.get('playing') && !this.get("preventinteractionstatus")) {
                                        this.set('preventinteractionstatus', true);
                                    }
                                }
                            }
                            if (!this.get("broadcasting")) {
                                this.set("last_position_change_delta", _now - this.get("last_position_change"));
                                this.set("position", new_position);
                                this.set("buffered", this.player.buffered());
                                var pld = this.player.duration();
                                if (0.0 < pld && pld < Infinity)
                                    this.set("duration", this.player.duration());
                                else
                                    this.set("duration", this.get("totalduration") || new_position);
                            }
                            this.set("fullscreened", this.player.isFullscreen(this.activeElement().childNodes[0]));
                            // If setting pop-up is open, hide it together with a control-bar if hideOnInactivity is true
                            if (this.get('hideoninactivity') && (this.get('activity_delta') > this.get('hidebarafter'))) {
                                this.set("settingsmenu_active", false);
                            }
                            // We need this part run each second not too fast, this.__adControlPosition will control it
                            if (this._adsLoader && this._adProvider && this.__adControlPosition < this.get("position")) {
                                this.__adControlPosition = Math.ceil(this.get("position"));
                                this.__controlAdRolls();
                            }
                        }
                    } catch (e) {}
                    try {
                        // For now, it will be implemented only for ads, if in the feature
                        //  are applied for another feature statement could be updated
                        if (this._adsRoll) {
                            var dimensions = this.get("states").dimensions;
                            var _width = Dom.elementDimensions(this.activeElement()).width || this.videoWidth() || this.parentWidth();
                            var _height = Dom.elementDimensions(this.activeElement()).height || this.videoHeight() || this.parentHeight();
                            // If any updates occur
                            if (dimensions.width === null || (dimensions.height !== _height || dimensions.width !== _width)) {
                                this.set("states", Objs.tree_merge(this.get("states"), {
                                    dimensions: {
                                        width: _width,
                                        height: _height
                                    }
                                }));
                                if (this._adsRoll._adsManager) {
                                    this._adsRoll._adsManager.resize(_width, _height, google.ima.ViewMode.NORMAL);
                                }
                            }
                        }
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 320 ? "medium" : "small"));
                    this.set("mobileview", width < 560);
                },

                videoHeight: function() {
                    if (this.videoAttached())
                        return this.player.videoHeight();
                    var img = this.activeElement().querySelector("img");
                    // In Safari img && img.height could return 0
                    if (Types.is_defined(img) && img.height) {
                        var clientHeight = (window.innerHeight || document.body.clientHeight);
                        if (img.height > clientHeight)
                            return clientHeight;
                        return img.height;
                    }
                    return NaN;
                },

                videoWidth: function() {
                    if (this.videoAttached())
                        return this.player.videoWidth();
                    var img = this.activeElement().querySelector("img");
                    // In Safari img && img.width could return 0
                    if (Types.is_defined(img) && img.width) {
                        var clientWidth = (window.innerWidth || document.body.clientWidth);
                        if (img.width > clientWidth)
                            return clientWidth;
                        return img.width;
                    }
                    return NaN;
                },

                aspectRatio: function() {
                    // Don't use shortcut way of getting aspect ratio, will act as not expected.
                    var height = this.videoHeight();
                    var width = this.videoWidth();

                    return width / height;
                },

                isPortrait: function() {
                    return this.aspectRatio() < 1.00;
                },

                isLandscape: function() {
                    return !this.isPortrait();
                },

                parentWidth: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).width;
                },

                parentHeight: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                cloneAttrs: function() {
                    return Objs.map(Types.is_function(this.attrs) ? this.attrs.call(this) : this.attrs, function(value, key) {
                        return this.get(key);
                    }, this);
                },

                isHD: function() {
                    if (this.videoAttached()) {
                        return (this.videoWidth() * this.videoHeight()) >= 1280 * 720;
                    } else {
                        var video_data;
                        if (this.get("stream") == null || this.get("stream") === "") {
                            video_data = this.get("video_data").default_stream;
                        } else {
                            for (var i = 0; i < this.get("video_data").streams.length; i++) {
                                if (this.get("video_data").streams[i].token === this.get("stream")) {
                                    return (this.get("video_data").streams[i].video_width * this.get("video_data").streams[i].video_height) >= 1280 * 720;
                                }
                            }
                        }
                        if (video_data) {
                            return (video_data.video_width * video_data.video_height) >= 1280 * 720;
                        } else {
                            return undefined;
                        }
                    }
                },

                isSD: function() {
                    return !this.isHD();
                },

                isMobile: function() {
                    return Info.isMobile();
                },

                popupAttrs: function() {
                    return {
                        autoplay: true,
                        popup: false,
                        width: this.get("popup-width"),
                        height: this.get("popup-height")
                    };
                },

                /**
                 * Prepare for postoll and mid-roll ad managers
                 * @private
                 */
                __controlAdRolls: function() {
                    // If we have mid-rolls, then prepare mid-Rolls
                    if (
                        (this.get("mid-linear-ad").length > 0 || this.get('non-linear-ad').length > 0) &&
                        this.get("duration") > 0.0 && !this._adsCollection
                    ) {
                        this._adsCollection = this.auto_destroy(new Collection()); // our adsCollections
                        this.__adMinIntervals = this.__adMinIntervals === 0 ?
                            this.get("minadintervals") : (this.__adMinIntervals - 1);
                        if (this.get("mid-linear-ad").length > 0) {
                            var _current = null;
                            var _nextPositionIndex = null;
                            Objs.iter(this.get("mid-linear-ad"), function(roll, index) {
                                if (roll.position && roll.position > 0) {
                                    // First ad position, if less than 1 it means it's percentage not second
                                    var _position = roll.position < 1 ?
                                        Math.floor(this.get("duration") * roll.position) :
                                        roll.position;
                                    // If the user does not set, and we will not get the same ad position, avoids dublication,
                                    // prevent very close ads and also wrong set position which exceeds the duration
                                    if ((Math.abs(_position - _current) > this.__adMinIntervals) && _position < this.get("duration")) {
                                        _current = _position;
                                        _nextPositionIndex = index;
                                        this._adsCollection.add({
                                            position: _position,
                                            duration: null,
                                            type: this._adProvider.__IMA_AD_TYPE_LINEAR,
                                            isLinear: true,
                                            dimensions: {
                                                width: Dom.elementDimensions(this.activeElement()).width || this.parentWidth(),
                                                height: Dom.elementDimensions(this.activeElement()).height || this.parentHeight()
                                            }
                                        });
                                    }
                                }
                            }, this);
                        }

                        // non-linear ads, They can be delivered as text, static image, or interactive rich media.
                        if (this.get("non-linear-ad").length > 0) {
                            Objs.iter(this.get("non-linear-ad"), function(nonLinear) {
                                if (Types.is_defined(nonLinear)) {
                                    if (nonLinear.position && nonLinear.position >= 0) {
                                        var _position = nonLinear.position < 1 ?
                                            Math.floor(this.get("duration") * nonLinear.position) :
                                            nonLinear.position;
                                        var _width = nonLinear.width || Dom.elementDimensions(this.activeElement()).width || this.parentWidth();
                                        var _height = nonLinear.height || Dom.elementDimensions(this.activeElement()).height || this.parentHeight();
                                        this._adsCollection.add({
                                            position: _position,
                                            duration: this._adProvider.nonLienarDuration,
                                            type: this._adProvider.__IMA_AD_TYPE_NON_LINEAR,
                                            isLinear: false,
                                            exact: (!!nonLinear.width && !!nonLinear.height),
                                            dimensions: {
                                                width: +_width,
                                                height: +_height
                                            },
                                            waitToLoadInSeconds: 5 // We can set divergent on linear or on non-linear
                                        });
                                    }
                                }
                            }, this);
                        }
                    }

                    // Set a new position when ad should run
                    if (this._adsCollection && !this._nextRollPosition) {
                        var _counter = this._adsCollection.count();
                        var _removeCurr = null;
                        if (_counter > 0) {
                            var _nextAdPoint = {
                                position: -1,
                                nextPosition: this.get("duration"),
                                nextIsLast: true,
                                type: null
                            };
                            this._adsCollection.iterate(function(curr) {
                                _counter--;
                                if ((_nextAdPoint.position > curr.get("position") && _nextAdPoint.type) || _nextAdPoint.position === -1) {
                                    _removeCurr = curr;
                                    _nextAdPoint = _removeCurr.data();
                                }
                                // We need max close position to play, if user seeked the video
                                if (this.get("position") >= curr.get("position")) {
                                    // Remove all passed positions
                                    this._adsCollection.remove(curr);
                                }
                                if (_nextAdPoint.position && _nextAdPoint.type && _counter === 0 && _removeCurr) {
                                    this._nextRollPosition = _nextAdPoint;
                                    this._adsCollection.remove(_removeCurr);
                                }
                            }, this);
                        }
                    }

                    if (this._nextRollPosition && this._adsRoll) {
                        if (this._nextRollPosition.position < this.get("position")) {
                            if (this._adsRoll._isLoaded) {
                                var _startedPosition = this._nextRollPosition.position;
                                this._adsRoll.startAd();
                                this._nextRollPosition = null;
                                // as soon as is loaded will reset next position data and find a new
                                this._adsRoll.once("adloaded", function(ad) {
                                    if (!ad && ad.isLinear()) {
                                        var _suggestedSeconds = (ad.getMinSuggestedDuration() || this.get("non-linear-min-duration")) + 1;
                                        var _nextPossible = _startedPosition + _suggestedSeconds;

                                        this._adCheckerTimer = new Timers.Timer({
                                            context: this,
                                            fire: function() {
                                                if (this._nextRollPosition) {
                                                    _nextPossible = Math.max(this._nextRollPosition.position, _nextPossible) - 1.5;
                                                    // We need be less than an above statement "this._nextRollPosition.position < this.get("position")"
                                                    if (_nextPossible < this.get("position")) {
                                                        this._adsRoll.manuallyEndAd();
                                                        this._adCheckerTimer.stop();
                                                    }
                                                }
                                            },
                                            delay: 1000,
                                            start: true,
                                            destroy_on_stop: true
                                        });
                                    }
                                }, this);

                                this._adsRoll.once("adendmanually", function(ad) {
                                    if (this._adsRoll) this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    if (!this.get("playing") && !this.get("manuallypaused") && (ad && ad.isLinear())) {
                                        this.player.play();
                                    }
                                }, this);

                                this._adsRoll.once("adfinished", function(ad) {
                                    if (this._adsRoll) this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    if (!this.get("playing") && !this.get("manuallypaused")) {
                                        this.player.play();
                                    }
                                }, this);

                                this._adsRoll.on("ad-error", function(message) {
                                    console.error('Error during loading an ad. Details:"' + message + '".');
                                    if (this._adsRoll) this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    if (!this.get("playing") && !this.get("manuallypaused")) {
                                        this.player.play();
                                    }
                                }, this);
                            } else {
                                // Will allow 5 seconds for load content before destroying the roll instance
                                if (this._adsRoll && this._nextRollPosition.waitToLoadInSeconds <= 0) {
                                    this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    this._nextRollPosition = null;
                                } else {
                                    this._nextRollPosition.waitToLoadInSeconds = this._nextRollPosition.waitToLoadInSeconds - 1;
                                }
                            }
                        }
                    }

                    // If we've set mid-roll position:
                    if (this._nextRollPosition && !this._adsRoll) {
                        if (this._nextRollPosition.type) {
                            this._adsRoll = this._adProvider._newAdsRequester(
                                this, this._nextRollPosition.type, false
                            );
                            var _nextPosition = this._nextRollPosition;
                            this._adsRoll.executeAd({
                                width: _nextPosition.dimensions.width || Dom.elementDimensions(this.activeElement()).width || this.parentWidth(),
                                height: _nextPosition.dimensions.height || Dom.elementDimensions(this.activeElement()).height || this.parentHeight(),
                                exact: _nextPosition.exact || false,
                                isLinear: _nextPosition.isLinear
                            });

                            // To remove previous all roll positions
                            if (this._adsCollection.count() > 0 && _nextPosition.position >= 0) {
                                this._adsCollection.iterate(function(curr) {
                                    if (curr.get("position") < _nextPosition.position) {
                                        this._adsCollection.remove(curr);
                                    }
                                }, this);
                            }
                        }
                    }

                    // Set postroll ads
                    if (this.get("has-post-roll-ad") && !this._postrollAd) {
                        // when time is less than 10 seconds
                        if ((this.get("duration") - this.get("position")) <= 10) {
                            this._postrollAd = this._adProvider._newAdsRequester(
                                this, this._adProvider.__IMA_POST_ROLL, true
                            );
                            this._postrollAd.on("ad-error", function(message) {
                                console.error('Error during loading an ad. Details:"' + message + '".');
                                this._postrollAd = null;
                                this.set("has-post-roll-ad", false);
                            }, this);
                        }
                    }
                },

                /**
                 * Will generate player stats
                 * @param position
                 * @param duration
                 * @private
                 */
                __playedStats: function(position, duration) {
                    var currentPassedQuarter = Math.floor(position / duration / 0.25);
                    if (Math.abs(this.get("last-seen-position") - position) >= 1) {
                        this.set("last-seen-position", position);
                        this.set("played-seconds", this.get("played-seconds") + 1);
                        if (this.get("volume") > 0.2) {
                            this.set("last-played-position", this.get("last-played-position") + 1);
                        }
                    }

                    if (this.get("passed-quarter") !== currentPassedQuarter) {
                        this.set("passed-quarter", currentPassedQuarter);
                        this.trigger("quarter-passed", currentPassedQuarter);
                    }

                    if (!this.get("player-started")) this.set("player-started", true);

                },

                _checkAutoPlay: function(video) {
                    video = video || this.__video;
                    if (!video) return;
                    if (this.get("autoplay-requires-muted") || this.get("autoplay-requires-playsinline") || this.get("wait-user-interaction") || this.get("forciblymuted")) {
                        if (this.get("autoplay-requires-muted") || this.get("forciblymuted"))
                            video.muted = true;
                        if (this.get("autoplay-requires-playsinline"))
                            video.playsinline = true;
                        Dom.userInteraction(function() {
                            var _initialVolume = this.get("initialoptions").volumelevel > 1 ? 1 : this.get("initialoptions").volumelevel;
                            this.set_volume(_initialVolume);
                            this.set("autoplay", this.get("initialoptions").autoplay);
                            if (this.get("volume") > 0.00)
                                video.muted = false;
                            this.set("forciblymuted", false);
                            if (this.get("autoplay-requires-muted") && (this._prerollAd || this._adsRoll)) {
                                var _adsManager = (this._prerollAd || this._adsRoll)._adsManager;
                                var _adsControlBar = (this._prerollAd || this._adsRoll)._adControlbar;
                                if (_adsManager) _adsManager.setVolume(_initialVolume);
                                if (_adsControlBar) _adsControlBar.set('volume', _initialVolume);
                            }
                            if (this.get("wait-user-interaction") && this.get("autoplay")) {
                                this.__testAutoplayOptions(video);
                                this.trigger("user-has-interaction");
                            }
                        }, this);
                    }

                },

                __testAutoplayOptions: function(video) {
                    var suitableCondition = false;
                    var autoplayPossibleOptions = [{
                            muted: false,
                            playsinline: false
                        },
                        {
                            muted: false,
                            playsinline: true
                        },
                        {
                            muted: true,
                            playsinline: false
                        },
                        {
                            muted: true,
                            playsinline: true
                        }
                    ];
                    Objs.iter(autoplayPossibleOptions, function(opt, index) {
                        PlayerSupport.canAutoplayVideo(opt)
                            .success(function(response, err) {
                                if (suitableCondition) return;
                                // If autoplay is allowed in any way
                                if (!this.get("autoplay-allowed")) {
                                    this.set("autoplay-allowed", !!response.result);
                                }
                                // If condition is true no need for turn off volume
                                if (!opt.muted && !opt.playsinline && response.result) {
                                    this.set("wait-user-interaction", false);
                                    this.set("autoplay-requires-muted", false);
                                    suitableCondition = true;
                                    // if (video) video.muted = opt.muted;
                                    if (video) {
                                        if (opt.playsinline) {
                                            video.setAttribute('playsinline', '');
                                        } else {
                                            video.removeAttribute('playsinline');
                                        }
                                    }
                                    if (!this.get("playing") && this.player) {
                                        this.player.play();
                                    }
                                }
                                if (opt.muted && response.result) {
                                    this.set("forciblymuted", true);
                                    this.set("autoplay-requires-muted", true);
                                    this.set("wait-user-interaction", false);
                                    this.set("volume", 0.0);
                                    this.set("forciblymuted", true);
                                    suitableCondition = true;
                                    if (video) video.muted = opt.muted;
                                    if (video) {
                                        if (opt.playsinline) {
                                            video.setAttribute('playsinline', '');
                                        } else {
                                            video.removeAttribute('playsinline');
                                        }
                                    }
                                    if (!this.get("playing") && this.player) {
                                        this.player.play();
                                    }
                                }
                                if (opt.playsinline && response.result) {
                                    this.set("autoplay-requires-playsinline", true);
                                    this.set("wait-user-interaction", false);
                                    if (video) video.playsinline = true;
                                    if (opt.muted) {
                                        this.set("forciblymuted", true);
                                        this.set("autoplay-requires-muted", true);
                                        if (video) video.muted = true;
                                    }
                                    suitableCondition = true;
                                }
                            }, this)
                            .error(function(err) {
                                console.warn("Error :", err, opt, index);
                            }, this);
                    }, this);
                },

                __prepareAdSchedule: function(schedules, nonLinearSchedules) {
                    if (schedules.length > 0) {
                        Objs.iter(schedules, function(schedule, index) {
                            switch (schedule.toLowerCase()) {
                                case this._adProvider.__IMA_PRE_ROLL:
                                    // if already, the user did not set preroll as an attribute
                                    if (!this._prerollAd) {
                                        this._prerollAd = this._adProvider._newAdsRequester(this, this._adProvider.__IMA_PRE_ROLL, true);
                                    }
                                    break;
                                case this._adProvider.__IMA_POST_ROLL:
                                    // Post-roll will trigger as soon as the video will be stopped
                                    this.set("has-post-roll-ad", true);
                                    break;
                                    // Midroll could be just "mid", which will trigger on 50% of player time,
                                    // or specify more details with second and percentage
                                default:
                                    // if user set schedule with time settings
                                    if (/^mid\[[\d\s]+(,[\d\s]+|[\d\s]+\%|\%|[\d\s]+\*|\*)*\]*$/i.test(schedule)) {
                                        var _s = schedule.replace('mid[', '').replace(']', '');
                                        Objs.map(_s.split(','), function(item) {
                                            item = item.trim();
                                            if (/^[\d\s]+\*$/.test(item)) {
                                                item = +item.replace("\*", '');
                                                this.on("change:duration", function(duration) {
                                                    if (duration > 0) {
                                                        var step = Math.floor(duration / item);
                                                        if (duration > item) {
                                                            for (var i = 1; i <= step; i++) {
                                                                this.get("mid-linear-ad").push({
                                                                    position: i * item
                                                                });
                                                            }
                                                        }
                                                    }
                                                }, this);
                                            } else {
                                                if (/^[\d\s]+\%$/.test(item)) {
                                                    item = parseInt(item.replace('%', '').trim(), 10);
                                                    if (item < 100 && item > 0) {
                                                        this.get("mid-linear-ad").push({
                                                            position: parseFloat((item / 100).toFixed(2))
                                                        });
                                                    }
                                                } else {
                                                    // the user also set 0 to 1 value, as percentage, more 1 means seconds
                                                    this.get("mid-linear-ad").push({
                                                        position: parseFloat(item)
                                                    });
                                                }
                                            }
                                        }, this);
                                    } else {
                                        if (/^mid\[.*?\]$/.test(schedule))
                                            console.log('Seems your mid roll settings does not correctly set. It will be played only in the middle of the video.');
                                        if (/^mid$/.test(schedule)) {
                                            this.get("mid-linear-ad").push({
                                                position: 0.5
                                            });
                                        }
                                    }
                                    break;
                            }

                            // After iteration completing. if adsCollections existed should be destroyed
                            if (((index + 1) === schedules.length) && !!this._adsCollection) {
                                this._adsCollection.destroy();
                                this._adsCollection = null;
                            }
                        }, this);
                    }

                    if (nonLinearSchedules.length > 0) {
                        this.set("non-linear-ad", nonLinearSchedules);
                    }
                }
            };
        }], {

            playerStates: function() {
                return [PlayerStates];
            }

        }).register("ba-videoplayer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/player.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "video-error": "An error occurred, please try again later. Click to retry.",
            "all-settings": "All settings",
            "player-speed": "Player speed",
            "full-screen": "Full screen"
        });
});