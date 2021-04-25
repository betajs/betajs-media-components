Scoped.define("module:VideoRecorder.Dynamics.Imagegallery", [
    "dynamics:Dynamic",
    "media:Recorder.Support",
    "base:Collections.Collection",
    "base:Properties.Properties",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Info",
    "module:Assets"
], [
    "dynamics:Partials.StylesPartial"
], function(Class, RecorderSupport, Collection, Properties, Timer, Dom, Info, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_recorder_imagegallery.html') %>",

                attrs: {
                    "css": "ba-videorecorder",
                    "csscommon": "ba-commoncss",
                    "cssrecorder": "ba-recorder",
                    "imagecount": 3,
                    "imagenativewidth": 0,
                    "imagenativeheight": 0,
                    "containerwidth": 0,
                    "containerheight": 0,
                    "containeroffset": 0,
                    "images": {},
                    "deltafrac": 1 / 8,
                    "showslidercontainer": true,
                    "covershot_accept_string": "image/*,image/png,image/jpg,image/jpeg"
                },

                computed: {
                    "showslidercontainer": function() {
                        return this.parent().snapshots.length > 0;
                    },
                    "imagewidth:imagecount,containerwidth,deltafrac": function() {
                        if (this.get("imagecount") <= 0)
                            return 0.0;
                        return this.get("containerwidth") * (1 - this.get("deltafrac")) / this.get("imagecount");
                    },
                    "imagedelta:imagecount,containerwidth,deltafrac": function() {
                        if (this.get("imagecount") <= 1)
                            return 0.0;
                        return this.get("containerwidth") * (this.get("deltafrac")) / (this.get("imagecount") - 1);
                    },
                    "imageheight:imagewidth,imagenativewidth,imagenativeheight": function() {
                        return this.get("imagenativeheight") * this.get("imagewidth") / this.get("imagenativewidth");
                    }
                },

                create: function() {
                    this.set("ie10below", Info.isInternetExplorer() && Info.internetExplorerVersion() <= 10);
                    var images = this.auto_destroy(new Collection());
                    this.set("images", images);
                    this.snapshotindex = 0;
                    this._updateImageCount();
                    this.on("change:imagecount", this._updateImageCount, this);
                    this.on("change:imagewidth change:imageheight change:imagedelta", this._recomputeImageBoxes, this);
                    this.auto_destroy(new Timer({
                        context: this,
                        delay: 1000,
                        fire: function() {
                            this.updateContainerSize();
                        }
                    }));
                },

                destroy: function() {
                    if (this.get("images").length > 0) {
                        this.get("images").iterate(function(image) {
                            if (image.snapshotDisplay && this.parent().recorder)
                                this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
                        }, this);
                    }
                    inherited.destroy.call(this);
                },

                _updateImageCount: function() {
                    var images = this.get("images");
                    var n = this.get("imagecount");
                    while (images.count() < n) {
                        var image = new Properties({
                            index: images.count()
                        });
                        this._recomputeImageBox(image);
                        images.add(image);
                    }
                    while (images.count() > n)
                        images.remove(images.getByIndex(images.count() - 1));
                },

                _recomputeImageBoxes: function() {
                    this.get("images").iterate(function(image) {
                        this._recomputeImageBox(image);
                    }, this);
                },

                /**
                 * @param {Object} image
                 * @private
                 */
                _recomputeImageBox: function(image) {
                    if (!this.parent().recorder && this.parent().snapshots.length < 1)
                        return;
                    // Will fix portrait covershot bug, will not show stretched box
                    var _maxHeight,
                        _reduceWidth = false,
                        _reduceInPercentage = 0.75,
                        _ratio = this.parent().get('videometadata').ratio;

                    if (!_ratio && typeof this.parent().recorder._recorder !== "undefined") {
                        if (typeof this.parent().recorder._recorder._videoTrackSettings !== "undefined") {
                            var _videoSettings = this.parent().recorder._recorder._videoTrackSettings;
                            if (typeof _videoSettings.aspectRatio !== "undefined") {
                                _ratio = _videoSettings.aspectRatio;
                            } else {
                                if (typeof _videoSettings.width !== "undefined" && typeof _videoSettings.height !== "undefined")
                                    _ratio = Math.round(_videoSettings.width / _videoSettings.height * 100) / 100;
                            }
                        }
                    }

                    if (_ratio) {
                        _maxHeight = Math.floor(this.get("imagewidth") / _ratio);
                        if (this.get("containerheight") < _maxHeight && _maxHeight > 0.00) {
                            _reduceWidth = true;
                            _maxHeight = Math.floor(this.get("containerheight") * _reduceInPercentage);
                        }
                    }
                    var i = image.get("index");
                    var ih = _maxHeight || this.get("imageheight");
                    var iw = _reduceWidth ? this.get("imagewidth") * _reduceInPercentage : this.get("imagewidth");
                    var id = this.get("imagedelta");
                    var h = this.get("containerheight");
                    var w = this.get("containerwidth");
                    if (ih > 1.00) {
                        // If images count is 1
                        if (this.get("images").count() === 1) {
                            if (_ratio > 1.00) {
                                iw *= 0.45;
                                ih *= 0.45;
                            } else
                                iw *= 0.45;
                        }
                        if (this.get("images").count() === 2 && _ratio < 1.00)
                            iw *= 0.70;
                        image.set("left", this.get("images").count() === 1 ? 1 + Math.round((w - iw) / 2) : 1 + Math.round(i * (iw + id)));
                        image.set("top", 1 + Math.round((h - ih) / 2));
                        image.set("width", 1 + Math.round(iw));
                        image.set("height", 1 + Math.round(ih));
                        if (image.snapshot && image.snapshotDisplay) {
                            if (this.parent().recorder) {
                                this.parent().recorder.updateSnapshotDisplay(
                                    image.snapshot,
                                    image.snapshotDisplay,
                                    image.get("left") + this.get("containeroffset"),
                                    image.get("top"),
                                    image.get("width"),
                                    image.get("height")
                                );
                            } else {
                                RecorderSupport.updateSnapshotDisplay(
                                    image.snapshot,
                                    image.snapshotDisplay,
                                    image.get("left") + this.get("containeroffset"),
                                    image.get("top"),
                                    image.get("width"),
                                    image.get("height")
                                );
                            }
                        }
                    }
                },

                /**
                 * NOTE: Runs's each second, offset is {top:0 , left is padding from left},
                 * dimension is correctly calculate box
                 */
                updateContainerSize: function() {
                    var container = this.activeElement().querySelector("[data-gallery-container]");
                    var offset = Dom.elementOffset(container);
                    var videoOffset = offset;
                    if (this.parent().recorder) {
                        videoOffset = Dom.elementOffset(this.parent().recorder._element);
                    } else {
                        var _video = this.parent().activeElement().querySelector("video");
                        if (_video)
                            videoOffset = Dom.elementOffset(_video);
                    }
                    var left = offset.left - videoOffset.left;
                    var dimensions = Dom.elementDimensions(container);
                    this.set("containeroffset", left);
                    this.set("containerheight", dimensions.height);
                    this.set("containerwidth", dimensions.width);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.apply(this, arguments);
                    this.updateContainerSize();
                },

                loadImageSnapshot: function(image, snapshotindex) {
                    if (image.snapshotDisplay) {
                        if (this.parent().recorder)
                            this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
                        else
                            RecorderSupport.removeSnapshotDisplay(image.snapshotDisplay);
                        image.snapshotDisplay = null;
                    }
                    var snapshots = this.parent().snapshots;
                    image.snapshot = snapshots[((snapshotindex % snapshots.length) + snapshots.length) % snapshots.length];
                    image.snapshotDisplay = this.parent().recorder ?
                        this.parent().recorder.createSnapshotDisplay(
                            this.activeElement(),
                            image.snapshot,
                            image.get("left") + this.get("containeroffset"),
                            image.get("top"),
                            image.get("width"),
                            image.get("height")
                        ) :
                        RecorderSupport.createSnapshotDisplay(
                            this.activeElement(),
                            image.snapshot,
                            image.get("left") + this.get("containeroffset"),
                            image.get("top"),
                            image.get("width"),
                            image.get("height")
                        );
                },

                loadSnapshots: function() {
                    this.get("images").iterate(function(image) {
                        this.loadImageSnapshot(image, this.snapshotindex + image.get("index"));
                    }, this);
                },

                nextSnapshots: function() {
                    this.snapshotindex += this.get("imagecount");
                    this.loadSnapshots();
                },

                prevSnapshots: function() {
                    this.snapshotindex -= this.get("imagecount");
                    this.loadSnapshots();
                },

                functions: {
                    left: function() {
                        this.prevSnapshots();
                    },
                    right: function() {
                        this.nextSnapshots();
                    },
                    select: function(image) {
                        this.trigger("image-selected", image.snapshot);
                    },
                    uploadCovershot: function(domEvent) {
                        this.trigger("upload-covershot", domEvent[0].target);
                    }
                }

            };
        })
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/video_recorder_imagegallery.html') %>*/
        })
        .register("ba-videorecorder-imagegallery")
        .attachStringTable(Assets.strings)
        .addStrings({
            "upload-covershot": "Upload Cover"
        });
});