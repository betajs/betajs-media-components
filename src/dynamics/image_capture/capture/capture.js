Scoped.define("module:ImageCapture.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:ImageRecorder.ImageRecorderWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Collections.Collection",
    "base:Promise",
    "module:ImageCapture.Dynamics.RecorderStates.Initial",
    "module:ImageCapture.Dynamics.RecorderStates"
], [
    "module:ImageCapture.Dynamics.Loader",
    "module:ImageCapture.Dynamics.Controlbar",
    "module:ImageCapture.Dynamics.Message",
    "module:ImageCapture.Dynamics.Topmessage",
    "module:ImageCapture.Dynamics.Chooser",
    "module:ImageCapture.Dynamics.Faceoutline",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, Info, Dom, MultiUploader, FileUploader, ImageRecorderWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/capture.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-imagecapture",
                    "csscommon": "ba-commoncss",
                    "iecss": "ba-imagecapture",
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
                    "dynloader": "imagecapture-loader",
                    "dyncontrolbar": "imagecapture-controlbar",
                    "dynmessage": "imagecapture-message",
                    "dyntopmessage": "imagecapture-topmessage",
                    "dynchooser": "imagecapture-chooser",
                    "dynimageviewer": "imageviewer",

                    /* Templates */
                    "tmplloader": "",
                    "tmplcontrolbar": "",
                    "tmplmessage": "",
                    "tmpltopmessage": "",
                    "tmplchooser": "",

                    /* Attributes */
                    "autorecord": false,
                    "allowrecord": true,
                    "allowupload": true,
                    "allowcustomupload": true,
                    "camerafacefront": false,
                    "primaryrecord": true,
                    "nofullscreen": false,
                    "recordingwidth": undefined,
                    "recordingheight": undefined,
                    "minuploadingwidth": undefined,
                    "maxuploadingwidth": undefined,
                    "minuploadingheight": undefined,
                    "maxuploadingheight": undefined,
                    "countdown": 3,
                    "webrtconmobile": "boolean",
                    "snapshottype": "jpg",
                    "playbacksource": "",
                    "recordermode": true,
                    "skipinitial": false,
                    "skipinitialonrerecord": false,
                    "flip-camera": false,
                    "early-rerecord": false,
                    "manualsubmit": false,
                    "allowedextensions": null,
                    "filesizelimit": null,
                    "faceoutline": false,

                    /* Configuration */
                    "forceflash": false,
                    "simulate": false,
                    "noflash": false,
                    "flashincognitosupport": false,
                    "localplayback": false,
                    "uploadoptions": {},
                    "playerattrs": {},
                    "shortMessage": true,

                    /* Options */
                    "rerecordable": true,
                    "recordings": null,
                    "ready": true,
                    "orientation": false,
                    "stretch": false

                },

                computed: {
                    "nativeRecordingWidth:recordingwidth,record_media": function() {
                        return this.get("recordingwidth") || (this.get("record_media") !== "screen" ? 640 : (window.innerWidth || document.body.clientWidth));
                    },
                    "nativeRecordingHeight:recordingheight,record_media": function() {
                        return this.get("recordingheight") || (this.get("record_media") !== "screen" ? 480 : (window.innerHeight || document.body.clientHeight));
                    },
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
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
                    "forceflash": "boolean",
                    "noflash": "boolean",
                    "rerecordable": "boolean",
                    "ready": "boolean",
                    "stretch": "boolean",
                    "autorecord": "boolean",
                    "allowrecord": "boolean",
                    "allowupload": "boolean",
                    "allowcustomupload": "boolean",
                    "primaryrecord": "boolean",
                    "flashincognitosupport": "boolean",
                    "recordermode": "boolean",
                    "nofullscreen": "boolean",
                    "skipinitialonrerecord": "boolean",
                    "localplayback": "boolean",
                    "camerafacefront": "boolean",
                    "skipinitial": "boolean",
                    "minuploadingwidth": "int",
                    "maxuploadingwidth": "int",
                    "minuploadingheight": "int",
                    "maxuploadingheight": "int",
                    "webrtconmobile": "boolean",
                    "flip-camera": "boolean",
                    "faceoutline": "boolean",
                    "early-rerecord": "boolean",
                    "manualsubmit": "boolean",
                    "simulate": "boolean",
                    "allowedextensions": "array"
                },

                extendables: ["states"],

                remove_on_destroy: true,

                events: {
                    "change:camerahealthy": function(value) {
                        this.trigger("camerahealth", value);
                    },
                    "change:webrtconmobile": function() {
                        this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !ImageRecorderWrapper.anySupport(this._imageCaptureWrapperOptions())));
                    },
                    "change:recordviafilecapture": function() {
                        if (this.get("recordviafilecapture")) {
                            this.set("skipinitial", false);
                            this.set("skipinitialonrerecord", false);
                            this.set("allowscreen", false);
                            this.set("autorecord", false);
                        }
                    }
                },

                create: function() {
                    if (this.get("theme") in Assets.recorderthemes) {
                        Objs.iter(Assets.recorderthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }
                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("hideoverlay", false);

                    this.set("canswitchcamera", false);
                    this.set("recordviafilecapture", Info.isMobile() && (!this.get("webrtconmobile") || !ImageRecorderWrapper.anySupport(this._imageCaptureWrapperOptions())));

                    if (this.get("recordviafilecapture")) {
                        this.set("skipinitial", false);
                        this.set("skipinitialonrerecord", false);
                        this.set("autorecord", false);
                    }

                    this.__attachRequested = false;
                    this.__activated = false;
                    this._bound = false;
                    this.__recording = false;
                    this.__error = null;
                    this.__currentStretch = null;

                    this.on("change:stretch", function() {
                        this._updateStretch();
                    }, this);
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

                    this.__cameraResponsive = true;
                    this.__cameraSignal = true;

                    if (!Info.isMobile())
                        this.set("orientation", false);
                    this.set("currentorientation", window.innerHeight > window.innerWidth ? "portrait" : "landscape");
                },

                state: function() {
                    return this.host.state();
                },

                recorderAttached: function() {
                    return !!this.recorder;
                },

                imageError: function() {
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

                _imageCaptureWrapperOptions: function() {
                    return {
                        simulate: this.get("simulate"),
                        forceflash: this.get("forceflash"),
                        noflash: this.get("noflash"),
                        flashFullSecurityDialog: !this.get("flashincognitosupport"),
                        // webrtcOnMobile: !!this.get("webrtconmobile"),
                        localPlaybackRequested: this.get("localplayback"),
                        flip: this.get("flip-camera")
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
                    var image = this.activeElement().querySelector("[data-image='image']");
                    this._clearError();
                    this.recorder = ImageRecorderWrapper.create(Objs.extend({
                        element: image
                    }, this._imageCaptureWrapperOptions()));
                    if (this.recorder)
                        this.trigger("attached");
                    else
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
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this.recorder.enumerateDevices().success(function(devices) {
                                var selected = this.recorder.currentDevices();
                                this.set("selectedcamera", selected.video);
                                this.set("cameras", new Collection(Objs.values(devices.video)));
                            }, this);
                            this.set("devicetesting", true);
                            this._updateStretch();
                            this._bound = true;
                            this.trigger("bound");
                        }, this);
                    }, this);
                },

                isFlash: function() {
                    return this.recorder && this.recorder.isFlash();
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

                _uploadImageFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").image));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _prepareRecording: function() {
                    return Promise.create(true);
                },

                _captureImage: function() {
                    this._snapshot = this.recorder.createSnapshot(this.get("snapshottype"));
                },

                _uploadCapture: function() {
                    if (this.get("simulate"))
                        return;
                    var uploader = this.recorder.createSnapshotUploader(this._snapshot, this.get("snapshottype"), this.get("uploadoptions").image);
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },


                _verifyRecording: function() {
                    return Promise.create(true);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachRecorder();
                },

                object_functions: ["record", "rerecord", "reset"],

                functions: {

                    record: function() {
                        this.host.state().record();
                    },

                    record_image: function() {
                        this.host.state().selectRecord();
                    },

                    upload_image: function(file) {
                        this.host.state().selectUpload(file);
                    },

                    select_camera: function(camera_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                video: camera_id
                            });
                            this.set("selectedcamera", camera_id);
                        }
                    },

                    select_camera_face: function(faceFront) {
                        if (this.recorder) {
                            this.recorder.setCameraFace(faceFront);
                            this.set("camerafacefront", faceFront);
                        }
                    },

                    rerecord: function() {
                        if (confirm(this.stringUnicode("rerecord-confirm")))
                            this.host.state().rerecord();
                    },

                    message_click: function() {
                        this.trigger("message-click");
                    },

                    message_link_click: function(link) {
                        this.trigger("message-link-click", link);
                    },

                    reset: function() {
                        this._stopRecording().callback(function() {
                            this._unbindMedia();
                            this._detachRecorder();
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

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    this.set("currentorientation", window.innerHeight > window.innerWidth ? "portrait" : "landscape");
                    try {
                        if (this.recorderAttached() && this.get("devicetesting")) {
                            var lightLevel = this.lightLevel();
                            this.set("camerahealthy", lightLevel >= 100 && lightLevel <= 200);
                        }
                    } catch (e) {}

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

                    this._updateStretch();
                    this._updateCSSSize();
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                imageHeight: function() {
                    return this.recorderAttached() ? this.recorder.cameraHeight() : NaN;
                },

                imageWidth: function() {
                    return this.recorderAttached() ? this.recorder.cameraWidth() : NaN;
                },

                aspectRatio: function() {
                    return this.imageWidth() / this.imageHeight();
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

                _updateStretch: function() {
                    var newStretch = null;
                    if (this.get("stretch")) {
                        var ar = this.aspectRatio();
                        if (isFinite(ar)) {
                            var par = this.parentAspectRatio();
                            if (isFinite(par)) {
                                if (par > ar)
                                    newStretch = "height";
                                if (par < ar)
                                    newStretch = "width";
                            } else if (par === Infinity)
                                newStretch = "height";
                        }
                    }
                    if (this.__currentStretch !== newStretch) {
                        if (this.__currentStretch)
                            Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
                        if (newStretch)
                            Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
                    }
                    this.__currentStretch = newStretch;
                }

            };
        }, {

            recorderStates: function() {
                return [RecorderStates];
            }

        })
        .register("ba-imagecapture")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/capture.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "recorder-error": "An error occurred, please try again later. Click to retry.",
            "attach-error": "We could not access the media interface. Depending on the device and browser, you might need to install Flash or access the page via SSL.",
            "software-required": "Please click below to install / activate the following requirements in order to proceed.",
            "software-waiting": "Waiting for the requirements to be installed / activated. You might need to refresh the page after completion.",
            "access-forbidden": "Access to the media was forbidden. Click to retry.",
            "uploading": "Uploading",
            "uploading-failed": "Uploading failed - click here to retry.",
            "upload-error-duration": "Length of the uploaded image does not meet the requirements - click here to retry.",
            "resolution-constraint-error": "The file you've selected does not match the required resolution - click here to retry.",
            "verifying": "Verifying",
            "verifying-failed": "Verifying failed - click here to retry.",
            "rerecord-confirm": "Do you really want to retake your image?",
            "image_file_too_large": "Your image file is too large (%s) - click here to try again with a smaller image file.",
            "unsupported_image_type": "Please upload: %s - click here to retry.",
            "orientation-portrait-required": "Please rotate your device to record in portrait mode.",
            "orientation-landscape-required": "Please rotate your device to record in landscape mode."
        });
});