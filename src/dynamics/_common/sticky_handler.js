Scoped.define("module:FloatHandler", [
    "base:Class",
    "base:Events.EventsMixin",
    "base:Maths",
    "browser:Events",
    "base:Functions"
], function(Class, EventsMixin, Maths, DomEvents, Functions, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {
            /**
             * @param {HTMLElement} element is playerContainer
             * @param {HTMLElement} container is activeElement, highest element
             * @param {Object} [options]
             * @param {boolean} [options.paused] - used to temporarily stop element from sticking to view
             */
            constructor: function(element, container, options) {
                inherited.constructor.call(this);
                this.element = element;
                this.container = container;
                this.paused = options.paused || false;
                this.floatCondition = options?.floatCondition;
                this.noFloatIfBelow = options?.noFloatIfBelow || false;
                this.noFloatIfAbove = options?.noFloatIfAbove || false;
                this.threshold = options?.threshold;
                if (!options["static"]) this.events = this.auto_destroy(new DomEvents());
                this.floating = false;
                this.observing = false;
            },

            destroy: function() {
                if (this._containerObserver) this._containerObserver.disconnect();
                inherited.destroy.call(this);
            },

            init: function() {
                this._initIntersectionObservers();
            },

            pause: function() {
                if (this.floating) this.removeFloatingStyles();
                this.paused = true;
            },

            start: function() {
                this.paused = false;
                this.elementRect = this.element.getBoundingClientRect();
            },

            stop: function() {
                if (!this.observing) return;
                if (this._containerObserver && this.container)
                    this._containerObserver.unobserve(this.container);
                this.observing = false;
            },

            resume: function() {
                if (this.observing) return;
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
                this.addFloatingStyles();
                if (this.events) this._initEventListeners();
            },

            elementWasDragged: function() {
                return !!this.__elementWasDragged;
            },

            addFloatingStyles: function() {
                if (this._top) this.element.style.top = this._top;
                if (this._left) this.element.style.left = this._left;
            },

            removeFloatingStyles: function() {
                this.element.style.removeProperty("top");
                this.element.style.removeProperty("left");
            },

            _initIntersectionObservers: function() {
                const containerCallback = (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            if (this.paused || (this.floatCondition && !this.floatCondition(this.elementRect))) {
                                this.trigger("transitionOutOfView");
                                return;
                            }
                            this.transitionToFloat();
                        } else {
                            if (!this.floating) return;
                            this.floating = false;
                            this.trigger("transitionToView");
                            this.removeFloatingStyles();
                            if (this.events) this.events.off(this.element, "mousedown touchstart");
                            this.dragging = false;
                        }
                    });
                }

                this._containerObserver = new IntersectionObserver(
                    (entries) => Functions.debounce(containerCallback, 10).apply(this, [entries]), {
                        threshold: this.threshold
                    }
                );
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