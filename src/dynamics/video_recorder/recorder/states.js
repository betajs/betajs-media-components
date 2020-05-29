Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.State", [
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
                "loader": false,
                "imagegallery": false,
                "helperframe": false
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

        selectRecordScreen: function(isMultiStream) {},

        selectUpload: function(file) {},

        uploadCovershot: function(file) {}

    }]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
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


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "browser:Dom"
], function(State, Dom, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn.set("is_initial_state", true);
            this.dyn.set("verified", false);
            this.dyn.set("playbacksource", null);
            this.dyn.set("playbackposter", null);
            this.dyn.set("player_active", false);
            this.dyn._videoFileName = null;
            this.dyn._videoFile = null;
            this.dyn._videoFilePlaybackable = false;
            this.dyn._initializeUploader();
            if (!this.dyn.get("recordermode")) {
                if (!this.dyn.get("video")) {
                    console.warn("recordermode:false requires an existing video to be present and provided.");
                    this.dyn.set("recordermode", true);
                } else
                    this.next("Player");
            } else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
                if (this.dyn.get("onlyaudio")) {
                    Dom.userInteraction(function() {
                        this.eventualNext("RequiredSoftwareCheck");
                    }, this);
                } else {
                    this.eventualNext("RequiredSoftwareCheck");
                }
            else
                this.next("Chooser");
        },

        _end: function() {
            this.dyn.set("is_initial_state", false);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
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
            if (this.dyn.get("allowtexttrackupload"))
                this.dyn.set("uploadtexttracksvisible", true);
        },

        _end: function() {
            this.dyn.set("player_active", false);
            this.dyn.set("uploadtexttracksvisible", false);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Strings",
    "base:Objs",
    "browser:Info",
    "module:PopupHelper",
    "media:Player.Support"
], function(State, Strings, Objs, Info, PopupHelper, PlayerSupport, scoped) {
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

        _popup: function() {
            var popup = this.auto_destroy(new PopupHelper());
            var dynamic = this.auto_destroy(new this.dyn.cls({
                element: popup.containerInner,
                attrs: Objs.extend(this.dyn.cloneAttrs(), this.dyn.popupAttrs())
            }));
            this._delegatedRecorder = dynamic;
            this.dyn.delegateEvents(null, dynamic);
            popup.on("hide", function() {
                this._delegatedRecorder = null;
                dynamic.destroy();
                popup.destroy();
            }, this);
            popup.show();
            dynamic.activate();
        },

        record: function() {
            if (this.dyn.get("popup")) {
                this._popup();
                return;
            }
            this.dyn.set("autorecord", true);
            this.selectRecord();
        },

        /**
         * Will launch multistream
         * @param isMultiStream // Does stream has additional stream
         */
        selectRecordScreen: function(isMultiStream) {
            if (this.dyn.get("popup")) {
                this._popup();
                return;
            }
            this.dyn.set("record_media", isMultiStream ? "multistream" : "screen");
            this.next("RequiredSoftwareCheck");
        },

        selectRecord: function() {
            if (this.dyn.get("popup")) {
                this._popup();
                return;
            }
            this.dyn.set("record_media", "camera");
            this.next("RequiredSoftwareCheck");
        },

        selectUpload: function(file) {
            if (this.dyn.get("popup")) {
                this._popup();
                return;
            }
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
                            message: this.dyn.string("unsupported_video_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
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
                        message: this.dyn.string("video_file_too_large").replace("%s", size + fact + " / " + limit + fact),
                        retry: "Chooser"
                    });
                    return;
                }
            }
            try {
                PlayerSupport.videoFileInfo(file.files[0]).success(function(data) {
                    if (data.duration && this.dyn.get("enforce-duration")) {
                        if ((this.dyn.get("timeminlimit") && data.duration < this.dyn.get("timeminlimit")) || (this.dyn.get("timelimit") && data.duration > this.dyn.get("timelimit"))) {
                            this.next("FatalError", {
                                message: this.dyn.string("upload-error-duration"),
                                retry: "Chooser"
                            });
                            return;
                        }
                    }
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
                    this.dyn._videoFilePlaybackable = true;
                    this._uploadFile(file);
                }, this).error(function() {
                    this._uploadFile(file);
                }, this);
            } catch (e) {
                this._uploadFile(file);
            }
        },

        /**
         * @param {File} file
         * @private
         */
        _uploadFile: function(file) {
            if (this.__blocked)
                return;
            this.__blocked = true;
            this.dyn.set("creation-type", Info.isMobile() ? "mobile" : "upload");
            try {
                this.dyn._videoFileName = file.files[0].name;
                this.dyn._videoFile = file.files[0];
            } catch (e) {}
            this.dyn._prepareRecording().success(function() {
                this.dyn.trigger("upload_selected", file);
                this.dyn._uploadVideoFile(file);
                this._setValueToEmpty(file);
                this.__blocked = false;
                if (((Info.isMobile && this.dyn.get("recordviafilecapture") && this.dyn.get("snapshotfrommobilecapture")) || this.dyn.get("snapshotfromuploader")) && !this.dyn.get("onlyaudio") && this.dyn.get("picksnapshots")) {
                    this.dyn.snapshots = [];
                    this.next("CreateUploadCovershot");
                } else
                    this.next("Uploading");
            }, this).error(function(s) {
                this._setValueToEmpty(file);
                this.__blocked = false;
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

Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CreateUploadCovershot", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "media:Recorder.Support",
    "base:Objs",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events",
    "browser:Info",
    "base:Async"
], function(State, RecorderSupport, Objs, Timer, Dom, DomEvents, Info, Async, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader", "message"],

        _started: function() {
            this.dyn.set("cancancel", true);
            this.dyn.set("loader_active", true);
            this.dyn.set("topmessage", this.dyn.string('please-wait'));
            this.dyn.set("message", this.dyn.string("prepare-covershot"));
            if (this.dyn.get("cancancel") && this.dyn.get("allowcancel"))
                this.dyn.set("controlbar_active", true);

            try {
                this.dyn.set("player_active", false);


                // this.dyn._videoFile only for playback able browsers
                if (this.dyn._videoFile)
                    this.dyn.set("playbacksource", (window.URL || window.webkitURL).createObjectURL(this.dyn._videoFile));
                else {
                    console.warn('Could not find source file to be able start player');
                    return this.next("Uploading");
                }

                var _video = document.createElement('video');
                var _currentTime = 0;
                var _totalDuration = 0;
                var _seekPeriod = 1;
                _video.src = this.dyn.get("playbacksource");
                _video.setAttribute('preload', 'metadata');
                _video.volume = 0;
                _video.muted = true;

                // Wait for 5 seconds before checking if any video data was be able loaded, if not proceed
                Async.eventually(function() {
                    // Have no metadata
                    if (_video.readyState < 1) {
                        console.warn('Could not be able load video metadata');
                        return this.next("Uploading");
                    }
                }, this, 5000);

                var _playerLoadedData = this.auto_destroy(new DomEvents());

                // Note that loadeddata event will not fire in mobile/tablet devices if data-saver is on in browser settings
                // So using loadedmetadata ( or canplaythrough) to be available both desktop and mobile
                // readyState is newly equal to HAVE_ENOUGH_DATA
                // HAVE_NOTHING == 0; HAVE_METADATA == 1; HAVE_CURRENT_DATA == 2; HAVE_FUTURE_DATA == 3; HAVE_ENOUGH_DATA == 4
                _playerLoadedData.on(_video, "loadedmetadata", function(ev) {
                    _totalDuration = _video.duration;
                    if (_totalDuration === Infinity || !_totalDuration) {
                        console.warn('Could not generate video covershots from uploaded file');
                        return this.next("Uploading");
                    }
                    _seekPeriod = this._calculateSeekPeriod(_totalDuration);
                    if (_video.videoWidth > 0 && _video.videoHeight > 0) {
                        var _thumbWidth = _video.videoWidth > _video.videoHeight ? 80 : 35;
                        this.dyn.set("videometadata", Objs.tree_merge(this.dyn.get("videometadata"), {
                            height: _video.videoHeight,
                            width: _video.videoWidth,
                            ratio: +(_video.videoWidth / _video.videoHeight).toFixed(2),
                            "thumbnails": {
                                width: _thumbWidth,
                                height: Math.floor(_thumbWidth / _video.videoWidth * _video.videoHeight)
                            }
                        }));
                        this.__videoSeekTimer = new Timer({
                            context: this,
                            fire: function() {
                                if (_video.volume < 0.1 || _video.muted) {
                                    _video.currentTime = _currentTime;
                                } else _video.volume = 0;
                                _currentTime = _currentTime + _seekPeriod;
                            },
                            destroy_on_stop: true,
                            delay: 500,
                            start: true
                        });
                    } else {
                        console.warn('Could not find video dimensions information to be able create covershot');
                        return this.next("Uploading");
                    }
                }, this);

                _playerLoadedData.on(_video, "seeked", function(ev) {
                    var __snap = RecorderSupport.createSnapshot(this.dyn.get("snapshottype"), _video, true);
                    if (__snap) {
                        // Will add snap images as thumbnails
                        if (this.dyn.get("createthumbnails")) {
                            this.dyn.get("videometadata").thumbnails.images.push({
                                time: _video.currentTime,
                                snap: __snap
                            });
                        }
                        if (this.dyn.snapshots.length < this.dyn.get("snapshotmax")) {
                            this.dyn.snapshots.push(__snap);
                        } else {
                            var i = Math.floor(Math.random() * this.dyn.get("snapshotmax"));
                            RecorderSupport.removeSnapshot(this.dyn.snapshots[i]);
                            this.dyn.snapshots[i] = __snap;
                        }
                    }

                    // Should trigger ended event
                    if ((_video.currentTime + _seekPeriod) >= _totalDuration) {
                        _video.currentTime = _video.currentTime + _seekPeriod;
                        // Will fire ended event if not fired already, fixes IE/Edge related bug
                        if (!_video.ended) {
                            Dom.triggerDomEvent(_video, "ended");
                        }
                    }
                }, this);

                _playerLoadedData.on(_video, "ended", function(ev) {
                    this.__videoSeekTimer.stop();
                    if (typeof _video.remove === 'function')
                        _video.remove();
                    else
                        _video.style.display = 'none';
                    if (this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
                        this.next("CovershotSelection");
                    else
                        this.next("Uploading");
                }, this);

            } catch (exe) {
                console.warn(exe);
                this.next("Uploading");
            }
        },

        stop: function() {
            this.dyn.set("loader_active", false);
            this.dyn.set("loaderlabel", "");
            this.dyn.set("topmessage", "");
        },

        /**
         * @param {number} duration
         * @return {number}
         * @private
         */
        _calculateSeekPeriod: function(duration) {
            if (duration < 15) return 1;
            if (duration < 40) return 3;
            if (duration < 100) return 4;
            else
                return Math.floor(duration / 100) + 4;
        }
    });
});

Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RequiredSoftwareCheck", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
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
            this.dyn.set("uploadcovershotvisible", false);
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


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RequiredSoftwareWait", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
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
            this.dyn.set("skipvisible", false);
            this.dyn.set("uploadcovershotvisible", false);
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



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Objs",
    "base:Types",
    "base:Timers.Timer",
    "base:Collections.Collection"
], function(State, Objs, Types, Timer, Collection, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("uploadcovershotvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "bound", function() {
                this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
                if (this.dyn.get("onlyaudio") || this.dyn.get("record_media") === "screen" || this.dyn.get("record_media") === "multistream") {
                    if (this.dyn.get("allowmultistreams") && this.dyn.get("record_media") === "multistream") {
                        this.dyn.recorder.enumerateDevices().success(function(devices) {
                            this.set("cameras", new Collection(Objs.values(devices.video)));
                            this.trigger(Types.is_empty(devices.video) ? "no_camera" : "has_camera");
                            this._add_new_stream();
                        }, this.dyn);
                    }
                    this.next("CameraHasAccess");
                    return;
                }
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
            this.listenOn(this.dyn, "access_forbidden", function(e) {
                var message = this.dyn.string("access-forbidden");

                if (typeof e.name === 'string' && typeof this.dyn.recorder.errorHandler === 'function') {
                    var errorHandler = this.dyn.recorder.errorHandler(e.name);
                    if (typeof errorHandler === 'object') {
                        if (errorHandler.userLevel)
                            message = this.dyn.string(errorHandler.key);
                        else
                            console.warn(errorHandler.message + '. Please inform us!');
                    }
                }
                this.next("FatalError", {
                    message: message,
                    retry: "Initial"
                });
            }, this);
            this.dyn._bindMedia();
        }
    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraHasAccess", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
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
            //  For now available for WebRTC only
            if (this.dyn.get("pausable"))
                this.dyn.set("pausable", this.dyn.recorder.canPause());
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("uploadcovershotvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("isrecorderready", true);
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


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RecordPrepare", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
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


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Recording", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
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
            this.dyn.set("stopvisible", true);
            this.dyn.set("skipvisible", false);
            this.dyn.set("uploadcovershotvisible", false);
            this._startTime = Time.now();
            this._stopping = false;
            this._timer = this.auto_destroy(new Timer({
                immediate: true,
                delay: 10,
                context: this,
                fire: this._timerFire
            }));
            this._framerateWarning = false;
        },

        _timerFire: function() {
            var limit = this.dyn.get("timelimit");
            var current = Time.now();
            var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
            this.dyn.trigger("recording_progress", current - this._startTime);
            this.dyn.set("controlbarlabel", this.dyn.get("display-timer") ? TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display) : "");

            // If recorder paused will slips starting second
            if (this.dyn.__paused)
                this._startTime += 10;

            if (this.dyn.get("timeminlimit"))
                this.dyn.set("mintimeindicator", (Time.now() - this._startTime) / 1000 <= this.dyn.get("timeminlimit"));

            if (limit && this._startTime + limit * 1000 <= current) {
                this._timer.stop();
                this.stop();
            }


            if (this.dyn.get("framerate-warning") && this.dyn.averageFrameRate()) {
                var framerateWarning = this.dyn.averageFrameRate() < this.dyn.get("framerate-warning");
                if (framerateWarning != this._framerateWarning) {
                    this._framerateWarning = framerateWarning;
                    if (framerateWarning)
                        this.dyn.set("hovermessage", this.dyn.string("framerate-warning"));
                    else
                        this.dyn.set("hovermessage", "");
                }
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
            this.dyn.set("topmessage_active", false);
            this.dyn.set("message_active", true);
            this.dyn.set("message", "");
            this._stopping = true;
            Async.eventually(function() {
                this.dyn._stopRecording().success(function() {
                    this._hasStopped();
                    if (this.dyn.get("picksnapshots") && this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
                        this.next("CovershotSelection");
                    else if (this.dyn.get("videometadata").thumbnails.images.length > 3 && this.dyn.get("createthumbnails"))
                        this.next("UploadThumbnails");
                    else
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
            if (this.dyn.snapshots.length > 0)
                this.dyn._showBackgroundSnapshot();
            this.dyn._unbindMedia();
            this.dyn.trigger("recording_stopped");
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CovershotSelection", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["imagegallery", "topmessage", "controlbar"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", true);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            this.dyn.set("uploadcovershotvisible", this.dyn.get("custom-covershots"));
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
            this.dyn.set("isrecorderready", false);
            var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
            imagegallery.loadSnapshots();
            imagegallery.updateContainerSize();
            this.listenOn(this.dyn, "invoke-skip", function() {
                this._nextUploading(true);
            }, this);
            this.listenOn(this.dyn, "select-image", function(image) {
                this.dyn._uploadCovershot(image);
                this._nextUploading(false);
            }, this);
        },

        rerecord: function() {
            this.dyn._hideBackgroundSnapshot();
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        uploadCovershot: function(file) {
            // If passed file in HTMLInputElement get file
            if (typeof file.files !== 'undefined')
                if (file.files[0])
                    file = file.files[0];
            this.dyn._uploadCovershotFile(file);
            this._nextUploading(false);
        },

        _nextUploading: function(skippedCovershot) {
            if (this.dyn.get("videometadata").thumbnails.images.length > 3 && this.dyn.get("createthumbnails"))
                this.next("UploadThumbnails");
            else
                this.next("Uploading");
        }

    });
});

Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.UploadThumbnails", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Objs",
    "base:Promise",
    "base:Time",
    "base:TimeFormat",
    "media:WebRTC.Support",
    "browser:Events"
], function(State, Objs, Promise, Time, TimeFormat, Support, Events, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("loader_active", true);
            this.dyn.set("loadlabel", "Thumbnails");
            this.dyn.set("message", this.dyn.string("prepare-thumbnails"));
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");

            this._drawIntoCanvas(this.dyn.get("videometadata").thumbnails)
                .success(function(canvas) {
                    this.dyn._uploadThumbnails(Support.dataURItoBlob(canvas.toDataURL('image/jpg')));
                    this.dyn._uploadThumbnailTracks(new Blob(this._vttDescripitions, {
                        type: "text/vtt"
                    }));
                    this.next("Uploading");
                }, this)
                .error(function(err) {
                    console.warn(err);
                    this.next("Uploading");
                }, this);
        },

        _drawIntoCanvas: function(thumbnails) {
            var promise = Promise.create();
            var w = thumbnails.width;
            var h = thumbnails.height;
            var imagesCount = thumbnails.images.length;
            var rowsCount = thumbnails.images.length > 10 ? Math.ceil(imagesCount / 10) : 1;
            var canvas = document.createElement('canvas');
            canvas.width = rowsCount > 1 ? w * 10 : w * imagesCount;
            canvas.height = rowsCount * h;
            this._vttDescripitions = [];
            this._vttDescripitions.push('WEBVTT \n\n');
            var ctx = canvas.getContext('2d');
            var index = 0;
            try {
                if (typeof thumbnails.images[index] !== 'undefined') {
                    this._imageEvent = this.auto_destroy(new Events());
                    var image = image || new Image();
                    image.width = w;
                    image.height = h;
                    image.src = (window.URL || window.webkitURL).createObjectURL(thumbnails.images[index].snap);

                    this._imageEvent.on(image, "load", function() {
                        this._recursivelyDrawImage(canvas, thumbnails, ctx, w, h, image, index, promise);
                    }, this);

                    this._imageEvent.on(image, "error", function(err) {
                        throw "Error with loading thumbnail image. ".err;
                    }, this);
                }
            } catch (err) {
                promise.asyncError(err);
            }
            return promise;
        },

        _recursivelyDrawImage: function(canvas, thumbnails, ctx, w, h, image, index, promise, column, row) {
            column = column || 0;
            row = row || 0;
            index = index || 0;
            ctx.drawImage(image, column * w, row * h, w, h);
            if ((index > 0 && (index % 10 === 0))) {
                row++;
                column = 0;
            } else if (index !== 0) column++;
            index++;
            if (typeof thumbnails.images[index] !== 'undefined' && thumbnails.images.length >= index) {
                var _image, _prevIndex, _nextIndex, _startTime, _endTime, _averageSecond, _formattedStartTime, _formattedEndTime;
                _prevIndex = index - 1;
                _nextIndex = index + 1;

                _averageSecond = Math.round((thumbnails.images[index].time - thumbnails.images[_prevIndex].time) / 2);
                _startTime = thumbnails.images[_prevIndex].time + _averageSecond;
                // For the latest thumb no need add average time
                if (!thumbnails.images[_nextIndex + 1]) _averageSecond = 0;
                _endTime = thumbnails.images[index].time + _averageSecond;

                _formattedStartTime = _startTime === 0 ? '00:00:00' : TimeFormat.format('HH:MM:ss', _startTime * 1000);
                _formattedEndTime = _endTime === 0 ? '00:00:00' : TimeFormat.format('HH:MM:ss', _endTime * 1000);

                // If we have have next index
                if (typeof thumbnails.images[_nextIndex] !== 'undefined') {
                    this._vttDescripitions.push(
                        _formattedStartTime + ".000" + " --> " + _formattedEndTime + ".000" + "\n" + this.dyn.get("uploadoptions").thumbnail.url + "#xywh=" + (column * w) + "," + (row * h) + "," + w + "," + h + "\n\n"
                    );
                }

                _image = new Image();
                _image.width = w;
                _image.height = h;
                _image.src = (window.URL || window.webkitURL).createObjectURL(thumbnails.images[index].snap);

                this._imageEvent.on(_image, "load", function() {
                    this._recursivelyDrawImage(canvas, thumbnails, ctx, w, h, _image, index, promise, column, row);
                }, this);

                this._imageEvent.on(_image, "error", function(err) {
                    throw "Error with loading thumbnail image. Error: ".err;
                }, this);

            } else {
                if (thumbnails.images.length <= index) {
                    promise.asyncSuccess(canvas);
                } else {
                    throw "Could not draw all images";
                }
            }
        }
    });
});

Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
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
            this.dyn.set("isrecorderready", false);
            this.dyn.trigger("uploading");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            if (this.dyn.get("early-rerecord") || (this.dyn.get("cancancel") && this.dyn.get("allowcancel")))
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
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._videoFilePlaybackable)) {
                if (this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback())
                    this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
                else
                    this.dyn.set("playbacksource", (window.URL || window.webkitURL).createObjectURL(this.dyn._videoFile));
                if (this.dyn.__lastCovershotUpload && this.dyn.recorder)
                    this.dyn.set("playbackposter", this.dyn.recorder.snapshotToLocalPoster(this.dyn.__lastCovershotUpload));
                this.dyn.set("loader_active", false);
                this.dyn.set("message_active", false);
                this.dyn._hideBackgroundSnapshot();
                this.dyn.set("player_active", true);
            }
            this.dyn.set("start-upload-time", Time.now());
            uploader.reset();
            uploader.upload();
        },

        rerecord: function() {
            this.dyn._hideBackgroundSnapshot();
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


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Verifying", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
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
            if (this.dyn.get("localplayback") && ((this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) || this.dyn._videoFilePlaybackable)) {
                this.dyn.set("loader_active", false);
                this.dyn.set("message_active", false);
            } else {
                this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
                if (this.dyn.get("early-rerecord"))
                    this.dyn.set("controlbar_active", true);
            }
            this.dyn._verifyRecording().success(function() {
                this.dyn.trigger("verified");
                this.dyn._hideBackgroundSnapshot();
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
            this.dyn._hideBackgroundSnapshot();
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        }

    });
});