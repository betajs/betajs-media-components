Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.State", [
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
                "controlbar": false,
                "loader": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this.dyn.set("message_links", null);
            this.dyn._accessing_microphone = false;
            this._started();
        },

        _started: function() {},

        record: function() {
            this.dyn.set("autorecord", true);
        },

        stop: function() {
            this.dyn.scopes.player.execute('stop');
        },

        play: function() {
            this.dyn.scopes.player.execute('play');
        },

        pause: function() {
            this.dyn.scopes.player.execute('pause');
        },

        rerecord: function() {},

        selectRecord: function() {},

        selectUpload: function(file) {}

    }]);
});



Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.FatalError", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
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


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Initial", [
    "module:AudioRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn.set("is_initial_state", true);
            this.dyn.set("verified", false);
            this.dyn.set("playbacksource", null);
            this.dyn.set("player_active", false);
            this.dyn._audioFileName = null;
            this.dyn._audioFile = null;
            this.dyn._audioFilePlaybackable = false;
            this.dyn._initializeUploader();
            if (!this.dyn.get("recordermode")) {
                if (!this.dyn.get("audio")) {
                    console.warn("recordermode:false requires an existing audio to be present and provided.");
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


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Player", [
    "module:AudioRecorder.Dynamics.RecorderStates.State"
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


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Chooser", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
    "base:Strings",
    "browser:Info",
    "media:Player.Support"
], function(State, Strings, Info, PlayerSupport, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["chooser"],

        record: function() {
            this.dyn.set("autorecord", true);
            this.selectRecord();
        },

        selectRecord: function() {
            this.dyn.set("record_media", "microphone");
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
                            message: this.dyn.string("unsupported_audio_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
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
                        message: this.dyn.string("audio_file_too_large").replace("%s", size + fact + " / " + limit + fact),
                        retry: "Chooser"
                    });
                    return;
                }
            }
            try {
                PlayerSupport.audioFileInfo(file.files[0]).success(function(data) {
                    if (data.duration && this.dyn.get("enforce-duration")) {
                        if ((this.dyn.get("timeminlimit") && data.duration < this.dyn.get("timeminlimit")) || (this.dyn.get("timelimit") && data.duration > this.dyn.get("timelimit"))) {
                            this.next("FatalError", {
                                message: this.dyn.string("upload-error-duration"),
                                retry: "Chooser"
                            });
                            return;
                        }
                    }
                    this.dyn._audioFilePlaybackable = true;
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
                this.dyn._audioFileName = file.files[0].name;
                this.dyn._audioFile = file.files[0];
            } catch (e) {}
            this.dyn._prepareRecording().success(function() {
                this.dyn.trigger("upload_selected", file);
                this.dyn._uploadAudioFile(file);
                this._setValueToEmpty(file);
                this.next("Uploading");
            }, this).error(function(s) {
                this._setValueToEmpty(file);
                this.next("FatalError", {
                    message: s,
                    retry: "Chooser"
                });
            }, this);
        },

        /**
         * Try to fix twice file upload behaviour, (on change event won't be executed twice with the same file)
         * Don't set null to value, will not solve an issue
         * @param {HTMLInputElement} file
         */
        _setValueToEmpty: function(file) {
            try {
                file.value = '';
            } catch (e) {}
        }

    });
});


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.RequiredSoftwareCheck", [
    "module:AudioRecorder.Dynamics.RecorderStates.State"
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
            this.dyn.set("skipvisible", false);
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
                    this.next("MicrophoneAccess");
                }, this);
            }
        }

    });
});


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.RequiredSoftwareWait", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
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
                this.next("MicrophoneAccess");
            }, this).error(function() {
                this.next("RequiredSoftwareCheck");
            }, this);
            this.dyn.on("message-click", function() {
                this.next("RequiredSoftwareCheck");
            }, this);
        }

    });
});



Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.MicrophoneAccess", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
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
            this.dyn.set("stopvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "bound", function() {
                this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
                this.next("MicrophoneHasAccess");
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


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.MicrophoneHasAccess", [
    "module:AudioRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.trigger("ready_to_record");
            this._preparePromise = null;
            if (this.dyn.get("countdown") > 0 && this.dyn.recorder && this.dyn.recorder.recordDelay(this.dyn.get("uploadoptions")) > this.dyn.get("countdown") * 1000)
                this._preparePromise = this.dyn._prepareRecording();
            this.dyn.set("hovermessage", "");
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
            if (this.dyn.get("audio-test-mandatory") && !this.dyn.get("microphonehealthy") && !this._preparePromise)
                return;
            this.next("RecordPrepare", {
                preparePromise: this._preparePromise
            });
        }

    });
});


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.RecordPrepare", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
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
            this.dyn._accessing_microphone = true;
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
            this._preparePromise.success(function() {
                this.dyn._startRecording().success(function() {
                    this.next("Recording");
                }, this).error(function(s) {
                    this.next("FatalError", {
                        message: s,
                        retry: "RequiredSoftwareCheck"
                    });
                }, this);
            }, this).error(function(s) {
                this.next("FatalError", {
                    message: s,
                    retry: "RequiredSoftwareCheck"
                });
            }, this);
        }

    });
});


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Recording", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
    "base:Timers.Timer",
    "base:Time",
    "base:TimeFormat",
    "base:Async"
], function(State, Timer, Time, TimeFormat, Async, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn._accessing_microphone = true;
            this.dyn.trigger("recording");
            this.dyn.set("settingsvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("stopvisible", true);

            this._startTime = Time.now();
            this._stopping = false;
            this._timer = this.auto_destroy(new Timer({
                immediate: true,
                delay: 10,
                context: this,
                fire: this._timerFire
            }));
        },

        _timerFire: function() {
            var limit = this.dyn.get("timelimit");
            var current = Time.now();
            var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
            this.dyn.trigger("recording_progress", current - this._startTime);
            this.dyn.set("controlbarlabel", this.dyn.get("display-timer") ? TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display) : "");

            if (this.dyn.get("timeminlimit"))
                this.dyn.set("mintimeindicator", (Time.now() - this._startTime) / 1000 <= this.dyn.get("timeminlimit"));

            if (limit && this._startTime + limit * 1000 <= current) {
                this._timer.stop();
                this.stop();
            }

        },

        stop: function() {
            var minlimit = this.dyn.get("timeminlimit");
            if (minlimit) {
                var delta = (Time.now() - this._startTime) / 1000;
                if (delta < minlimit) {
                    var limit = this.dyn.get("timelimit");
                    if (!limit || limit > delta)
                        return;
                }
            }
            if (this._stopping)
                return;
            this.dyn.set("loader_active", true);
            this.dyn.set("controlbar_active", false);
            this.dyn.set("message_active", true);
            this.dyn.set("message", "");
            this._stopping = true;
            Async.eventually(function() {
                this.dyn._stopRecording().success(function() {
                    this._hasStopped();
                    this.next("Uploading");
                }, this).error(function(s) {
                    this.next("FatalError", {
                        message: s,
                        retry: "RequiredSoftwareCheck"
                    });
                }, this);
            }, this);
        },

        _hasStopped: function() {
            this.dyn.set("duration", Time.now() - this._startTime);
            this.dyn._unbindMedia();
            this.dyn.trigger("recording_stopped");
        }

    });
});



Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Uploading", [
    "module:AudioRecorder.Dynamics.RecorderStates.State",
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
            this.dyn.set("stopvisible", false);
            this.dyn.set("loadlabel", "");
            this.dyn.set("controlbarlabel", "");
            this.dyn.trigger("uploading");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            if (this.dyn.get("early-rerecord"))
                this.dyn.set("controlbar_active", true);
            this.dyn.set("hovermessage", "");
            this.dyn.set("message", this.dyn.string("uploading"));
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
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._audioFilePlaybackable)) {
                if (this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback())
                    this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
                else
                    this.dyn.set("playbacksource", (window.URL || window.webkitURL).createObjectURL(this.dyn._audioFile));
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


Scoped.define("module:AudioRecorder.Dynamics.RecorderStates.Verifying", [
    "module:AudioRecorder.Dynamics.RecorderStates.State"
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
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._audioFilePlaybackable)) {
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