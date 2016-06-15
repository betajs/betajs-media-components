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
				"imagegallery": false,
				"player": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this._started();
		},
		
		_started: function () {},
		
		record: function () {
			this.dyn.set("autorecord", true);
		},
		
		stop: function () {},
		
		play: function () {},
		
		pause: function () {},
		
		rerecord: function () {},
		
		selectRecord: function () {},
		
		selectUpload: function (file) {}
	
	}]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message", "retry"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
			this.listenOn(this.dyn, "message-click", function () {
				if (this._retry)
					this.next(this._retry);
			});
		}

	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		_started: function () {
			this.dyn._initializeUploader();
			if (!this.dyn.get("recordermode"))
				this.next("Player");
			else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
				this.next("CameraAccess");
			else
				this.next("Chooser");
		}
	
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["player"],

		_started: function () {
			this.player = this.dyn.scope(">[id='player']").materialize(true);
		},
		
		rerecord: function () {
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		stop: function () {
			this.player.stop();
		},
		
		play: function () {
			this.player.play();
		},
		
		pause: function () {
			this.player.pause();
		}		
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"jquery:",
	"base:Strings",
	"browser:Info"
], function (State, $, Strings, Info, scoped) {
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
					var filename = $(file).val().toLowerCase();
					var found = false;
					this.dyn.get("allowedextensions").forEach(function (extension) {
						if (Strings.ends_with(filename, "." + extension.toLowerCase()))
							found = true;
					}, this);
					if (!found) {
						this.next("FatalError", {
							message: this.dyn.strings("unsupported_video_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
							retry: "Chooser"
						});
						return;
					}
				}
				if (this.dyn.get("filesizelimit")) {
					var f = file;
					if (f.files && f.files.length > 0 && f.files[0].size > this.dyn.get("filesizelimit")) {
						this.next("FatalError", {
							message: this.dyn.strings("video_file_too_large"),
							retry: "Chooser"
						});
						return;
					}
				}
			}
			this.dyn._prepareRecording().success(function () {
				this.dyn._uploadVideoFile(file);
				this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "Chooser" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			this.listenOn(this.dyn, "bound", function () {
				if (this.dyn.get("autorecord"))
					this.next("RecordPrepare");
			}, this);
			this.listenOn(this.dyn, "error", function (s) {
				this.next("FatalError", { message: s, retry: "Initial" });
			}, this);
			this.dyn._attachRecorder();
			this.dyn._bindMedia();
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
			this._promise = this.dyn._prepareRecording();
			this.dyn.set("message", "");
			if (this.dyn.get("countdown")) {
				this.dyn.set("loaderlabel", this.dyn.get("countdown"));
				var endTime = Time.now() + this.dyn.get("countdown") * 1000;
				var timer = new Timer({
					context: this,
					delay: 100,
					fire: function () {
						this.dyn.set("loaderlabel", "" + Math.round(Math.max(0, endTime - Time.now()) / 1000));
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
			this.dyn.trigger("recording");
			this.dyn.set("settingsvisible", false);
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
			this.dyn.set("controlbarlabel", TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display));
			if (limit && this._startTime + limit * 1000 <= current) {
				this._timer.stop();
				this.stop();
			}
		},
		
		stop: function () {
			if (this._stopping)
				return;
			this._stopping = true;
			this.dyn._stopRecording().success(function () {
				this.dyn._showBackgroundSnapshot();
				this.dyn._unbindMedia();
				this.dyn.trigger("recording_stopped");
				if (this.dyn.get("picksnapshots"))
					this.next("CovershotSelection");
				else
					this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
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
			this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
			var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
			imagegallery.loadSnapshots();
			imagegallery.updateContainerSize();
			this.listenOn(this.dyn, "invoke-skip", function () {
				this.next("Uploading");
			}, this);
			this.listenOn(this.dyn, "select-image", function (image) {
				this.dyn._uploadCovershot(image);
				this.next("Uploading");
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("uploading");
			this.dyn.set("topmessage", "");
			this.dyn.set("message", this.dyn.string("uploading"));
			var uploader = this.dyn._dataUploader;
			this.listenOn(uploader, "success", function () {
				this.next("Verifying");
			});
			this.listenOn(uploader, "error", function () {
				this.next("FatalError", { message: this.dyn.string("uploading-failed"), retry: "Uploading" });
			});
			this.listenOn(uploader, "progress", function (uploaded, total) {
				if (total !== 0) {
					this.dyn.trigger("upload_progress", uploaded / total);
					this.dyn.set("message", this.dyn.string("uploading") + ": " + Math.round(uploaded / total * 100) + "%");
				}
			});
			uploader.reset();
			uploader.upload();
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
			this.dyn._verifyRecording().success(function () {
				this.dyn._hideBackgroundSnapshot();
				this.dyn._detachRecorder();
				if (this.dyn.get("recordings"))
					this.dyn.set("recordings", this.dyn.get("recordings") - 1);
				this.next("Player");
			}, this).error(function () {
				this.next("FatalError", { message: this.dyn.string("verifying-failed"), retry: "Verifying" });
			}, this);
		}
	});
});
