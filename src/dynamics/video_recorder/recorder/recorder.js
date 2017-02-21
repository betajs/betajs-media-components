
Scoped.define("module:VideoRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:Recorder.VideoRecorderWrapper",
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
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, Dom, MultiUploader, FileUploader, VideoRecorderWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.recorder,
			
			attrs: {
				/* CSS */
				"css": "ba-videorecorder",
				"iecss": "ba-videorecorder",
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
				"dynimagegallery": "videorecorder-imagegallery",
				"dynloader": "videorecorder-loader",
				"dyncontrolbar": "videorecorder-controlbar",
				"dynmessage": "videorecorder-message",
				"dyntopmessage": "videorecorder-topmessage",
				"dynchooser": "videorecorder-chooser",
				"dynvideoplayer": "videoplayer",

				/* Templates */
				"tmplimagegallery": "",
				"tmplloader": "",
				"tmplcontrolbar": "",
				"tmplmessage": "",
				"tmpltopmessage": "",
				"tmplchooser": "",

				/* Attributes */
				"autorecord": false,
				"autoplay": false,
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"primaryrecord": true,
				"nofullscreen": false,
				"recordingwidth": 640,
				"recordingheight": 480,
				"countdown": 3,
				"snapshotmax": 15,
				"framerate": null,
				"audiobitrate": null,
				"videobitrate": null,
				"snapshottype": "jpg",
				"picksnapshots": true,
				"playbacksource": "",
				"playbackposter": "",
				"recordermode": true,
				"skipinitial": false,
				"timelimit": null,
				"timeminlimit": null,
				"rtmpstreamtype": "mp4",
				"rtmpmicrophonecodec": "speex",
				"webrtcstreaming": false,
				"microphone-volume": 1.0,
				"flip-camera": false,
				"early-rerecord": false,
				"custom-covershots": false,
				"manualsubmit": false,
				"allowedextensions": null,
				"filesizelimit": null,

				/* Configuration */
				"forceflash": false,
				"simulate": false,
				"noflash": false,
				"noaudio": false,
				"flashincognitosupport": false,
				"localplayback": false,
				"uploadoptions": {},
				"playerattrs": {},

				/* Options */
				"rerecordable": true,
				"recordings": null,
				"ready": true,
				"stretch": false
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
				"autoplay": "boolean",
				"allowrecord": "boolean",
				"allowupload": "boolean",
				"allowcustomupload": "boolean",
				"primaryrecord": "boolean",
				"flashincognitosupport": "boolean",
				"recordermode": "boolean",
				"nofullscreen": "boolean",
				"picksnapshots": "boolean",
				"localplayback": "boolean",
				"noaudio": "boolean",
				"skipinitial": "boolean",
				"webrtcstreaming": "boolean",
				"microphone-volume": "float",
				"audiobitrate": "int",
				"videobitrate": "int",
				"flip-camera": "boolean",
				"early-rerecord": "boolean",
				"custom-covershots": "boolean",
				"manualsubmit": "boolean",
				"simulate": "boolean",
				"allowedextensions": "array"
			},
			
			extendables: ["states"],
			
			remove_on_destroy: true,
			
			create: function () {
				
				if (this.get("theme") in Assets.recorderthemes) {
					Objs.iter(Assets.recorderthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}
				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("hideoverlay", false);
				
				if (Info.isMobile())
					this.set("skipinitial", false);

				this.__attachRequested = false;
				this.__activated = false;
				this._bound = false;
				this.__recording = false;
				this.__error = null;
				this.__currentStretch = null;
				
				this.on("change:stretch", function () {
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
				
			},
			
			state: function () {
				return this.host.state();
			},
			
			recorderAttached: function () {
				return !!this.recorder;
			},
			
			videoError: function () {
				return this.__error;
			},
			
			_error: function (error_type, error_code) {
				this.__error = {
					error_type: error_type,
					error_code: error_code
				};
				this.trigger("error:" + error_type, error_code);
				this.trigger("error", error_type, error_code);
			},
			
			_clearError: function () {
				this.__error = null;
			},
			
			_detachRecorder: function () {
				if (this.recorder)
					this.recorder.weakDestroy();
				this.recorder = null;
				this.set("hasrecorder", false);
			},
			
			_attachRecorder: function () {
				if (this.recorderAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.set("hasrecorder", true);
				this.snapshots = [];
				this.__attachRequested = false;
				var video = this.activeElement().querySelector("[data-video='video']");
				this._clearError();
				this.recorder = VideoRecorderWrapper.create({
					element: video,
					simulate: this.get("simulate"),
			    	forceflash: this.get("forceflash"),
			    	noflash: this.get("noflash"),
			    	recordVideo: true,
			    	recordAudio: !this.get("noaudio"),
			    	recordingWidth: this.get("recordingwidth"),
			    	recordingHeight: this.get("recordingheight"),
			    	audioBitrate: this.get("audiobitrate"),
			    	videoBitrate: this.get("videobitrate"),
			    	flashFullSecurityDialog: !this.get("flashincognitosupport"),
			    	rtmpStreamType: this.get("rtmpstreamtype"),
			    	rtmpMicrophoneCodec: this.get("rtmpmicrophonecodec"),
			    	webrtcStreaming: !!this.get("webrtcstreaming"),
			    	framerate: this.get("framerate"),
			    	flip: this.get("flip-camera")
			    });
				if (!this.recorder)
					this._error("attach");
			},
			
			_bindMedia: function () {
				if (this._bound || !this.recorderAttached() || !this.recorder)
					return;
				this.recorder.ready.success(function () {
					this.recorder.on("require_display", function () {
						this.set("hideoverlay", true);
					}, this);
					this.recorder.bindMedia().error(function (e) {
						this.trigger("access_forbidden", e);
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this._error("bind", e);
					}, this).success(function () {
						this.trigger("access_granted");
						this.recorder.setVolumeGain(this.get("microphone-volume"));
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this.recorder.enumerateDevices().success(function (devices) {
							var selected = this.recorder.currentDevices();
							this.set("selectedcamera", selected.video);
							this.set("selectedmicrophone", selected.audio);
							this.set("cameras", new Collection(Objs.values(devices.video)));
							this.set("microphones", new Collection(Objs.values(devices.audio)));
						}, this);
						if (!this.get("noaudio"))
							this.recorder.testSoundLevel(true);
						this.set("devicetesting", true);
						this._updateStretch();
						while (this.snapshots.length > 0) {
							var snapshot = this.snapshots.unshift();
							this.recorder.removeSnapshot(snapshot);
						}
						this._bound = true;
						this.trigger("bound");
					}, this);
				}, this);
			},
			
			isFlash: function () {
				return this.recorder && this.recorder.isFlash();
			},
			
			_initializeUploader: function () {
				if (this._dataUploader)
					this._dataUploader.weakDestroy();
				this._dataUploader = new MultiUploader();
			},
			
			_unbindMedia: function () {
				if (!this._bound)
					return;
				this.recorder.unbindMedia();
				this._bound = false;
			},
			
			_uploadCovershot: function (image) {
				if (this.get("simulate"))
					return;
				this.__lastCovershotUpload = image;
				var uploader = this.recorder.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image);
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_uploadCovershotFile: function (file) {
				if (this.get("simulate"))
					return;
				this.__lastCovershotUpload = file;
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").image));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},

			_uploadVideoFile: function (file) {
				if (this.get("simulate"))
					return;
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").video));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_prepareRecording: function () {
				return Promise.create(true);
			},
			
			_startRecording: function () {
				if (this.__recording)
					return Promise.error(true);
				if (!this.get("noaudio"))
					this.recorder.testSoundLevel(false);
				this.set("devicetesting", false);
				return this.recorder.startRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio,
					webrtcStreaming: this.get("uploadoptions").webrtcStreaming
				}).success(function () {
					this.__recording = true;
					this.__recording_start_time = Time.now();
				}, this);
			},
			
			_stopRecording: function () {
				if (!this.__recording)
					return Promise.error(true);
				return this.recorder.stopRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio,
					webrtcStreaming: this.get("uploadoptions").webrtcStreaming
				}).success(function (uploader) {
					this.__recording = false;
					uploader.upload();
					this._dataUploader.addUploader(uploader);
				}, this);
			},
			
			_verifyRecording: function () {
				return Promise.create(true);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachRecorder();
			},
			
			_showBackgroundSnapshot: function () {
				this._hideBackgroundSnapshot();
				this.__backgroundSnapshot = this.recorder.createSnapshot(this.get("snapshottype"));
				var el = this.activeElement().querySelector("[data-video]");
				var dimensions = Dom.elementDimensions(el);
				this.__backgroundSnapshotDisplay = this.recorder.createSnapshotDisplay(el, this.__backgroundSnapshot, 0, 0, dimensions.width, dimensions.height);
			},
			
			_hideBackgroundSnapshot: function () {
				if (this.__backgroundSnapshotDisplay)
					this.recorder.removeSnapshotDisplay(this.__backgroundSnapshotDisplay);
				delete this.__backgroundSnapshotDisplay;
				if (this.__backgroundSnapshot)
					this.recorder.removeSnapshot(this.__backgroundSnapshot);
				delete this.__backgroundSnapshot;
			},
			
			object_functions: ["record", "rerecord", "stop", "play", "pause", "reset"],

			functions: {
				
				record: function () {
					this.host.state().record();
				},
				
				record_video: function () {
					this.host.state().selectRecord();
				},
				
				upload_video: function (file) {
					this.host.state().selectUpload(file);
				},
				
				upload_covershot: function (file) {
					this.host.state().uploadCovershot(file);
				},

				select_camera: function (camera_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({video: camera_id});
						this.set("selectedcamera", camera_id);
					}
				},
				
				select_microphone: function (microphone_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({audio: microphone_id});
						this.recorder.testSoundLevel(true);
						this.set("selectedmicrophone", microphone_id);
					}
					this.set("microphonehealthy", false);
				},
				
				invoke_skip: function () {
					this.trigger("invoke-skip");
				},
				
				select_image: function (image) {
					this.trigger("select-image", image);
				},
				
				rerecord: function () {
					if (confirm(this.string("rerecord-confirm")))
						this.host.state().rerecord();
				},

				stop: function () {
					this.host.state().stop();
				},
				
				play: function () {
					this.host.state().play();
				},

				pause: function () {
					this.host.state().pause();
				},
				
				message_click: function () {
					this.trigger("message-click");
				},
				
				playing: function () {
					this.trigger("playing");
				},
				
				paused: function () {
					this.trigger("paused");
				},
				
				ended: function () {
					this.trigger("ended");
				},
				
				reset: function () {
					this._stopRecording().callback(function () {
						this._detachRecorder();
						this.host.state().next("Initial");
					}, this);
				},
				
				manual_submit: function () {
					this.set("rerecordable", false);
					this.set("manualsubmit", false);
					this.trigger("manually_submitted");
				}
						
			},
			
			destroy: function () {				
				this._timer.destroy();
				this.host.destroy();
				this._detachRecorder();
				inherited.destroy.call(this);
			},
			
			deltaCoefficient: function () {
				return this.recorderAttached() ? this.recorder.deltaCoefficient() : null;
			},

			blankLevel: function () {
				return this.recorderAttached() ? this.recorder.blankLevel() : null;
			},

			lightLevel: function () {
				return this.recorderAttached() ? this.recorder.lightLevel() : null;
			},
			
			soundLevel: function () {
				return this.recorderAttached() ? this.recorder.soundLevel() : null;
			},
			
			_timerFire: function () {
				if (this.destroyed())
					return;
				try {
					if (this.recorderAttached() && this.get("devicetesting")) {
						var lightLevel = this.lightLevel();
						this.set("camerahealthy", lightLevel >= 100 && lightLevel <= 200);
						if (!this.get("noaudio") && !this.get("microphonehealthy") && this.soundLevel() >= 1.01) {
							this.set("microphonehealthy", true);
							this.recorder.testSoundLevel(false);
						}
					}
				} catch (e) {}
				
				if (this.__recording && this.__recording_start_time + 500 < Time.now()) {
					var p = this.snapshots.length < this.get("snapshotmax") ? 0.25 : 0.05;
					if (Math.random() <= p) {
						var snap = this.recorder.createSnapshot(this.get("snapshottype"));
						if (snap) {
							if (this.snapshots.length < this.get("snapshotmax")) {
								this.snapshots.push(snap);
							} else {
								var i = Math.floor(Math.random() * this.get("snapshotmax"));
								this.recorder.removeSnapshot(this.snapshots[i]);
								this.snapshots[i] = snap;
							}
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
				
				this._updateStretch();
				this._updateCSSSize();
			},
			
			_updateCSSSize: function () {
				var width = Dom.elementDimensions(this.activeElement()).width;
				this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
			},
			
			videoHeight: function () {
				return this.recorderAttached() ? this.recorder.cameraHeight() : NaN;
			},
			
			videoWidth: function () {
				return this.recorderAttached() ? this.recorder.cameraWidth() : NaN;
			},
			
			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},
			
			parentWidth: function () {
				return this.get("width") || Dom.elementDimensions(this.activeElement()).width;
			},
			
			parentHeight: function () {
				return this.get("height") || Dom.elementDimensions(this.activeElement()).height;
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},
			
			averageFrameRate: function () {
				return this.recorderAttached() ? this.recorder.averageFrameRate() : null;
			},
			
			_updateStretch: function () {
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
		
		recorderStates: function () {
			return [RecorderStates];
		}
		
	}).register("ba-videorecorder")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"recorder-error": "An error occurred, please try again later. Click to retry.",
    	"attach-error": "We could not access the camera interface. Depending on the device and browser, you might need to install Flash or access the page via SSL.",
    	"access-forbidden": "Access to the camera was forbidden. Click to retry.",
    	"pick-covershot": "Pick a covershot.",
    	"uploading": "Uploading",
    	"uploading-failed": "Uploading failed - click here to retry.",
    	"verifying": "Verifying",
    	"verifying-failed": "Verifying failed - click here to retry.",
    	"rerecord-confirm": "Do you really want to redo your video?",
    	"video_file_too_large": "Your video file is too large (%s) - click here to try again with a smaller video file.",
    	"unsupported_video_type": "Please upload: %s - click here to retry."    		
    });
});