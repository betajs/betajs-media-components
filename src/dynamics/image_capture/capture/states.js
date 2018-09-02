Scoped.define("module:ImageCapture.Dynamics.RecorderStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function(State, ListenMixin, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, [ListenMixin, {

        dynamics: [],

        _start: function() {
            this.dyn = this.host.dynamic;
            Objs.iter(Objs.extend({
                "message": false,
                "chooser": false,
                "topmessage": false,
                "controlbar": false,
                "loader": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this.dyn.set("playertopmessage", "");
            this.dyn.set("message_links", null);
            this.dyn._accessing_camera = false;
            this._started();
        },

        _started: function() {},

        record: function() {
            this.dyn.set("autorecord", true);
        },

        rerecord: function() {},

        selectRecord: function() {},

        selectUpload: function(file) {}

    }]);
});



Scoped.define("module:ImageCapture.Dynamics.RecorderStates.FatalError", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "browser:Info",
    "base:Timers.Timer"
], function(State, Info, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],
        _locals: ["message", "retry"],

        _started: function() {
            this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
            this.dyn.set("shortMessage", this.dyn.get("message").length < 30);
            this.listenOn(this.dyn, "message-click", function() {
                if (this._retry)
                    this.next(this._retry);
            });
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Initial", [
    "module:ImageCapture.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn.set("is_initial_state", true);
            this.dyn.set("verified", false);
            this.dyn.set("playbacksource", null);
            this.dyn.set("player_active", false);
            this.dyn._imageFileName = null;
            this.dyn._imageFile = null;
            this.dyn._imageFilePlaybackable = false;
            this.dyn._initializeUploader();
            if (!this.dyn.get("recordermode")) {
                if (!this.dyn.get("image")) {
                    console.warn("recordermode:false requires an existing video to be present and provided.");
                    this.dyn.set("recordermode", true);
                } else
                    this.next("Player");
            } else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
                this.eventualNext("RequiredSoftwareCheck");
            else
                this.next("Chooser");
        },

        _end: function() {
            this.dyn.set("is_initial_state", false);
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Player", [
    "module:ImageCapture.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        rerecord: function() {
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        _started: function() {
            this.dyn.set("player_active", true);
        },

        _end: function() {
            this.dyn.set("player_active", false);
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Chooser", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Strings",
    "browser:Info",
    "media:Player.Support"
], function(State, Strings, Info, PlayerSupport, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["chooser"],

        _started: function() {
            this.listenOn(this.dyn, "change:orientation change:currentorientation", function() {
                var orientation = this.dyn.get("orientation");
                var currentorientation = this.dyn.get("currentorientation");
                var result = orientation && orientation !== currentorientation;
                if (result)
                    this.dyn.set("message", this.dyn.string("orientation-" + orientation + "-required"));
                this.dyn.set("message_active", result);
                this.dyn.set("chooser_active", !result);
            }, this, {
                initcall: true
            });
        },

        record: function() {
            this.dyn.set("autorecord", true);
            this.selectRecord();
        },

        selectRecord: function() {
            this.dyn.set("record_media", "camera");
            this.next("RequiredSoftwareCheck");
        },

        selectUpload: function(file) {
            if (!(Info.isMobile() && Info.isAndroid() && Info.isCordova())) {
                if (this.dyn.get("allowedextensions")) {
                    var filename = (file.files[0].name || "").toLowerCase();
                    var found = false;
                    this.dyn.get("allowedextensions").forEach(function(extension) {
                        if (Strings.ends_with(filename, "." + extension.toLowerCase()))
                            found = true;
                    }, this);
                    if (!found) {
                        this.next("FatalError", {
                            message: this.dyn.string("unsupported_image_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
                            retry: "Chooser"
                        });
                        return;
                    }
                }
                if (this.dyn.get("filesizelimit") && file.files && file.files.length > 0 && file.files[0].size && file.files[0].size > this.dyn.get("filesizelimit")) {
                    var fact = "KB";
                    var size = Math.round(file.files[0].size / 1000);
                    var limit = Math.round(this.dyn.get("filesizelimit") / 1000);
                    if (size > 999) {
                        fact = "MB";
                        size = Math.round(size / 1000);
                        limit = Math.round(limit / 1000);
                    }
                    this.next("FatalError", {
                        message: this.dyn.string("image_file_too_large").replace("%s", size + fact + " / " + limit + fact),
                        retry: "Chooser"
                    });
                    return;
                }
            }
            try {
                PlayerSupport.imageFileInfo(file.files[0]).success(function(data) {
                    if ((data.width && this.dyn.get("minuploadingwidth") && this.dyn.get("minuploadingwidth") > data.width) ||
                        (data.width && this.dyn.get("maxuploadingwidth") && this.dyn.get("maxuploadingwidth") < data.width) ||
                        (data.height && this.dyn.get("minuploadingheight") && this.dyn.get("minuploadingheight") > data.height) ||
                        (data.height && this.dyn.get("maxuploadingheight") && this.dyn.get("maxuploadingheight") < data.height)) {
                        this.next("FatalError", {
                            message: this.dyn.string("resolution-constraint-error"),
                            retry: "Chooser"
                        });
                        return;
                    }
                    this.dyn._imageFilePlaybackable = true;
                    this._uploadFile(file);
                }, this).error(function() {
                    this._uploadFile(file);
                }, this);
            } catch (e) {
                this._uploadFile(file);
            }
        },

        _uploadFile: function(file) {
            this.dyn.set("creation-type", Info.isMobile() ? "mobile" : "upload");
            try {
                this.dyn._imageFileName = file.files[0].name;
                this.dyn._imageFile = file.files[0];
            } catch (e) {}
            this.dyn._prepareRecording().success(function() {
                this.dyn.trigger("upload_selected", file);
                this.dyn._uploadImageFile(file);
                this.next("Uploading");
            }, this).error(function(s) {
                this.next("FatalError", {
                    message: s,
                    retry: "Chooser"
                });
            }, this);
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.RequiredSoftwareCheck", [
    "module:ImageCapture.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "error", function(s) {
                this.next("FatalError", {
                    message: this.dyn.string("attach-error"),
                    retry: "Initial"
                });
            }, this);
            this.dyn._attachRecorder();
            if (this.dyn) {
                this.dyn.on("message-link-click", function(link) {
                    link.execute();
                    this.next("RequiredSoftwareWait");
                }, this);
                this.dyn._softwareDependencies().error(function(dependencies) {
                    this.dyn.set("message_links", dependencies);
                    this.dyn.set("loader_active", false);
                    this.dyn.set("message_active", true);
                    this.dyn.set("message", this.dyn.string("software-required"));
                }, this).success(function() {
                    this.next("CameraAccess");
                }, this);
            }
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.RequiredSoftwareWait", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Promise",
    "browser:Dom"
], function(State, Promise, Dom, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.dyn.set("message", this.dyn.string("software-waiting"));
            Promise.resilience(function() {
                if (Dom.isTabHidden())
                    return Promise.error("Not ready");
                return this.dyn._softwareDependencies();
            }, this, 120, [], 1000).success(function() {
                this.next("CameraAccess");
            }, this).error(function() {
                this.next("RequiredSoftwareCheck");
            }, this);
            this.dyn.on("message-click", function() {
                this.next("RequiredSoftwareCheck");
            }, this);
        }

    });
});



Scoped.define("module:ImageCapture.Dynamics.RecorderStates.CameraAccess", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Timers.Timer"
], function(State, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "bound", function() {
                this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
                var timer = this.auto_destroy(new Timer({
                    start: true,
                    delay: 100,
                    context: this,
                    fire: function() {
                        if (this.dyn.blankLevel() >= 0.01 && this.dyn.deltaCoefficient() >= 0.01) {
                            timer.stop();
                            this.next("CameraHasAccess");
                        }
                    }
                }));
            }, this);
            this.listenOn(this.dyn, "error", function(s) {
                this.next("FatalError", {
                    message: this.dyn.string("attach-error"),
                    retry: "Initial"
                });
            }, this);
            this.listenOn(this.dyn, "access_forbidden", function() {
                this.next("FatalError", {
                    message: this.dyn.string("access-forbidden"),
                    retry: "Initial"
                });
            }, this);
            this.dyn._bindMedia();
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.CameraHasAccess", [
    "module:ImageCapture.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["topmessage", "controlbar"],

        _started: function() {
            this.dyn.trigger("ready_to_record");
            this._preparePromise = null;
            if (this.dyn.get("countdown") > 0 && this.dyn.recorder && this.dyn.recorder.recordDelay(this.dyn.get("uploadoptions")) > this.dyn.get("countdown") * 1000)
                this._preparePromise = this.dyn._prepareRecording();
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("controlbarlabel", "");
            if (this.dyn.get("autorecord"))
                this.next("RecordPrepare", {
                    preparePromise: this._preparePromise
                });
        },

        record: function() {
            if (this.dyn.get("autorecord"))
                return;
            this.next("RecordPrepare", {
                preparePromise: this._preparePromise
            });
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.RecordPrepare", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Timers.Timer",
    "base:Time"
], function(State, Timer, Time, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],
        _locals: ["preparePromise"],

        _started: function() {
            this.dyn.set("message", "");
            this.dyn.set("loaderlabel", "");
            var startedRecording = false;
            this.dyn._accessing_camera = true;
            this._preparePromise = this._preparePromise || this.dyn._prepareRecording();
            var countdown = this.dyn.get("countdown") ? this.dyn.get("countdown") * 1000 : 0;
            var delay = this.dyn.recorder.recordDelay(this.dyn.get("uploadoptions")) || 0;
            if (countdown) {
                var displayDenominator = 1000;
                var silentTime = 0;
                var startTime = Time.now();
                var endTime = startTime + Math.max(delay, countdown);
                if (delay > countdown) {
                    silentTime = Math.min(500, delay - countdown);
                    displayDenominator = (delay - silentTime) / countdown * 1000;
                } else
                    this.dyn.set("loaderlabel", this.dyn.get("countdown"));
                var timer = new Timer({
                    context: this,
                    delay: 50,
                    fire: function() {
                        var now = Time.now();
                        var time_left = Math.max(0, endTime - now);
                        if (now > silentTime + startTime) {
                            this.dyn.set("loaderlabel", "" + Math.ceil((time_left - silentTime) / displayDenominator));
                            this.dyn.trigger("countdown", Math.round((time_left - silentTime) / displayDenominator * 1000));
                        }
                        if (endTime <= now) {
                            this.dyn.set("loaderlabel", "");
                            timer.stop();
                        }
                        if ((time_left <= delay) && !startedRecording) {
                            startedRecording = true;
                            this._startRecording();
                        }
                    }
                });
                this.auto_destroy(timer);
            } else
                this._startRecording();
        },

        record: function() {
            this._startRecording();
        },

        _startRecording: function() {
            this.next("Recording");
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Recording", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Timers.Timer",
    "base:Time",
    "base:TimeFormat",
    "base:Async"
], function(State, Timer, Time, TimeFormat, Async, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["topmessage", "controlbar"],

        _started: function() {
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn._accessing_camera = true;
            this.dyn.trigger("recording");
            this.dyn.set("settingsvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn._captureImage();
            this.dyn._uploadCapture();
            this.dyn._unbindMedia();
            this.next("Uploading");
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Uploading", [
    "module:ImageCapture.Dynamics.RecorderStates.State",
    "base:Time",
    "base:Async",
    "base:Objs"
], function(State, Time, Async, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader", "message"],

        _started: function() {
            this.dyn.set("cancancel", true);
            this.dyn.set("skipinitial", this.dyn.get("skipinitial") || this.dyn.get("skipinitialonrerecord"));
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("loadlabel", "");
            this.dyn.set("controlbarlabel", "");
            this.dyn.trigger("uploading");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            if (this.dyn.get("early-rerecord"))
                this.dyn.set("controlbar_active", true);
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn.set("message", this.dyn.string("uploading"));
            this.dyn.set("playertopmessage", this.dyn.get("message"));
            var uploader = this.dyn._dataUploader;
            this.listenOn(uploader, "success", function() {
                Async.eventually(function() {
                    if (this.destroyed())
                        return;
                    this._finished();
                    this.next("Verifying");
                }, this);
            });
            this.listenOn(uploader, "error", function(e) {
                var bestError = this.dyn.string("uploading-failed");
                try {
                    e.forEach(function(ee) {
                        for (var key in ee)
                            if (this.dyn.string("upload-error-" + key))
                                bestError = this.dyn.string("upload-error-" + key);
                    }, this);
                } catch (err) {}
                this.dyn.set("player_active", false);
                this.next("FatalError", {
                    message: bestError,
                    retry: this.dyn.recorderAttached() ? "Uploading" : "Initial"
                });
            });
            this.listenOn(uploader, "progress", function(uploaded, total) {
                this.dyn.trigger("upload_progress", uploaded, total);
                if (total !== 0 && total > 0 && uploaded >= 0) {
                    var up = Math.min(100, Math.round(uploaded / total * 100));
                    if (!isNaN(up)) {
                        this.dyn.set("message", this.dyn.string("uploading") + ": " + up + "%");
                        this.dyn.set("playertopmessage", this.dyn.get("message"));
                    }
                }
            });
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._imageFilePlaybackable)) {
                if (this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback())
                    this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
                else
                    this.dyn.set("playbacksource", (window.URL || window.webkitURL).createObjectURL(this.dyn._imageFile));
                this.dyn.set("loader_active", false);
                this.dyn.set("message_active", false);
                this.dyn.set("player_active", true);
            }
            this.dyn.set("start-upload-time", Time.now());
            uploader.reset();
            uploader.upload();
        },

        rerecord: function() {
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        _finished: function() {
            this.dyn.set("cancancel", false);
            this.dyn.trigger("uploaded");
            this.dyn.set("end-upload-time", Time.now());
        }

    });
});


Scoped.define("module:ImageCapture.Dynamics.RecorderStates.Verifying", [
    "module:ImageCapture.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader", "message"],

        _started: function() {
            this.dyn.set("loadlabel", "");
            this.dyn.trigger("verifying");
            this.dyn.set("message", this.dyn.string("verifying") + "...");
            this.dyn.set("playertopmessage", this.dyn.get("message"));
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._imageFilePlaybackable)) {
                this.dyn.set("loader_active", false);
                this.dyn.set("message_active", false);
            } else {
                this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
                if (this.dyn.get("early-rerecord"))
                    this.dyn.set("controlbar_active", true);
            }
            this.dyn._verifyRecording().success(function() {
                this.dyn.trigger("verified");
                this.dyn._detachRecorder();
                if (this.dyn.get("recordings"))
                    this.dyn.set("recordings", this.dyn.get("recordings") - 1);
                this.dyn.set("message", "");
                this.dyn.set("playertopmessage", "");
                this.dyn.set("verified", true);
                this.next("Player");
            }, this).error(function() {
                this.dyn.set("player_active", false);
                this.next("FatalError", {
                    message: this.dyn.string("verifying-failed"),
                    retry: this.dyn.recorderAttached() ? "Verifying" : "Initial"
                });
            }, this);
        },

        rerecord: function() {
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        }

    });
});