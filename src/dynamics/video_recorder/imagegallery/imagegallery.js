Scoped.define("module:VideoRecorder.Dynamics.Imagegallery", [
    "dynamics:Dynamic",
    "module:Templates",
    "base:Collections.Collection",
    "base:Properties.Properties",
    "base:Timers.Timer",
    "browser:Dom"
], [
    "dynamics:Partials.StylesPartial"
], function (Class, Templates, Collection, Properties, Timer, Dom, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_imagegallery,
			
			attrs: {
				"css": "ba-videorecorder",
				"imagecount": 3,
				"imagenativewidth": 0,
				"imagenativeheight": 0,
				"containerwidth": 0,
				"containerheight": 0,
				"containeroffset": 0,
				"deltafrac": 1/8
			},
			
			computed: {
				"imagewidth:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 0)
						return 0.0;
					return this.get("containerwidth") * (1 - this.get("deltafrac")) / this.get("imagecount");
				},
				"imagedelta:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 1)
						return 0.0;
					return this.get("containerwidth") * (this.get("deltafrac")) / (this.get("imagecount") - 1);
				},
				"imageheight:imagewidth,imagenativewidth,imagenativeheight": function () {
					return this.get("imagenativeheight") * this.get("imagewidth") / this.get("imagenativewidth");
				}
			},
			
			create: function () {
				var images = this.auto_destroy(new Collection());
				this.set("images", images);
				this.snapshotindex = 0;
				this._updateImageCount();
				this.on("change:imagecount", this._updateImageCount, this);
				this.on("change:imagewidth change:imageheight change:imagedelta", this._recomputeImageBoxes, this);
				this.auto_destroy(new Timer({
					context: this,
					delay: 1000,
					fire: function () {
						this.updateContainerSize();
					}
				}));
			},
			
			destroy: function () {
				this.get("images").iterate(function (image) {
					if (image.snapshotDisplay && this.parent().recorder)
						this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
				}, this);
				inherited.destroy.call(this);
			},
			
			_updateImageCount: function () {
				var images = this.get("images");
				var n = this.get("imagecount");
				while (images.count() < n) {
					var image = new Properties({index: images.count()});
					this._recomputeImageBox(image);
					images.add(image);
				}
				while (images.count() > n)
					images.remove(images.getByIndex(images.count() - 1));
			},
			
			_recomputeImageBoxes: function () {
				this.get("images").iterate(function (image) {
					this._recomputeImageBox(image);
				}, this);
			},
			
			_recomputeImageBox: function (image) {
				if (!this.parent().recorder)
					return;
				var i = image.get("index");
				var iw = this.get("imagewidth");
				var ih = this.get("imageheight");
				var id = this.get("imagedelta");
				var h = this.get("containerheight");
				image.set("left", 1+Math.round(i * (iw + id)));
				image.set("top", 1+Math.round((h - ih) / 2));
				image.set("width", 1+Math.round(iw));
				image.set("height", 1+Math.round(ih));
				if (image.snapshot && image.snapshotDisplay) {
					this.parent().recorder.updateSnapshotDisplay(
						image.snapshot,
						image.snapshotDisplay,
						image.get("left") + this.get("containeroffset"),
						image.get("top"),
						image.get("width"),
						image.get("height")
					);
				}
			},
			
			updateContainerSize: function () {
				var container = this.activeElement().querySelector("[data-gallery-container]");
				var offset = Dom.elementOffset(container);
				var dimensions = Dom.elementDimensions(container);
				this.set("containeroffset", offset.left);
				this.set("containerheight", dimensions.height);
				this.set("containerwidth", dimensions.width);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.apply(this, arguments);
				this.updateContainerSize();
			},
			
			loadImageSnapshot: function (image, snapshotindex) {
				if (image.snapshotDisplay) {
					this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
					image.snapshotDisplay = null;
				}
				var snapshots = this.parent().snapshots;
				image.snapshot = snapshots[((snapshotindex % snapshots.length) + snapshots.length) % snapshots.length]; 
				image.snapshotDisplay = this.parent().recorder.createSnapshotDisplay(
					this.activeElement(),
					image.snapshot,
					image.get("left") + this.get("containeroffset"),
					image.get("top"),
					image.get("width"),
					image.get("height")
				);
			},
			
			loadSnapshots: function () {
				this.get("images").iterate(function (image) {
					this.loadImageSnapshot(image, this.snapshotindex + image.get("index"));
				}, this);
			},
			
			nextSnapshots: function () {
				this.snapshotindex += this.get("imagecount");
				this.loadSnapshots();
			},
			
			prevSnapshots: function () {
				this.snapshotindex -= this.get("imagecount");
				this.loadSnapshots();
			},
			
			functions: {
				left: function () {
					this.prevSnapshots();
				},
				right: function () {
					this.nextSnapshots();
				},
				select: function (image) {
					this.trigger("image-selected", image.snapshot);
				}
			}
			
		};
	}).register("ba-videorecorder-imagegallery");
});