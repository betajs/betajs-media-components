Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Assets",
    "module:DatasetProperties",
    "module:FloatHandler",
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
    "base:Maths",
    "base:Time",
    "base:Timers",
    "base:Promise",
    "base:TimeFormat",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Async",
    "base:Functions",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates",
    "browser:Events"
], [
    "module:Ads.Dynamics.Player",
    "module:Common.Dynamics.Settingsmenu",
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Share",
    "module:VideoPlayer.Dynamics.Next",
    "module:VideoPlayer.Dynamics.Controlbar",
    "module:VideoPlayer.Dynamics.Topmessage",
    "module:VideoPlayer.Dynamics.Tracks",
    "module:VideoPlayer.Dynamics.Sidebar",
    "module:VideoPlayer.Dynamics.Tooltip",
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
    "module:VideoPlayer.Dynamics.PlayerStates.Outstream",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadAds",
    "module:VideoPlayer.Dynamics.PlayerStates.PlayOutstream",
    "module:VideoPlayer.Dynamics.PlayerStates.PlayAd",
    "module:VideoPlayer.Dynamics.PlayerStates.PrerollAd",
    "module:VideoPlayer.Dynamics.PlayerStates.MidrollAd",
    "module:VideoPlayer.Dynamics.PlayerStates.PostrollAd",
    "module:VideoPlayer.Dynamics.PlayerStates.PosterError",
    "module:VideoPlayer.Dynamics.PlayerStates.LoadVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.PlayVideo",
    "module:VideoPlayer.Dynamics.PlayerStates.NextVideo"
], function(Class, Assets, DatasetProperties, FloatHandler, StylesMixin, TrackTags, Info, Dom, VideoPlayerWrapper, Broadcasting, PlayerSupport, Types, Objs, Strings, Collection, Maths, Time, Timers, Promise, TimeFormat, Host, ClassRegistry, Async, Functions, InitialState, PlayerStates, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/player.html') %>",

                attrs: function() {
                    return {
                        /* CSS */
                        brightness: 0,
                        current_video_from_playlist: 0,
                        debug_ima: false,
                        next_video_from_playlist: 0,
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
                        "testid": "ba-testid",
                        "width": "",
                        "height": "",
                        "presetkey": null,
                        "availablepresetoptions": {},
                        "showsidebargallery": false,
                        "sidebaroptions": {
                            // percentage by default, or could be in px
                            "presetwidth": 30,
                            "afteradsendtext": null,
                            "gallerytitletext": null,
                            "headerlogourl": null,
                            "headerlogoimgurl": null,
                            "headerlogoname": null,
                            "fluid": false, // when set to true, when we have no presetwidth, then sidebar will be changed based on video width
                            "preferredratio": 1.778, // if set, then sidebar will be resized based on video container ratio, 16/9(=1.778), 4/3(1.333), 1/1, 9/16(0.5625), 3/4(0.75)
                            // if set to true, companion ad will be shown on sidebar if it's exits
                            "showcompanionad": false,
                            "hidevideoafterplay": false,
                            "autonext": true,
                            // Currently it's playing next video in the list, but if required watch next un-watched one, set it as true
                            "nextunplayed": false
                        },
                        "popup-width": "",
                        "popup-height": "",
                        "aspectratio": null,
                        "fallback-aspect-ratio": "1280/720",
                        "floating-fallback-mobile-height": 75,
                        "floating-fallback-desktop-height": 240,
                        performanceprefix: `ba-player-perf`,
                        performancerecords: [],
                        // can be applied only some nodes, https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/elementtiming
                        performancerendertiming: [`ba-player-video`, `ba-player-poster`],
                        performanceobservedtypes: ["measure", "mark", "navigation", "element"],
                        performancerecordeditems: [{
                                type: `mark`,
                                keys: [`duration`, `startTime`],
                            },
                            {
                                type: `measure`,
                                keys: [`duration`],
                            },
                            {
                                type: `navigation`,
                                keys: [`domInteractive`, `loadEventEnd`, `domComplete`]
                            },
                            {
                                type: `element`,
                                keys: [`loadTime`, `naturalHeight`, `naturalWidth`, `renderTime`]
                            }
                        ],
                        /* Themes */
                        "theme": "",
                        "csstheme": "",
                        "themecolor": "",
                        /* Dynamics */
                        "dynadscontrolbar": "ads-controlbar",
                        "dynadsplayer": "adsplayer",
                        "dynplaybutton": "videoplayer-playbutton",
                        "dynloader": "videoplayer-loader",
                        "dynmessage": "videoplayer-message",
                        "dyntopmessage": "videoplayer-topmessage",
                        "dyncontrolbar": "videoplayer-controlbar",
                        "dynshare": "videoplayer-share",
                        "dyntracks": "videoplayer-tracks",
                        "dynsidebar": "videoplayer-sidebar",
                        "dynsettingsmenu": "common-settingsmenu",
                        "dyntrimmer": "videorecorder-trimmer",
                        "dynnext": "videoplayer-next",
                        "dyntooltip": "videoplayer-tooltip",

                        /* Templates */
                        "tmpladcontrolbar": "",
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
                        "showlearnmorebutton": false,
                        "source": "",
                        "sources": [],
                        "sourcefilter": {},
                        "state": "",
                        "streams": [],
                        "currentstream": null,
                        "hasnext": false,
                        "playlist": null,
                        "volume": 1.0,
                        "title": "",
                        "description": "",
                        "upload_date": "",
                        "uploaddate": "",
                        "content_url": "",
                        "thumbnail_url": "",
                        "contenturl": "",
                        "thumbnailurl": "",
                        "initialseek": null,
                        "sharevideo": [],
                        "sharevideourl": "",
                        "share_active": true,
                        "visibilityfraction": 0.8,

                        /* Configuration */
                        "reloadonplay": false,
                        "ias-config": undefined,
                        "playonclick": true,
                        "pauseonclick": true,
                        "unmuteonclick": false,
                        "muted": false,
                        "nextwidget": false,
                        "shownext": 3,
                        "noengagenext": 5,
                        "stayengaged": false,
                        "next_active": false,
                        "max_shortform_video_duration": 600, // 10 min in seconds https://support.google.com/google-ads/answer/2382886?hl=en#:~:text=Shortform%20videos%20are%20under%2010,or%20longform%20videos%2C%20or%20both.
                        /** tooltip
                         {
                         "tooltiptext": null,
                         "closeable": false,
                         "position": "top-right", // default: "top-right", other options: top-center, top-left, bottom-right, bottom-center, bottom-left
                         "pauseonhover": false, //  default: false
                         "disappearafterseconds": 2 // -1 will set it as showing always, default: 2 seconds
                         "showprogressbar": true, // default: false, will show progressbar on tooltip completion
                         "showonhover": false, // TODO: will be shown on hover only
                         "queryselector": null // TODO: will be shown on hover only on this element
                         }
                         */
                        "presetedtooltips": {
                            "onplayercreate": null,
                            // "onclicktroughexistence": {
                            //     "tooltiptext": "Click again to learn more",
                            //     "disappearafterseconds": 5
                            // }
                        },

                        /* Ads */
                        "adprovider": null,
                        "preroll": false,
                        "outstream": false,
                        "outstreamoptions": {}, // can be false, string (example: '10px', '10') or numeric
                        "imasettings": {},
                        "imaadsrenderingsetting": {},
                        "adtagurl": null,
                        "adchoiceslink": null,
                        "adtagurlfallbacks": '',
                        "pause_ads_on_float_close": false,
                        "nextadtagurls": [],
                        "inlinevastxml": null,
                        "midrollminintervalbeforeend": 5,
                        "mindurationnext": 0, // when set to 0, mindurationnext is equal to noengagenext. Can be disabled by setting it to -1
                        "hidebeforeadstarts": true, // Will help hide player poster before ads start
                        "hideadscontrolbar": false,
                        "adsposition": null,
                        "vmapads": false, // VMAP ads will set pre, mid, post positions inside XML file
                        "non-linear": null,
                        "adsunmuted": false,
                        // **
                        // companionad: {
                        //  hideoncompletion: true, // FEATURE: default: true, should hide when ad is completed
                        //  timeout: null, // FEATURE:: default: null, timeout in milliseconds when should be hidden
                        //  "locations": [{
                        //      id: 'ID', // required, ID of the companion ad slot
                        //      adslotid: 'adslotid'
                        //      selector: 'selector' // required, CSS selector,
                        //      timeout: null, // FEATURE: default: null, timeout in milliseconds when should be hidden
                        //   }]
                        // }
                        "companionad": null, // if just set to true, it will set companionads attribute for further use cases and will not render companion ad
                        "companionads": [],
                        "adsrendertimeout": null,
                        preload_ads: true,
                        ads_source_init_timeout: null, // we can set any microseconds to show player content in any case if ads not initialized
                        "linearadplayer": true,
                        "customnonlinear": false, // Currently, not fully supported
                        "minadintervals": 5,
                        "non-linear-min-duration": 10,
                        "midrollads": [],
                        "adchoicesontop": true,
                        "mobilebreakpoint": 560,
                        // Accept Interface AdsRequestInterface properties from IMA SDK
                        /**
                         * all vendors could be listed from `google.ima.OmidVerificationVendor` enum
                         * all access modes could be listed from `google.ima.OmidAccessMode` enum
                         * example:*
                         * ads_request_options: {
                         *     adsResponse: 'VAST XML test', // if inlinevastxml was set, this one will be overwritten
                         *     omidAccessModeRules: {
                         *         'OmidVerificationVendor.GOOGLE': 'OmidAccessMode.FULL' or 9: 'full', // which is equal: google.ima.OmidVerificationVendor.GOOGLE: google.ima.OmidAccessMode.FULL,
                         *         'OmidVerificationVendor.OTHER': 'OmidAccessMode.LIMITED' or 1: 'limited',// which is equal: google.ima.OmidVerificationVendor.OTHER: google.ima.OmidAccessMode.LIMITED,
                         *         'OmidVerificationVendor.MOAT': 'OmidAccessMode.DOMAIN' or 2: 'domain' // which is equal: google.ima.OmidVerificationVendor.MOAT: google.ima.OmidAccessMode.DOMAIN,
                         *     }
                         * }
                         */
                        ads_request_options: {},

                        /* Options */
                        "allowpip": true, // Picture-In-Picture Mode
                        "rerecordable": false,
                        "submittable": false,
                        "autoplay": false,
                        "autoplaywhenvisible": false,
                        "continuousplayback": true,
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
                        "airplay": false,
                        "chromecast": false,
                        "broadcasting": false,
                        "chromecastreceiverappid": null, // Could be published custom App ID https://cast.google.com/publish/#/overview
                        "skipseconds": 5,
                        // floating options
                        "floating": false,
                        "sticky": false, // Deprecated
                        "sticky-starts-paused": true, // Deprecated
                        "sticky-threshold": undefined, // Deprecated
                        "floatingoptions": {
                            "starts-paused": true,
                            "threshold": undefined,
                            "sidebar": true, // show sidebar
                            "floatingonly": false, // hide and show on video player based on view port
                            "closeable": true, // show close button
                            "hideplayeronclose": false, // hide player container in the content if floating player was closed
                            "showcompanionad": false, // if set to true, companion ad will be shown on sidebar if it's exitst
                            // "fluidsidebar": true, // TODO: not works for now, if false, 50% width will be applied on sidebar
                            "desktop": {
                                "position": "bottom-right", // position of floating video player for desktop
                                "bottom": 30,
                                "sidebar": false,
                                "companionad": false

                                /** optional settings */
                                // "height": number,
                                // "size": null", // any key
                                // "availablesizes": {
                                //     'key1': heightInNumber, 'key2': heightInNumber2, ...
                                // }
                            },
                            "mobile": {
                                "position": "top", // positions of floating video player for mobile
                                "sidebar": true,
                                "companionad": true,
                                "positioning": {
                                    "relativeSelector": null, // To be able to work positioning option, correct selector should be provided (Example: div#header)
                                    "applySelector": 'div.ba-player-floating', // could be changed if you require
                                    "applyProperty": 'margin-top' // will apply height of the relativeSelector
                                }
                                /** optional settings */
                                // "height": number,
                                // "size": null", // any key
                                // "availablesizes": {
                                //     'key1': heightInNumber, 'key2': heightInNumber2, ...
                                // }
                            }
                        },
                        "tracktags": [],
                        "tracktagsstyled": true,
                        "tracktaglang": 'en',
                        "tracktextvisible": false,
                        "tracksshowselection": false,
                        "autoenabledtracktags": [], // options: subtitles, captions, descriptions, chapters, or metadata
                        "showchaptertext": true,
                        "thumbimage": {},
                        "thumbcuelist": [],
                        "showduration": false,
                        "infiniteduration": false,
                        "showsettings": true,
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
                        "adsplaying": false,
                        "adshassource": false,
                        "showbuiltincontroller": false,
                        "airplaybuttonvisible": false,
                        "castbuttonvisble": false,
                        "fullscreened": false,
                        // As "initialoptions" we're setting options which were set by user, but could be required to be restored
                        // also setting which we want to be predefined as a default settings and users are not set them
                        "initialoptions": {
                            // below settings are will be store for further use-cases
                            "hideoninactivity": null,
                            "volumelevel": null,
                            "autoplay": null,
                            "adsrendertimeout": null,
                            ads_source_init_timeout: null,
                            autoenabledtracktags: null,
                            autoplaywhenvisible: null,
                            // below are default settings
                            "outstreamoptions": {
                                hideOnCompletion: true,
                                numOfRetriesOnError: 0, // # of retries on adError before falling back to `recurrenceperiod` interval from `immediate`.
                                recurrenceperiod: 30000, // Period when a new request will be sent if ads is not showing, default: 30 seconds
                                maxadstoshow: -1, // Maximum number of ads to show, if there's next ads or errors occurred default: -1 (unlimited)
                                noEndCard: false, // No end cart at the end when outstream completed
                                allowRepeat: true, // Make possible to repeat ads
                                // firstframeasendcard: '', // to capture first frame and show as endcard background
                                // moredetailslink: '', // more button URL
                                // moreText: '', // read more about outstream text
                                // repeatText: '', // repeat button text
                                persistentcompanionad: false
                            },
                            imaadsrenderingsetting: {
                                enablePreloading: true,
                                useStyledNonLinearAds: true,
                                restoreCustomPlaybackStateOnAdBreakComplete: true, // This is setting is used primarily when the publisher passes in its content player to use for custom ad playback.
                                // loadVideoTimeout: -1, // use -1 for the default of 8 seconds
                                // Specifies whether the UI elements that should be displayed.
                                // The elements in this array are ignored for AdSense/AdX ads.
                                uiElements: [], // (null or non-null Array of string)
                                // autoAlign: boolean,
                                // bitrate: number,
                                // mimeTypes: null or non-null Array of string
                                // playAdsAfterTime: number
                                // useStyledLinearAds: boolean // Render linear ads with full UI styling. This setting does not apply to AdSense/AdX ads or ads played in a mobile context
                                // useStyledNonLinearAds: boolean // Render non-linear ads with a close and recall button.
                            }
                            // rollback: {}
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
                        "userengagedwithplayer": false,
                        "userhadplayerinteraction": false,
                        // If settings are open and visible
                        "states": {
                            floatingclosed: false,
                            "poster_error": {
                                "ignore": false,
                                "click_play": true
                            },
                            "dimensions": {
                                "width": null,
                                "height": null
                            },
                            "hiddenelement": {
                                "visible": true
                            }
                        },
                        "computedstyles": {},
                        "placeholderstyle": "",
                        "hasplaceholderstyle": false,
                        "playerorientation": undefined,
                        // Reference to Chrome renewed policy, we have to set up mute for autoplaying players.
                        // If we do it forcibly, then we will set as true
                        "forciblymuted": false,
                        "autoplay-requires-muted": true,
                        "autoplay-requires-playsinline": null,
                        // When volume was unmuted, by the user himself, not automatically
                        "volumeafterinteraction": false,
                        "prominent-title": false,
                        "closeable-title": false,
                        "showadchoices": true,
                        "unknownadsrc": false,
                    };
                },

                types: {
                    "allowpip": "boolean",
                    "debug_ima": "boolean",
                    "hidecontrolbar": "boolean",
                    "muted": "boolean",
                    "nextwidget": "boolean",
                    "shownext": "float",
                    "state": "string",
                    "noengagenext": "float",
                    "unmuteonclick": "boolean",
                    "rerecordable": "boolean",
                    "loop": "boolean",
                    "loopall": "boolean",
                    "autoplay": "boolean",
                    "autoplaywhenvisible": "boolean",
                    "infiniteduration": "boolean",
                    "continuousplayback": "boolean",
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
                    "showlearnmorebutton": "boolean",
                    "aspectratio": "float",
                    "fallback-aspect-ratio": "string",
                    "outstreamoptions": "json",
                    "initialseek": "float",
                    "fullscreened": "boolean",
                    "ias-config": "json",
                    "sharevideo": "array",
                    "sharevideourl": "string",
                    "playfullscreenonmobile": "boolean",
                    "themecolor": "string",
                    "totalduration": "float",
                    "playwhenvisible": "boolean",
                    "playedonce": "boolean",
                    "disablepause": "boolean",
                    "disableseeking": "boolean",
                    "playonclick": "boolean",
                    "pauseonclick": "boolean",
                    "airplay": "boolean",
                    "airplaybuttonvisible": "boolean",
                    "chromecast": "boolean",
                    "chromecastreceiverappid": "string",
                    "skipseconds": "integer",
                    "floating": "boolean",
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
                    "showsettingsmenu": "boolean",
                    "showduration": "boolean",
                    "visibilityfraction": "float",
                    "showchaptertext": "boolean",
                    "title": "string",
                    "description": "string",
                    "upload_date": "string",
                    "uploaddate": "string",
                    "content_url": "string",
                    "thumbnail_url": "string",
                    "contenturl": "string",
                    "thumbnailurl": "string",
                    "videofitstrategy": "string",
                    "posterfitstrategy": "string",
                    "adtagurl": "string",
                    "adchoiceslink": "string",
                    "adtagurlfallbacks": "string",
                    "nextadtagurls": "array",
                    "hideadscontrolbar": "boolean",
                    "inlinevastxml": "string",
                    "imasettings": "jsonarray",
                    "adsposition": "string",
                    "non-linear": "string",
                    "adchoicesontop": "boolean",
                    "minadintervals": "int",
                    "non-linear-min-duration": "int",
                    "slim": "boolean",
                    "prominent-title": "boolean",
                    "closeable-title": "boolean",
                    "floatingoptions": "jsonarray",
                    "presetedtooltips": "object",
                    "presetkey": "string",
                    "availablepresetoptions": "object",
                    "showsidebargallery": "boolean",
                    // Will help hide player poster before ads start,
                    // if false rectangle with full dimensions will be shown
                    "hidebeforeadstarts": "boolean",
                    // "companionad": "string", can be also boolean, object and null
                    "sidebaroptions": "object",
                    "showadchoices": "boolean",
                    "unknownadsrc": "boolean",
                    "adsrendertimeout": "int",
                    "imaadsrenderingsetting": "object",
                    performanceprefix: "string",
                    performancerendertiming: "array",
                    performanceobservedtypes: "jsonarray",
                    performancerecordeditems: "array",
                    autoenabledtracktags: "array",
                    ads_source_init_timeout: "number"
                },

                __INTERACTION_EVENTS: ["click", "mousedown", "touchstart", "keydown", "keypress"],

                extendables: ["states"],

                registerchannels: ["ads", "next"],

                scopes: {
                    adsplayer: ">[tagname='ba-adsplayer']",
                    settingsmenu: ">[tagname='ba-common-settingsmenu']",
                    floatingsidebar: ">[tagname='ba-videoplayer-sidebar']"
                },

                collections: {
                    tooltips: {}
                },

                events: {
                    "change:upload_date": function(value) {
                        if (typeof value === "number")
                            this.set("upload_date", TimeFormat.format("yyyy-mm-dd", value * 1000));
                    },
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
                    },
                    "change:position": function(position, old) {
                        if (this.get("userengagedwithplayer") && this.get("nextwidget") && !this.get("next_active"))
                            return;

                        if (!this.get("nextwidget") || this.get("stayengaged") || this.get("adsplaying"))
                            return;
                        if (position - old > 1) return this.channel("next").trigger("setStay");
                        const thisPlaylist = this.get("playlist");
                        if (Array.isArray(thisPlaylist) && thisPlaylist.length > 0) {
                            // do not autoPlayNext if the only video on sidebar playlist is the current video playing
                            if (thisPlaylist.length === 1 && thisPlaylist[0].title === this.get('title')) return;
                            const showNextTime = Number(this.get("shownext")) || 0;
                            const engageTime = showNextTime + (Number(this.get("noengagenext")) || 0);
                            let minDurationNext = this.get("mindurationnext");
                            if (!minDurationNext) minDurationNext = engageTime;

                            if (this.get("duration") >= minDurationNext && showNextTime && position > showNextTime && !this.get("next_active")) {
                                this.set("next_active", true);
                            }


                            if (this.get("duration") >= minDurationNext && position > engageTime && engageTime > 0) {
                                this.channel("next").trigger("autoPlayNext");
                                this.channel("next").trigger("playNext", true);
                            }
                        }
                    },
                    "change:volume": function(volume) {
                        if (this.isBroadcasting()) this._broadcasting.player.trigger("change-google-cast-volume", volume);
                        if (this.videoLoaded()) {
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0);
                        }
                        this.set("muted", volume === 0);
                    },
                    "change:muted": function(muted) {
                        // muted can be only boolean value
                        if (!Types.is_boolean(muted)) return;
                        if (this.player) {
                            this.player.setMuted(muted);
                        } else if (this.__video) {
                            this.__video.mute = muted;
                        }
                    },
                    "change:companionads": function(companionAds) {
                        if (this.__repeatOutstream && this.get("outstreamoptions.persistentcompanionad"))
                            return;
                        if (companionAds && companionAds.length > 0 && this.get("companionad")) {
                            if (this.get("companionad.locations")) {
                                this._renderMultiCompanionAds();
                            } else if (this.scopes.adsplayer && Types.is_string(this.get("companionad")) || Types.is_boolean(this.get("companionad"))) {
                                this.scopes.adsplayer.execute('renderCompanionAd', this.get("ad"), this.get("companionad"));
                            } else {
                                console.warn(`Please set correct companion ad attribute. It can be object with locations, string with "|" character seperated or boolean`);
                            }
                        }
                    },
                    "change:tracktags": function() {
                        if (this.__trackTags) {
                            this.__trackTags.reload();
                        } else {
                            if (this.__video) {
                                this.__trackTags = new TrackTags({}, this);
                            } else {
                                if (this.player) {
                                    this.player.once("loaded", function() {
                                        if (this.__video && !this.__trackTags) {
                                            this.__trackTags = new TrackTags({}, this);
                                        }
                                    }, this);
                                }
                            }
                        }
                    }
                },
                channels: {
                    "next:setStay": function() {
                        this.set("stayengaged", true);
                        this.set("next_active", false);
                        this.setPlayerEngagement();
                    },
                    "next:playNext": function(automaticallyOnTimeout) {
                        this.trigger("play_next");
                        this.set("next_active", false);
                        if (!automaticallyOnTimeout) this.setPlayerEngagement();
                    },
                    "next:resetNextWidget": function() {
                        this.set("stayengaged", false);
                        this.set("next_active", false);
                    }
                },

                computed: {
                    "aspectRatioFallback:aspectratio,fallback-aspect-ratio": function(aspectRatio, fallback) {
                        const f = fallback.split("/");
                        return {
                            paddingTop: 100 / (aspectRatio || (f[0] / f[1])) + "%"
                        };
                    },
                    "hide_sidebar:with_sidebar,is_floating,showsidebargallery,playlist": function(
                        withSidebar, isFloating, showSidebarGallery, playlist
                    ) {
                        if (!showSidebarGallery && Types.is_defined(this.get("initialoptions.nextwidget"))) {
                            this.set("nextwidget", this.get("initialoptions.nextwidget"));
                        }
                        const showSidebar = (withSidebar && isFloating) || (showSidebarGallery && (playlist && playlist.length >= 0));
                        if (this.get("sidebar_active") !== true && showSidebar) {
                            this.set("sidebar_active", true);
                        }
                        // we can activate only once, after we should hide sidebar
                        return !showSidebar;
                    },
                    "show_sidebar:outstream,hide_sidebar,is_floating,with_sidebar,fullscreened,mobileviewport": function(
                        outstream, hideSidebar, isFloating, withSidebar, fullscreened, mobileViewport
                    ) {
                        if (fullscreened) return false;
                        this.set("floatingsidebar", !hideSidebar && isFloating && withSidebar);
                        this.set("gallerysidebar", !hideSidebar && !isFloating && (Types.is_defined(mobileViewport) && !mobileViewport) && !outstream);
                        if (this.get("gallerysidebar")) {
                            if (!this.get("nextwidget") && Types.is_undefined(this.get("initialoptions.nextwidget"))) {
                                this.set("initialoptions.nextwidget", false);
                            }
                            this.set("nextwidget", this.get("sidebaroptions.autonext"));
                        }
                        return this.get("floatingsidebar") || this.get("gallerysidebar");
                    },
                    "adsinitialized:adtagurl,inlinevastxml": function(adsTagURL, inlineVastXML) {
                        if ((!!adsTagURL || !!inlineVastXML) && !this.get("adshassource")) {
                            this.set("adshassource", true);
                            this.stopAdsSourceSetupChecker(true);
                            // If we're already not set timer for ads failure, and we have some ads source
                            // start set it here. Possible other options are via Header bidding services like Prebid
                            this.initAdsRenderFailTimeout();
                            // On error, we're set initialized to true to prevent further attempts
                            this.once("ads:ad-error", function() {
                                this.set("adsinitialized", true);
                            }, this);
                        } else return false;
                    },
                    "hideplayer:autoplay,autoplaywhenvisible,adshassource,adsinitialized,hidden,hidebeforeadstarts": function(
                        autoplay,
                        autoplaywhenvisible,
                        adshassource,
                        adsinitialized,
                        hidden,
                        hidebeforeadstarts
                    ) {
                        if (this.get("floatingoptions.floatingonly")) {
                            this.set("autoplaywhenvisible", false);
                        }
                        if (Types.is_defined(hidden)) return hidden;
                        if (!autoplay && !autoplaywhenvisible) return false;
                        if (autoplay || !autoplaywhenvisible) return false;
                        if (hidebeforeadstarts && adshassource) return !adsinitialized;
                        return false;
                    },
                    "containerSizingStyles:computedstyles,is_floating": function(styles, isFloating) {
                        if (!styles?.activeElement) return {};
                        let {
                            player,
                            sidebar,
                            floating,
                            container,
                            aspectRatio,
                            activeElement,
                        } = styles;

                        if (isFloating) {
                            player = floating.player || {};
                            sidebar = floating.sidebar || {};
                            container = floating.container || {};
                            if (container.width && container.height && container.aspectRatio) {
                                delete container.aspectRatio;
                            }
                            this.resetResizeObserver(this.activeElement()?.firstChild);
                        } else {
                            if (aspectRatio) {
                                this.set("aspect_ratio", aspectRatio);
                                container.aspectRatio = aspectRatio;
                                activeElement.aspectRatio = aspectRatio;
                            } else if (container.height) {
                                activeElement.height = container.height;
                            }
                            this.__lastActiveElementStyles = this._applyStyles(this.activeElement(), activeElement, this.__lastActiveElementStyles);
                            this.resetResizeObserver(this.activeElement());
                        }
                        if (container.width && container.height && container.aspectRatio) {
                            this.set(`aspect_ratio`, null);
                            delete container.aspectRatio;
                        }
                        this.set("sidebarstyles", sidebar);
                        this.set("playercontainerstyles", player);
                        Functions.debounce(() => {
                            this._styleApplyingLocked = false;
                            this.trigger("resize", {
                                width: container.width,
                                height: container.height
                            });
                        }, 10)();
                        this._styleApplyingLocked = true;
                        return container;
                    },
                    "cssfloatingclasses:floatingoptions.desktop.position,floatingclosed": function(position, closed) {
                        if (closed) return "";
                        return [
                            this.get("cssplayer") + "-floating",
                            this.get("csscommon") + "-sticky",
                            this.get("csscommon") + "-sticky-" + position || "bottom-right",
                            this.floatHandler && this.floatHandler.elementWasDragged() ? "ba-commoncss-fade-up" : ""
                        ].join(" ");
                    },
                    "buffering:buffered,position,last_position_change_delta,playing": function(buffered, position, ld, playing) {
                        if (playing) this.__playedStats(position, this.get("duration"));
                        return playing && buffered < position && ld > 1000;
                    },
                    "is_floating:view_type,fullscreened": function(view_type, fullscreened) {
                        if (fullscreened) return false;
                        return view_type === "float" || (view_type && this.get("floatingoptions.floatingonly"));
                    },
                    "layout:mobileviewport": function(mobileviewport) {
                        this.applyPresets(mobileviewport);
                        return mobileviewport ? "mobile" : "desktop";
                    },
                    "placement:outstream": function(outstream) {
                        return outstream ? "outstream" : "instream";
                    },
                    "quartile:passed-quarter,playing": function(passedQuarter, playing) {
                        if (this.get("position") === 0 && !playing) return null;
                        return ["first", "second", "third", "fourth"][passedQuarter];
                    },
                    "orientation:videowidth,videoheight,fallback-aspect-ratio": function(videoWidth, videoHeight, fallbackAspectRatio) {
                        const fallbackDimensions = fallbackAspectRatio.split("/");
                        const width = videoWidth || fallbackDimensions[0];
                        const height = videoHeight || fallbackDimensions[1];
                        if (width === height) return "square";
                        return width > height ? "landscape" : "portrait";
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    this._performanceObserver = new PerformanceObserver(
                        (...args) => this.__performanceObserverFunc.apply(this, args)
                    );
                    this._performanceObserver.observe({
                        // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
                        entryTypes: ["measure", "mark", "navigation", "element"]
                    });

                    if (this.get("autoplaywhenvisible")) {
                        this.set("autoplay", true);
                        Dom.onScrollIntoView(this.activeElement().firstChild, this.get("visibilityfraction"), function() {
                            if (this.destroyed()) return;
                            this.set("autoplaywhenvisible", false);
                        }, this);
                    } else {
                        if (!this.get("autoplay") && this.get("volume") > 0 && !this.get("unmuteonclick")) {
                            this.set("muted", false);
                            this.set("adsunmuted", true);
                        }
                    }

                    if (this.get("unmuteonclick")) {
                        this.on("change:adsplaying", function(adsplaying) {
                            if (adsplaying) {
                                this.set("unmuteonclick", false);
                                if (this.get("volume") > 0) this.set("adsunmuted", true);
                            } else if (this.get("muted") || this.get("volume") === 0) {
                                this.set("unmuteonclick", true);
                            }
                        }, this);
                    }

                    this.__attachPlayerInteractionEvents();
                    this.set('clearDebounce', 0);
                    this.__mergeDeepAttributes();
                    this.__mergeWithInitialOptions();
                    this._dataset = this.auto_destroy(new DatasetProperties(this.activeElement()));
                    this._dataset.bind("layout", this.properties());
                    this._dataset.bind("placement", this.properties());
                    this._dataset.bind("quartile", this.properties());
                    this._dataset.bind("adsquartile", this.properties());
                    this._dataset.bind("adsplaying", this.properties());
                    this._dataset.bind("visibility", this.properties(), {
                        secondKey: "view_type"
                    });
                    this._dataset.bind("orientation", this.properties());
                    if (typeof this.get("showsettings") !== "undefined")
                        this.set("showsettingsmenu", this.get("showsettings"));
                    this.delegateEvents(null, this.channel("ads"), "ad");
                    this.delegateEvents(null, this.channel("next"), "next");
                    this.set("prominent_title", this.get("prominent-title"));
                    this.set("closeable_title", this.get("closeable-title"));
                    this.__initFloatingOptions();
                    this._activeElementResizeObserver = new ResizeObserver(function(entries) {
                        for (let i = 0; i < entries.length; i++) {
                            if (!this._styleApplyingLocked) {
                                this.__computeContainersStyleStates(entries[i]?.contentRect);
                            }
                        }
                    }.bind(this));
                    this.initAdSources();
                    this._validateParameters();
                    // Will set volume initial state
                    this.set("initialoptions", Objs.tree_merge(this.get("initialoptions"), {
                        volumelevel: this.get("volume"),
                        autoplay: this.get("autoplay"),
                    }));
                    //Will set initial state
                    this.set("sidebaroptions", Objs.tree_merge(this.get("sidebaroptions"), {
                        autonext: this.get("nextwidget"),
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
                        // In Safari Desktop can cause trouble on preload, if the user will
                    }

                    if (this.get("presetedtooltips") && this.get("presetedtooltips.onplayercreate")) {
                        this.showTooltip(this.get("presetedtooltips.onplayercreate"));
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
                    this.set("mobileviewport", this.__isInMobileViewport());
                    this.applyPresets(this.get("mobileviewport"));
                    this.set("hasnext", this.get("loop") || this.get("loopall") || this.get("playlist") && this.get("playlist").length > 1);
                    // For Apple, it's very important that their users always remain in control of the volume of the sounds their devices emit
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
                    this.set("with_sidebar", false);
                    this.set('isAndroid', (Info.isMobile() && !Info.isiOS()))
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

                    this.host = this.auto_destroy(new Host({
                        stateRegistry: new ClassRegistry(this.cls.playerStates())
                    }));
                    this.host.dynamic = this;
                    this.set("state", this._initialState.classname ? this._initialState.classname.split(".").slice(-1)[0] : this._initialState);
                    this.host.on("next", function(state) {
                        this.set("state", state);
                    }, this);
                    this.host.initialize(this._initialState);

                    this.__adsControlPosition = 0;
                    this._timer = this.auto_destroy(new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 100,
                        start: true
                    }));
                    this.activeElement().style.setProperty("display", "flex");

                    // to detect only video playing container dimensions, when there also sidebar exists
                    this.__playerContainer = this.activeElement().querySelector("[data-selector='ba-player-container']");

                    this._activeElementResizeObserver.observe(this.activeElement());
                    this.__initFloatingOptions();
                    this.__initResizeSensitiveAttributes();

                    // Init the number of outstream ad error retries on immediate requests.
                    if (this.get('outstream') && this.get('outstreamoptions.recurrenceperiod') === 0) {
                        this.setImmediateOutstreamRequests(true);
                    }
                },

                /**
                 * Global Method, can be used when using some bidding parameters as well
                 * initAdsRenderFailTimeout
                 */
                initAdsRenderFailTimeout: function() {
                    const renderTimeout = Number(this.get("adsrendertimeout"));
                    let repeatMicroseconds = 200;
                    if (!this.__adsRenderFailTimer && renderTimeout && renderTimeout > 0) {
                        if (renderTimeout < repeatMicroseconds) {
                            repeatMicroseconds = renderTimeout;
                        }
                        this.__adsRenderFailTimer = new Timers.Timer({
                            fire: function() {
                                // we're setting adsplaying true when
                                if (this.get("adsplaying")) {
                                    // we're not resetting adsrendertimeout, as it's also will apply to the loadVideoTimeout
                                    this.stopAdsRenderFailTimeout();
                                }
                                const _timer = this.get("adsrendertimeout");
                                if (_timer > 0) {
                                    this.set("adsrendertimeout", _timer - repeatMicroseconds);
                                    return;
                                }
                                // If after passing the time, ads still not playing, we should trigger an error
                                this.channel("ads").trigger("render-timeout");
                                this.breakAdsManually(true);
                            }.bind(this),
                            delay: repeatMicroseconds,
                            start: true,
                            context: this
                        });
                        this.auto_destroy(this.__adsRenderFailTimer);
                    }
                },

                /**
                 * Global Method, will reset ads fail timeout with a new function
                 */
                resetAdsRenderFailTimeout: function() {
                    if (this.__adsRenderFailTimer) {
                        this.stopAdsRenderFailTimeout(true);
                        this.initAdsRenderFailTimeout();
                        return;
                    }
                    this.initAdsRenderFailTimeout();
                },

                /**
                 * Clear ads fail timout
                 */
                stopAdsRenderFailTimeout: function(reset) {
                    reset = reset || false;
                    if (reset)
                        this.set("adsrendertimeout", this.get("initialoptions.adsrendertimeout"));
                    if (!this.__adsRenderFailTimer) return;
                    if (!this.__adsRenderFailTimer.destroyed()) {
                        this.__adsRenderFailTimer.stop();
                    }
                    if (reset) this.__adsRenderFailTimer = null;
                },

                initMidRollAds: function() {
                    let schedules;
                    // Split all via comma exclude inside brackets
                    schedules = Objs.map(this.get("adsposition").split(/(?![^)(]*\([^)(]*?\)\)),(?![^\[]*\])/), function(item) {
                        return item.trim();
                    }, this);

                    if (schedules.length > 0) {
                        this.set("midrollads", []);
                        this.__adMinIntervals = this.get("minadintervals");
                        this.__adsControlPosition = 0;
                        // This will be called in the next video cases
                        Objs.iter(schedules, function(schedule, index) {
                            schedule = schedule.toLowerCase();
                            // if user set schedule with time settings
                            if (/^mid\[[\d\s]+(,[\d\s]+|[\d\s]+\%|\%|[\d\s]+\*|\*)*\]*$/i.test(schedule)) {
                                const _s = schedule.replace('mid[', '').replace(']', '');
                                Objs.map(_s.split(','), function(item) {
                                    item = item.trim();
                                    if (/^[\d\s]+\*$/.test(item)) {
                                        item = +item.replace("\*", '');
                                        this.on("change:duration", function(duration) {
                                            if (duration > 0 && this.get("midrollads").length === 0) {
                                                var step = Math.floor(duration / item);
                                                if (this.get("infiniteduration"))
                                                    step = 100;
                                                if (duration > item) {
                                                    for (var i = 1; i <= step; i++) {
                                                        this.get("midrollads").push({
                                                            position: this.get("position") + i * item
                                                        });
                                                    }
                                                }
                                            }
                                        }, this);
                                    } else {
                                        if (/^[\d\s]+\%$/.test(item)) {
                                            item = parseInt(item.replace('%', '').trim(), 10);
                                            if (item < 100 && item > 0) {
                                                this.get("midrollads").push({
                                                    position: parseFloat((item / 100).toFixed(2))
                                                });
                                            }
                                        } else {
                                            // the user also set 0 to 1 value, as percentage, more 1 means seconds
                                            this.get("midrollads").push({
                                                position: parseFloat(item)
                                            });
                                        }
                                    }
                                }, this);
                            } else {
                                if (/^mid\[.*?\]$/.test(schedule))
                                    console.log('Seems your mid roll settings does not correctly set. It will be played only in the middle of the video.');
                                if (/^mid$/.test(schedule)) {
                                    this.get("midrollads").push({
                                        position: 0.5
                                    });
                                }
                            }

                            // After iteration completing. If adsCollections existed should be destroyed
                            if (((index + 1) === schedules.length) && !!this._adsRollPositionsCollection) {
                                this._adsRollPositionsCollection.destroy();
                                this._adsRollPositionsCollection = null;
                            }
                        }, this);
                    }
                },

                getFullscreenElement: function() {
                    let host = this.activeElement().getRootNode().host;
                    while (host && host.getRootNode && host.getRootNode().host) {
                        host = host.getRootNode().host;
                    }
                    return host || this.activeElement().childNodes[0];
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
                    // If a type of source of image is a Blob object, convert it to URL
                    img.src = isLocal ? (window.URL || window.webkitURL).createObjectURL(this.get("poster")) : this.get("poster");
                },
                _drawFrame: function(video, currentTime, width, height, cb) {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height
                    const ctx = canvas.getContext('2d');
                    video.currentTime = currentTime;
                    setTimeout(function() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        cb(canvas, ctx);
                    }.bind(this), 250);
                },
                removeAdsBackgroundInSafari: function() {
                    this.scopes.adsplayer.execute('removeBackImageFromAds');
                },
                addSourcToVideo: function(source, video) {
                    try {
                        this.vidEle.src = source;
                        const videoParentEle = video.parentElement;
                        this.imgEle.style.width = '100%';
                        this.vidEle.setAttribute('crossorigin', 'anonymous')
                        this.vidEle.muted = true;

                        this.vidEle.addEventListener("loadeddata", (event) => {
                            this.vidEle.pause();
                            this._drawFrame(this.vidEle, 0, video.videoWidth, video.videoHeight, (canvas) => {
                                this.imgEle.src = `${canvas.toDataURL()}`;
                                videoParentEle.appendChild(this.imgEle);
                            })
                        })
                    } catch (e) {}
                },
                _renderVideoFrame: function(video) {
                    const currentPosition = this.getCurrentPosition();
                    video.style.backgroundColor = 'transparent';
                    try {
                        this.vidEle.pause();
                        this.imgEle.src = '';
                        this._drawFrame(this.vidEle, currentPosition, video.videoWidth, video.videoHeight, (canvas) => {
                            this.imgEle.src = `${canvas.toDataURL()}`;
                        })
                    } catch (e) {}
                },
                _detachVideo: function() {
                    this.set("playing", false);
                    if (this.player) this.player.weakDestroy();
                    this.player = null;
                    this.__video = null;
                    this.set("videoelement_active", false);
                },

                _validateParameters: function() {
                    var fitStrategies = ["crop", "pad", "original"];
                    var stickyPositions = ["top-left", "top-right", "bottom-right", "bottom-left"];
                    var mobilePositions = ["top", "bottom"];
                    if (!fitStrategies.includes(this.get("videofitstrategy"))) {
                        console.warn("Invalid value for videofitstrategy: " + this.get("videofitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }
                    if (!fitStrategies.includes(this.get("posterfitstrategy"))) {
                        console.warn("Invalid value for posterfitstrategy: " + this.get("posterfitstrategy") + "\nPossible values are: " + fitStrategies.slice(0, -1).join(", ") + " or " + fitStrategies.slice(-1));
                    }
                    if (this.get("stretch") || this.get("stretchwidth") || this.get("stretchheight")) {
                        console.warn("Stretch parameters were deprecated, your player will stretch to the full container width by default.");
                    }
                    // TODO:  check and remove if useless
                    // if (this.get("floating") && this.get("floatingoptions.mobile.position") && !(mobilePositions.includes(this.get("floatingoptions.mobile.position")))) {
                    if (this.get("floating") && !(mobilePositions.includes(this.get("floatingoptions").mobile))) {
                        console.warn("Please choose one of the following values instead:", mobilePositions);
                    }

                    const deprecatedCSS = ["minheight", "minwidth", "minheight", "minwidth"];
                    deprecatedCSS.forEach(function(parameter) {
                        if (Types.is_string(parameter)) {
                            if (this.get(parameter))
                                console.warn(parameter + " parameter was deprecated, please use CSS instead.");
                        }
                    }.bind(this));

                    const deprecatedParams = {
                        "sticky-position": "floatingoptions.desktop.position",
                    };
                    Object.keys(deprecatedParams).forEach(function(key) {
                        if (this.get(key))
                            console.warn(key + " parameter was deprecated, please use " + deprecatedParams[key] + " instead.");
                    }.bind(this));

                    var toBeDeprecatedParams = {
                        "sticky": "floating",
                        "sticky-start-pause": "floatingoptions.start-pause",
                        "sticky-threshold": "floatingoptions.threshold",
                    };
                    Object.keys(toBeDeprecatedParams).forEach(function(key) {
                        if (this.get(key))
                            console.warn(key + " parameter will be deprecated on future version, please use " + toBeDeprecatedParams[key] + " instead.");
                    }.bind(this));

                    if (this.get("height")) {
                        let supportedHeight = typeof this.get("height") === "number";
                        supportedHeight ||= isNaN(this.get("height")) && this.get("height").includes("px");
                        if (!supportedHeight) {
                            console.warn(`Please set height as px or just a number, other way of settings are deprecated`);
                        }
                    }
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
                    this.addSourcToVideo(this.get("source"), video);
                    this._clearError();
                    // Just in case, be sure that player's controllers will be hidden
                    video.controls = this.get("showbuiltincontroller");
                    if (!this.get("allowpip"))
                        video.disablePictureInPicture = true;
                    VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: video,
                        onlyaudio: this.get("onlyaudio"), // Will fix only audio local playback bug
                        preload: !!this.get("preload"),
                        loop: !!this.get("loop"),
                        reloadonplay: this.get('playlist') && this.get("playlist").length > 0 ? true : !!this.get("reloadonplay"),
                        fullscreenedElement: this.getFullscreenElement(),
                        loadmetadata: Info.isChrome() && this.get("skipinitial")
                    })).error(function(e) {
                        if (this.destroyed())
                            return;
                        this._error("attach", e);
                    }, this).success(function(instance) {
                        if (this.destroyed())
                            return;
                        this.player = instance;
                        this.delegateEvents(null, this.player, "player");
                        this.__video = video;
                        if (!this.__trackTags && this.get("tracktags").length) {
                            this.__trackTags = new TrackTags({}, this);
                        }

                        // On autoplay video, silent attach should be false
                        this.set("silent_attach", (silent && !this.get("autoplay")) || false);

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
                        // If the browser not allows unmuted autoplay, and we have manually forcibly muted player
                        // If user already has an interaction with player, we don't need to check it again
                        if (!this.get("userhadplayerinteraction")) this._checkAutoPlay(this.__video);
                        this.player.on("error:poster", function() {
                            this._error("poster");
                        }, this);
                        if (!this.get("playedonce")) {
                            this.player.once("playing", function() {
                                this.set("playedonce", true);
                                this.set("playbackcount", 1);
                            }, this);
                        }
                        this.player.on("playing", function() {
                            if (Info.isSafari()) {
                                this.removeAdsBackgroundInSafari();
                            }
                            const floating = this.get("sticky") || this.get("floating");
                            if (this.get("sample_brightness")) this.__brightnessSampler.start();
                            this.set("playing", true);
                            this.trigger("playing");

                        }, this);
                        this.player.on("loaded", function() {
                            this.set("videowidth", this.player.videoWidth());
                            this.set("videoheight", this.player.videoHeight());
                            if (this.get("sample_brightness")) this.__brightnessSampler.fire();
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("video", e);
                        }, this);
                        if (this.player.error())
                            this.player.trigger("error", this.player.error());
                        this.player.on("paused", function() {
                            if (Info.isSafari()) {
                                this._renderVideoFrame(this.__video);
                            }
                            if (this.get("sample_brightness")) this.__brightnessSampler.stop();
                            this.set("playing", false);
                            this.trigger("paused");

                        }, this);
                        this.player.on("ended", function() {
                            if (Info.isSafari()) {
                                this._renderVideoFrame(this.__video);
                            }
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
                            this.channel("next").trigger("resetNextWidget");
                            var volume = Math.min(1.0, this.get("volume"));
                            this.player.setVolume(volume);
                            this.player.setMuted(this.get("muted") || volume <= 0.0);
                            if (this.get("totalduration") || this.player.duration() < Infinity)
                                this.set("duration", this.get("totalduration") || this.player.duration());
                            this.set("fullscreensupport", this.player.supportsFullscreen(this.getFullscreenElement()));
                            // As duration is credential, we're waiting to get duration info
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
                        // We should add the CSS codes, and we are adding it here, to mark the player
                        this.activeElement().classList.add(this.get("csscommon") + "-slim");
                    }

                    var img = this.activeElement().querySelector('img[data-image="image"]');
                    var imgEventHandler = this.auto_destroy(new DomEvents());
                    imgEventHandler.on(img, "load", function() {
                        this.set("fallback-aspect-ratio", img.naturalWidth + "/" + img.naturalHeight);
                        imgEventHandler.destroy();
                    }, this);
                    this._recordPerformance(`activated`);
                },

                _playWhenVisible: function(video) {
                    const _self = this;

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
                    if (this.get("tracktextvisible")) {
                        this.set("autoenabledtracktags", this.get("initialoptions.autoenabledtracktags"));
                    } else {
                        this.set("trackcuetext", null);
                        this.set("autoenabledtracktags", []);
                    }
                    this.resetTrackTags();
                },

                resetTrackTags: function(status) {
                    status = Types.is_defined(status) ? status : this.get("tracktextvisible");
                    const _lang = this.get("tracktaglang"),
                        _customStyled = this.get("tracktagsstyled");
                    let _status = status ? 'showing' : 'disabled';
                    _status = (status && _customStyled) ? 'hidden' : _status;
                    if (!status && this.get("tracktagsstyled")) this.set("trackcuetext", null);
                    if (this.__trackTags && !this.__trackTags.destroyed()) {
                        Objs.iter(this.__video.textTracks, function(track, index) {
                            if (typeof this.__video.textTracks[index] === 'object' && this.__video.textTracks[index]) {
                                const _track = this.__video.textTracks[index];
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
                    }
                },

                _keyDownActivity: function(element, ev) {
                    if (this.get("preventinteractionstatus")) return;
                    var _keyCode = ev.which || ev.keyCode;
                    // Prevent white-space browser center scroll and arrow buttons behaviors
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

                showTooltip: function(tooltip) {
                    if (!Types.is_object(tooltip) || !tooltip.tooltiptext)
                        console.warn("Provided tooltip has to be an object, at least with 'tooltiptext' key");
                    var position = tooltip.position || 'top-right';
                    if (this.get("tooltips").count() > 0) this.hideTooltip(position);

                    this.get("tooltips").add({
                        id: tooltip.id || Time.now(),
                        tooltiptext: tooltip.tooltiptext,
                        position: tooltip.position || 'top-right',
                        closeable: tooltip.closeable || false,
                        pauseonhover: tooltip.pauseonhover || false,
                        showprogressbar: tooltip.showprogressbar || false,
                        disappearafterseconds: tooltip.disappearafterseconds || -1,
                        showonhover: tooltip.showonhover || false,
                        queryselector: tooltip.queryselector || null
                    });
                    this.get("tooltips").add_secondary_index("position");
                },

                hideTooltip: function(position, id) {
                    let exists;
                    if (id) {
                        exists = this.get("tooltips").queryOne({
                            id: id
                        });
                    } else {
                        exists = this.get("tooltips").get_by_secondary_index("position", position, true);
                    }
                    if (exists) this.get("tooltips").remove(exists);
                },

                hideControl: function() {
                    this.auto_destroy(new Timers.Timer({
                        delay: 4000,
                        fire: function() {
                            if (this.get("showcontroll") && this.get('playing') && this.get('trackUnmute')) this.set("showcontroll", false);
                        }.bind(this),
                        once: true
                    }));
                },

                showControll: function() {
                    if (this.get("playing") && !this.get('showcontroll') && this.get('trackUnmute') && this.get('isAndroid')) {
                        this.set('showcontroll', true);
                        this.hideControl();
                        return true;

                    } else if (!this.get("playing") && this.get('showcontroll')) {
                        this.set('showcontroll', false);
                        return false;
                    } else if (!this.get('trackUnmute') && this.get("playing") && this.get('isAndroid')) {
                        return false;
                    }
                },

                object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume", "set_speed", "toggle_tracks"],

                functions: {

                    user_activity: function(strong) {
                        if (this.get('preventinteractionstatus')) return;
                        this._resetActivity();
                    },

                    message_click: function() {
                        this.trigger("message:click");
                        this.setPlayerEngagement();
                    },

                    playbutton_click: function() {
                        this.setPlayerEngagement();
                        this.trigger("playbuttonclick");
                        this.host.state().play();
                    },

                    play: function() {
                        this.setPlayerEngagement();
                        this.trigger("playrequested");
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

                        if (this.get("playing_ad") || this.get("adsplaying"))
                            this.scopes.adsplayer.execute("pause");

                        if (this.get("playing") || this.get("pause_content_after_start")) {
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
                        this.setPlayerEngagement();
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("seek", position);
                            return;
                        }
                        if (this.get('disableseeking')) return;
                        if (this.get("nextwidget")) this.channel("next").trigger("setStay");
                        if (this.videoLoaded()) {
                            if (position < this.get("position")) this.trigger("rewind");
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
                        if (this._adsRollPositionsCollection) {
                            if (this._adsRollPositionsCollection.count() > 0) {
                                this._adsRollPositionsCollection.iterate(function(curr) {
                                    if (curr.get("position") < position)
                                        this._nextRollPosition = null;
                                }, this);
                            }
                        }
                        this.__playedStats(position, this.get("duration"));
                    },

                    set_speed: function(speed, from_ui) {
                        this.setPlayerEngagement();
                        if (!this.player) return false;
                        this.player.setSpeed(speed);
                        if (!from_ui) this.updateSettingsMenuItem("playerspeeds", {
                            value: parseFloat(speed.toFixed(2))
                        });
                        return speed;
                    },

                    set_volume: function(volume) {
                        this.setPlayerEngagement();
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("set_volume", volume);
                            return;
                        }
                        this.set("volume", Maths.clamp(volume, 0, 1));
                    },

                    toggle_volume: function() {
                        this.setPlayerEngagement();
                    },

                    toggle_settings_menu: function() {
                        this.set("settingsmenu_active", !this.get("settingsmenu_active"));
                    },

                    toggle_share: function() {
                        this.set("share_active", !this.get("share_active"));
                    },

                    toggle_fullscreen: function() {
                        this.setPlayerEngagement();
                        if (this.get("preventinteractionstatus")) return;
                        if (this._delegatedPlayer) {
                            this._delegatedPlayer.execute("toggle_fullscreen");
                            return;
                        }
                        if (this.get("fullscreened")) {
                            Dom.documentExitFullscreen();
                        } else {
                            if (Info.isiOS() && Info.isMobile()) {
                                var videoEl = this.activeElement().querySelector(this.get("playing_ad") ? "[data-video='ima-ad-container'] video" : "video");
                                Dom.elementEnterFullscreen(videoEl);
                                this.__lastPause = 0;
                                this.__changePlayingCB = function(p) {
                                    if (!p) this.__lastPause = Time.now();
                                }.bind(this);
                                this.on("change:playing", this.__changePlayingCB);
                                this.on("change:adnotpaused", this.__changePlayingCB);
                                videoEl.addEventListener("webkitendfullscreen", function() {
                                    this.off("change:playing", this.__changePlayingCB);
                                    this.off("change:adnotpaused", this.__changePlayingCB);
                                    this.set("fullscreened", false);
                                    if (this.get("playing")) {
                                        this.once("paused", function() {
                                            this.play();
                                        }, this);
                                    } else if (this.get("adnotpaused")) {
                                        this.once("change:adnotpaused", function() {
                                            this.play();
                                        }, this);
                                    } else if (Time.now() - this.__lastPause < 100) {
                                        setTimeout(function() {
                                            this.play();
                                        }.bind(this), 500);
                                    }
                                }.bind(this), {
                                    once: true
                                });
                            } else Dom.elementEnterFullscreen(this.activeElement().childNodes[0]);
                        }
                        this.set("fullscreened", !this.get("fullscreened"));
                    },

                    toggle_player: function(fromOverlay) {
                        if (!this._debouncedToggle) this._debouncedToggle = Functions.debounce(function(fo) {
                            const floating = this.get("sticky") || this.get("floating");
                            if (floating && this.floatHandler && this.floatHandler.isDragging()) {
                                this.floatHandler.stopDragging();
                                return;
                            }
                            if (this.get("playing") && this.get("preventinteractionstatus")) return;
                            if (this._delegatedPlayer) {
                                this._delegatedPlayer.execute("toggle_player");
                                return;
                            }
                            if (fo) {
                                this.setPlayerEngagement();
                                if (this.get("unmuteonclick")) {
                                    this.set('showcontroll', this.get('isAndroid'));
                                    this.set('trackUnmute', false);
                                    return;
                                }
                            }

                            if (this.showControll()) return;

                            if (this.get("playing") && this.get("pauseonclick")) {
                                this.set('showcontroll', this.get('isAndroid'));
                                this.set('trackUnmute', this.get('isAndroid'));
                                this.trigger("pause_requested");
                                this.pause();
                            } else if (!this.get("playing") && this.get("playonclick")) {
                                this.trigger("play_requested");
                                this.setPlayerEngagement();
                                this.play();
                            }
                        }.bind(this), 100, true);
                        this._debouncedToggle(fromOverlay);
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
                    },

                    pause_ads: function() {
                        this.channel("ads").trigger("pause");
                    },

                    resume_ads: function() {
                        this.setPlayerEngagement();
                        this.channel("ads").trigger("resume");
                    },

                    close_floating: function(destroy, event) {
                        if (event) {
                            if (event[0].type === 'touchstart') {
                                event[0].preventDefault();
                                event[0].stopPropagation();
                            }
                        }
                        destroy = destroy || false;
                        this.trigger("floatingplayerclosed");
                        this.set(`states.floatingclosed`, true);
                        const floating = this.get("sticky") || this.get("floating");

                        // Unset immediateOutstreamRequests on close to prevent ad retries.
                        if (this.get("outstream")) {
                            this.set("immediateOutstreamRequests", undefined);
                        }

                        if (floating || this.get("floatingoptions.floatingonly")) {
                            if (this.get("adsplaying")) {
                                this._pauseAdsOnFloatCloseHandle();
                            } else this.pause();
                            if (this.floatHandler) {
                                if (destroy) this.floatHandler.destroy();
                                else this.floatHandler.stop();
                            }
                            if (this.get("floatingoptions.hideplayeronclose") || this.get("floatingoptions.floatingonly")) {
                                // If player is not sticky but floating we need hide whole player,
                                // this is true also if we want to hide player container on floating close
                                // Hide container element if player will be destroyed
                                this.hidePlayerContainer(true);
                                if (destroy) this.destroy();
                            } else {
                                // If we want left player container visible and close floating player
                                this.set("view_type", "default");
                            }
                        } else {
                            this.hidePlayerContainer(true);
                            if (destroy) this.destroy();
                        }
                    }
                },

                _pauseAdsOnFloatCloseHandle: function() {
                    if (this.get("pause_ads_on_float_close")) {
                        this.pause();
                    } else {
                        this.set_volume(0);
                        this.set("pause_content_after_start", true)
                    };
                },

                resetResizeObserver: function(element) {
                    if (this._observedElement !== element) {
                        if (this._activeElementResizeObserver)
                            this._activeElementResizeObserver.disconnect();
                        if (element || this.activeElement()) {
                            this._observedElement = element || this.activeElement().firstChild;
                            this._activeElementResizeObserver.observe(element || this.activeElement().firstChild);
                        }
                    }
                },

                destroy: function() {
                    if (this._activeElementResizeObserver) this._activeElementResizeObserver.disconnect();
                    if (this._performanceObserver) {
                        this._performanceObserver.disconnect();
                    }
                    this._detachVideo();
                    inherited.destroy.call(this);
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        this.set("mobileviewport", this.__isInMobileViewport());
                        if (this.videoLoaded()) {
                            var _now = Time.now();
                            this.set("activity_delta", _now - this.get("last_activity"));
                            var new_position = this.player.position();
                            if (new_position !== this.get("position") || this.get("last_position_change"))
                                this.set("last_position_change", _now);
                            // Run each second not to fast
                            if (this.get("position") > 0.0 && this.__previousPostion !== Math.round(this.get("position"))) {
                                this.__previousPostion = Math.round(this.get("position"));
                                if (this.__previousPostion > 0) this.trigger("playing_progress", this.__previousPostion);
                            }
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
                            // If setting pop-up is open, hide it together with a control-bar if hideOnInactivity is true
                            if (this.get('hideoninactivity') && (this.get('activity_delta') > this.get('hidebarafter'))) {
                                this.set("settingsmenu_active", false);
                            }
                            // We need this part run each second not too fast, this.__adsControlPosition will control it
                            if (this.__adsControlPosition < this.get("position") && !this.get("isseeking")) {
                                this.__adsControlPosition = Math.ceil(this.get("position"));
                                this.__controlAdRolls();
                            }

                        }
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width;
                    if (this.get("is_floating") && this.get("with_sidebar")) {
                        // with sidebar, we need to get only video player width not whole container
                        width = Dom.elementDimensions(this.__playerContainer || this.activeElement()).width;
                    } else {
                        width = Dom.elementDimensions(this.activeElement()).width;
                    }
                    this.set("csssize", width > 400 ? "normal" : (width > 320 ? "medium" : "small"));
                    this.set("mobileview", width < this.get("mobilebreakpoint"));
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

                // `forceClose` accounts for `outstream` completion or users closing the player.
                hidePlayerContainer: function(forceClose = false) {
                    // Return early if we have an outstream player with immediate adRequest interval.
                    if (!forceClose && this.get("immediateOutstreamRequests")) {
                        return;
                    }

                    if (this.activeElement() && !this.get("hidden")) {
                        this.set("hidden", true);
                        // If floating sidebar then it will be hidden via player itself so not set companionads as []
                        if (this.scopes.adsplayer) this.scopes.adsplayer.execute("hideCompanionAd");
                        this.set("adsplayer_active", false);
                        if (this.get("playing")) this.pause();
                    }
                },

                showHiddenPlayerContainer: function() {
                    // Resume sticky handler if it is not destroyed
                    if (this.floatHandler && !this.floatHandler.destroyed() && this.floatHandler.observing === false) {
                        this.floatHandler.resume();
                    }
                    // If player is visible no need todo anything
                    if (!this.get("hidden")) return;
                    this.set("hidden", false);
                    if (!this.get("playing")) this.play();
                },

                resetAdsPlayer: function() {
                    if (this.get("adsplayer_active")) this.set("adsplayer_active", false);
                    this.set("adsplayer_active", true);
                },

                getNextOutstreamAdTagURLs: function(immediate) {
                    immediate = immediate || false;
                    var promise = Promise.create();
                    if (this.get("outstreamoptions.maxadstoshow") === 0) {
                        return promise.asyncError("Limit of showing ads exceeded.", true);
                    }
                    if ((this.get("nextadtagurls") && this.get("nextadtagurls").length > 0) || (this.get("adtagurlfallbacks") && this.get("adtagurlfallbacks").length > 0)) {
                        promise.asyncSuccess(this.get("nextadtagurls").length > 0 ? this.get("nextadtagurls").shift() : this.get("adtagurlfallbacks").shift());
                    } else {
                        Async.eventually(function() {
                            var _promise = this.requestForTheNextAdTagURL();
                            var isGlobalPromise = typeof _promise.then === "function";
                            return Types.is_function(this.requestForTheNextAdTagURL) ?
                                _promise[isGlobalPromise ? 'then' : 'success'](function(response) {
                                    return promise.asyncSuccess(response);
                                }, this)[isGlobalPromise ? 'catch' : 'error'](function(error) {
                                    return promise.asyncError(error);
                                }, this) :
                                console.log("Please define requestForTheNextAdTagURL method with Promise.");
                        }, this, immediate ? 100 : this.get("outstreamoptions.recurrenceperiod") || 30000);
                    }
                    return promise;
                },

                setImmediateOutstreamRequests(value) {
                    this.set("immediateOutstreamRequests", value);
                },

                handleOutstreamAdImpression() {
                    const immediateRequests = this.get("immediateOutstreamRequests");
                    if (immediateRequests !== undefined) {
                        this.setImmediateOutstreamRequests(true);
                        // Reset number of available retries for immediate outstream requests.
                        this.set("availableOutstreamRetries", this.get("outstreamoptions.numOfRetriesOnError") || 0);
                    }
                },

                handleOutstreamAdError() {
                    const immediateRequestEnabled = this.get("immediateOutstreamRequests");

                    if (immediateRequestEnabled) {
                        const retriesAvailable = this.get("availableOutstreamRetries");
                        if (retriesAvailable && retriesAvailable > 0) {
                            this.set("availableOutstreamRetries", retriesAvailable - 1);
                            return;
                        } else {
                            this.setImmediateOutstreamRequests(false);
                        }
                    }

                    // Trigger a non-immediate manual retry using on ad-error
                    if (!this.get("immediateOutstreamRequests")) {
                        this.trigger("outstreamRetryOnInterval");
                    }

                    this.hidePlayerContainer();
                },

                /**
                 * This method should be overwritten.
                 * @return {*}
                 */
                requestForTheNextAdTagURL: function() {
                    var promise = Promise.create();
                    // inherit this function from the parent player and set a new next ad tag
                    promise.asyncSuccess([]);
                    return promise;
                },

                /**
                 * @param immediate
                 * @param stateContext
                 * @param nextState
                 * @private
                 */
                setNextOutstreamAdTagURL: function(immediate, stateContext, nextState) {
                    immediate = immediate || false;

                    if (this.get("immediateOutstreamRequests")) {
                        immediate = true;
                    }
                    // if we have set nextadtagurls, then we will try to load next adtagurl
                    this.getNextOutstreamAdTagURLs(immediate)
                        .success(function(response) {
                            if (typeof response === "string") {
                                this.set("adtagurl", response);
                            } else if (response && typeof response.shift === "function" && response.length > 0) {
                                this.set("adtagurl", response.shift());
                                // if still length is more than 0, then set it to nextadtagurls
                                if (response.length > 0) this.set("nextadtagurls", response);
                            } else {
                                return this.setNextOutstreamAdTagURL(immediate, stateContext, nextState);
                            }

                            if ((!immediate && this.scopes.adsplayer) || this.get("adsmanagerloaded")) {
                                this.resetAdsPlayer();
                            }

                            if (stateContext && nextState) {
                                return stateContext.next(nextState);
                            } else {
                                return stateContext.next("LoadAds", {
                                    position: 'outstream'
                                });
                            }
                        }, this)
                        .error(function(err, complete) {
                            console.log("Error on getting next outstream tag", err);
                            if (!complete) return stateContext.next("LoadPlayer");
                        }, this);
                },

                aspectRatio: function() {
                    // Don't use a shortcut way of getting an aspect ratio, will act as not expected.
                    const height = this.videoHeight();
                    const width = this.videoWidth();

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

                isBroadcasting: function() {
                    return this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected;
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

                initAdSources: function() {
                    if (
                        Array.isArray(this.get("adtagurlfallbacks")) &&
                        this.get("adtagurlfallbacks").length > 0 &&
                        !this.get("adtagurl") &&
                        !this.get("inlinevastxml")
                    ) this.set("adtagurl", this.get("adtagurlfallbacks").shift());
                    this.set("adshassource", !!this.get("adtagurl") || !!this.get("inlinevastxml"));

                    // The initial mute state will not be changes if outstream is not set
                    if (this.get("outstream")) {
                        this.set(`preload_ads`, true);
                        this.set("autoplay", true);
                        this.set("skipinitial", false);
                        // Actually we can remove it as a new function should merge it, anyway need first test
                        this.set("outstreamoptions", Objs.tree_merge(this.get("initialoptions").outstreamoptions, this.get("outstreamoptions")));
                        // will store user set options for outstream
                        this.set("states.outstreamoptions", this.get("outstreamoptions"));
                    }

                    if (this.get("adshassource")) {
                        if (this.get("adsposition")) {
                            this.set("adsplaypreroll", this.get("adsposition").indexOf("pre") !== -1);
                            this.set("adsplaypostroll", this.get("adsposition").indexOf("post") !== -1);
                            this.initMidRollAds();
                        } else {
                            // if there's no specification, play preroll or VMAP if not set adsposition at all
                            this.set("vmapads", true);
                        }
                    } else if (this.get(`ads_source_init_timeout`) > 0) {
                        this.startAdsSourceSetupChecker(this.get(`ads_source_init_timeout`));
                    }
                },

                /**
                 * Will check if as source is ready, if not will start a timer to check it and trigger event
                 * @param timeout
                 */
                startAdsSourceSetupChecker: function(timeout) {
                    timeout = timeout || this.get(`ads_source_init_timeout`) || this.get(`initialoptions.ads_source_init_timeout`);
                    this._recordPerformance(`startAdsSourceSetupChecker`);
                    if (!isNaN(timeout) && timeout > 0) {
                        if (!this.__adSourceSetupChecker) {
                            const interval = timeout < 200 ? timeout : 200;
                            this.__adSourceSetupChecker = new Timers.Timer({
                                context: this,
                                fire: () => {
                                    if (this.get(`adshassource`)) {
                                        this.stopAdsSourceSetupChecker(true);
                                    }
                                },
                                delay: interval,
                                start: true,
                                destroy_on_stop: true,
                                fire_max: Math.floor(timeout / interval),
                                once: interval <= 200
                            });
                            this.auto_destroy(this.__adSourceSetupChecker);
                            Async.eventually(function() {
                                this.stopAdsSourceSetupChecker(false);
                            }, this, timeout);
                        } else {
                            this.resetAdsSourceSetupChecker(timeout);
                        }
                    }
                },

                stopAdsSourceSetupChecker: function(success) {
                    success = success || false;
                    if (this.__adSourceSetupChecker) {
                        this._recordPerformance(`stopAdsSourceSetupChecker-${success}`);
                        this.__adSourceSetupChecker.destroy();
                        this.__adSourceSetupChecker = null;
                        // NOTE: Important to trigger event after __adSourceSetupChecker is set to null
                        this.trigger(`ads_source_ready`, success);
                    }
                },

                resetAdsSourceSetupChecker: function(timeout) {
                    timeout = timeout || this.get(`ads_source_init_timeout`) || this.get(`initialoptions.ads_source_init_timeout`);
                    if (this.__adSourceSetupChecker) {
                        this.__adSourceSetupChecker.destroy();
                        this.__adSourceSetupChecker = null;
                        if (timeout > 0) {
                            this.startAdsSourceSetupChecker(timeout);
                        }
                    }
                },

                __mergeWithInitialOptions: function() {
                    const options = this.get("initialoptions");
                    if (options && Types.is_object(options)) {
                        Objs.iter(options, function(v, k) {
                            // if value is null, then we need to set it user or default value, as initial options
                            if (v === null) {
                                this.set(`initialoptions.${k}`, this.get(k));
                            } else {
                                if (Types.is_defined(v) && typeof options[k] === typeof this.get(k)) {
                                    const isCountable = v && this.types[k] && ["json", "array", "object", "jsonarray"].indexOf(this.types[k]) > -1;
                                    if (isCountable && options[k] && Objs.count(options[k]) > 0) {
                                        this.set(k, Objs.tree_merge(options[k], this.get(k)));
                                    } else if (!Types.is_object(v)) {
                                        this.set(k, v);
                                    }
                                }
                            }
                        }, this);
                    }
                },

                /**
                 * Will merge attributes from the user with the default/initial attributes
                 * @private
                 */
                __mergeDeepAttributes: function() {
                    Objs.iter([
                        'floatingoptions', 'outstreamoptions', 'sidebaroptions'
                    ], function(k) {
                        if (Types.is_object(this.get(k))) {
                            this.set(k, Objs.tree_merge(this.attrs()[k], this.get(k)));
                        }
                    }, this);
                },

                /** @private */
                __initFloatingOptions: function() {
                    Objs.iter(["mobile", "desktop"], function(view) {
                        var _floatingoptions = this.get("floatingoptions")[view];
                        if (_floatingoptions && _floatingoptions.size && _floatingoptions.availablesizes) {
                            var _availableSizes = _floatingoptions.availablesizes;
                            if (!Types.is_object(_availableSizes)) return;
                            Objs.keyMap(_availableSizes, function(v, k) {
                                if (Types.is_string(_floatingoptions.size) && k === _floatingoptions.size.toLowerCase()) {
                                    switch (view) {
                                        case "mobile":
                                            this.set("floatingoptions.mobile.height", v);
                                            break;
                                        case "desktop":
                                            this.set("floatingoptions.desktop.height", v);
                                            break;
                                    }
                                }
                            }, this);
                        }
                    }, this);

                    const isAbleToFloatOnViewport = () => {
                        if (this.get("floatingoptions.noFloatOnDesktop") && !this.get("mobileviewport")) return false;
                        return !(this.get("floatingoptions.noFloatOnMobile") && this.get("mobileviewport"));

                    }
                    if (this.get("floatingoptions.floatingonly") && isAbleToFloatOnViewport()) {
                        this.set("view_type", "float");
                    }

                    if (this.__isInMobileViewport() && Types.is_object(this.get("floatingoptions.mobile.positioning"))) {
                        this.__applyMobileRelativePositionBasedOnSelector();
                    }

                    // Only init floatHandler if floatingonly is disabled
                    const floating = this.get("sticky") || this.get("floating");
                    if (floating && !this.get("floatingoptions.floatingonly")) {
                        const stickyOptions = {
                            threshold: this.get("sticky-threshold") || this.get("floatingoptions.threshold"),
                            paused: (this.get("sticky-starts-paused") || this.get("floatingoptions.starts-paused")) || !floating,
                            "static": this.get("floatingoptions.static"),
                            floatCondition: function(elementRect) {
                                if (this.get("floatingoptions.noFloatOnDesktop") && !this.get("mobileviewport")) return false;
                                if (this.get("floatingoptions.noFloatOnMobile") && this.get("mobileviewport")) return false;
                                if (this.get("floatingoptions.noFloatIfAbove") && this.get("mobileviewport") && elementRect.top >= 0) return false
                                return !(this.get("floatingoptions.noFloatIfBelow") && this.get("mobileviewport") && elementRect.top <= 0);
                            }.bind(this),
                        };
                        this.floatHandler = this.auto_destroy(new FloatHandler(
                            this.activeElement().firstChild,
                            this.activeElement(),
                            stickyOptions
                        ));
                        this.floatHandler.on("transitionToFloat", function() {
                            this.set("view_type", "float");
                        }, this);
                        this.floatHandler.on("transitionToView", function() {
                            this.set("view_type", "default");
                        }, this);
                        this.floatHandler.on("transitionOutOfView", function() {
                            this.set("view_type", "out_of_view");
                        }, this);
                        this.delegateEvents(null, this.floatHandler);
                        this.floatHandler.init();
                        this.floatHandler.start();
                    }
                },

                __isInMobileViewport: function() {
                    // mobileviewport different from mobileview, as mobileview will get player itself mobileview, mobileviewport from screen size
                    const clientWidth = window.innerWidth || document.documentElement.clientWidth ||
                        document.body.clientWidth;
                    // as isMobile will calculate based on userAgent, and user's platform,
                    // it will depend on how user starts the player, and will not be changed.
                    return clientWidth <= this.get("mobilebreakpoint") || (Types.is_undefined("mobileviewport") && Info.isMobile());
                },

                /**
                 * Will set preset options.
                 * Default settings will be applied to the desktop.
                 * If we want to set default for mobile, or exact for mobile,
                 * we have to set via mobile boolean false or object key.
                 * NOTE: if require we also can add floating presets
                 */
                applyPresets: function(isMobileView) {
                    const _isMobileView = isMobileView || this.__isInMobileViewport();
                    // if we have mobile view, then we need to calculate mobile presets
                    // Adding condition: "|| Info.isMobile()" will be always true/false as it's getting data from the userAgent and at once;
                    [`sidebaroptions`, `floatingoptions`].forEach((k) => {
                        let currentOptions = {
                            ...this.get(k)
                        };
                        if (currentOptions && Types.is_object(currentOptions)) {
                            const deviceRelatedSidebarOptions = _isMobileView ?
                                (currentOptions[`mobile`] || {}) : (currentOptions[`desktop`] || {});
                            currentOptions = {
                                ...currentOptions,
                                ...deviceRelatedSidebarOptions
                            }
                            this.set(k, currentOptions);
                        }
                    });
                    const presetKey = this.get("presetkey");
                    // No need to apply presets if presetkey is not defined
                    if (!presetKey) return;
                    const multiPresets = this.get("availablepresetoptions");
                    // both attributes should be defined
                    if (!Types.is_object(multiPresets) || !multiPresets[presetKey]) {
                        console.warn(`Make sure presetkey (${presetKey}) is defined as object key, inside 'availablepresetoptions' hashed objects.`);
                        return;
                    }

                    // will check if attribute exists in root level or in object level
                    const existingAttribute = (key) => Types.is_defined(this.attrs()[key]) || (Types.is_string(key) && key.split('.').some(k => this.attrs()[k]));

                    // If it's true then we previously applied all presets
                    if (Types.is_defined(this.get("initialoptions.mobilepresets"))) {
                        // if mobile viewport and we have mobile presets, then apply them
                        if (_isMobileView) {
                            // apply only attributes which are defined as desktop presets
                            if (Objs.count(this.get("initialoptions.mobilepresets")) > 0) {
                                Objs.iter(this.get("initialoptions.mobilepresets"), (v, k) => existingAttribute(k) && this.set(k, v), this);
                            }
                        } else {
                            // If not mobile apply all presets, as desktop is default
                            Objs.iter(multiPresets[presetKey], (v, k) => existingAttribute(k) && this.set(k, v), this);
                        }
                    } else {
                        // define initialoptions.mobilepresets, not to visit this block again
                        this.set("initialoptions.mobilepresets", {});
                        if (Objs.count(multiPresets) > 0) {
                            const presets = multiPresets[presetKey];
                            Objs.iter(presets, function(v, k) {
                                const currentValue = this.get(k);
                                // if boolean value, then it can be false.
                                if (Types.is_defined(presets.mobile) && existingAttribute(k)) {
                                    // current value also can be false
                                    if (Types.is_boolean(presets.mobile) && presets.mobile === false) {
                                        this.set(`initialoptions.mobilepresets.${k}`, currentValue);
                                    } else {
                                        if (Types.is_object(presets.mobile) && presets.mobile[k]) {
                                            this.set(`initialoptions.mobilepresets.${k}`, presets.mobile[k]);
                                            if (_isMobileView) this.set(k, presets.mobile[k]);
                                        }
                                    }
                                }
                                // if key already preset in root level, and key contains object key separated via dots
                                if (existingAttribute(k) && !_isMobileView) this.set(k, v);
                            }, this);
                        }
                    }
                },

                /**
                 * Prepare for postoll and mid-roll ad managers
                 * @private
                 */
                __controlAdRolls: function() {
                    const shouldPlayMidrolls = this.get("duration") > this.get("max_shortform_video_duration");
                    const hasMidRolls = this.get("midrollads").length > 0;
                    // If we have mid-rolls, then prepare mid-Rolls
                    if (shouldPlayMidrolls && hasMidRolls && this.get("duration") > 0.0 && !this._adsRollPositionsCollection) {
                        this._adsRollPositionsCollection = this.auto_destroy(new Collection()); // our adsCollections
                        let _current = null;
                        const midrollsAds = this.get("midrollads");
                        midrollsAds.forEach(roll => {
                            if (roll.position && roll.position > this.get("position")) {
                                // First ad position, if less than 1 it means it's percentage not second
                                let _position = roll.position < 1 ?
                                    Math.floor(this.get("duration") * roll.position) :
                                    roll.position;
                                // If the user does not set, and we will not get the same ad position, avoids dublication,
                                // prevent very close ads and also wrong set position which exceeds the duration
                                if ((Math.abs(_position - _current) > this.__adMinIntervals) && (this.get("infiniteduration") || _position < this.get("duration"))) {
                                    _current = _position;
                                    this._adsRollPositionsCollection.add({
                                        position: _position,
                                        duration: null,
                                        type: 'linear',
                                        isLinear: true,
                                        dimensions: {
                                            width: Dom.elementDimensions(this.activeElement()).width || this.parentWidth(),
                                            height: Dom.elementDimensions(this.activeElement()).height || this.parentHeight()
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        this.__adMinIntervals = this.__adMinIntervals === 0 ?
                            this.get("minadintervals") : (this.__adMinIntervals - 1);
                    }

                    // Set a new position when ad should run
                    if (this._adsRollPositionsCollection && !this._nextRollPosition) {
                        var _counter = this._adsRollPositionsCollection.count();
                        var _removeCurr = null;
                        if (_counter > 0) {
                            var _nextAdPoint = {
                                position: -1,
                                nextPosition: this.get("duration"),
                                nextIsLast: true,
                                type: null
                            };
                            this._adsRollPositionsCollection.iterate(function(curr) {
                                _counter--;
                                if ((_nextAdPoint.position > curr.get("position") && _nextAdPoint.type) || _nextAdPoint.position === -1) {
                                    _removeCurr = curr;
                                    _nextAdPoint = _removeCurr.data();
                                }
                                // We need max close position to play, if user seeked the video
                                if (this.get("position") >= curr.get("position")) {
                                    // Remove all passed positions
                                    this._adsRollPositionsCollection.remove(curr);
                                }
                                if (_nextAdPoint.position && _nextAdPoint.type && _counter === 0 && _removeCurr) {
                                    this._nextRollPosition = _nextAdPoint;
                                    this._adsRollPositionsCollection.remove(_removeCurr);
                                }
                            }, this);
                        } else {
                            this._adsRollPositionsCollection.destroy();
                            this._adsRollPositionsCollection = null;
                        }
                    }

                    if (this._nextRollPosition && this.get("adshassource") && this._nextRollPosition.position < this.get("position") && (this.get("duration") - this.get("position") > this.get("midrollminintervalbeforeend") || this.get("infiniteduration"))) {
                        if (this.__adMinIntervals > 0) {
                            return;
                        }

                        const handleTriggerMidRollEvent = () => {
                            if (this.get("duration") > this.get("max_shortform_video_duration")) {
                                this.trigger("playnextmidroll");
                            }
                        }
                        // If active ads player is existed
                        if (this.get("adsplayer_active") && this.scopes.adsplayer) {
                            this.breakAdsManually();
                            handleTriggerMidRollEvent();
                        } else {
                            // In case if preroll not exists, so ads_player is not activated
                            this.trigger("playnextmidroll");
                        }
                        this._nextRollPosition = null; // To be able to grab another next position from the Collection
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
                        if (this.get("autoplay-requires-muted") || this.get("forciblymuted")) video.muted = true;
                        if (this.get("autoplay-requires-playsinline")) {
                            video.playsinline = true;
                        }
                        Dom.userInteraction(function() {
                            this.set("autoplay", this.get("initialoptions").autoplay);
                            // We will unmute only if unmuteonclick is false, as it means user has to click on player not in any place
                            if (!this.get("unmuteonclick")) {
                                if (this.get("wait-user-interaction") && this.get("autoplay")) {
                                    this.__testAutoplayOptions(video);
                                    this.trigger("user-has-interaction");
                                }
                            }
                            this.set("forciblymuted", false);
                        }, this);
                    }
                },

                /**
                 * Will render multi companion ads
                 * @private
                 */
                _renderMultiCompanionAds: function() {
                    this.set("multicompanionads", []);
                    const companionAds = this.get('companionads');
                    const locations = this.get("companionad.locations");
                    Objs.iter(locations, function(location) {
                        const {
                            selector,
                            id,
                            adslotid,
                            incontainer
                        } = location;
                        if (!selector || !(id || adslotid)) {
                            console.warn(`Please provide selector and adslotid for companion ad`);
                            return;
                        }
                        let element;
                        if (!incontainer) {
                            element = document.querySelector(selector);
                        } else {
                            element = this.activeElement().querySelector(selector);
                        }
                        if (element) {
                            Objs.map(companionAds, function(ad) {
                                const adContent = ad.data?.content;
                                if (adContent) {
                                    const reg = new RegExp(`id=['"]${id}['"]`, "g");
                                    const matching = reg.test(ad.data?.content);

                                    if (Number(ad.getAdSlotId()) === Number(adslotid) || matching) {
                                        element.innerHTML = ad.getContent() || adContent;
                                        this.get("multicompanionads").push(element);
                                    }
                                }
                            }, this);
                        } else {
                            console.warn(`Non existing element for companion ad selector: ${selector}`);
                        }
                    }, this);
                },

                breakAdsManually: function(hard) {
                    hard = hard || false;
                    var adsPlayer = this.scopes.adsplayer;

                    // Only if min-suggested seconds of nonLinear ads are shown will show next ads
                    if (adsPlayer.get("non-linear-min-suggestion") > 0 && !this.get("linear") && !hard)
                        return;

                    if (!this.get("adscompleted") && !adsPlayer.get("linear")) {
                        this.channel("ads").trigger("allAdsCompleted");
                        // this.channel("ads").trigger("discardAdBreak"); // nonLinear not run discard
                    }
                    this.stopAdsRenderFailTimeout(true);
                    this.set("adsplayer_active", false);
                },

                __testAutoplayOptions: function(video) {
                    var suitableCondition = false;
                    var autoplayPossibleOptions = [{
                            muted: true,
                            playsinline: false
                        },
                        {
                            muted: true,
                            playsinline: true
                        }
                    ];
                    // If we preset muted and unmuteonclick is false, we don't need to check unmuted options
                    if (!this.get("muted") && !this.get("unmuteonclick")) {
                        autoplayPossibleOptions.push({
                            muted: false,
                            playsinline: false
                        }, {
                            muted: false,
                            playsinline: true
                        });
                    }
                    Objs.iter(autoplayPossibleOptions, function(opt, index) {
                        PlayerSupport.canAutoplayVideo(opt)
                            .success(function(response, err) {
                                if (suitableCondition) return;
                                // If autoplay is allowed in any way
                                if (Types.is_undefined(this.get("autoplay-allowed"))) {
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
                                }
                                if (opt.muted && response.result) {
                                    this.set("forciblymuted", true);
                                    this.set("autoplay-requires-muted", true);
                                    this.set("wait-user-interaction", false);
                                    this.set("volume", 0.0);
                                    this.set("muted", true);
                                    suitableCondition = true;
                                    if (video) video.muted = opt.muted;
                                    if (video) {
                                        if (opt.playsinline) {
                                            video.setAttribute('playsinline', '');
                                        } else {
                                            video.removeAttribute('playsinline');
                                        }
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

                __attachPlayerInteractionEvents: function() {
                    this.__bindedInteractionEvents = [];
                    Objs.iter(this.__INTERACTION_EVENTS, function(eventName) {
                        const f = this.__setPlayerHadInteraction.bind(this);
                        this.__bindedInteractionEvents.push({
                            type: eventName,
                            func: f
                        });
                        this.auto_destroy(
                            this.activeElement().addEventListener(
                                eventName, f, {
                                    // we could require listen several additional actions from the user,
                                    // to be able to detect user engagement
                                    once: false
                                }
                            ));
                    }, this);
                },

                __removePlayerInteractionEvents: function() {
                    if (Objs.count(this.__bindedInteractionEvents) <= 0) return;
                    Objs.iter(this.__INTERACTION_EVENTS, function(eventName) {
                        const ev = this.__bindedInteractionEvents.filter(_ev => _ev.type === eventName)[0];
                        if (ev && ev.func) {
                            this.__bindedInteractionEvents = this.__bindedInteractionEvents.filter(_ev => _ev.type !== eventName);
                            this.activeElement().removeEventListener(
                                ev.type || eventName, ev.func
                            );
                        }
                    }, this);
                },

                // Detect if user engaged with the player.
                // It happens in some actions made by user, pause is not that action
                setPlayerEngagement: function() {
                    if (this.get("userengagedwithplayer")) return;
                    this.set("userengagedwithplayer", true);
                    this.trigger("playerengaged");
                },

                // If user has any player interaction
                __setPlayerHadInteraction: function() {
                    // if unmuteonclick is active, remove the tooltip and tracking events
                    // unmuteonclick gets set to true everytime the player is muted before a ready_to_play event
                    if (this.get("unmuteonclick")) {
                        this.__unmuteOnClick();
                        this.__removePlayerInteractionEvents();

                        // this return required, not to allow to delete events and set unmute
                        return;
                    }
                    this.__removePlayerInteractionEvents();
                    if (this.get("userhadplayerinteraction")) return;
                    this.set("userhadplayerinteraction", true);
                    this.trigger("playerinteracted");
                },

                // fires an event to let listeners know that the user has engaged with the player by setting
                // unmuteonclick is set to false and volume will be set > 0
                __unmuteOnClick: function() {
                    clearTimeout(this.get('clearDebounce'));
                    const clearDebounce = setTimeout(function() {
                        if (!this.get("muted") && this.get("volume") > 0) {
                            return this.set("unmuteonclick", false);
                        }
                        this.auto_destroy(new Timers.Timer({
                            delay: 500,
                            fire: function() {
                                if (this.get("muted")) {
                                    this.set("muted", false);
                                    // Fix on Safari not unmute on click
                                    if (this.get("volume") > 0) {
                                        this.set_volume(this.get("volume"));
                                    }
                                }
                                if (this.get("volume") === 0) {
                                    this.set_volume(this.get("volume") || this.get("initialoptions").volumelevel || 1);
                                }
                                if (!this.get("manuallypaused")) this.setPlayerEngagement();
                                this.set("unmuteonclick", false);
                            }.bind(this),
                            once: true
                        }));
                        this.set("volumeafterinteraction", true);
                        if (this.get("forciblymuted")) this.set("forciblymuted", false);
                    }.bind(this), 1);
                    this.set('clearDebounce', clearDebounce);
                },

                __initResizeSensitiveAttributes: function() {
                    const resizeSensitiveAttributes = [
                        "width", "height", "show_sidebar",
                        "mobileviewport", "layout",
                        "sidebaroptions.presetwidth",
                        "fallback-aspect-ratio"
                    ];

                    resizeSensitiveAttributes.forEach((attr) => {
                        this.on(`change:${attr}`, () => {
                            this.__computeContainersStyleStates();
                        });
                    });
                },

                __computeContainersStyleStates: function(resizedContainer) {
                    const activeElement = this.activeElement();
                    if (!activeElement || (this.get("is_floating") && this.get(`states.floatingclosed`))) {
                        return;
                    }

                    let aspectRatio;
                    let activeElementStyles = {},
                        playerStyles = {},
                        sidebarStyles = {},
                        containerStyles = {};

                    // Only purpose declaring and calling as this way is to make code more readable
                    const {
                        resetPlayerStyles,
                        isSidebarPossible,
                        getFloatingStyles,
                        getSidebarWidthNum,
                        setSidebarPosition,
                        getPresetAspectRatioNum,
                        centerPlayerIfSmallerThanContainer,
                    } = this.__containerSizeComputeHelperFunctions();

                    if (this.get(`fullscreen`)) return resetPlayerStyles();

                    const containerDimensions = Dom.elementDimensions(activeElement.firstChild);
                    const {
                        width: containerWidthNum,
                        height: containerHeightNum
                    } = resizedContainer || containerDimensions;

                    const floatingOnly = !!this.get(`floatingoptions.floatingonly`);
                    const floating = this.get(`states.floatingclosed`) ? {} : getFloatingStyles(containerWidthNum);

                    const possibleSidebar = isSidebarPossible();
                    this.set(`states.possiblesidebar`, !!possibleSidebar);
                    const sidebarPosition = this.get(`sidebaroptions.position`);
                    const sidebarBorderRadius = this.get(`sidebaroptions.borderradius`);

                    const sidebarAsColumn = [undefined, null, `right`, `left`].includes(sidebarPosition);
                    this.set(`states.sidebarascolumn`, !!sidebarAsColumn);
                    let sidebarWidthNum = (possibleSidebar && sidebarAsColumn) ?
                        getSidebarWidthNum(containerWidthNum) : 0;
                    const expectedPlayerAspectRatioNum = getPresetAspectRatioNum(sidebarWidthNum);

                    let playerWidthNum = (containerWidthNum - sidebarWidthNum);
                    let width = containerWidthNum;
                    let height = (playerWidthNum / expectedPlayerAspectRatioNum) || containerHeightNum;

                    const presetWidth = this.get(`width`);
                    const presetHeight = this.get(`height`);

                    if (!presetHeight && !presetWidth) {
                        const containerAspectRatio = typeof height === "number" && height > 0 ?
                            (containerWidthNum / height) :
                            (containerWidthNum / containerHeightNum)
                        // This will make player fluid, both has to be aspectRatio
                        containerStyles.aspectRatio = containerAspectRatio;
                        activeElementStyles.aspectRatio = containerAspectRatio;
                    } else {
                        if (presetWidth) {
                            width = this.__convertToCSSSupportedUnit(presetWidth);
                            activeElementStyles.width = width;
                            containerStyles.width = width;
                        }

                        if (presetHeight) {
                            height = this.__convertToCSSSupportedUnit(presetHeight);
                            activeElementStyles.height = floatingOnly ? 0 : height;
                            containerStyles.height = this.__convertToCSSSupportedUnit(height);
                            if (expectedPlayerAspectRatioNum && !presetWidth) {
                                playerWidthNum = this.__convertCSSUnitToNumber(height) * expectedPlayerAspectRatioNum;
                                if (
                                    this.get(`sidebaroptions.presetwidth`) === null &&
                                    this.get(`sidebaroptions.preferredratio`) !== null &&
                                    sidebarWidthNum > 0
                                ) {
                                    sidebarWidthNum = containerWidthNum - playerWidthNum;
                                }
                            }
                        }
                    }

                    if (sidebarWidthNum > 0) {
                        // activeElementStyles.display = `flex`;
                        sidebarStyles.width = this.__convertToCSSSupportedUnit(sidebarWidthNum);
                        sidebarStyles.height = containerStyles.height || this.__convertToCSSSupportedUnit(height);
                    }

                    if (!containerStyles.aspectRatio) {
                        if (sidebarWidthNum > 0) {
                            aspectRatio = (containerWidthNum || (playerWidthNum + sidebarWidthNum)) / height;
                            aspectRatio = Number(aspectRatio.toFixed(2));
                            activeElement.aspectRatio = aspectRatio;
                            containerStyles.aspectRatio = aspectRatio;
                        } else {
                            containerStyles.height = this.__convertToCSSSupportedUnit(height);
                        }
                    }

                    if (Types.is_string(activeElementStyles.width) && activeElementStyles.width.includes(`%`)) {
                        containerStyles.width = `100%`;
                    }
                    playerStyles = centerPlayerIfSmallerThanContainer(playerStyles, playerWidthNum, containerWidthNum, 10);
                    playerStyles.width = playerWidthNum ? this.__convertToCSSSupportedUnit(playerWidthNum) : "100%";
                    playerStyles.height = this.__convertToCSSSupportedUnit(height);
                    // this.__playerAreaSize = playerDimensions.height * playerDimensions.width;
                    let computedStyles = {
                        floating,
                        aspectRatio,
                        player: playerStyles,
                        sidebar: sidebarStyles,
                        container: containerStyles,
                        activeElement: activeElementStyles,
                    };

                    if (possibleSidebar && Types.is_defined(sidebarPosition)) {
                        computedStyles = {
                            ...computedStyles,
                            ...setSidebarPosition(
                                computedStyles, sidebarPosition, sidebarBorderRadius
                            ),
                        }
                    }

                    this.set(`computedstyles`, computedStyles);
                },

                /**
                 * All return functions will are very tightly specific for dimensions calculations
                 * and using player instance. So why not moved to another module
                 * @return
                 */
                __containerSizeComputeHelperFunctions: function() {

                    const resetPlayerStyles = () => {
                        this.set(`computedstyles`, {});
                    }

                    const isSidebarPossible = (forFloatingOnly) => {
                        const gallerySidebar = this.get(`showsidebargallery`);
                        let sidebarCompanion = this.get(`sidebaroptions.showcompanionad`);

                        let floatingSidebar = this.get(`floatingoptions.sidebar`);

                        if (!!forFloatingOnly) return !!floatingSidebar && !this.get("states.sidebarclosed");

                        let possibleSidebar = (!!sidebarCompanion && this.get(`adshassource`));
                        possibleSidebar ||= (!this.get(`outstream`) && gallerySidebar);
                        possibleSidebar ||= (this.get(`is_floating`) && floatingSidebar);

                        return (possibleSidebar || !!this.get("with_sidebar")) && !this.get("states.sidebarclosed");
                    }

                    const getSidebarWidthNum = (containerWidth) => {
                        let presetWidth = this.get(`sidebarpresetwidth`);
                        presetWidth ||= this.get(`sidebaroptions.presetwidth`);
                        presetWidth ||= (this.get(`outstream`) ? `50%` : `30%`);

                        if (Types.is_string(presetWidth) && presetWidth.includes('px')) {
                            return Number(presetWidth.parseFloat().fixed(2));
                        }

                        const widthInPercentageNumber = _getDimensionAsFloatPercentage(presetWidth, containerWidth);
                        return containerWidth * widthInPercentageNumber;
                    }

                    const getPresetAspectRatioNum = (sidebarWidthNum) => {
                        const possibleSidebar = sidebarWidthNum > 0;
                        let expectedPlayerAspectRatioNum;
                        if (possibleSidebar) {
                            expectedPlayerAspectRatioNum = this.get(`sidebaroptions.aspectratio`);
                            expectedPlayerAspectRatioNum ||= this.get(`sidebaroptions.preferredratio`);
                        }
                        expectedPlayerAspectRatioNum ||= this.get(`aspectratio`);
                        expectedPlayerAspectRatioNum ||= this.get(`fallback-aspect-ratio`) || 1.77;
                        if (isNaN(expectedPlayerAspectRatioNum)) {
                            expectedPlayerAspectRatioNum = _convertAspectRatioToNumber(expectedPlayerAspectRatioNum);
                        }
                        return expectedPlayerAspectRatioNum;
                    }

                    const getFloatingStyles = (containerWidthNum) => {
                        let player = {},
                            sidebar = {},
                            container = {};

                        const isMobile = this.__isInMobileViewport();

                        const withSidebar = isSidebarPossible(true);
                        this.set(`with_sidebar`, !!withSidebar);

                        const expectedSidebarWidth = withSidebar ?
                            _getFloatingSidebarWidth(isMobile) : -1;

                        let {
                            height: heightNum,
                            width: playerWidthNum,
                            position,
                            sidebarPosition,
                            sidebarBorderRadius
                        } = _getFloatingDimensionsAndPosition(
                            isMobile, expectedSidebarWidth, containerWidthNum
                        );

                        let sidebarWidthNum = 0;
                        const sidebarAsColumn = [undefined, null, `right`, `left`].includes(sidebarPosition);
                        const borderRadius = sidebarAsColumn ? 0 : sidebarBorderRadius;

                        container.height = this.__convertToCSSSupportedUnit(heightNum);

                        if (playerWidthNum) {
                            player.width = this.__convertToCSSSupportedUnit(playerWidthNum);
                            if (expectedSidebarWidth > 0 && sidebarAsColumn) {
                                // if (isMobile && !this.get("sidebaroptions.mobile.sidebarwidth")) {
                                //     sidebarWidthNum = containerWidthNum - playerWidthNum;
                                // } else
                                if (expectedSidebarWidth <= 1) {
                                    if (isMobile) {
                                        containerWidthNum = `100%`;
                                        sidebarWidthNum = this.get(`sidebaroptions.mobile.sidebarwidth`) ?
                                            containerWidthNum * expectedSidebarWidth :
                                            `calc(100% - ${player.width})`;
                                    } else {
                                        containerWidthNum = playerWidthNum / (1 - expectedSidebarWidth);
                                        sidebarWidthNum = containerWidthNum - playerWidthNum;
                                    }
                                } else {
                                    if (isMobile) {
                                        containerWidthNum = `100%`;
                                        sidebarWidthNum = this.get(`sidebaroptions.mobile.sidebarwidth`) ?
                                            containerWidthNum - expectedSidebarWidth :
                                            `calc(100% - ${player.width})`;
                                    } else {
                                        sidebarWidthNum = expectedSidebarWidth;
                                        containerWidthNum = sidebarWidthNum + playerWidthNum;
                                    }
                                }
                                sidebar.width = this.__convertToCSSSupportedUnit(sidebarWidthNum);
                                container.width = this.__convertToCSSSupportedUnit(containerWidthNum);
                            } else {
                                container.width = isMobile ? `100%` : player.width;
                            }
                            if (container.width && !isMobile) player.width = `100%`;
                        } else {
                            console.warn(`something wrong with calculating floating player dimensions`);
                        }

                        container = {
                            ...container,
                            ...position,
                        };

                        player = centerPlayerIfSmallerThanContainer(player, playerWidthNum, containerWidthNum, 5);

                        const styles = {
                            player,
                            sidebar,
                            container
                        };

                        return {
                            ...styles,
                            ...setSidebarPosition(styles, sidebarPosition, borderRadius),
                        }
                    }

                    const centerPlayerIfSmallerThanContainer = (styles, playerWidthNum, containerWidthNum, moreThanPx) => {
                        const _moreThanPx = (!isNaN(moreThanPx) ? moreThanPx : 10) || 10;
                        if (playerWidthNum + _moreThanPx < containerWidthNum) {
                            return {
                                height: `100%`,
                                ...styles,
                                margin: `0 auto`,
                                position: `relative`,
                            };
                        }
                        return styles;
                    }

                    const setSidebarPosition = (styles, position, borderRadius) => {
                        const {
                            container,
                            sidebar
                        } = styles;
                        if (this.activeElement() && sidebar) {
                            const {
                                height
                            } = Dom.elementDimensions(this.activeElement().firstChild) || {};
                            if ([`top`, `bottom`].includes(position)) {
                                container.overflow = `visible`;
                                container.flexDirection = `column`
                                sidebar.overflow = `overlay`;
                                sidebar.width = `100%`;
                                sidebar.position = `absolute`;
                                sidebar.borderRadius = borderRadius || 0;
                            }
                            switch (position) {
                                case `left`:
                                    container.flexDirection = `row`
                                    container.flexDirection = `row-reverse`;
                                    break;
                                case `top`:
                                    container.flexDirection = `column-reverse`;
                                    sidebar.bottom = Types.is_defined(height) ? this.__convertToCSSSupportedUnit(height + 10) : 0;
                                    break;
                                case `bottom`:
                                    sidebar.top = Types.is_defined(height) ? this.__convertToCSSSupportedUnit(height + 10) : 0;
                                    break;
                                default:
                                    container.flexDirection = `row`
                                    break;
                            }
                        }

                        return {
                            ...container,
                            ...sidebar,
                        };
                    }

                    const _getFloatingPosition = (isMobile, settings, positions) => {
                        const styles = {};
                        const _positions = positions.split("-");
                        Objs.iter(["top", "right", "bottom", "left"], function(val) {
                            if ((val === `right` || val === `left`) && isMobile) return;
                            if (_positions.includes(val)) {
                                styles[val] = settings[val] ? this.__convertToCSSSupportedUnit(settings[val]) : 0;
                            }
                        }, this);
                        return styles;
                    }

                    // get percentage as float number less than 1
                    const _getDimensionAsFloatPercentage = (value, basedContainerInPx) => {
                        if (isNaN(value)) {
                            if (value.includes("%")) {
                                return Number(parseFloat(value).toFixed(2)) / 100;
                            } else if (value.includes("px") && !isNaN(parseFloat(basedContainerInPx))) {
                                return basedContainerInPx / Number(parseFloat(value).toFixed(2));
                            } else {
                                console.warn(`Please provide correct CSS unit as "px" or "%"`);
                            }
                        } else {
                            value = value > 1 ? value / 100 : value;
                        }
                        return Number(value > 0 ? value : 0);
                    }

                    const _getFloatingSidebarWidth = () => {
                        let presetWidth = this.get("floatingoptions.sidebarwidth") || 50;
                        const num = this.__convertCSSUnitToNumber(presetWidth);
                        if (isNaN(presetWidth) && num > 1 && !presetWidth.includes(`%`)) {
                            return num;
                        }
                        return Number(num > 1 ? (num / 100).toFixed(2) : num);
                    }

                    const _convertAspectRatioToNumber = (ar) => {
                        if (!ar) return null;
                        if (isNaN(ar)) {
                            let aspectRatio = ar.split(/[:\/]/, 2);
                            if (Types.is_array(aspectRatio) && aspectRatio.length === 2) {
                                ar = (parseFloat(aspectRatio[0]) / parseFloat(aspectRatio[1])).toFixed(2);
                            } else {
                                ar = ar.parseFloat().fixed(2);
                            }
                        }
                        return Number(ar);
                    }

                    const _getFloatingDimensionsAndPosition = (isMobile, sidebarWidth, containerWidth) => {
                        const floatingOptions = this.get(`floatingoptions`);
                        const withSidebar = sidebarWidth !== -1;

                        let presetAspectRatio = floatingOptions['aspectratio'];
                        let fallbackAR = this.get("aspectratio");
                        fallbackAR ||= this.get("fallback-aspect-ratio") || 1.77;

                        fallbackAR = _convertAspectRatioToNumber(fallbackAR);
                        presetAspectRatio = _convertAspectRatioToNumber(presetAspectRatio);

                        const fallback = {
                            height: this.get(`floating-fallback-${isMobile ? 'mobile' : 'desktop'}-height`),
                            position: isMobile ? "top" : "bottom-right",
                        }

                        const presetHeight = floatingOptions['height'];
                        const fallbackHeight = fallback['height'] || (isMobile ? 75 : 240);
                        const presetPosition = floatingOptions['position'] || fallback['position'];

                        if (floatingOptions['width']) {
                            console.warn(`floating options are not supporting width parameter, for now`);
                        }

                        let width, height = presetHeight;
                        if (presetHeight && presetAspectRatio) {
                            width = presetAspectRatio * height;
                        } else if (presetHeight && fallbackAR) {
                            width = fallbackAR * height;
                        } else {
                            if (isMobile) {
                                if (withSidebar) {
                                    width = withSidebar > 1 ?
                                        containerWidth - sidebarWidth :
                                        containerWidth * (1 - sidebarWidth);
                                    height = width / (presetAspectRatio || fallbackAR);
                                } else {
                                    height = containerWidth / (presetAspectRatio || fallbackAR);
                                }
                            } else {
                                height = fallbackHeight;
                                width = height * (presetAspectRatio ? presetAspectRatio : fallbackAR);
                            }
                        }

                        return {
                            height,
                            width: width || `100%`,
                            sidebarPosition: floatingOptions['sidebarposition'] || `right`,
                            sidebarBorderRadius: floatingOptions[`borderradius`] || 0,
                            position: _getFloatingPosition(isMobile, floatingOptions, presetPosition)
                        };
                    };

                    return {
                        resetPlayerStyles,
                        isSidebarPossible,
                        getFloatingStyles,
                        getSidebarWidthNum,
                        setSidebarPosition,
                        getPresetAspectRatioNum,
                        centerPlayerIfSmallerThanContainer
                    };
                },

                __convertToCSSSupportedUnit: function(measure, propertyName) {
                    const propertyNamePassed = Types.is_defined(propertyName);
                    const _propertyName = propertyName || "width";
                    const _measure = isNaN(measure) ? measure : parseFloat(measure).toFixed(2) + "px";
                    if (window && !window.CSS.supports(_propertyName, _measure)) {
                        let message = `Value: "${_measure}" you provided as CSS unit, not supported by the browser`;
                        message += propertyNamePassed ? `for the CSS ${_propertyName} property name;` : ``;
                        console.error(message);
                    }
                    return _measure;
                },

                __convertCSSUnitToNumber: function(unit) {
                    let convertedUnit;
                    if (isNaN(unit)) {
                        if (Types.is_string(unit)) {
                            if (unit.includes("%")) {
                                return Number(parseFloat(unit).toFixed(2)) / 100;
                            } else if (unit.includes("px")) {
                                return Number(parseFloat(unit).toFixed(2));
                            } else {
                                const convertedUnit = parseFloat(unit).toFixed(2);
                            }
                        } else {
                            console.warn(`${this.__convertCSSUnitToNumber.name}: argument is not correct`);
                            return 0;
                        }
                    }
                    return Number(convertedUnit || unit);
                },

                __applyMobileRelativePositionBasedOnSelector: function() {
                    let playerApplyForSelector, documentRelativeSelector, positioningApplySelector, positioningRelativeSelector, positioningProperty;
                    positioningApplySelector = this.get("floatingoptions.mobile.positioning.applySelector");
                    positioningRelativeSelector = this.get("floatingoptions.mobile.positioning.relativeSelector");
                    positioningProperty = Strings.camelCase(this.get("floatingoptions.mobile.positioning.applyProperty") || 'margin-top');
                    if (typeof positioningRelativeSelector === "string") {
                        if (positioningRelativeSelector) {
                            playerApplyForSelector = this.activeElement().querySelector(positioningApplySelector);
                        }
                        if (playerApplyForSelector) {
                            playerApplyForSelector = this.activeElement().firstChild;
                        }
                        documentRelativeSelector = document.querySelector(positioningRelativeSelector);
                        if (documentRelativeSelector && playerApplyForSelector) {
                            const relativeSelectorHeight = Dom.elementDimensions(documentRelativeSelector).height;
                            playerApplyForSelector.style[positioningProperty] = relativeSelectorHeight + 'px';
                        }
                    }
                },

                _recordPerformance: function(name) {
                    const recordName = `${this.get(`performanceprefix`)}-${name}`;
                    // Entry Types starting Chrome 59: "element", "event", "first-input",
                    // "largest-contentful-paint", "layout-shift", "longtask", "mark",
                    // "measure", "navigation", "paint", "resource"
                    if (this.__previousMark) {
                        performance.measure(recordName, this.__previousMark);
                    }
                    this.__previousMark = recordName;
                    performance.mark(recordName);
                },

                __performanceObserverFunc: function(list) {
                    list.getEntries().forEach((entry) => {
                        let name;
                        switch (entry.entryType) {
                            case `navigation`:
                                name = `${this.get(`performanceprefix`)}-navigation`;
                                break;
                            case `element`:
                                name = entry.identifier || entry.name;
                                break;
                            default:
                                name = entry.name
                        }
                        const index = this.get(`performancerecords`).findIndex(
                            pr => (pr && pr.name === name)
                        );
                        const perf = index > -1 ? this.get(`performancerecords`)[index] : {
                            name
                        };
                        const records = [{
                                type: `mark`,
                                keys: [`duration`, `startTime`],
                            },
                            {
                                type: `measure`,
                                keys: [`duration`],
                            },
                            {
                                type: `navigation`,
                                keys: [`domInteractive`, `loadEventEnd`, `domComplete`]
                            },
                            {
                                type: `element`,
                                keys: [`loadTime`, `naturalHeight`, `naturalWidth`, `renderTime`]
                            }
                        ];
                        records.forEach((k) => {
                            if (!k.keys || !k.type || entry.entryType !== k.type) return;
                            k.keys.forEach((key) => {
                                if (entry[key]) perf[key] = entry[key];
                            });
                        });
                        // to be able to trigger change event
                        if (index > -1) this.get(`performancerecords`)[index] = perf;
                        this.set(`performancerecords`, index > -1 ? this.get(`performancerecords`) : [
                            ...this.get(`performancerecords`),
                            perf
                        ]);
                    }, this);
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