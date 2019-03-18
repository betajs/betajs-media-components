/*!
 * Croppr.js
 * https://jamesooi.design/Croppr.js
 *
 * Copyright © 2018 James Ooi.
 * Released under the MIT License.
 * https://github.com/jamesssooi/Croppr.js/blob/master/LICENSE
 */

Scoped.define("module:Cropping", [
    "base:Class",
    "base:Objs",
    "base:Events.EventsMixin",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events"
], function(Class, Objs, EventsMixin, Async, Timer, Dom, DomEvents, scoped) {

    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(element, options, deferred) {
                this._polyfills.apply(this);
                this.domEvents = this.auto_destroy(new DomEvents());

                this.options = options || {};
                this.deferred = deferred || false;

                this._aspectRatio = null;
                this._minSize = {
                    width: null,
                    height: null
                };
                this._maxSize = {
                    width: null,
                    height: null
                };
                this._startSize = {
                    width: 100,
                    height: 100,
                    unit: '%'
                };


                // 'real', 'ratio' or 'raw'
                // returnMode: 'real',
                // onInitialize: null,
                // onCropStart: null,
                // onCropMove: null,
                // onCropEnd: null,

            },

            _createElement: function(position, constraints, cursor, eventBus) {
                this.position = position;
                this.constraints = constraints;
                this.cursor = cursor;
                this.eventBus = eventBus;

                // Create DOM element
                this.el = document.createElement('div');
                this.el.className = 'betajs-croppr-handle';
                this.el.style.cursor = cursor;

                // Attach initial listener
                this.domevents(this.el, 'mousedown', this.__onMouseDown);
            },

            __onMouseDown: function(e) {
                e.stopPropagation();

                this.domevents(document, 'mouseup', this.__onMouseUp);
                this.domevents(document, 'mousemove', this.__onMouseMove);

                // Dom.triggerDomEvent(element, eventName, parameters, customEventParams);
                // element, eventName, parameters, customEventParams
                Dom.triggerDomEvent(document, 'crophandlestart', {}, {
                    detail: {
                        handle: this
                    }
                });
                // this.eventBus.dispatchEvent(new CustomEvent('crophandlestart', {
                //     detail: { handle: this }
                // }));
            },

            __onMouseUp: function(e) {
                e.stopPropagation();
                this.domevents(document, 'mouseup', this.__onMouseUp);
                this.domevents(document, 'mousemove', this.__onMouseMove);

                // Notify parent
                this.eventBus.dispatchEvent(new CustomEvent('crophandleend', {
                    detail: {
                        handle: this
                    }
                }));
            },

            __onMouseMove: function(e) {
                e.stopPropagation();

                // Notify parent
                this.eventBus.dispatchEvent(new CustomEvent('crophandlemove', {
                    detail: {
                        mouseX: e.clientX,
                        mouseY: e.clientY
                    }
                }));
            },

            // TODO: move to the shim files or crate a new polyfill
            // Some polyfills need to add shim file later
            _polyfills: function() {

                // Request Animation Frame polyfill
                // requestAnimationFrame && cancelAnimationFrame
                (function() {
                    var lastTime = 0;
                    var vendors = ['ms', 'moz', 'webkit', 'o'];
                    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                            window[vendors[x] + 'CancelRequestAnimationFrame'];
                    }

                    if (!window.requestAnimationFrame)
                        window.requestAnimationFrame = function(callback, element) {
                            var currTime = new Date().getTime();
                            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                            var id = window.setTimeout(function() {
                                    callback(currTime + timeToCall);
                                },
                                timeToCall);
                            lastTime = currTime + timeToCall;
                            return id;
                        };

                    if (!window.cancelAnimationFrame)
                        window.cancelAnimationFrame = function(id) {
                            clearTimeout(id);
                        };
                }());


                // CustomEvents polyfill
                // While a window.CustomEvent object exists, it cannot be called as a constructor.
                // Instead of new CustomEvent(...), you must use e = document.createEvent('CustomEvent') and then e.initCustomEvent(...)
                // There is no window.CustomEvent object, but document.createEvent('CustomEvent') still works.
                (function() {

                    if (typeof window.CustomEvent === "function") return false;

                    function CustomEvent(event, params) {
                        params = params || {
                            bubbles: false,
                            cancelable: false,
                            detail: undefined
                        };
                        var evt = document.createEvent('CustomEvent');
                        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                        return evt;
                    }

                    CustomEvent.prototype = window.Event.prototype;

                    window.CustomEvent = CustomEvent;
                })();


                // MouseEvents polyfill
                (function(window) {
                    try {
                        new CustomEvent('test');
                        return false; // No need to polyfill
                    } catch (e) {
                        // Need to polyfill - fall through
                    }

                    // Polyfills DOM4 CustomEvent
                    function MouseEvent(eventType, params) {
                        params = params || {
                            bubbles: false,
                            cancelable: false
                        };
                        var mouseEvent = document.createEvent('MouseEvent');
                        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                        return mouseEvent;
                    }

                    MouseEvent.prototype = Event.prototype;

                    window.MouseEvent = MouseEvent;
                })(window);

                // TODO: for dispatchEvent need to add polyfill
                // Supports Microsoft's proprietary EventTarget.fireEvent() method.
            }
        };
    }]);
});