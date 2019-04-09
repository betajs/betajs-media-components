Scoped.define("module:PopupHelper", [
    "base:Class",
    "base:Events.EventsMixin",
    "browser:Dom",
    "browser:Events"
], function(Class, EventsMixin, Dom, DomEvents, scoped) {

    var PopupHelper = Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(options) {
                inherited.constructor.call(this);

                this.popupContainer = document.createElement("div");
                this.backgroundContainer = document.createElement("div");
                this.backgroundContainer.className = "ba-popup-helper-overlay-background";
                this.popupContainer.appendChild(this.backgroundContainer);
                this.overlayContainer = document.createElement("div");
                this.overlayContainer.className = "ba-popup-helper-overlay";
                this.popupContainer.appendChild(this.overlayContainer);
                this.containerInner = document.createElement("div");
                this.containerInner.className = "ba-popup-helper-overlay-inner";
                this.overlayContainer.appendChild(this.containerInner);

                this.domEvents = this.auto_destroy(new DomEvents());
                this.domEvents.on(this.backgroundContainer, "click touchstart", function() {
                    this.hide();
                }, this);
                this.domEvents.on(this.containerInner, "click touchstart", function(event) {
                    event.stopPropagation();
                });
            },

            show: function() {
                return this.recursionProtection("show", function() {
                    Dom.elementAddClass(document.body, "ba-popup-helper-overlay-body");
                    document.body.appendChild(this.popupContainer);
                    this.trigger("show");
                });
            },

            hide: function() {
                return this.recursionProtection("hide", function() {
                    var popupContainer = this.popupContainer;
                    this.trigger("hide");
                    document.body.removeChild(popupContainer);
                    Dom.elementRemoveClass(document.body, "ba-popup-helper-overlay-body");
                });
            }

        };
    }], {

        mixin: function(inherited) {
            return {

                constructor: function(options) {
                    options = options || {};
                    this.__popup = new PopupHelper(options.popup);
                    this.__popup.on("hide", this.destroy, this);
                    options.element = this.__popup.containerInner;
                    inherited.constructor.call(this, options);
                },

                activate: function() {
                    this.__popup.show();
                    inherited.activate.call(this);
                },

                destroy: function() {
                    this.__popup.hide();
                    this.__popup.destroy();
                    inherited.destroy.call(this);
                }

            };
        }

    });

    return PopupHelper;
});