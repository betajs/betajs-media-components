Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"message": false,
				"chooser": false,
				"topmessage": false,
				"controlbar": false,
				"loader": false,
				"imagegallery": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this.dyn.set("playertopmessage", "");
			this.dyn._accessing_camera = false;
			this._started();
		},
		
		_started: function () {},
		
		record: function () {
			this.dyn.set("autorecord", true);
		},
		
		stop: function () {
			this.dyn.scopes.player.execute('stop');
		},
		
		play: function () {
			this.dyn.scopes.player.execute('play');
		},
		
		pause: function () {
			this.dyn.scopes.player.execute('pause');
		},		
		
		rerecord: function () {},
		
		selectRecord: function () {},
		
		selectUpload: function (file) {},
		
		uploadCovershot: function (file) {}
	
	}]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"browser:Info",
	"base:Timers.Timer"
], function (State, Info, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message", "retry", "flashtest"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
			this.listenOn(this.dyn, "message-click", function () {
				if (this._retry)
					this.next(this._retry);
			});
			if (this._flashtest && !Info.isMobile() && Info.flash().supported() && !Info.flash().installed()) {
				this.auto_destroy(new Timer({
					delay: 500,
					context: this,
					fire: function () {
						if (Info.flash(true).installed())
							this.next(this._retry);
					}
				}));
				if (Info.isSafari() && Info.safariVersion() >= 10)
					document.location.href = "//get.adobe.com/flashplayer";
			}
		}

	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		_started: function () {
			this.dyn.set("player_active", false);
			this.dyn._initializeUploader();
			if (!this.dyn.get("recordermode"))
				this.next("Player");
			else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
				this.eventualNext("CameraAccess");
			else
				this.next("Chooser");
		}
	
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		rerecord: function () {
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		_started: function () {
			this.dyn.set("player_active", true);
		},
		
		_end: function () {
			this.dyn.set("player_active", false);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Strings",
	"browser:Info"
], function (State, Strings, Info, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["chooser"],
		
		record: function () {
			this.dyn.set("autorecord", true);
			this.selectRecord();
		},
		
		selectRecord: function () {
			this.next("CameraAccess");
		},
		
		selectUpload: function (file) {
			if (!(Info.isMobile() && Info.isAndroid() && Info.isCordova())) {
				if (this.dyn.get("allowedextensions")) {
					var filename = (file.files[0].name || "").toLowerCase();
					var found = false;
					this.dyn.get("allowedextensions").forEach(function (extension) {
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
			this._uploadFile(file);
		},
		
		_uploadFile: function (file) {
			this.dyn.set("creation-type", Info.isMobile() ? "mobile" : "upload");
			this.dyn._prepareRecording().success(function () {
				this.dyn.trigger("upload_selected", file);
				this.dyn._uploadVideoFile(file);
				this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "Chooser" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer"
], function (State, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			this.listenOn(this.dyn, "bound", function () {
				this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
				var timer = this.auto_destroy(new Timer({
					start: true,
					delay: 100,
					context: this,
					fire: function () {
						if (this.dyn.recorder.blankLevel() >= 0.01 && this.dyn.recorder.deltaCoefficient() >= 0.01) {
							timer.stop();
							this.next("CameraHasAccess");
						}
					}
				}));
			}, this);
			this.listenOn(this.dyn, "error", function (s) {
				this.next("FatalError", { message: this.dyn.string("attach-error"), retry: "Initial", flashtest: true });
			}, this);
			this.listenOn(this.dyn, "access_forbidden", function () {
				this.next("FatalError", { message: this.dyn.string("access-forbidden"), retry: "Initial" });
			}, this);
			this.dyn._attachRecorder();
			if (this.dyn)
				this.dyn._bindMedia();
		}
				
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraHasAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			if (this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		},
		
		record: function () {
			if (!this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RecordPrepare", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time"
], function (State, Timer, Time, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this._promise = this.dyn._prepareRecording();
			this.dyn.set("message", "");
			if (this.dyn.get("countdown")) {
				this.dyn.set("loaderlabel", this.dyn.get("countdown"));
				var endTime = Time.now() + this.dyn.get("countdown") * 1000;
				var timer = new Timer({
					context: this,
					delay: 100,
					fire: function () {
						var time_left = Math.max(0, endTime - Time.now());
						this.dyn.set("loaderlabel", "" + Math.round(time_left / 1000));
						this.dyn.trigger("countdown", time_left);
						if (endTime <= Time.now()) {
							this.dyn.set("loaderlabel", "");
							timer.stop();
							this._startRecording();
						}
					}
				});				
				this.auto_destroy(timer);
			} else
				this._startRecording();
		},
		
		record: function () {
			this._startRecording();
		},

		_startRecording: function () {
			this._promise.success(function () {
				this.dyn._startRecording().success(function () {
					this.next("Recording");
				}, this).error(function (s) {
					this.next("FatalError", { message: s, retry: "CameraAccess" });
				}, this);
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Recording", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time",
	"base:TimeFormat"
], function (State, Timer, Time, TimeFormat, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this.dyn.trigger("recording");
			this.dyn.set("settingsvisible", false);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", true);
			this.dyn.set("skipvisible", false);
			this._startTime = Time.now();
			this._stopping = false;
			this._timer = this.auto_destroy(new Timer({
				immediate: true,
				delay: 10,
				context: this,
				fire: this._timerFire
			}));
		},
		
		_timerFire: function () {
			var limit = this.dyn.get("timelimit");
			var current = Time.now();
			var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
			this.dyn.trigger("recording_progress", current - this._startTime);
			this.dyn.set("controlbarlabel", TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display));
			if (limit && this._startTime + limit * 1000 <= current) {
				this._timer.stop();
				this.stop();
			}
		},
		
		stop: function () {
			var minlimit = this.dyn.get("timeminlimit");
			if (minlimit) {
				var delta = Time.now() - this._startTime;
				if (delta < minlimit) {
					var limit = this.dyn.get("timelimit");
					if (!limit || limit > delta)
						return;
				}
			}
			if (this._stopping)
				return;
			this._stopping = true;
			this.dyn._stopRecording().success(function () {
				this._hasStopped();
				if (this.dyn.get("picksnapshots") && this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
					this.next("CovershotSelection");
				else
					this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
		},
		
		_hasStopped: function () {
			this.dyn.set("duration", Time.now() - this._startTime);
			this.dyn._showBackgroundSnapshot();
			this.dyn._unbindMedia();
			this.dyn.trigger("recording_stopped");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CovershotSelection", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["imagegallery", "topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", true);
			this.dyn.set("controlbarlabel", "");
			this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			this.dyn.set("uploadcovershotvisible", this.dyn.get("custom-covershots"));
			this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
			var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
			imagegallery.loadSnapshots();
			imagegallery.updateContainerSize();
			this.listenOn(this.dyn, "invoke-skip", function () {
				this._nextUploading(true);
			}, this);
			this.listenOn(this.dyn, "select-image", function (image) {
				this.dyn._uploadCovershot(image);
				this._nextUploading(false);
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		uploadCovershot: function (file) {
			this.dyn._uploadCovershotFile(file);
			this._nextUploading(false);
		},
		
		_nextUploading: function (skippedCovershot) {
			this.next("Uploading");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Time"
], function (State, Time, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("uploading");
			this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			if (this.dyn.get("early-rerecord"))
				this.dyn.set("controlbar_active", true);
			this.dyn.set("topmessage", "");
			this.dyn.set("message", this.dyn.string("uploading"));
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			var uploader = this.dyn._dataUploader;
			this.listenOn(uploader, "success", function () {
				this._finished();
				this.next("Verifying");
			});
			this.listenOn(uploader, "error", function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("uploading-failed"),
					retry: this.dyn.recorderAttached() ? "Uploading" : "Initial"
				});
			});
			this.listenOn(uploader, "progress", function (uploaded, total) {
				this.dyn.trigger("upload_progress", uploaded, total);
				if (total !== 0) {
					this.dyn.set("message", this.dyn.string("uploading") + ": " + Math.min(100, Math.round(uploaded / total * 100)) + "%");
					this.dyn.set("playertopmessage", this.dyn.get("message"));
				}
			});
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
				if (this.dyn.__lastCovershotUpload)
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
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		_finished: function () {
			this.dyn.trigger("uploaded");
			this.dyn.set("end-upload-time", Time.now());			
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Verifying", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("verifying");
			this.dyn.set("message", this.dyn.string("verifying") + "...");
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("loader_active", false);
				this.dyn.set("message_active", false);
			} else {
				this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
				if (this.dyn.get("early-rerecord"))
					this.dyn.set("controlbar_active", true);
			}
			this.dyn._verifyRecording().success(function () {
				this.dyn.trigger("verified");
				this.dyn._hideBackgroundSnapshot();
				this.dyn._detachRecorder();
				if (this.dyn.get("recordings"))
					this.dyn.set("recordings", this.dyn.get("recordings") - 1);
				this.next("Player");
			}, this).error(function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("verifying-failed"),
					retry: this.dyn.recorderAttached() ? "Verifying" : "Initial"
				});
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		}
		
	});
});