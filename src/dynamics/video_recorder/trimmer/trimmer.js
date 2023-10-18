Scoped.define("module:VideoRecorder.Dynamics.Trimmer", [
    "dynamics:Dynamic",
    "browser:Events",
    "base:Promise"
], function(Class, DomEvents, Promise, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/trimmer.html') %>",

                attrs: {
                    "csscommon": "ba-commoncss",
                    "csstrimmer": "ba-videorecorder-trimmer"
                },

                computed: {
                    "trimButtonEnabled:startposition,endposition,duration": function(startPosition, endPosition, duration) {
                        return (startPosition !== 0 && startPosition !== null) || (endPosition !== duration && endPosition !== null);
                    }
                },

                events: {
                    "change:progress-bar-width": function() {
                        this.call("updateThumbnails");
                    }
                },

                destroy: function() {
                    if (this._progressBarResizeObserver) this._progressBarResizeObserver.disconnect();
                    inherited.destroy.call(this);
                },

                functions: {
                    skip: function() {
                        this.chainedTrigger("skip");
                    },
                    trim: function() {
                        this.chainedTrigger("video-trimmed", {
                            start: this.get("startposition"),
                            end: this.get("endposition")
                        });
                    },
                    togglePlay: function() {
                        this.trigger(this.get("playing") ? "pause" : "play");
                    },
                    handleSelectionClick: function(events) {
                        var event = events[0];
                        event.preventDefault();
                        if (event.type === "mousedown" && event.button !== 0) return;
                        var clientX = this.call("getClientX", event);
                        var elementRect = event.target.getBoundingClientRect();
                        var borderWidth = event.target.clientLeft;

                        var isClickingOnLeftBorder = clientX >= elementRect.left && clientX <= (elementRect.left + borderWidth);
                        var isClickingOnRightBorder = clientX >= (elementRect.right - borderWidth) && clientX <= (elementRect.right);
                        if (!isClickingOnLeftBorder && !isClickingOnRightBorder) return;

                        event.stopPropagation();
                        if (isClickingOnLeftBorder) this.call("attachUpdatePositionEventListeners", clientX, "startposition");
                        else this.call("attachUpdatePositionEventListeners", clientX, "endposition");
                    },

                    handleProgressBarClick: function(events) {
                        var event = events[0];
                        event.preventDefault();
                        if (event.type === "mousedown" && event.button !== 0) return;
                        var clientX = this.call("getClientX", event);
                        var selectionRect = this._selectionElement.getBoundingClientRect();

                        var isClickingOnLeftOfSelection = clientX <= selectionRect.left;
                        var isClickingOnRightOfSelection = clientX >= selectionRect.right;

                        if (isClickingOnLeftOfSelection) {
                            this.call("attachUpdatePositionEventListeners", clientX, "startposition");
                            return;
                        }

                        if (isClickingOnRightOfSelection) {
                            this.call("attachUpdatePositionEventListeners", clientX, "endposition");
                            return;
                        }

                        if (this.get("playing")) {
                            this.set("wasPlaying", true);
                            this.trigger("pause");
                        }

                        this.call("attachUpdatePositionEventListeners", clientX, "position");
                    },

                    attachUpdatePositionEventListeners: function(clientX, position) {
                        this.call("updatePosition", clientX, position);

                        var events = this._events;
                        events.on(document, "mousemove touchmove", function(e) {
                            e.preventDefault();
                            this.call("updatePosition", this.call("getClientX", e), position);
                        }, this);
                        events.on(document, "mouseup touchend", function(e) {
                            e.preventDefault();
                            if (this.get("wasPlaying")) {
                                this.trigger("play");
                                setTimeout(function() { // we need this delay to avoid switching to play button icon while video doesn't start playing
                                    this.set("wasPlaying", false);
                                }.bind(this), 100);
                            }
                            events.off(document, "mouseup touchend mousemove touchmove");
                        }, this);
                    },

                    updatePosition: function(clientX, position) {
                        var newPosition = this.call("getCurrentPosition", clientX);
                        var minDuration = this.get("minduration") || 1;
                        switch (position) {
                            case "position":
                                this.trigger("seek", newPosition);
                                break;
                            case "startposition":
                                var endPosition = this.get("endposition") || this.get("duration");
                                if (newPosition > endPosition - minDuration)
                                    this.set(position, endPosition - minDuration);
                                else this.set(position, newPosition);
                                break;
                            case "endposition":
                                var startPosition = this.get("startposition") || 0;
                                if (newPosition < startPosition + minDuration)
                                    this.set(position, startPosition + minDuration);
                                else this.set(position, newPosition);
                                break;
                        }
                    },

                    getClientX: function(event) {
                        return event.clientX === 0 ? 0 : event.clientX || event.targetTouches[0].clientX;
                    },

                    getCurrentPosition: function(clientX) {
                        var percentageFromStart;
                        var dimensions = this._progressBarElement.getBoundingClientRect();

                        if (clientX < dimensions.left) percentageFromStart = 0;
                        else if (clientX > (dimensions.left + dimensions.width)) percentageFromStart = 1;
                        else percentageFromStart = (clientX - dimensions.left) / (dimensions.width || 1);

                        return this.get("duration") * percentageFromStart;
                    },

                    updateThumbnails: function() {
                        if (!this._internalVideoElement || this._progressBarElement.clientWidth === 0) return;
                        this.call("drawSnapshotRecursive", 1);
                    },

                    createNewCanvas: function() {
                        var canvas = document.createElement("canvas");
                        canvas.height = this._canvasHeight;
                        canvas.width = this._canvasWidth;
                        this._snapshotsElement.appendChild(canvas);
                        return canvas;
                    },

                    drawSnapshot: function(canvas, position) {
                        var promise = Promise.create();
                        this._internalVideoElement.currentTime = position || 0;
                        this._events.on(this._internalVideoElement, "seeked", function() {
                            canvas.getContext("2d").drawImage(this._internalVideoElement, 0, 0, canvas.width, canvas.height);
                            this._events.off(this._internalVideoElement, "seeked");
                            promise.asyncSuccess();
                        }, this);
                        return promise;
                    },

                    drawSnapshotRecursive: function(i) {
                        if (i * this._canvasWidth > this._progressBarElement.clientWidth) return;
                        if (i + 1 >= this._canvases.length) this._canvases.push(this.call("createNewCanvas"));
                        this.call("drawSnapshot", this._canvases[i], this.get("duration") * ((i * this._canvasWidth) / this._progressBarElement.clientWidth)).success(function() {
                            this.call("drawSnapshotRecursive", ++i);
                        }, this);
                    }
                },

                create: function() {
                    this._events = this.auto_destroy(new DomEvents());
                    this._progressBarElement = this.activeElement().querySelector("[data-selector='progressbar']");
                    this._selectionElement = this.activeElement().querySelector("[data-selector='selection']");
                    this._snapshotsElement = this.activeElement().querySelector("[data-selector='snapshots']");

                    this._progressBarResizeObserver = new ResizeObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.contentRect.width === this.get("progress-bar-width")) return;
                            this.set("progress-bar-width", entry.contentRect.width);
                        }.bind(this));
                    }.bind(this));

                    this._progressBarResizeObserver.observe(this._progressBarElement);

                    this._loadVideo().success(function() {
                        this.call("updateThumbnails");
                    }, this);
                },

                _loadVideo: function() {
                    var promise = Promise.create();
                    var video = document.createElement("video");
                    var source = this.get("source").src || this.get("source");
                    video.src = typeof source === "string" ? source : URL.createObjectURL(source);
                    this._events.on(video, "loadedmetadata", function() {
                        if (!this || this.destroyed()) return;
                        if (!this.get("duration")) this.set("duration", video.duration);
                        this._internalVideoElement = video;
                        this._canvasHeight = 34; // TODO calculate instead of hard coding value
                        this._canvasWidth = this._canvasHeight * video.videoWidth / video.videoHeight;
                        this._canvases = [];
                        this._canvases.push(this.call("createNewCanvas"));
                        this.call("drawSnapshot", this._canvases[0], 0).success(function() {
                            promise.asyncSuccess(video);
                        });
                    }, this);
                    return promise;
                }
            };
        })
        .register("ba-videorecorder-trimmer")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/trimmer.html') %>*/
        });
});