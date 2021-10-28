Scoped.define("module:AudioRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Assets",
    "module:AudioVisualization",
    "browser:Info",
    "browser:Dom",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:AudioRecorder.AudioRecorderWrapper",
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
    "module:AudioRecorder.Dynamics.RecorderStates.Initial",
    "module:AudioRecorder.Dynamics.RecorderStates"
], [
    "module:AudioRecorder.Dynamics.Loader",
    "module:AudioRecorder.Dynamics.Controlbar",
    "module:AudioRecorder.Dynamics.Message",
    "module:AudioRecorder.Dynamics.Chooser",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, AudioVisualization, Info, Dom, MultiUploader, FileUploader, AudioRecorderWrapper, WebRTCSupport, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/recorder.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-videorecorder", // inherit from video recorder
                    "cssaudio": "ba-audiorecorder",
                    "cssrecorder": "ba-recorder",
                    "csscommon": "ba-commoncss",
                    "iecss": "ba-audiorecorder",
                    "cssimagegallery": "",
                    "cssloader": "",
                    "csscontrolbar": "",
                    "cssmessage": "",
                    "csstopmessage": "",
                    "csschooser": "",
                    "width": "",
                    "height": "",
                    "gallerysnapshots": 3,

                    /* Themes */
                    "theme": "",
                    "csstheme": "",

                    /* Dynamics */
                    "dynloader": "audiorecorder-loader",
                    "dyncontrolbar": "audiorecorder-controlbar",
                    "dynmessage": "audiorecorder-message",
                    "dynchooser": "audiorecorder-chooser",
                    "dynaudioplayer": "audioplayer",

                    /* Templates */
                    "tmplloader": "",
                    "tmplcontrolbar": "",
                    "tmplmessage": "",
                    "tmplchooser": "",

                    /* Attributes */
                    "autorecord": false,
                    "autoplay": false,
                    "allowrecord": true,
                    "allowupload": true,
                    "allowcustomupload": true,
                    "primaryrecord": true,
                    "countdown": 3,
                    "audiobitrate": null,
                    "playbacksource": "",
                    "recordermode": true,
                    "skipinitial": false,
                    "skipinitialonrerecord": false,
                    "timelimit": null,
                    "timeminlimit": null,
                    "webrtcstreaming": false,
                    "webrtconmobile": false,
                    "webrtcstreamingifnecessary": true,
                    "microphone-volume": 1.0,
                    "early-rerecord": false,
                    "manualsubmit": false,
                    "allowedextensions": null,
                    "filesizelimit": null,
                    "display-timer": true,
                    "pausable": false,
                    "visualeffectvisible": true,
                    "visualeffectsupported": false,
                    "visualeffectheight": null,
                    "visualeffectminheight": 120,
                    "visualeffecttheme": "red-bars", // types: `balloon`, 'red-bars'

                    /* Configuration */
                    "simulate": false,
                    "enforce-duration": null,
                    "localplayback": false,
                    "uploadoptions": {},
                    "playerattrs": {},
                    "shortMessage": true,

                    /* Options */
                    "rerecordable": true,
                    "allowcancel": false,
                    "recordings": null,
                    "ready": true,
                    "audio-test-mandatory": false

                },

                scopes: {
                    player: ">[id='player']"
                },

                computed: {
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
                        return result;
                    }
                },

                types: {
                    "rerecordable": "boolean",
                    "ready": "boolean",
                    "autorecord": "boolean",
                    "autoplay": "boolean",
                    "allowrecord": "boolean",
                    "allowupload": "boolean",
                    "allowcustomupload": "boolean",
                    "primaryrecord": "boolean",
                    "recordermode": "boolean",
                    "skipinitialonrerecord": "boolean",
                    "localplayback": "boolean",
                    "skipinitial": "boolean",
                    "pausable": "boolean",
                    "enforce-duration": "bool",
                    "webrtcstreaming": "boolean",
                    "webrtconmobile": "boolean",
                    "webrtcstreamingifnecessary": "boolean",
                    "microphone-volume": "float",
                    "audiobitrate": "int",
                    "early-rerecord": "boolean",
                    "manualsubmit": "boolean",
                    "simulate": "boolean",
                    "allowedextensions": "array",
                    "allowcancel": "boolean",
                    "display-timer": "boolean",
                    "audio-test-mandatory": "boolean",
                    "visualeffectvisible": "boolean"
                },

                extendables: ["states"],

                remove_on_destroy: true,

                events: {
                    "change:microphonehealthy": function(value) {
                        this.trigger("microphonehealth", value);
                    },
                    "change:webrtconmobile": function() {
                        this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !AudioRecorderWrapper.anySupport(this._audioRecorderWrapperOptions())));
                    },
                    "change:recordviafilecapture": function() {
                        if (this.get("recordviafilecapture")) {
                            this.set("skipinitial", false);
                            this.set("skipinitialonrerecord", false);
                            this.set("autorecord", false);
                        }
                    },
                    "change:visualeffectsupported": function(supported) {
                        if (!supported && this.audioVisualization) this.audioVisualization.destroy();
                    }
                },

                create: function() {
                    // Initialize AudioContext
                    WebRTCSupport.globals();
                    if (this.get("theme") in Assets.recorderthemes) {
                        Objs.iter(Assets.recorderthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }
                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("hideoverlay", false);

                    this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !AudioRecorderWrapper.anySupport(this._audioRecorderWrapperOptions())));

                    if (this.get("recordviafilecapture")) {
                        this.set("skipinitial", false);
                        this.set("skipinitialonrerecord", false);
                        this.set("autorecord", false);
                    }

                    if (this.get("pausable"))
                        this.set("resumevisible", false);

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

                    this._initSettings();
                },

                state: function() {
                    return this.host.state();
                },

                recorderAttached: function() {
                    return !!this.recorder;
                },

                audioError: function() {
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
                },

                _audioRecorderWrapperOptions: function() {
                    return {
                        simulate: this.get("simulate"),
                        audioBitrate: this.get("audiobitrate"),
                        webrtcStreaming: !!this.get("webrtcstreaming"),
                        webrtcStreamingIfNecessary: !!this.get("webrtcstreamingifnecessary"),
                        // webrtcOnMobile: !!this.get("webrtconmobile"),
                        localPlaybackRequested: this.get("localplayback")
                    };
                },

                _attachRecorder: function() {
                    if (this.recorderAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.set("hasrecorder", true);
                    this.__attachRequested = false;
                    var audio = this.activeElement().querySelector("[data-audio='audio']");
                    this._clearError();
                    this.recorder = AudioRecorderWrapper.create(Objs.extend({
                        element: audio
                    }, this._audioRecorderWrapperOptions()));
                    // Draw visualization effect for the audio player
                    // if (this.get("visualeffectvisible") && AudioVisualization.supported()) {
                    //     this.audioVisualization = new AudioVisualization(audio, {
                    //         recorder: this.recorder,
                    //         globalAudioContext: WebRTCSupport.globals().audioContext,
                    //         height: this.recorder._recorder._options.recordResolution.height || 120,
                    //         element: this.activeElement()
                    //     });
                    // }
                    if (this.recorder) {
                        this.trigger("attached");
                        this.set("pausable", this.get("pausable") && this.recorder.canPause());
                    } else {
                        this._error("attach");
                    }
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
                        this.recorder.on("require_display", function() {
                            this.set("hideoverlay", true);
                        }, this);
                        this.recorder.bindMedia().error(function(e) {
                            this.trigger("access_forbidden", e);
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this._error("bind", e);
                        }, this).success(function() {
                            this.trigger("access_granted");
                            this.recorder.setVolumeGain(this.get("microphone-volume"));
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            // Draw visualization effect for the audio player
                            if (this.get("visualeffectvisible") && AudioVisualization.supported()) {
                                if (this.get("height") && this.get("height") > this.get("visualeffectminheight")) {
                                    this.set('visualeffectheight', this.get("height"));
                                } else if (this.get("visualeffectheight") < this.get("visualeffectminheight")) {
                                    this.set('visualeffectheight', this.get("visualeffectminheight"));
                                }
                                this.audioVisualization = new AudioVisualization(this.recorder._recorder.stream(), {
                                    element: this.activeElement(),
                                    recorder: this.recorder,
                                    height: this.get("visualeffectheight"),
                                    theme: this.get("visualeffecttheme")
                                });
                                // To be able set width of the canvas element
                                var waitAnalyser = new Timers.Timer({
                                    context: this,
                                    immediate: true,
                                    delay: 50,
                                    fire: function() {
                                        if (this.recorder._analyser) {
                                            try {
                                                this.audioVisualization.initializeVisualEffect();
                                                this.audioVisualization.start();
                                                this.set("visualeffectsupported", true);
                                            } catch (ex) {
                                                this.set("visualeffectsupported", false);
                                                console.warn(ex);
                                            }
                                            waitAnalyser.stop();
                                        }
                                    }
                                });
                                this.auto_destroy(waitAnalyser);
                            }
                            this.recorder.enumerateDevices().success(function(devices) {
                                var selected = this.recorder.currentDevices();
                                this.set("selectedmicrophone", selected.audio);
                                this.set("microphones", new Collection(Objs.values(devices.audio)));
                            }, this);
                            this.recorder.testSoundLevel(true);
                            this.set("devicetesting", true);
                            this._bound = true;
                            this.trigger("bound");
                        }, this);
                    }, this);
                },

                isWebrtcStreaming: function() {
                    return this.recorder && this.recorder.isWebrtcStreaming();
                },

                _initSettings: function() {
                    this.set("duration", 0);
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

                _uploadAudioFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").audio));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _prepareRecording: function() {
                    return Promise.create(true);
                },

                _startRecording: function() {
                    if (this.__recording)
                        return Promise.error(true);
                    this.set("devicetesting", false);
                    return this.recorder.startRecord({
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
                    if (this.audioVisualization) this.audioVisualization.stop();
                    return this.recorder.stopRecord({
                        audio: this.get("uploadoptions").audio,
                        webrtcStreaming: this.get("uploadoptions").webrtcStreaming
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
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachRecorder();
                    this.persistentTrigger("loaded");
                },

                object_functions: [
                    "record", "rerecord", "stop", "play", "pause", "reset", "pause_recorder", "resume"
                ],

                functions: {

                    cancel: function() {
                        if (confirm(this.stringUnicode("cancel-confirm")))
                            this.execute("reset");
                    },

                    record: function() {
                        this.host.state().record();
                    },

                    record_audio: function() {
                        this.host.state().selectRecord();
                    },

                    upload_audio: function(file) {
                        this.host.state().selectUpload(file);
                    },

                    select_microphone: function(microphone_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                audio: microphone_id
                            });
                            this.recorder.testSoundLevel(true);
                            this.set("selectedmicrophone", microphone_id);
                            if (this.audioVisualization) {
                                this.recorder._recorder.on("bound", function() {
                                    this.audioVisualization.updateSourceStream();
                                }, this);
                            }
                        }
                        this.set("microphonehealthy", false);
                    },

                    rerecord: function() {
                        if (confirm(this.stringUnicode("rerecord-confirm"))) {
                            this.host.state().rerecord();
                            this._initSettings();
                        }
                    },

                    stop: function() {
                        // If recorder is paused need resume first,
                        // setting this._recording to true also could be enough
                        if (this.__paused)
                            this._resume();
                        this.host.state().stop();
                    },

                    pause_recorder: function() {
                        if (typeof this.recorder !== 'undefined') {
                            this.recorder.pauseRecord();
                            this.recorder._recorder.once("paused", function() {
                                this.__paused = true;
                                this.__recording = false;
                                this.set("resumevisible", true);
                            }, this);
                        }
                    },

                    resume: function() {
                        if (typeof this.recorder !== 'undefined')
                            this._resume();
                    },

                    play: function() {
                        this.host.state().play();
                    },

                    pause: function() {
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
                        this._stopRecording().callback(function() {
                            this._unbindMedia();
                            this._detachRecorder();
                            this._initSettings();
                            this.host.state().next("Initial");
                        }, this);
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

                soundLevel: function() {
                    return this.recorderAttached() ? this.recorder.soundLevel() : null;
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        if (this.recorderAttached() && this.get("devicetesting")) {
                            if (!this.get("microphonehealthy") && this.soundLevel() >= 1.01) {
                                this.set("microphonehealthy", true);
                                this.recorder.testSoundLevel(false);
                            }
                        }
                    } catch (e) {}

                    this._updateCSSSize();
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                parentWidth: function() {
                    return this.get("width") || Dom.elementDimensions(this.activeElement()).width;
                },

                parentHeight: function() {
                    return this.get("height") || Dom.elementDimensions(this.activeElement()).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                }

            };
        }, {

            recorderStates: function() {
                return [RecorderStates];
            }

        })
        .register("ba-audiorecorder")
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
            "uploading": "Uploading",
            "uploading-failed": "Uploading failed - click here to retry.",
            "upload-error-duration": "Length of the uploaded audio does not meet the requirements - click here to retry.",
            "verifying": "Verifying",
            "verifying-failed": "Verifying failed - click here to retry.",
            "rerecord-confirm": "Do you really want to redo your audio?",
            "cancel-confirm": "Do you really want to cancel your audio upload?",
            "audio_file_too_large": "Your audio file is too large (%s) - click here to try again with a smaller audio file.",
            "unsupported_audio_type": "Please upload: %s - click here to retry.",
            "uploading-src-error": "Unable to play back audio now, uploading is still in progress",
            "missing-track": "Required audio track is missing",
            "device-already-in-use": "At least one of your input devices are already in use",
            "browser-permission-denied": "Permission denied by browser, please grant access and reload page"
        });
});