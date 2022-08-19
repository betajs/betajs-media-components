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
    "base:Ajax.Support",
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
    "module:VideoPlayer.Dynamics.Tracks",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, StickyHandler, StylesMixin, TrackTags, Info, Dom, VideoPlayerWrapper, Broadcasting, Types, Objs, Strings, Collection, Time, Timers, TimeFormat, Host, ClassRegistry, Async, AjaxSupport, InitialState, PlayerStates, AdProvider, IMARequester, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: {
                    /* CSS */
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
                    "fallback-width": 320,
                    "fallback-height": 240,
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
                    "visibilityfraction": 0.8,
                    "collect-meta-data": false,
                    /**
                     * collection-xpath-rule format:
                     * [{
                     *   key: string // Any key name which could be set as JSON key. Example: 'header',
                     *   scope: Node // Node scope, in which area query required. Example: document.body,
                     *   dataKeyType: 'key' | 'tag' | string: 'anyAttributeName' // Which type of key should be used as deta key,
                     *   resultKeyType: 'innerText' // Found Node content type,
                     *   rules: string[] | string // Sny xPath rules: https://devhints.io/xpath, Example: "//h1[position()=1]"
                     * }]
                     */
                    "collection-xpath-rule": null,
                    "send-meta-endpoint": null,

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
                    "customnonlinear": false, // Currently, not fully suported
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

                    /* States (helper variables which are controlled by application itself not set by user) */
                    "showbuiltincontroller": false,
                    "airplaybuttonvisible": false,
                    "castbuttonvisble": false,
                    "fullscreened": false,
                    "initialoptions": {
                        "hideoninactivity": null,
                        "volumelevel": null,
                        "playlist": []
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
                    // If we do it forcibly then will set as true
                    "forciblymuted": false,
                    // When volume was un muted, by user himself, not automatically
                    "volumeafterinteraction": false
                },

                types: {
                    "allowpip": "boolean",
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
                    "non-linear-min-duration": "int",
                    "companion-ad": "string",
                    "collect-meta-data": "boolean",
                    "collection-xpath-rule": "jsonarray",
                    "send-meta-endpoint": "string"
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
                    "containerSizingStyles:aspectratio,fallback-width,fallback-height,height,width": function(aspectRatio, fallbackWidth, fallbackHeight, height, width) {
                        var styles = {
                            aspectRatio: aspectRatio || fallbackWidth + "/" + fallbackHeight
                        };
                        if (height) styles.height = typeof height === "string" && height[height.length - 1] === "%" ? height : height + "px";
                        if (width) styles.width = typeof width === "string" && width[width.length - 1] === "%" ? width : width + "px";
                        if (this.activeElement()) {
                            this._applyStyles(this.activeElement(), styles, this.__lastContainerSizingStyles);
                        }
                        this.__lastContainerSizingStyles = styles;
                        return styles;
                    },
                    "buffering:buffered,position,last_position_change_delta,playing": function() {
                        return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    this._validateParameters();
                    // Will set volume initial state
                    this.set("initialoptions", Objs.tree_merge(this.get("initialoptions"), {
                        volumelevel: this.get("volume")
                    }));
                    if (this.get("fullscreenmandatory")) {
                        if (!(document.fullscreenEnabled || document.mozFullscreenEnabled ||
                                document.webkitFullscreenEnabled || document.msFullscreenEnabled)) {
                            this.set("skipinitial", true);
                            this.set("showbuiltincontroller", true);
                        }
                    }

                    if ((Info.isMobile() || Info.isChromiumBased()) && (this.get("autoplay") || this.get("playwhenvisible"))) {
                        this.set("volume", 0.0);
                        this.set("forciblymuted", true);

                        //if (!(Info.isiOS() && Info.iOSversion().major >= 10)) {
                        //this.set("autoplay", false);
                        //this.set("loop", false);
                        //}
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

                    if (this.get("collect-meta-data") && this.get("send-meta-endpoint")) {
                        this._collectMetaData();
                    }

                    if (this.get("adprovider")) {
                        this._adProvider = this.get("adprovider");
                        if (Types.is_string(this._adProvider))
                            this._adProvider = AdProvider.registry[this._adProvider];

                        if (this._adProvider) {
                            var adInitOptions = {
                                videoElement: this.activeElement().querySelector("[data-video='video']"),
                                adElement: this.activeElement().querySelector("[data-video='ad']"),
                                adContainer: this.activeElement().querySelector("[data-video='ima-ad-container']"),
                                dynamic: this
                            };

                            if (this.get("preroll")) {
                                // console.warn('Adsense ad provider is deprecated, please try to implement IMA ad provider with linear & non-linear options instead');
                                this._prerollAd = this._adProvider.newPrerollAd(adInitOptions);
                            }

                            if (this.get("adprovider") === 'ima' && (this.get("linear") || this.get("non-linear"))) {
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
                                    this._adProvider.initAdsLoader(adInitOptions)
                                        .success(function(loader) {
                                            this._adsLoader = loader;
                                            this._adOptions = adInitOptions;
                                            if (schedules.length > 0) {
                                                Objs.iter(schedules, function(schedule) {
                                                    switch (schedule.toLowerCase()) {
                                                        case this._adProvider.__IMA_PRE_ROLL:
                                                            // if already user not set preroll as an attribute
                                                            if (!this._prerollAd) {
                                                                this._prerollAd = this._adProvider._newAdsRequester(this, this._adProvider.__IMA_PRE_ROLL, true);
                                                            }
                                                            break;
                                                        case this._adProvider.__IMA_POST_ROLL:
                                                            // Post roll will trigger as soon as video will be stopped
                                                            this.set("has-post-roll-ad", true);
                                                            break;
                                                            // Midroll could be just "mid", which will trigger on 50% of player time,
                                                            // or specify more details with second and percentage
                                                        default:
                                                            // if user set schedule with time settings
                                                            if (/^mid\[[\d\s]+(,[\d\s]+|[\d\s]+\%)*\]*$/i.test(schedule)) {
                                                                var _s = schedule.replace('mid[', '').replace(']', '');
                                                                Objs.map(_s.split(','), function(item) {
                                                                    item = item.trim();
                                                                    if (/^[\d\s]+\%$/.test(item)) {
                                                                        item = parseInt(item.replace('%', '').trim(), 10);
                                                                        if (item < 100 && item > 0) {
                                                                            this.get("mid-linear-ad").push({
                                                                                position: parseFloat((item / 100).toFixed(2))
                                                                            });
                                                                        }
                                                                    } else {
                                                                        // user also can set 0 to 1 value, as percentage, more 1 means seconds
                                                                        this.get("mid-linear-ad").push({
                                                                            position: parseFloat(item)
                                                                        });
                                                                    }
                                                                }, this);
                                                            } else {
                                                                if (/^mid$/.test(schedule)) {
                                                                    this.get("mid-linear-ad").push({
                                                                        position: 0.5
                                                                    });
                                                                }
                                                            }
                                                            break;
                                                    }
                                                }, this);
                                            }

                                            if (nonLinearSchedules.length > 0) {
                                                this.set("non-linear-ad", nonLinearSchedules);
                                            }

                                        }, this)
                                        .error(function(err) {
                                            console.log("Error could not be able init adsense container. Err: ", err);
                                        }, this);
                                }
                            }
                        }
                    }
                    if (this.get("playlist")) {
                        var pl0 = (this.get("playlist"))[0];
                        this.set("poster", pl0.poster);
                        this.set("source", pl0.source);
                        this.set("sources", pl0.sources);
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
                    // For Apple it's very important that their users always remain in control of the volume of the sounds their devices emit
                    this.set("hidevolumebar", (Info.isMobile() && Info.isiOS()));
                    this.set("duration", this.get("totalduration") || 0.0);
                    this.set("position", 0.0);
                    this.set("buffered", 0.0);
                    this.set("message", "");
                    this.set("fullscreensupport", false);
                    this.set("csssize", "normal");

                    this.set("loader_active", false);
                    this.set("playbutton_active", false);
                    this.set("controlbar_active", false);
                    this.set("message_active", false);
                    this.set("settingsmenu_active", false);

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
                            paused: true
                        };
                        this.stickyHandler = this.auto_destroy(new StickyHandler(
                            this.activeElement().firstChild,
                            this.activeElement(),
                            stickyOptions
                        ));
                        this.stickyHandler.init();
                        this.set("fadeup", true);
                        this.stickyHandler.on("elementLeftView", function() {
                            this.set("sticktoview", true);
                        }, this);
                        this.stickyHandler.on("containerEnteredView", function() {
                            this.set("sticktoview", false);
                            if (this.get("fadeup") && this.stickyHandler.elementWasDragged()) this.set("fadeup", false);
                        }, this);
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
                    if (this._prerollAd) {
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

                    if (this._postrollAd) {
                        this._postrollAd.weakDestroy();
                        this._postrollAd = null;
                    }
                    this.player = null;
                    this.__video = null;
                    this.set("videoelement_active", false);
                },

                _validateParameters: function() {
                    var fitStrategies = ["crop", "pad", "original"];
                    if (!fitStrategies.includes(this.get("videofitstrategy"))) {
                        console.warn("Invalid value for videofitstrategy: " + this.get("videofitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }
                    if (!fitStrategies.includes(this.get("posterfitstrategy"))) {
                        console.warn("Invalid value for posterfitstrategy: " + this.get("posterfitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }

                    if (this.get("stretch") || this.get("stretchwidth") || this.get("stretchheight")) {
                        console.warn("Stretch parameters were deprecated, your player will stretch to the full container width by default.");
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
                    // Just in case be sure that player's controllers will be hidden
                    video.controls = this.get("showbuiltincontroller");
                    if (!this.get("allowpip"))
                        video.disablePictureInPicture = true;
                    VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: video,
                        onlyaudio: this.get("onlyaudio"), // Will fix only audio local playback bug
                        preload: !!this.get("preload"),
                        loop: !!this.get("loop") || (this.get("lastplaylistitem") && this.get("loopall")),
                        reloadonplay: this.get('playlist') ? true : !!this.get("reloadonplay"),
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
                        this.set("silent_attach", silent || false);

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
                        // If browser is Chrome, and we have manually forcibly muted player
                        if (Info.isChromiumBased() && this.get("forciblymuted")) {
                            video.isMuted = true;
                            Dom.userInteraction(function() {
                                this.set_volume(this.get("initialoptions").volumelevel);
                                if (this.get("volume") > 0.00)
                                    video.isMuted = false;
                                this.set("forciblymuted", false);
                            }, this);
                        }
                        this.player.on("postererror", function() {
                            this._error("poster");
                        }, this);
                        this.player.on("playing", function() {
                            this.set("playing", true);
                            this.trigger("playing");
                            if (this.get("playedonce") === false) {
                                this.set("playbackcount", 1);
                            } else {
                                this.set("playbackcount", this.get("playbackended") + 1);
                            }
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("video", e);
                        }, this);
                        if (this.player.error())
                            this.player.trigger("error", this.player.error());
                        this.player.on("paused", function() {
                            this.set("playing", false);
                            this.trigger("paused");
                        }, this);
                        this.player.on("ended", function() {
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
                            // As duration is credential we're waiting to get duration info
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
                    this.activeElement().classList.add(this.get("csscommon") + "-max-height-100vh");
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
                    // Prevent whitespace browser center scroll and arrow buttons behaviours
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
                    },

                    set_speed: function(speed) {
                        this.player.setSpeed(speed);
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
                            // If settings pop-up is open hide it together with control-bar if hideOnInactivity is true
                            if (this.get('hideoninactivity') && (this.get('activity_delta') > this.get('hidebarafter'))) {
                                this.set("settingsmenu_active", false);
                            }

                            // We need this part run each second not too fater, this.__adControlPosition will control it
                            if (this._adsLoader && this._adProvider && this.__adControlPosition < this.get("position")) {
                                this.__adControlPosition = Math.ceil(this.get("position"));
                                this.__controlAdRolls();
                            }
                        }
                    } catch (e) {}
                    try {
                        // For now it will be implemented only for ads, if in the feateure
                        // will be applied for other features statment could be updated
                        if (this._adsRoll) {
                            var dimensions = this.get("states").dimensions;
                            var _width = this.videoWidth() || this.parentWidth() || Dom.elementDimensions(this.activeElement()).width;
                            var _height = this.videoHeight() || this.parentHeight() || Dom.elementDimensions(this.activeElement()).height;
                            // If any updates will occure
                            if (dimensions.widht === null || (dimensions.height !== _height || dimensions.width !== _width)) {
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
                    if (img && img.height) {
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
                    if (img && img.width) {
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
                    return Objs.map(this.attrs, function(value, key) {
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

                _collectMetaData: function() {
                    var data = {};
                    var rules = [{
                            key: 'meta',
                            scope: document.head,
                            dataKeyType: 'name', // key - this object key, tag - should be key as a tag name, anyAttributeName - if not defined will use key
                            resultKeyType: 'content', // content, innerText
                            rules: "//meta[@name='keywords' or @name='description']" // string or array of rules
                        },
                        {
                            key: 'header',
                            scope: document.body,
                            dataKeyType: 'key',
                            resultKeyType: 'innerText',
                            rules: "//h1[position()=1]"
                        },
                        {
                            key: 'content',
                            scope: document.body,
                            dataKeyType: 'key',
                            resultKeyType: 'innerText',
                            rules: [
                                "//p[parent::div or parent::main or parent::article][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]",
                                "//h2[parent::div or parent::main or parent::article or parent::body][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]",
                                "//h3[parent::div or parent::main or parent::article or parent::body][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]",
                                "//h4[parent::div or parent::main or parent::article or parent::body][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]",
                                "//h5[parent::div or parent::main or parent::article or parent::body][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]",
                                "//h6[parent::div or parent::main or parent::article or parent::body][parent::*[not(parent::a)]][parent::*[parent::*[not(parent::a)]]]"
                            ]
                        }
                    ];

                    if (Objs.count(this.get("collection-xpath-rule")) > 0) {
                        rules = Objs.tree_merge(rules, this.get("collection-xpath-rule"));
                    }

                    Objs.iter(rules, function(rule, index) {
                        if (Types.is_undefined(rule.key) || Types.is_undefined(rule.rules) ||
                            (Types.is_defined(rule.key) && (!Types.is_string(rule.key) || !rule.key)) ||
                            (Types.is_defined(rule.rule) && !(Types.is_string(rule.rules) || Types.is_array(rule.rules)))
                        ) { // ANY nothing condition
                        } else {
                            if (Types.is_array(rule.rules)) {
                                Objs.iter(rule.rules, function(_r) {
                                    this.__xPathSelection(_r, rule, data);
                                }, this);
                            } else {
                                this.__xPathSelection(rule.rules, rule, data);
                            }
                        }

                        if (index === Objs.count(rules) - 1 && Objs.count(data) > 0) {
                            AjaxSupport.execute({
                                method: 'POST',
                                uri: this.get("send-meta-endpoint"),
                                contentType: 'application/json',
                                data: data
                            }).success(function(resp) {
                                this.trigger("metadatasent", data, resp);
                            }, this).error(function(err) {
                                this.trigger("metadatasenterror", err);
                            }, this);
                        }
                    }, this);

                },

                /**
                 *
                 * @param query any xPath rules: https://devhints.io/xpath
                 * @param resultRule:
                 *          {
                 *             key: string,
                 *             scope: Node, // default document.body
                 *             nodeOutputKey: 'content' || 'innerText',
                 *             resultKeyType: 'key' | 'tag' | string: 'anyAttributeName',
                 *          }
                 * @param result any object
                 */
                __xPathSelection: function(query, resultRule, result) {
                    var selected, queries, key, scope, outputKey, resultKeyType;
                    result = Types.is_object(result) ? result : {};
                    key = resultRule.key;
                    scope = resultRule.scope;
                    outputKey = key;
                    resultKeyType = Types.is_undefined(resultRule.resultKeyType) ? 'innerText' : resultRule.resultKeyType;
                    queries = document.evaluate(query, scope || document.body, null, XPathResult.ANY_TYPE, null);

                    while (selected = queries.iterateNext()) {
                        if (typeof resultRule.dataKeyType !== "undefined" && resultRule.dataKeyType) {
                            if (resultRule.dataKeyType === 'tag') {
                                outputKey = selected.nodeName;
                            } else {
                                if (resultRule.dataKeyType !== 'key' && typeof selected.getAttribute('name') !== 'undefined') {
                                    outputKey = selected.getAttribute('name');
                                }
                            }
                        }

                        if (Types.is_undefined(result[outputKey])) result[outputKey] = "";
                        else result[outputKey] += " ";

                        result[outputKey] += selected[resultKeyType];
                    }

                    return result;
                },


                /**
                 * Prepare for postoll and mid roll ad managers
                 * @private
                 */
                __controlAdRolls: function() {
                    // If we have midrolls, then prepare mid Rolls
                    if (
                        (this.get("mid-linear-ad").length > 0 || this.get('non-linear-ad').length > 0) &&
                        this.get("duration") > 0.0 && !this._adsCollection
                    ) {
                        this._adsCollection = this.auto_destroy(new Collection()); // our adsCollections
                        if (this.get("mid-linear-ad").length > 0) {
                            var _current = null;
                            var _nextPositionIndex = null;
                            Objs.iter(this.get("mid-linear-ad"), function(roll, index) {
                                if (roll.position && roll.position > 0) {
                                    // First ad position, if less than 1 it means it's persentage not second
                                    var _position = roll.position < 1 ?
                                        Math.floor(this.get("duration") * roll.position) :
                                        roll.position;
                                    // If user will not set and we will not get the same ad position, avoids dublication,
                                    // prevent very close ads and also wrong set position which exceeds the duration
                                    if ((Math.abs(_position - _current) > 5) && _position < this.get("duration")) {
                                        _current = _position;
                                        _nextPositionIndex = index;
                                        this._adsCollection.add({
                                            position: _position,
                                            duration: null,
                                            type: this._adProvider.__IMA_AD_TYPE_LINEAR,
                                            isLinear: true,
                                            dimensions: {
                                                widht: this.parentWidth(),
                                                height: this.parentHeight()
                                            }
                                        });
                                    }
                                }
                            }, this);
                        }

                        // non linear ads, They can be delivered as text, static image, or interactive rich media.
                        if (this.get("non-linear-ad").length > 0) {
                            Objs.iter(this.get("non-linear-ad"), function(nonLinear) {
                                if (Types.is_defined(nonLinear)) {
                                    if (nonLinear.position && nonLinear.position >= 0) {
                                        var _position = nonLinear.position < 1 ?
                                            Math.floor(this.get("duration") * nonLinear.position) :
                                            nonLinear.position;
                                        var _width = nonLinear.width || this.parentWidth();
                                        var _height = nonLinear.height || this.parentHeight();
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
                                            waitToLoadInSeconds: 5 // We can set diggerent on linear or on non-linear
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
                                // as soon as as is loaded will reset next position data and find a new
                                this._adsRoll.once("adloaded", function(ad) {
                                    if (!ad.isLinear()) {
                                        var _suggestedSeconds = (ad.getMinSuggestedDuration() || this.get("non-linear-min-duration")) + 1;
                                        var _nextPossible = _startedPosition + _suggestedSeconds;

                                        this._adCheckerTimer = new Timers.Timer({
                                            context: this,
                                            fire: function() {
                                                if (this._nextRollPosition) {
                                                    _nextPossible = Math.max(this._nextRollPosition.position, _nextPossible) - 1.5;
                                                    // We need be less than above statement "this._nextRollPosition.position < this.get("position")"
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
                                    if (!this.get("playing") && !this.get("manuallypaused") && ad.isLinear())
                                        this.player.play();
                                }, this);

                                this._adsRoll.once("adfinished", function(ad) {
                                    if (this._adsRoll) this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    if (!this.get("playing") && !this.get("manuallypaused"))
                                        this.player.play();
                                }, this);

                                this._adsRoll.on("ad-error", function(message) {
                                    console.error('Error during loading an ad. Details:"' + message + '".');
                                    if (this._adsRoll) this._adsRoll.weakDestroy();
                                    this._adsRoll = null;
                                    if (!this.get("playing") && !this.get("manuallypaused"))
                                        this.player.play();
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

                    // If we've set mid roll position:
                    if (this._nextRollPosition && !this._adsRoll) {
                        if (this._nextRollPosition.type) {
                            this._adsRoll = this._adProvider._newAdsRequester(
                                this, this._nextRollPosition.type, false
                            );
                            var _nextPosition = this._nextRollPosition;
                            this._adsRoll.executeAd({
                                width: _nextPosition.dimensions.width || this.parentWidth(),
                                height: _nextPosition.dimensions.height || this.parentHeight(),
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