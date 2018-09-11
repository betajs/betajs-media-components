Scoped.define("module:ImageViewer.Dynamics.ImageViewer", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:Classes.ClassRegistry",
    "base:Async",
    "browser:Events"
], [
    "module:ImageViewer.Dynamics.Message",
    "module:ImageViewer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TemplatePartial",
    "dynamics:Partials.HotkeyPartial"
], function(Class, Assets, Info, Dom, Types, Objs, Strings, Time, Timers, ClassRegistry, Async, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_viewer.html') %>",

                attrs: {
                    /* CSS */
                    "css": "ba-imageviewer",
                    "csscommon": "ba-commoncss",
                    "iecss": "ba-imageviewer",
                    "cssmessage": "",
                    "csstopmessage": "",
                    "csscontrolbar": "",
                    "width": "",
                    "height": "",
                    "popup-width": "",
                    "popup-height": "",
                    /* Themes */
                    "theme": "",
                    "csstheme": "",
                    "themecolor": "",
                    /* Dynamics */
                    "dynmessage": "imageviewer-message",
                    "dyntopmessage": "imageviewer-topmessage",
                    "dyncontrolbar": "imageviewer-controlbar",
                    /* Templates */
                    "tmplmessage": "",
                    "tmpltopmessage": "",
                    "tmplcontrolbar": "",
                    /* Attributes */
                    "source": "",
                    "title": "",
                    "fullscreened": false,
                    "visibilityfraction": 0.8,

                    /* Options */
                    "rerecordable": false,
                    "submittable": false,
                    "popup": false,
                    "nofullscreen": false,
                    "ready": true,
                    "stretch": false,
                    "popup-stretch": false,
                    "hideoninactivity": true,
                    "topmessage": "",
                    "closebuttonvisible": false,
                    "customcaptionvisible": false,
                    "initialoptions": {
                        "hideoninactivity": null
                    }
                },

                types: {
                    "rerecordable": "boolean",
                    "ready": "boolean",
                    "nofullscreen": "boolean",
                    "stretch": "boolean",
                    "hideoninactivity": "boolean",
                    "popup": "boolean",
                    "popup-stretch": "boolean",
                    "popup-width": "int",
                    "popup-height": "int",
                    "fullscreened": "boolean",
                    "themecolor": "string",
                    "closebuttonvisible": "boolean",
                    "customcaptionvisible": "boolean"
                },

                computed: {
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
                        return result;
                    }
                },

                events: {
                    "change:source": function() {
                        var img = this.image();
                        if (img)
                            img.src = this.get("source");
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    if (this.get("theme") in Assets.imageviewerthemes) {
                        Objs.iter(Assets.imageviewerthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }

                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("firefox", Info.isFirefox());
                    this.set("message", "");
                    this.set("fullscreensupport", Dom.elementSupportsFullscreen(this.activeElement()));
                    this.set("csssize", "normal");

                    this.set("controlbar_active", this.get("fullscreensupport") || this.get("submittable") || this.get("rerecordable"));
                    this.set("message_active", false);

                    this.set("last_activity", Time.now());
                    this.set("activity_delta", 0);

                    this.__currentStretch = null;
                    this.__imageViewer = {};

                    // Set initial options for further help actions
                    this.set("initialoptions", {
                        hideoninactivity: this.get("hideoninactivity")
                    });
                    this.activeElement().onkeydown = this._keyDownActivity.bind(this, this.activeElement());

                    this.on("change:stretch", function() {
                        this._updateStretch();
                    }, this);

                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 100,
                        start: true
                    });
                },

                _keyDownActivity: function(element, ev) {
                    var _keyCode = ev.which || ev.keyCode;
                    // Prevent whitespace browser center scroll and arrow buttons behaviours
                    if (_keyCode === 32 || _keyCode === 37 || _keyCode === 38 || _keyCode === 39 || _keyCode === 40) ev.preventDefault();

                    if (_keyCode === 32 || _keyCode === 13 || _keyCode === 9) {
                        this._resetActivity();
                        if (this.get("fullscreened") && this.get("hideoninactivity")) this.set("hideoninactivity", false);
                    }

                    if (_keyCode === 9 && ev.shiftKey) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        }, -1);
                    } else if (_keyCode === 9) {
                        this._resetActivity();
                        this._findNextTabStop(element, ev, function(target, index) {
                            target.focus();
                        });
                    }
                },

                _findNextTabStop: function(parentElement, ev, callback, direction) {
                    var _currentIndex, _direction, _tabIndexes, _tabIndexesArray, _maxIndex, _minIndex, _looked, _tabIndex, _delta, _element, _imagePlayersCount;
                    _maxIndex = _minIndex = 0;
                    _direction = direction || 1;
                    _element = ev.target;
                    _currentIndex = _element.tabIndex;
                    _tabIndexes = parentElement.querySelectorAll('[tabindex]');
                    _tabIndexesArray = Array.prototype.slice.call(_tabIndexes, 0);
                    _tabIndexes = _tabIndexesArray
                        .filter(function(element) {
                            if ((element.clientWidth > 0 || element.clientHeight > 0) && (element.tabIndex !== -1)) {
                                if (_maxIndex <= element.tabIndex) _maxIndex = element.tabIndex;
                                if (_minIndex >= element.tabIndex) _minIndex = element.tabIndex;
                                return true;
                            } else return false;
                        });

                    if ((_direction === 1 && _currentIndex === _maxIndex) || (direction === -1 && _currentIndex === _minIndex) || _maxIndex === 0) {
                        _imagePlayersCount = document.querySelectorAll('ba-imageviewer').length;
                        if (_imagePlayersCount > 1) {
                            parentElement.tabIndex = -1;
                            parentElement.blur();
                        }
                        return;
                    }

                    for (var i = 0; i < _tabIndexes.length; i++) {
                        if (!_tabIndexes[i])
                            continue;
                        _tabIndex = _tabIndexes[i].tabIndex;
                        _delta = _tabIndex - _currentIndex;
                        if (_tabIndex < _minIndex || _tabIndex > _maxIndex || Math.sign(_delta) !== _direction)
                            continue;

                        if (!_looked || Math.abs(_delta) < Math.abs(_looked.tabIndex - _currentIndex))
                            _looked = _tabIndexes[i];
                    }

                    if (_looked) {
                        ev.preventDefault();
                        callback(_looked, _looked.tabIndex);
                    }
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.image().src = this.get("source");
                },

                _resetActivity: function() {
                    this.set("last_activity", Time.now());
                    this.set("activity_delta", 0);
                },

                object_functions: ["rerecord"],

                functions: {

                    user_activity: function(strong) {
                        this.set("last_activity", Time.now());
                        this.set("activity_delta", 0);
                    },

                    message_click: function() {
                        this.trigger("message:click");
                    },

                    rerecord: function() {
                        if (!this.get("rerecordable"))
                            return;
                        this.trigger("rerecord");
                    },

                    toggle_fullscreen: function() {
                        if (this.get("fullscreened") && this.__imageViewer.imageWrapper) {
                            this._close_image();
                        } else {
                            this._open_image();
                        }
                    },

                    submit: function() {
                        if (!this.get("submittable"))
                            return;
                        this.trigger("submit");
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        var _targetElement, _activeElement, _selector, _keyCode;
                        _keyCode = ev.which || ev.keyCode;
                        _activeElement = this.activeElement();
                        if (_keyCode === 13 || _keyCode === 32) {
                            if (focusingSelector) {
                                _selector = "[data-selector='" + focusingSelector + "']";
                                _targetElement = _activeElement.querySelector(_selector);
                                if (_targetElement)
                                    Async.eventually(function() {
                                        this.trigger("keyboardusecase", _activeElement);
                                        _targetElement.focus({
                                            preventScroll: false
                                        });
                                    }, this, 100);
                            } else {
                                _selector = '[data-image="image"]';
                                _targetElement = _activeElement.querySelector(_selector);
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: true
                                    });
                                }, this, 100);
                            }
                        } else if (_keyCode === 9 && nextSelector) {
                            _selector = "[data-selector='" + nextSelector + "']";
                            _targetElement = _activeElement.querySelector(_selector);
                            if (_targetElement)
                                Async.eventually(function() {
                                    this.trigger("keyboardusecase", _activeElement);
                                    _targetElement.focus({
                                        preventScroll: false
                                    });
                                }, this, 100);

                        }
                    }
                },

                destroy: function() {
                    this._timer.destroy();
                    this.host.destroy();
                    inherited.destroy.call(this);
                },

                _open_image: function(sourceFile) {
                    this.__imageViewer.counter = 0;
                    // Main container
                    this.__imageViewer.imageViewer = document.createElement('div');

                    // Wrapper
                    this.__imageViewer.imageWrapper = document.createElement('div');
                    this.__imageViewer.imageWrapper.className = this.get('css') + '-image-viewer-wrapper';

                    // image viewer overlay
                    this.__imageViewer.overlayElement = document.createElement('div');
                    this.__imageViewer.overlayElement.className = this.get('css') + '-image-viewer-overlay';

                    this.__imageViewer.image = document.createElement('img');
                    this.__imageViewer.image.className = this.get('css') + '-image-viewer-expanded';
                    this.__imageViewer.image.src = sourceFile || this.get('source');

                    // Will show caption in the middle bottom side
                    if (this.get("customcaptionvisible")) {
                        var _titleText;
                        this.__imageViewer.title = document.createElement('div');
                        this.__imageViewer.title.className = this.get('css') + '-image-viewer-title';
                        _titleText = document.createTextNode(this.get('title'));
                        this.__imageViewer.title.appendChild(_titleText);
                    }

                    // Show close button on the top right corner
                    if (this.get("closebuttonvisible")) {
                        this.__imageViewer.closeButton = document.createElement('div');
                        this.__imageViewer.closeButton.className = this.get('css') + '-close-button';
                        this.__imageViewer.closeButton.tabIndex = 0;

                        // Listen event on close button
                        this.__imageViewer.clickEvent = this.auto_destroy(new DomEvents());
                        this.__imageViewer.clickEvent.on(this.__imageViewer.closeButton, "click", function() {
                            this._close_image();
                        }, this);
                        this.__imageViewer.clickEvent.on(this.__imageViewer.closeButton, "keydown", function() {
                            this._close_image();
                        }, this);
                    }


                    // Show title on the image, if require could be added as a future


                    this.__imageViewer.bodyOverlay = document.querySelector('ba-imageviewer');

                    this.__imageViewer.imageViewer.appendChild(this.__imageViewer.overlayElement);
                    this.__imageViewer.imageViewer.appendChild(this.__imageViewer.image);

                    if (this.get("customcaptionvisible"))
                        this.__imageViewer.imageViewer.appendChild(this.__imageViewer.title);
                    if (this.get("closebuttonvisible"))
                        this.__imageViewer.imageViewer.appendChild(this.__imageViewer.closeButton);

                    // Append child
                    this.__imageViewer.bodyOverlay.parentNode.insertBefore(this.__imageViewer.imageWrapper, this.__imageViewer.bodyOverlay);

                    this.__imageViewer.imageViewer.style.opacity = 0;
                    this.__imageViewer.imageWrapper.appendChild(this.__imageViewer.imageViewer);

                    // Start fadIn process
                    this.__imageViewer.fadeInCounter = new Timers.Timer({
                        context: this,
                        fire: this.__fadeIn,
                        delay: 40,
                        start: true
                    });

                    this.set("hideoninactivity", false);
                    this.set("fullscreened", true);
                },

                _close_image: function() {
                    this.set("fullscreened", false);
                    this.set("hideoninactivity", this.get("initialoptions").hideoninactivity);
                    this.__imageViewer.fadeInCounter = new Timers.Timer({
                        context: this,
                        fire: this.__fadeOut,
                        delay: 20,
                        start: true
                    });
                },

                __fadeIn: function() {
                    if (!this.__imageViewer.fadeInCounter) return;
                    if (this.__imageViewer.fadeInCounter.destroyed()) return;
                    if (this.__imageViewer.counter < 1.05) {
                        this.__imageViewer.imageViewer.style.opacity = this.__imageViewer.counter;
                        this.__imageViewer.counter += 0.05;
                    } else {
                        this.__imageViewer.imageViewer.opacity = 1.00;
                        this.__imageViewer.fadeInCounter.stop();
                    }
                },

                __fadeOut: function() {
                    if (!this.__imageViewer.fadeInCounter) return;
                    if (this.__imageViewer.fadeInCounter.destroyed()) return;
                    if (this.__imageViewer.counter > 0) {
                        this.__imageViewer.imageViewer.style.opacity = this.__imageViewer.counter;
                        this.__imageViewer.counter -= 0.05;
                    } else {
                        this.__imageViewer.fadeInCounter.stop();
                        this.__imageViewer.bodyOverlay.parentNode.removeChild(this.__imageViewer.imageWrapper);
                    }
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
                    try {
                        this.set("activity_delta", Time.now() - this.get("last_activity"));
                    } catch (e) {}
                    try {
                        this._updateStretch();
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                image: function() {
                    return this.activeElement().querySelector("img");
                },

                imageHeight: function() {
                    return this.image().height;
                },

                imageWidth: function() {
                    return this.image().width;
                },

                aspectRatio: function() {
                    return this.imageWidth() / this.imageHeight();
                },

                parentWidth: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).width;
                },

                parentHeight: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                _updateStretch: function() {
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
                },

                cloneAttrs: function() {
                    return Objs.map(this.attrs, function(value, key) {
                        return this.get(key);
                    }, this);
                },

                popupAttrs: function() {
                    return {
                        popup: false,
                        width: this.get("popup-width"),
                        height: this.get("popup-height"),
                        stretch: this.get("popup-stretch")
                    };
                }

            };
        }, {

        }).register("ba-imageviewer")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/image_viewer.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "image-error": "An error occurred, please try again later. Click to retry."
        });
});