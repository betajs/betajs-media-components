Scoped.define("module:StickyHandler", [
    "base:Class",
    "base:Events.EventsMixin",
    "base:Maths",
    "browser:Events",
    "browser:Info"
], function(Class, EventsMixin, Maths, DomEvents, Info, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {
            /**
             * @param {HTMLElement} element
             * @param {HTMLElement} container
             * @param {Object} [options]
             * @param {boolean} [options.paused] - used to temporarily stop element from sticking to view
             */
            constructor: function(element, container, options) {
                inherited.constructor.call(this);
                this.element = element;
                this.container = container;
                this.paused = options.paused || false;
                this.floatCondition = options.floatCondition;
                this.noFloatIfBelow = options.noFloatIfBelow || false;
                this.noFloatIfAbove = options.noFloatIfAbove || false;
                this.threshold = options.threshold;
                if (!options["static"]) this.events = this.auto_destroy(new DomEvents());
                this.floating = false;
                this.observing = false;
            },

            destroy: function() {
                if (this._elementObserver) this._elementObserver.disconnect();
                if (this._containerObserver) this._containerObserver.disconnect();
                inherited.destroy.call(this);
            },

            init: function() {
                this._initIntersectionObservers();
            },

            pause: function() {
                if (this.floating) this.removeStickyStyles();
                this.paused = true;
            },

            start: function() {
                if (this.floatCondition && !this.floatCondition()) return;
                if (!this.elementIsVisible && !this.floating) this.transitionToFloat();
                this.paused = false;
            },

            stop: function() {
                if (!this.observing) return;
                if (this._elementObserver && this.element)
                    this._elementObserver.unobserve(this.element);
                if (this._containerObserver && this.container)
                    this._containerObserver.unobserve(this.container);
                this.observing = false;
            },

            resume: function() {
                if (this.observing) return;
                if (this._elementObserver && this.element)
                    this._elementObserver.observe(this.element);
                if (this._containerObserver && this.container)
                    this._containerObserver.observe(this.container);
                this.observing = true;
            },

            isDragging: function() {
                return !!this.dragging;
            },

            stopDragging: function() {
                this.dragging = false;
            },

            transitionToFloat: function() {
                this.floating = true;
                this.trigger("transitionToFloat");
                this.addStickyStyles();
                if (this.events) this._initEventListeners();
            },

            elementWasDragged: function() {
                return !!this.__elementWasDragged;
            },

            addStickyStyles: function() {
                if (this._top) this.element.style.top = this._top;
                if (this._left) this.element.style.left = this._left;
            },

            removeStickyStyles: function() {
                this.element.style.removeProperty("top");
                this.element.style.removeProperty("left");
            },

            _initIntersectionObservers: function() {
                var elementFirstObservation = true;
                this._elementObserver = new IntersectionObserver(elementCallback.bind(this), {
                    threshold: this.threshold
                });
                this._containerObserver = new IntersectionObserver(containerCallback.bind(this), {
                    threshold: this.threshold
                });

                function elementCallback(entries, observer) {
                    entries.forEach(function(entry) {
                        this.elementIsVisible = entry.isIntersecting;
                        if (elementFirstObservation) {
                            elementFirstObservation = false;
                            return;
                        }
                        if (entry.isIntersecting) return;
                        if (this.paused || (this.floatCondition && !this.floatCondition())) {
                            this.trigger("transitionOutOfView");
                            return;
                        }
                        if (this.noFloatIfAbove || this.noFloatIfBelow) {
                            var r = this.element.getBoundingClientRect();
                            if (this.noFloatIfAbove && r.top >= 0) return;
                            if (this.noFloatIfBelow && r.top <= 0) return;
                        }
                        this.transitionToFloat();
                    }.bind(this));
                }

                function containerCallback(entries, observer) {
                    entries.forEach(function(entry) {
                        if (!entry.isIntersecting) return;
                        this.floating = false;
                        this.trigger("transitionToView");
                        this.removeStickyStyles();
                        if (this.events) this.events.off(this.element, "mousedown touchstart");
                        this.dragging = false;
                    }.bind(this));
                }

                this._elementObserver.observe(this.element);
                this._containerObserver.observe(this.container);
                this.observing = true;
            },

            _initEventListeners: function() {
                var lastX, lastY, diffX, diffY;
                this.events.on(this.element, "mousedown", mouseDownHandler, this);
                this.events.on(this.element, "touchstart", touchStartHandler, this);

                function mouseDownHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    if (e.button !== 0) return;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    this.events.on(document, "mousemove", mouseMoveHandler, this);
                    this.events.on(document, "mouseup", mouseUpHandler, this);
                }

                function touchStartHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;
                    this.events.on(document, "touchmove", touchMoveHandler, this);
                    this.events.on(document, "touchend", touchEndHandler, this);
                }

                function mouseMoveHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    diffX = lastX - e.clientX;
                    diffY = lastY - e.clientY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    this.__elementWasDragged = true;
                    this.dragging = true;
                    this.element.style.top = Maths.clamp(this.element.offsetTop - diffY, 0, window.innerHeight - this.element.offsetHeight) + "px";
                    this.element.style.left = Maths.clamp(this.element.offsetLeft - diffX, 0, window.innerWidth - this.element.offsetWidth) + "px";
                    this._top = this.element.style.getPropertyValue("top");
                    this._left = this.element.style.getPropertyValue("left");
                }

                function touchMoveHandler(e) {
                    e = e || window.event;
                    e.preventDefault();
                    diffX = lastX - e.touches[0].clientX;
                    diffY = lastY - e.touches[0].clientY;
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;
                    this.__elementWasDragged = true;
                    this.dragging = true;
                    this.element.style.top = Maths.clamp(this.element.offsetTop - diffY, 0, window.innerHeight - this.element.offsetHeight) + "px";
                    this.element.style.left = Maths.clamp(this.element.offsetLeft - diffX, 0, window.innerWidth - this.element.offsetWidth) + "px";
                    this._top = this.element.style.getPropertyValue("top");
                    this._left = this.element.style.getPropertyValue("left");
                }

                function mouseUpHandler() {
                    this.events.off(document, "mousemove mouseup");
                }

                function touchEndHandler() {
                    this.events.off(document, "touchmove touchend");
                }
            }
        };
    }]);
});