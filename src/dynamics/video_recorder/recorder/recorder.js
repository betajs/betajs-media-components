Scoped.define("module:VideoRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Assets",
    "module:StylesMixin",
    "browser:Info",
    "browser:Dom",
    "browser:Events",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:Recorder.VideoRecorderWrapper",
    "media:Recorder.Support",
    "media:WebRTC.Support",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Collections.Collection",
    "base:Promise",
    "module:VideoRecorder.Dynamics.RecorderStates.Initial",
    "module:VideoRecorder.Dynamics.RecorderStates"
], [
    "module:VideoRecorder.Dynamics.Imagegallery",
    "module:VideoRecorder.Dynamics.Loader",
    "module:VideoRecorder.Dynamics.Controlbar",
    "module:VideoRecorder.Dynamics.Message",
    "module:VideoRecorder.Dynamics.Topmessage",
    "module:VideoRecorder.Dynamics.Chooser",
    "module:VideoRecorder.Dynamics.Faceoutline",
    "module:Common.Dynamics.Helperframe",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, StylesMixin, Info, Dom, DomEvents, MultiUploader, FileUploader, VideoRecorderWrapper, RecorderSupport, WebRTCSupport, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/recorder.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-videorecorder",
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
                    "iecss": "ba-videorecorder",
                    "cssimagegallery": "",
                    "cssloader": "",
                    "csscontrolbar": "",
                    "cssmessage": "",
                    "csstopmessage": "",
                    "csschooser": "",
                    "csshelperframe": "",
                    "gallerysnapshots": 3,
                    "popup-width": "",
                    "popup-height": "",

                    /* Themes */
                    "theme": "",
                    "csstheme": "",
                    "themecolor": "",

                    /* Dynamics */
                    "dynimagegallery": "videorecorder-imagegallery",
                    "dynloader": "videorecorder-loader",
                    "dyncontrolbar": "videorecorder-controlbar",
                    "dynmessage": "videorecorder-message",
                    "dyntopmessage": "videorecorder-topmessage",
                    "dynchooser": "videorecorder-chooser",
                    "dynvideoplayer": "videoplayer",
                    "dynhelperframe": "helperframe",

                    /* Templates */
                    "tmplimagegallery": "",
                    "tmplloader": "",
                    "tmplcontrolbar": "",
                    "tmplmessage": "",
                    "tmpltopmessage": "",
                    "tmplchooser": "",
                    "tmplhelperframe": "",

                    /* Attributes */
                    "autorecord": false,
                    "autoplay": false,
                    "allowrecord": true,
                    "allowupload": true,
                    "allowcustomupload": true,
                    "manual-upload": false,
                    "camerafacefront": false,
                    "fittodimensions": false,
                    "resizemode": null, // enum option to scale screen recorder, has 2 options: 'crop-and-scale',  'none'
                    "createthumbnails": false,
                    "primaryrecord": true,
                    "allowscreen": false,
                    "initialmessages": [], // should include object at least with message key, and optional type with enum: "error", "warninig" (default) or "success"
                    "screenrecordmandatory": false,
                    "nofullscreen": false,
                    "recordingwidth": undefined,
                    "recordingheight": undefined,
                    "minuploadingwidth": undefined,
                    "maxuploadingwidth": undefined,
                    "minuploadingheight": undefined,
                    "maxuploadingheight": undefined,
                    "countdown": 3,
                    "snapshotmax": 15,
                    "framerate-warning": null,
                    "framerate": null,
                    "audiobitrate": null,
                    "videobitrate": null,
                    "snapshottype": "jpg",
                    "picksnapshots": true,
                    "playbacksource": "",
                    "screen": {},
                    "playbackposter": "",
                    "recordermode": true,
                    "skipinitial": false,
                    "skipinitialonrerecord": false,
                    "timelimit": null,
                    "timeminlimit": null,
                    "webrtcstreaming": false,
                    "webrtconmobile": false,
                    "webrtcstreamingifnecessary": true,
                    "microphone-volume": 1.0,
                    "flip-camera": false,
                    "flipscreen": false, // Will affect as true, if flip-camera also set as true
                    "early-rerecord": false,
                    "custom-covershots": false,
                    "selectfirstcovershotonskip": false,
                    "picksnapshotmandatory": false,
                    "media-orientation": null, // possible options "landscape", "portrait"
                    "manualsubmit": false,
                    "allowedextensions": null,
                    "filesizelimit": null,
                    "faceoutline": false,
                    "display-timer": true,
                    "pausable": false,
                    "sharevideo": [],
                    "videofitstrategy": "pad",
                    "posterfitstrategy": "crop",
                    "placeholderstyle": "",
                    "hasplaceholderstyle": false,
                    /** outsource-selectors should start with cam-* or/and mic-* will add in the feature other selectors.
                     * If set skipinitial devices info will be accessible w/o pressing record button
                     * all settings should be seperated by ';' and has to be ID selector (only characters: "-", "_", numbers and letters allowed)
                     * OPTIONS:
                     * 'type': Could be manage type of element, by default will be 'select' element
                     * possible types: 'radio', 'select'(default) all should be as a string
                     * 'disabled': Could be set disable by default, and of there're no option more than 1
                     * device selection. Default is true
                     * 'className': will be added as a class attribute to single option and in label for radio
                     * 'showCapabilities' for camera only and if available camera resolutions info provided
                     * by browser. Default is true
                     * examples:
                     * "cam-my-own-id-selector;mic-my-own-id-selector"
                     * "cam-my-own-id-selector[type='select',disabled=false,showCapabilities=true];mic-my-own-id-selector[type='radio',className='class1 class2 etc']"
                     */
                    "outsource-selectors": null,

                    /* Configuration */
                    "simulate": false,
                    "onlyaudio": false,
                    "noaudio": false,
                    "enforce-duration": null,
                    "localplayback": false,
                    "uploadoptions": {},
                    "playerattrs": {},
                    "shortMessage": true,
                    "cpu-friendly": false,

                    /* Options */
                    "rerecordable": true,
                    "allowcancel": false,
                    "recordings": null,
                    "ready": true,
                    "orientation": false,
                    "popup": false,
                    "popup-stretch": false,
                    "audio-test-mandatory": false,
                    "snapshotfromuploader": false,
                    "snapshotfrommobilecapture": false,
                    "allowmultistreams": false,
                    "showaddstreambutton": false,
                    "multistreamreversable": true,
                    "multistreamdraggable": true,
                    "multistreamresizeable": false,
                    "addstreamproportional": true,
                    "addstreampositionx": 5,
                    "addstreampositiony": 5,
                    "addstreampositionwidth": 120,
                    "addstreampositionheight": null,
                    "addstreamminwidth": 120,
                    "addstreamminheight": null,
                    "addstreamdeviceid": null,
                    "showsettingsmenu": true, // As a property show/hide settings from users
                    "showplayersettingsmenu": true, // As a property show/hide after recorder player settings from users

                    "allowtexttrackupload": false,
                    "framevisible": false,
                    "uploadlocales": [{
                        lang: 'en',
                        label: 'English'
                    }],
                    "tracktags": [],
                    "outsourceSelectors": [],
                    "hassubtitles": false,
                    "videometadata": {},
                    "optionsinitialstate": {},
                    "playerfallbackwidth": 320,
                    "playerfallbackheight": 240,
                    "pickcovershotframe": false,
                    "allowtrim": false,
                    "trimoverlay": true
                },

                computed: {
                    "nativeRecordingWidth:recordingwidth,record_media": function() {
                        return this.get("recordingwidth") || ((this.get("record_media") !== "screen" && (this.get("record_media") !== "multistream")) ? 640 : (window.innerWidth || document.body.clientWidth));
                    },
                    "nativeRecordingHeight:recordingheight,record_media": function() {
                        return this.get("recordingheight") || ((this.get("record_media") !== "screen" && (this.get("record_media") !== "multistream")) ? 480 : (window.innerHeight || document.body.clientHeight));
                    },
                    "containerSizingStyles:aspectratio,nativeRecordingWidth,nativeRecordingHeight,activated": function(aspectRatio, fallbackWidth, fallbackHeight, active) {
                        var result = {
                            aspectRatio: aspectRatio || fallbackWidth + "/" + fallbackHeight
                        };
                        if (active && (Info.isInternetExplorer() || (Info.isSafari() && Info.safariVersion() < 15))) {
                            new ResizeObserver(function(entries) {
                                this.set("height", Math.floor(entries[0].target.offsetWidth / (aspectRatio || (fallbackWidth / fallbackHeight))));
                            }.bind(this)).observe(this.activeElement().parentElement);
                            result.height = Math.floor(this.activeElement().parentElement.offsetWidth / (aspectRatio || (fallbackWidth / fallbackHeight))) + "px";
                        }
                        if (this.activeElement()) this._applyStyles(this.activeElement(), result, this.__lastContainerSizingStyles);
                        this.__lastContainerSizingStyles = result;
                        return result;
                    },
                    "canswitchcamera:recordviafilecapture": function() {
                        return !this.get("recordviafilecapture") && Info.isMobile();
                    }
                },

                scopes: {
                    player: ">[id='player']"
                },

                types: {
                    "allowscreen": "boolean",
                    "rerecordable": "boolean",
                    "ready": "boolean",
                    "fittodimensions": "boolean",
                    "autorecord": "boolean",
                    "autoplay": "boolean",
                    "allowrecord": "boolean",
                    "allowupload": "boolean",
                    "allowcustomupload": "boolean",
                    "primaryrecord": "boolean",
                    "recordermode": "boolean",
                    "nofullscreen": "boolean",
                    "skipinitialonrerecord": "boolean",
                    "picksnapshots": "boolean",
                    "localplayback": "boolean",
                    "camerafacefront": "boolean",
                    "noaudio": "boolean",
                    "skipinitial": "boolean",
                    "popup": "boolean",
                    "popup-stretch": "boolean",
                    "popup-width": "int",
                    "popup-height": "int",
                    "enforce-duration": "bool",
                    "webrtcstreaming": "boolean",
                    "themecolor": "string",
                    "webrtconmobile": "boolean",
                    "manual-upload": "boolean",
                    "webrtcstreamingifnecessary": "boolean",
                    "microphone-volume": "float",
                    "audiobitrate": "int",
                    "videobitrate": "int",
                    "minuploadingwidth": "int",
                    "maxuploadingwidth": "int",
                    "minuploadingheight": "int",
                    "maxuploadingheight": "int",
                    "framerate-warning": "int",
                    "snapshotfromuploader": "boolean",
                    "snapshotfrommobilecapture": "boolean",
                    "flip-camera": "boolean",
                    "flipscreen": "boolean",
                    "faceoutline": "boolean",
                    "early-rerecord": "boolean",
                    "custom-covershots": "boolean",
                    "picksnapshotmandatory": "boolean",
                    "selectfirstcovershotonskip": "boolean",
                    "manualsubmit": "boolean",
                    "simulate": "boolean",
                    "allowedextensions": "array",
                    "onlyaudio": "boolean",
                    "cpu-friendly": "boolean",
                    "allowcancel": "boolean",
                    "display-timer": "boolean",
                    "audio-test-mandatory": "boolean",
                    "allowtexttrackupload": "boolean",
                    "uploadlocales": "array",
                    "allowmultistreams": "boolean",
                    "pausable": "boolean",
                    "sharevideo": "array",
                    "multistreamreversable": "boolean",
                    "multistreamdraggable": "boolean",
                    "multistreamresizeable": "boolean",
                    "addstreamproportional": "boolean",
                    "addstreampositionx": "int",
                    "addstreampositiony": "int",
                    "addstreampositionwidth": "int",
                    "addstreampositionheight": "int",
                    "addstreamminwidth": "int",
                    "addstreamminheight": "int",
                    "showsettingsmenu": "boolean",
                    "showplayersettingsmenu": "boolean",
                    "initialmessages": "array",
                    "screenrecordmandatory": "boolean",
                    "media-orientation": "string",
                    "mandatoryresolutions": "array",
                    "pickcovershotframe": "boolean",
                    "allowtrim": "boolean",
                    "trimoverlay": "boolean",
                    "outsourceSelectors": []
                },

                extendables: ["states"],

                remove_on_destroy: true,

                events: {
                    "change:camerahealthy": function(value) {
                        this.trigger("camerahealth", value);
                    },
                    "change:microphonehealthy": function(value) {
                        this.trigger("microphonehealth", value);
                    },
                    "change:webrtconmobile": function() {
                        this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !VideoRecorderWrapper.anySupport(this._videoRecorderWrapperOptions())));
                    },
                    "change:recordviafilecapture": function() {
                        if (this.get("recordviafilecapture")) {
                            this.set("skipinitial", false);
                            this.set("skipinitialonrerecord", false);
                            this.set("autorecord", false);
                            this._screenRecorderVerifier(false);
                        }
                    },
                    "change:placeholderstyle": function(value) {
                        this.set("hasplaceholderstyle", value.length > 10);
                    }
                },

                create: function() {
                    this._validateParameters();
                    // Init Audio Context
                    WebRTCSupport.globals();
                    this.set("optionsinitialstate", {
                        autorecord: this.get("autorecord"),
                        skipinitial: this.get("skipinitial")
                    });

                    if (this.get("theme")) this.set("theme", this.get("theme").toLowerCase());
                    if (this.get("theme") in Assets.recorderthemes) {
                        Objs.iter(Assets.recorderthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }
                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

                    if (this.get("pausable"))
                        this.set("resumevisible", false);

                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("hideoverlay", false);
                    this.set("firefox", Info.isFirefox());

                    this.set("canswitchcamera", false);
                    this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !VideoRecorderWrapper.anySupport(this._videoRecorderWrapperOptions())));

                    if (this.get("outsource-selectors")) {
                        var selectors = Objs.map(this.get("outsource-selectors").split(/;/), function(item) {
                            var obj = {
                                options: {
                                    type: 'select',
                                    disabled: true,
                                    showCapabilities: true
                                }
                            };
                            var options = '';
                            var splitted = item.split("[");
                            var selector = splitted[0];
                            var camSelectorPatters = /^cam\-[A-Za-z\d\-\_]*/i;
                            var micSelectorPatters = /^mic\-[A-Za-z\d\-\_]*/i;
                            if (camSelectorPatters.test(selector)) {
                                obj.isCamera = true;
                                obj.selector = selector;
                            }
                            if (micSelectorPatters.test(selector)) {
                                obj.isCamera = false;
                                obj.selector = selector;
                            }

                            if (splitted[1]) {
                                options = splitted[1].replace(/\]$/, "")
                                    .replace(/\=/g, ':').replace(/\'/g, '"')
                                    .replace(/(\w+:)|(\w+ :)/g, function(matchedStr) {
                                        return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
                                    });
                            }
                            if (options.length > 5) {
                                try {
                                    var parsedOptions = JSON.parse("{" + options + "}");
                                    obj.options = Objs.tree_extend(obj.options, parsedOptions);
                                } catch (e) {
                                    console.warn("Wrong settins for 'outsource-selectors' was provided");
                                }
                            }

                            if (!Types.is_undefined(obj.isCamera)) {
                                return obj;
                            }

                        }, this);
                        this.set("outsourceSelectors", selectors);
                    }

                    if (this.get("recordviafilecapture")) {
                        this.set("skipinitial", false);
                        this.set("skipinitialonrerecord", false);
                        this.set("autorecord", false);
                        this._screenRecorderVerifier(false);
                    }

                    this.__attachRequested = false;
                    this.__activated = false;
                    this._bound = false;
                    this.__recording = false;
                    this.__error = null;

                    this.host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.recorderStates())
                    });
                    this.host.dynamic = this;
                    this.host.initialize(InitialState);

                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 250,
                        start: true
                    });

                    this.activeElement().style.setProperty("display", "inline-block");
                    this._applyStyles(this.activeElement(), this.get("containerSizingStyles"));

                    this.__cameraResponsive = true;
                    this.__cameraSignal = true;

                    this._initSettings();

                    if (this.get("onlyaudio")) {
                        this.set("allowupload", false);
                        this.set("orientation", false);
                        // By default custom-covershots is false, if user want poster they can upload it
                        this.set("picksnapshots", this.get("custom-covershots"));
                    }
                    if (!Info.isMobile())
                        this.set("orientation", false);
                    this.set("currentorientation", window.innerHeight > window.innerWidth ? "portrait" : "landscape");
                    this._screenRecorderVerifier();
                },

                state: function() {
                    return this.host.state();
                },

                recorderAttached: function() {
                    return !!this.recorder;
                },

                videoError: function() {
                    return this.__error;
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

                _detachRecorder: function() {
                    if (this.recorder)
                        this.recorder.weakDestroy();
                    this.recorder = null;
                    this.set("hasrecorder", false);
                    // to prevent autorecord if user not set, but use reset()
                    this.set("autorecord", this.get("optionsinitialstate").autorecord);
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

                    var deprecatedCSS = ["width", "height", "minheight", "minwidth", "minheight", "minwidth"];
                    deprecatedCSS.forEach(function(parameter) {
                        if (this.get(parameter)) console.warn(parameter + " parameter was deprecated, please use CSS instead.");
                    }.bind(this));
                },

                _videoRecorderWrapperOptions: function() {
                    var _screen = null;
                    var _resizeMode = this.get("resizemode");
                    if ((this.get("allowscreen") && this.get("record_media") === "screen") || (this.get("allowmultistreams") && this.get("record_media") === "multistream")) {
                        _screen = this.get("screen");
                        if (!_resizeMode) {
                            _resizeMode = 'none';

                        }
                    }
                    if (!this.get("allowrecord") && (this.get("autorecord") || this.get("skipinitial"))) {
                        if (this.get("allowscreen") || this.get("allowmultistreams")) {
                            this.set("record_media", this.get("allowscreen") ? "screen" : "multistream");
                            _screen = {};
                        }
                    }

                    return {
                        simulate: this.get("simulate"),
                        recordVideo: !this.get("onlyaudio"),
                        screenResizeMode: this.get("screenresizemode"),
                        recordAudio: !this.get("noaudio"),
                        recordingWidth: this.get("nativeRecordingWidth"),
                        recordingHeight: this.get("nativeRecordingHeight"),
                        audioBitrate: typeof this.get("audiobitrate") === "number" ? this.get("audiobitrate") : undefined,
                        videoBitrate: typeof this.get("videobitrate") === "number" ? this.get("videobitrate") : undefined,
                        webrtcStreaming: !!this.get("webrtcstreaming"),
                        webrtcStreamingIfNecessary: !!this.get("webrtcstreamingifnecessary"),
                        // webrtcOnMobile: !!this.get("webrtconmobile"),
                        localPlaybackRequested: this.get("localplayback"),
                        screen: _screen,
                        resizeMode: _resizeMode,
                        framerate: this.get("framerate"),
                        flip: this.get("flip-camera"),
                        flipscreen: this.get("flipscreen"),
                        fittodimensions: this.get("fittodimensions"),
                        cpuFriendly: this.get("cpu-friendly")
                    };
                },

                _attachRecorder: function() {
                    if (this.recorderAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    if (this.get("record_media") === "screen" && typeof navigator.mediaDevices !== 'undefined')
                        if (typeof navigator.mediaDevices.getDisplayMedia === "undefined")
                            this.set("webrtcstreaming", true);
                    this.set("hasrecorder", true);
                    this.__attachRequested = false;
                    var video = this.activeElement().querySelector("[data-video='video']");
                    this._clearError();
                    this.recorder = VideoRecorderWrapper.create(Objs.extend({
                        element: video
                    }, this._videoRecorderWrapperOptions()));
                    if (this.recorder) {
                        this.trigger("attached");
                        this.set("pausable", this.get("pausable") && this.recorder.canPause());
                    } else
                        this._error("attach");
                },

                _softwareDependencies: function() {
                    if (!this.recorderAttached() || !this.recorder)
                        return Promise.error("No recorder attached.");
                    return this.recorder.softwareDependencies();
                },

                _bindMedia: function() {
                    if (this._bound || !this.recorderAttached() || !this.recorder)
                        return;
                    this.recorder.ready.success(function() {
                        if (!this.recorder) return;
                        this.recorder.on("require_display", function() {
                            this.set("hideoverlay", true);
                        }, this);
                        this.recorder.bindMedia().error(function(e) {
                            this.trigger("access_forbidden", e);
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this._error("bind", e);
                        }, this).success(function() {
                            if (!this.recorder) return;
                            this.trigger("access_granted");
                            this.recorder.setVolumeGain(this.get("microphone-volume"));
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this.recorder.once("mainvideostreamended", function() {
                                this.trigger("mainvideostreamended");
                            }, this);
                            this.recorder.enumerateDevices().success(function(devices) {
                                if (!this.recorder) return;
                                this.recorder.once("currentdevicesdetected", function(currentDevices) {
                                    this.set("selectedcamera", currentDevices.video);
                                    this.set("selectedmicrophone", currentDevices.audio);
                                    if (this.get("outsourceSelectors").length > 0) {
                                        this.setOutsourceSelectors(currentDevices);
                                    }
                                }, this);
                                this.set("cameras", new Collection(Objs.values(devices.video)));
                                this.set("microphones", new Collection(Objs.values(devices.audio)));
                                this.trigger(Types.is_empty(devices.video) ? "no_camera" : "has_camera");
                                this.trigger(Types.is_empty(devices.audio) ? "no_microphone" : "has_microphone");
                                this.set("showaddstreambutton", this._showAddStreamButton());
                            }, this);
                            if (!this.get("noaudio"))
                                this.recorder.testSoundLevel(true);
                            this.set("devicetesting", true);
                            while (this.get("snapshots").length > 0) {
                                var snapshot = this.get("snapshots").unshift();
                                this.recorder.removeSnapshot(snapshot);
                            }
                            this._bound = true;
                            this.trigger("bound");
                        }, this);
                    }, this);
                },

                isWebrtcStreaming: function() {
                    return this.recorder && this.recorder.isWebrtcStreaming();
                },

                _showAddStreamButton: function() {
                    return this.get("allowmultistreams") && (this.get("cameras").count() > 1 || this.get("cameras").count() >= 1 && ((this.get("record_media") !== "screen" || (this.get("record_media") !== "multistream"))));
                },

                _initSettings: function() {
                    // Without below line re-recorder will not launch
                    this.set("snapshots", []);
                    this.thumbnails = [];
                    this.__lastCovershotUpload = undefined;
                    this.__pauseDelta = 0;
                    this.set("starttime", undefined);
                    this.set("endtime", undefined);
                    this.set("duration", 0);
                    this.set("videometadata", {
                        "height": null,
                        "width": null,
                        "ratio": null,
                        "thumbnails": {
                            "mainimage": null,
                            "images": []
                        },
                        "placeholderSnapshot": null
                    });
                },

                _initializeUploader: function() {
                    if (this._dataUploader)
                        this._dataUploader.weakDestroy();
                    this._dataUploader = new MultiUploader();
                },

                _unbindMedia: function() {
                    if (!this._bound)
                        return;
                    this.recorder.unbindMedia();
                    this._bound = false;
                },

                _uploadCovershot: function(image) {
                    if (this.get("simulate"))
                        return;
                    this.__lastCovershotUpload = image;
                    var uploader = this.recorder ?
                        this.recorder.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image) :
                        RecorderSupport.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image);
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _uploadCovershotFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    this.__lastCovershotUpload = file;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").image));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                /**
                 * Upload single image Blob file with thumbnails to the server
                 * @param {Blob} file
                 * @private
                 */
                _uploadThumbnails: function(file) {
                    if (this.get("simulate"))
                        return;
                    this.set("videometadata", Objs.tree_merge(this.get("videometadata"), {
                        thumbnails: {
                            mainimage: file
                        }
                    }));
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").thumbnail));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                /**
                 * Upload VTT Blob file to the server with all details about thumbnails
                 * @param {Blob} file
                 * @private
                 */
                _uploadThumbnailTracks: function(file) {
                    if (this.get("simulate"))
                        return;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").tracks));
                    // Add Thumbnails as Track element to the player
                    if (this.get("uploadoptions").tracks.url) {
                        this.get("tracktags").push({
                            kind: 'thumbnails',
                            src: this.get("uploadoptions").tracks.url
                        });
                    }
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _uploadVideoFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").video));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _prepareRecording: function() {
                    return Promise.create(true);
                },

                _startRecording: function() {
                    if (this.__recording)
                        return Promise.error(true);
                    if (!this.get("noaudio"))
                        this.recorder.testSoundLevel(false);
                    this.set("devicetesting", false);
                    return this.recorder.startRecord({
                        video: this.get("uploadoptions").video,
                        audio: this.get("uploadoptions").audio,
                        webrtcStreaming: this.get("uploadoptions").webrtcStreaming
                    }).success(function() {
                        this.__recording = true;
                        this.__recording_start_time = Time.now();
                    }, this);
                },

                _stopRecording: function() {
                    if (!this.__recording)
                        return Promise.error(true);
                    return this.recorder.stopRecord({
                        video: this.get("uploadoptions").video,
                        audio: this.get("uploadoptions").audio,
                        webrtcStreaming: this.get("uploadoptions").webrtcStreaming,
                        noUploading: this.get("uploadoptions").noUploading
                    }).success(function(uploader) {
                        this.__recording = false;
                        uploader.upload();
                        this._dataUploader.addUploader(uploader);
                    }, this);
                },

                isRecording: function() {
                    return this.__recording;
                },

                _verifyRecording: function() {
                    return Promise.create(true);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.set("activated", true);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachRecorder();
                    this.persistentTrigger("loaded");
                    this.activeElement().classList.add(this.get("csscommon") + "-full-width");
                    this.activeElement().classList.add(this.get("csscommon") + "-max-height-100vh");
                },

                _showBackgroundSnapshot: function() {
                    if (this.get("onlyaudio"))
                        return;
                    this._hideBackgroundSnapshot();
                    if (this.get("snapshots") && this.get("selectfirstcovershotonskip")) {
                        if (this.get("snapshots")[0])
                            this.__backgroundSnapshot = this.get("snapshots")[0];
                    }
                    if (!this.__backgroundSnapshot && this.recorder) {
                        this.__backgroundSnapshot = this.recorder.createSnapshot(this.get("snapshottype"));
                    }
                    var el = this.activeElement().querySelector("[data-video]");
                    var dimensions = Dom.elementDimensions(el);
                    if (this.__backgroundSnapshot) {
                        var _top, _left, _width, _height, _dimensions;
                        _top = 0;
                        _left = 0;
                        _width = dimensions.width;
                        _height = dimensions.height;
                        if (this.recorder._recorder._videoTrackSettings && typeof this.recorder._recorder._videoTrackSettings.videoInnerFrame !== "undefined") {
                            _dimensions = this.recorder._recorder._videoTrackSettings.videoInnerFrame;
                            _width = _dimensions.width || _width;
                            _height = _dimensions.height || _height;
                            _left = (dimensions.width - _width) / 2;
                            _top = (dimensions.height - _height) / 2;
                        }
                        this.__backgroundSnapshotDisplay = this.recorder.createSnapshotDisplay(el, this.__backgroundSnapshot, _left, _top, _width, _height);
                    }

                },

                _hideBackgroundSnapshot: function() {
                    if (this.get("onlyaudio"))
                        return;
                    if (this.__backgroundSnapshotDisplay)
                        this.recorder.removeSnapshotDisplay(this.__backgroundSnapshotDisplay);
                    delete this.__backgroundSnapshotDisplay;
                    if (this.__backgroundSnapshot)
                        this.recorder.removeSnapshot(this.__backgroundSnapshot);
                    delete this.__backgroundSnapshot;
                },

                _getFirstFrameSnapshot: function() {
                    if (this.__firstFrameSnapshot)
                        return Promise.value(this.__firstFrameSnapshot);

                    if (!(this._videoFile || (this.recorder && this.recorder.localPlaybackSource().src)))
                        return Promise.error("No source to get the snapshot from");

                    var promise = Promise.create();
                    var blob = this._videoFile || this.recorder.localPlaybackSource().src;
                    RecorderSupport.createSnapshotFromSource(URL.createObjectURL(blob), this.get("snapshottype"), 0)
                        .success(function(snapshot) {
                            this.__firstFrameSnapshot = snapshot;
                            promise.asyncSuccess(snapshot);
                            URL.revokeObjectURL(blob);
                        }, this)
                        .error(function(error) {
                            promise.asyncError(error);
                            URL.revokeObjectURL(blob);
                        }, this);

                    return promise;
                },

                toggleFaceOutline: function(new_status) {
                    if (typeof new_status === 'undefined') {
                        this.set("faceoutline", !this.get("faceoutline"));
                    } else {
                        this.set("faceoutline", new_status);
                    }
                },

                isMobile: function() {
                    return Info.isMobile();
                },

                object_functions: [
                    "record", "rerecord", "record_screen", "stop", "play", "pause", "reset", "cancel",
                    "pause_recorder", "resume", "upload_video", "upload_covershot", "select_camera",
                    "select_microphone", "add_new_stream", "trim"
                ],

                functions: {

                    cancel: function() {
                        if (confirm(this.stringUnicode("cancel-confirm")))
                            this.execute("reset");
                    },

                    record: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("record");
                            return;
                        }
                        this.host.state().record();
                    },

                    record_video: function() {
                        this.host.state().selectRecord();
                    },

                    record_screen: function(isMultiStream) {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("record_screen");
                            return;
                        }
                        this.host.state().selectRecordScreen(isMultiStream);
                    },

                    pause_recorder: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("pause_recorder");
                            return;
                        }
                        if (typeof this.recorder !== 'undefined') {
                            this.__paused = true;
                            this.__pauseStart = Time.now();
                            this.__recording = false;
                            this.recorder.pauseRecord();
                            this.recorder._recorder.once("paused", function(ev) {
                                this.set("resumevisible", true);
                            }, this);
                        }
                    },

                    resume: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("resume");
                            return;
                        }
                        if (typeof this.recorder !== 'undefined')
                            this._resume();
                    },

                    video_file_selected: function(file) {
                        this.__selected_video_file = file;
                        if (!this.get("manual-upload"))
                            this.execute("upload_video");
                    },

                    upload_video: function(file) {
                        this.host.state().selectUpload(file || this.__selected_video_file);
                    },

                    upload_covershot: function(file) {
                        this.host.state().uploadCovershot(file);
                    },

                    select_camera: function(camera_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                video: camera_id
                            });
                            this.set("showaddstreambutton", this._showAddStreamButton());
                            this.set("selectedcamera", camera_id);
                        }
                    },

                    select_microphone: function(microphone_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                audio: microphone_id
                            });
                            this.recorder.testSoundLevel(true);
                            this.set("selectedmicrophone", microphone_id);
                        }
                        this.set("microphonehealthy", false);
                    },

                    toggle_face_mode: function() {
                        if (this.recorder) {
                            this.recorder.setCameraFace(this.get("camerafacefront"));
                            this.set("camerafacefront", !this.get("camerafacefront"));
                        }
                    },

                    add_new_stream: function(deviceId) {
                        this._add_new_stream(deviceId);
                    },

                    invoke_skip: function() {
                        this.trigger("invoke-skip");
                    },

                    select_image: function(image) {
                        this.trigger("select-image", image);
                    },

                    rerecord: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("rerecord");
                            return;
                        }
                        if (confirm(this.stringUnicode("rerecord-confirm"))) {
                            this.host.state().rerecord();
                            this._initSettings();
                        }
                    },

                    stop: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("stop");
                            return;
                        }

                        // If recorder is paused need resume first,
                        // setting this._recording to true also could be enough
                        if (this.__paused)
                            this._resume();

                        this.host.state().stop();
                    },

                    play: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("play");
                            return;
                        }
                        this.host.state().play();
                    },

                    pause: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("pause");
                            return;
                        }
                        this.host.state().pause();
                    },

                    message_click: function() {
                        this.trigger("message-click");
                    },

                    message_link_click: function(link) {
                        this.trigger("message-link-click", link);
                    },

                    playing: function() {
                        this.trigger("playing");
                    },

                    paused: function() {
                        this.trigger("paused");
                    },

                    ended: function() {
                        this.trigger("ended");
                    },

                    reset: function() {
                        if (this._delegatedRecorder) {
                            this._delegatedRecorder.execute("reset");
                            return;
                        }
                        this._stopRecording().callback(function() {
                            this._unbindMedia();
                            this._hideBackgroundSnapshot();
                            this._detachRecorder();
                            this._initSettings();
                            this.host.state().next("Initial");
                        }, this);
                    },

                    toggle_facemode: function() {
                        this._toggleFaceMode();
                    },

                    trim: function(start, end) {
                        if (this.host.state().state_name() !== "Trimming") return;
                        this.trigger("manual-trim", start, end);
                    },

                    manual_submit: function() {
                        this.set("rerecordable", false);
                        this.set("manualsubmit", false);
                        this.trigger("manually_submitted");
                    },

                    ready_to_play: function() {
                        this.trigger("ready_to_play");
                    }
                },

                _resume: function() {
                    this.__paused = false;
                    this.__pauseDelta += Time.now() - this.__pauseStart;
                    this.__recording = true;
                    this.recorder.resumeRecord();
                    this.recorder._recorder.once("resumed", function() {
                        this.set("resumevisible", false);
                    }, this);
                },

                destroy: function() {
                    this._timer.destroy();
                    this.host.destroy();
                    this._detachRecorder();
                    inherited.destroy.call(this);
                },

                deltaCoefficient: function() {
                    return this.recorderAttached() ? this.recorder.deltaCoefficient() : null;
                },

                blankLevel: function() {
                    return this.recorderAttached() ? this.recorder.blankLevel() : null;
                },

                lightLevel: function() {
                    return this.recorderAttached() ? this.recorder.lightLevel() : null;
                },

                soundLevel: function() {
                    return this.recorderAttached() ? this.recorder.soundLevel() : null;
                },

                _toggleFaceMode: function() {
                    this.set("camerafacefront", !!this.get("camerafacefront"));
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    this.set("currentorientation", window.innerHeight > window.innerWidth ? "portrait" : "landscape");
                    try {
                        if (this.recorderAttached() && this.get("devicetesting")) {
                            if (!this.get("onlyaudio")) {
                                var lightLevel = this.lightLevel();
                                this.set("camerahealthy", lightLevel >= 100 && lightLevel <= 200);
                            }
                            if (!this.get("noaudio") && !this.get("microphonehealthy") && this.soundLevel() >= 1.01) {
                                this.set("microphonehealthy", true);
                                this.recorder.testSoundLevel(false);
                            }
                        }
                    } catch (e) {}

                    if (!this.get("onlyaudio") && this.__recording) {
                        if (this.get("picksnapshots")) {
                            if (this.__recording_start_time + 500 < Time.now()) {
                                var p = this.get("snapshots").length < this.get("snapshotmax") ? 0.25 : 0.05;
                                if (Math.random() <= p) {
                                    var snap = this.recorder.createSnapshot(this.get("snapshottype"));
                                    if (snap) {
                                        if (!this.get('videometadata').height && typeof Image !== 'undefined' && this.get("createthumbnails")) {
                                            RecorderSupport.snapshotMetaData(snap).success(function(data) {
                                                var _thumbWidth = data.orientation === 'landscape' ? 80 : 35;
                                                this.set("videometadata", Objs.tree_merge(this.get("videometadata"), data));
                                                this.set("videometadata", Objs.tree_merge(this.get("videometadata"), {
                                                    "thumbnails": {
                                                        width: _thumbWidth,
                                                        height: Math.floor(_thumbWidth / data.width * data.height)
                                                    }
                                                }));
                                            }, this);
                                        }
                                        if (this.get("snapshots").length < this.get("snapshotmax")) {
                                            this.get("snapshots").push(snap);
                                        } else {
                                            var i = Math.floor(Math.random() * this.get("snapshotmax"));
                                            this.recorder.removeSnapshot(this.get("snapshots")[i]);
                                            this.get("snapshots")[i] = snap;
                                        }

                                        if (this.get("createthumbnails")) {
                                            var _currentRecordingSecond = Math.floor((Time.now() - this.__recording_start_time) / 1000);
                                            var _thumbLatestIndex = this.get("videometadata").thumbnails.images.length > 1 ? this.get("videometadata").thumbnails.images.length - 1 : 0;
                                            var _latestThumb = this.get("videometadata").thumbnails.images[_thumbLatestIndex];

                                            // Add thumb each 2 seconds
                                            if (typeof _latestThumb !== 'undefined') {
                                                if (_currentRecordingSecond > _latestThumb.time + 1) {
                                                    this.get("videometadata").thumbnails.images.push({
                                                        time: _currentRecordingSecond,
                                                        snap: snap
                                                    });
                                                }
                                            } else {
                                                this.get("videometadata").thumbnails.images.push({
                                                    time: _currentRecordingSecond,
                                                    snap: snap
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            // took snap only one for background view
                            if (!this.get("videometadata").processingPlaceholder) {
                                this.get("videometadata").processingPlaceholder = this.recorder.createSnapshot(this.get("snapshottype"));
                            }
                        }
                    }

                    try {
                        if (this.recorderAttached() && this._timer.fire_count() % 20 === 0 && this._accessing_camera) {
                            var signal = this.blankLevel() >= 0.01;
                            if (signal !== this.__cameraSignal) {
                                this.__cameraSignal = signal;
                                this.trigger(signal ? "camera_signal" : "camera_nosignal");
                            }
                        }
                        if (this.recorderAttached() && this._timer.fire_count() % 20 === 10 && this._accessing_camera) {
                            var delta = this.recorder.deltaCoefficient();
                            var responsive = delta === null || delta >= 0.5;
                            if (responsive !== this.__cameraResponsive) {
                                this.__cameraResponsive = responsive;
                                this.trigger(responsive ? "camera_responsive" : "camera_unresponsive");
                            }
                        }
                    } catch (e) {}

                    this._updateCSSSize();
                },

                domDimensions: function() {
                    return Dom.elementDimensions(this.activeElement().childNodes[0]);
                },

                _updateCSSSize: function() {
                    var width = this.domDimensions().width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                videoHeight: function() {
                    var _clientHeight = (window.innerHeight || document.body.clientHeight);
                    if (!this.recorderAttached())
                        return _clientHeight;
                    else {
                        var _height = this.recorder.cameraHeight();
                        return _height > _clientHeight ? _clientHeight : _height;
                    }
                },

                videoWidth: function() {
                    var _clientWidth = (window.innerWidth || document.body.clientWidth);
                    if (!this.recorderAttached())
                        return _clientWidth;
                    else {
                        var _width = this.recorder.cameraWidth();
                        return _width > _clientWidth ? _clientWidth : _width;
                    }
                },

                aspectRatio: function() {
                    var width = this.videoWidth();
                    var height = this.videoHeight();
                    return width / height;
                },

                isPortrait: function() {
                    if (typeof this.recorder !== "undefined") {
                        if (typeof this.recorder._recorder._videoTrackSettings !== "undefined") {
                            return this.recorder._recorder._videoTrackSettings.aspectRatio < 1.0;
                        }
                    }

                    return this.aspectRatio() < 1.00;
                },

                isLandscape: function() {
                    return !this.isPortrait();
                },

                parentWidth: function() {
                    return this.get("width") || Dom.elementDimensions(this.activeElement()).width;
                },

                parentHeight: function() {
                    return this.get("height") || Dom.elementDimensions(this.activeElement()).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                averageFrameRate: function() {
                    return this.recorderAttached() ? this.recorder.averageFrameRate() : null;
                },

                cloneAttrs: function() {
                    return Objs.map(this.attrs, function(value, key) {
                        return this.get(key);
                    }, this);
                },

                popupAttrs: function() {
                    return {
                        popup: false,
                        width: this.get("popup-width"),
                        height: this.get("popup-height"),
                        stretch: this.get("popup-stretch")
                    };
                },

                imageUploaded: function() {
                    return !!this.__lastCovershotUpload;
                },

                audioUploaded: function() {
                    return this.recorder && this.recorder.localPlaybackSource() && !!this.recorder.localPlaybackSource().audiosrc;
                },

                /**
                 *
                 * @param {boolean =} setFalse
                 * @private
                 */
                _screenRecorderVerifier: function(setFalse) {
                    if (setFalse) {
                        this.set("allowscreen", false);
                        this.set("allowmultistreams", false);
                    }
                    if ((this.get("allowscreen") || this.get("allowmultistreams")) && this.get("screenrecordmandatory") && !Info.isScreenRecorderSupported()) {
                        this.get("initialmessages").push({
                            id: typeof Date.now !== 'undefined' ? +Date.now() : 1498744,
                            message: this.string("screen-recorder-is-not-supported"),
                            type: 'warning'
                        });
                    }
                },

                /**
                 * Will add new stream based on provided ID
                 * @param deviceId
                 */
                _add_new_stream: function(deviceId) {
                    var _selected;
                    var _currentTracks = this.recorder._recorder.stream().getTracks();
                    this.get("cameras").iterate(function(videoDevice) {
                        var _videoDevice = videoDevice.data();
                        deviceId = deviceId || _videoDevice.id; // In case if argument is empty take any video source
                        if (!_selected && deviceId === _videoDevice.id) {
                            this.set("loadlabel", this.string("adding-new-stream"));
                            this.set("loader_active", true);
                            this.recorder.addMultiStream(_videoDevice, {
                                positionX: this.get("addstreampositionx"),
                                positionY: this.get("addstreampositiony"),
                                width: this.get("addstreampositionwidth"),
                                height: this.get("addstreampositionheight")
                            }, _currentTracks).success(function(stream) {
                                _selected = true;
                                this.set("addstreamdeviceid", deviceId);
                                if (!this.get("addstreampositionheight")) {
                                    var _height, _aspectRatio;
                                    _aspectRatio = 1.333;
                                    if (typeof stream.getTracks()[0] !== 'undefined') {
                                        var _settings = stream.getTracks()[0].getSettings();
                                        if (_settings.aspectRatio) {
                                            _aspectRatio = _settings.aspectRatio;
                                        } else if (_settings.height > 0 && _settings.width > 0) {
                                            _aspectRatio = Math.round((_settings.width / _settings.height) * 100) / 100;
                                        }
                                    }

                                    if (_aspectRatio)
                                        _height = this.get("addstreampositionwidth") / _aspectRatio;
                                    else
                                        _height = Math.round(this.get("addstreampositionwidth") / 1.33);

                                    this.set("addstreampositionheight", _height);
                                }
                                this.set("loadlabel", "");
                                this.set("loader_active", false);
                                this.set("showaddstreambutton", false);
                                if (this.get("allowmultistreams") && (this.get("multistreamreversable") || this.get("multistreamdraggable") || this.get("multistreamresizeable"))) {
                                    this.set("helperframe_active", true);
                                    this.set("framevisible", true);
                                }
                            }, this).error(function(message) {
                                console.warn(message);
                                this.set("loadlabel", message);
                                this.set("loader_active", false);
                            }, this);
                        }
                    }, this);
                },

                /**
                 * Will set settings on outsource elements
                 */
                setOutsourceSelectors: function(choosenDevices) {
                    Objs.map(this.get("outsourceSelectors"), function(item) {
                        var options = item.options;
                        var element = document.getElementById(item.selector);
                        if (element) {
                            var isCamera = item.isCamera;
                            var choosenDevice = choosenDevices[isCamera ? 'video' : 'audio'];
                            if ((options.type === "select" && element.tagName !== "SELECT") || (options.type !== "select" && element.tagName === "SELECT")) {
                                var message = "You sould provide correct element selector, option element could be only select element child";
                                var childNode = document.createTextNode(message);
                                if (element.tagName === "SELECT") {
                                    var textNode = childNode;
                                    childNode = document.createElement('option');
                                    childNode.appendChild(textNode);
                                }
                                element.appendChild(childNode);
                                console.warn(message);
                            } else {
                                this.__buildOutsourceElement(element, item.options, isCamera, choosenDevice);
                            }
                        } else {
                            console.warn("There are no element with id: " + item.selector + " to implement 'outsource-selectors'");
                        }
                    }, this);
                },

                /**
                 * Just Helper funtion build outsources elements
                 * @param element
                 * @param options
                 * @param isCamera
                 * @param choosenDevice
                 * @private
                 */
                __buildOutsourceElement: function(element, options, isCamera, choosenDevice) {
                    var self = this;
                    var deviceCollections = isCamera ? this.get("cameras") : this.get("microphones");
                    var listeners = [];
                    var initialSelectorText = '';
                    element.disabled = deviceCollections.count() <= 1 && options.disabled;
                    if (deviceCollections.count() > 0) {
                        // Clear initial select content
                        if (options.type === "select" && element.options) {
                            initialSelectorText = element.options[0].innerText;
                            while (element.options.length > 0) {
                                element.remove(0);
                            }
                        }

                        deviceCollections.iterate(function(device) {
                            var _details = '';
                            if (options.showCapabilities && isCamera) {
                                var capabilities = device.get("capabilities");
                                if (capabilities) {
                                    if (typeof capabilities.width !== "undefined" && typeof capabilities.height !== "undefined") {
                                        _details = '(' + capabilities.width.max + 'x' + capabilities.height.max + ')';
                                    }
                                }
                            }

                            var id = device.get("id");
                            var label = device.get("label");

                            if (options.type === "select" && element.tagName === "SELECT") {
                                var option = document.createElement('option');
                                option.value = id;
                                option.innerText = label + _details;
                                option.selected = id === choosenDevice;
                                if (options.className) option.className += options.className;
                                element.appendChild(option);
                            }

                            if (options.type === "radio") {
                                var radioInput = document.createElement('input');
                                var radioInputLabel = document.createElement('label');
                                radioInput.name = self.get("css") + (isCamera ? '-cam' : '-mic') + '-radio-input';
                                radioInput.type = 'radio';
                                if (options.className) {
                                    radioInputLabel.className += options.className;
                                }

                                radioInputLabel.setAttribute('for', this.get("css") + id);
                                radioInput.value = id;
                                radioInput.checked = id === choosenDevice;
                                // radioInputLabel.innerText = label + _details;
                                var radioInputTextNode = document.createTextNode(label + _details);

                                radioInputLabel.appendChild(radioInput);
                                radioInputLabel.appendChild(radioInputTextNode);
                                element.appendChild(radioInputLabel);

                                // Add event listener on change
                                radioInput.addEventListener("change", function(ev) {
                                    var _radio = ev.target;
                                    var value = _radio.value;
                                    if (_radio.checked && value) {
                                        if (isCamera) {
                                            self.select_camera(value);
                                        } else {
                                            self.select_microphone(value);
                                        }
                                    }
                                });
                                listeners.push({
                                    type: "change",
                                    element: radioInput,
                                    container: radioInputLabel
                                });
                            }
                        }, this);

                        // Add event listener on change
                        if (options.type === "select") {
                            listeners.push({
                                type: "change",
                                element: element
                            });
                            element.addEventListener("change", function(ev) {
                                Array.from(ev.target.options).forEach(function(option) {
                                    var value = option.value;
                                    if (option.selected && value) {
                                        if (isCamera) {
                                            self.select_camera(value);
                                        } else {
                                            self.select_microphone(value);
                                        }
                                    }
                                });
                            });
                        }

                        self.on("recording", function() {
                            if (listeners.length > 0) {
                                Objs.map(listeners, function(listener) {
                                    var type = listener.type;
                                    var el = listener.element;
                                    var container = listener.container || el;
                                    removeEventListener(type, el);
                                    if (!Types.is_undefined(container.options)) {
                                        while (container.options.length > 0) {
                                            container.remove(0);
                                        }
                                        var option = document.createElement('option');
                                        var textNode = document.createTextNode(initialSelectorText);
                                        option.appendChild(textNode);
                                        container.appendChild(option);
                                    } else {
                                        container.parentNode.removeChild(container);
                                    }
                                });
                            }
                        });
                    }
                }
            };
        }], {

            recorderStates: function() {
                return [RecorderStates];
            }

        })
        .register("ba-videorecorder")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/recorder.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "recorder-error": "An error occurred, please try again later. Click to retry.",
            "attach-error": "We could not access the media interface. Depending on the device and browser, you might need to access the page via SSL.",
            "software-required": "Please click below to install / activate the following requirements in order to proceed.",
            "software-waiting": "Waiting for the requirements to be installed / activated. You might need to refresh the page after completion.",
            "access-forbidden": "Access to the media was forbidden. Click to retry.",
            "pick-covershot": "Pick a covershot.",
            "pick-covershot-frame": "Select a frame to use as covershot.",
            "framerate-warning": "The video frame rate is very low. We recommend closing all other programs and browser tabs or to use a faster computer.",
            "uploading": "Uploading",
            "uploading-src-error": "Unable to play back video now, uploading is still in progress",
            "uploading-failed": "Uploading failed - click here to retry.",
            "upload-error-duration": "Length of the uploaded video does not meet the requirements - click here to retry.",
            "resolution-constraint-error": "The file you've selected does not match the required resolution - click here to retry.",
            "verifying": "Verifying",
            "verifying-failed": "Verifying failed - click here to retry.",
            "rerecord-confirm": "Do you really want to redo your video?",
            "cancel-confirm": "Do you really want to cancel your video upload?",
            "video_file_too_large": "Your video file is too large (%s) - click here to try again with a smaller video file.",
            "unsupported_video_type": "Please upload: %s - click here to retry.",
            "orientation-portrait-required": "Please rotate your device to record in portrait mode.",
            "orientation-landscape-required": "Please rotate your device to record in landscape mode.",
            "switch-camera": "Switch camera",
            "prepare-covershot": "Preparing covershots",
            "prepare-thumbnails": "Preparing seeking thumbnails",
            "adding-new-stream": "Adding New Stream",
            "missing-track": "Required audio or video track is missing",
            "device-already-in-use": "At least one of your input devices are already in use",
            "browser-permission-denied": "Permission denied by browser, please grant access and reload page",
            "screen-recorder-is-not-supported": "Screen recorder is not supported on this device",
            "trim-prompt": "Do you want to trim your video?",
            "trim-video": "Move the start and end markers to trim your video",
            "wait-for-trim": "Waiting for trim command...",
            "supported-mode": "Media resolution should be in '%s' mode.",
            "re-choose-action": "Please click to choose another input device or retry action."
        });
});