Scoped.define("module:Settings", [
    "base:Class",
    "base:Objs",
    "base:Events.EventsMixin",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events"
], function(Class, Objs, EventsMixin, Async, Timer, Dom, DomEvents, Info, scoped) {

    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(options, dynamics) {
                inherited.constructor.call(this);
                var _selector, _css;
                this.options = options;
                this.dyn = dynamics;
                this.selected = {};
                _css = this.dyn.get('css');
                // Dom.ready(function () {
                try {
                    _selector = '.' + _css + '-overlay';
                    this.currentElement = dynamics.activeElement().querySelector(_selector);
                    this.settingsContainer = document.createElement("div");
                    this.settingsContainer.className = "ba-settings-overlay";
                    this.currentElement.appendChild(this.settingsContainer);
                } catch (e) {
                    console.warn('Could not select settings element. Details: ' + e);
                    return;
                }

                this.domEvents = this.auto_destroy(new DomEvents());

                // If mouse clicked outside of the element
                this.domEvents.on(document, "click touchstart", function(event) {
                    var isClickInside = this.settingsContainer.contains(event.target);
                    if (!isClickInside && this.containerInner) {
                        this.dyn.set("settingsoptionsvisible", false);
                        this._removeSettingsContent();
                    }
                }, this);

                // }, this);
            },

            /**
             * Toggle settings
             */
            toggle_settings_block: function() {
                if (this.containerInner) {
                    this._removeSettingsContent();
                    return;
                }
                this._showRootSettings(this.options, this.hasSubMenu);
            },

            /**
             * If exists remove old inner container and create a new one
             * @private
             */
            _buildSettingsContainer: function(callback) {
                try {
                    this._removeSettingsContent();
                    Async.eventually(function() {
                        this.containerInner = document.createElement("ul");
                        this.containerInner.className = "ba-settings-overlay-inner";
                        this.settingsContainer.appendChild(this.containerInner);
                        callback.call(this, null, this.containerInner);
                    }, this, 10);
                } catch (e) {
                    callback(e, null);
                }
            },

            /**
             * Show root settings as a list
             * @param {Object} options
             * @private
             */
            _showRootSettings: function(options) {
                options = options || this.options;
                var _singleSetting, _label, _hasOptions, _rightAngleIcon;
                this._buildSettingsContainer(function(err, container) {
                    if (err) {
                        console.warn('Error: ', err);
                        return;
                    } else {
                        //Objs.count(options)
                        Objs.iter(options, function(setting) {
                            _singleSetting = document.createElement('li');
                            _label = this.dyn.string(setting.label) || setting.label;
                            _hasOptions = setting.options ? 'true' : false;
                            _rightAngleIcon = _hasOptions ? '<i class="' + this.dyn.get('csscommon') + '-icon-angle-right' + '"></i>' : '';
                            _singleSetting.tabIndex = 0;
                            _singleSetting.innerHTML = _label + '<span class="ba-settings-label-icon">' + _rightAngleIcon + '</span>';
                            if (!this.selected[setting.id]) {
                                this.selected[setting.id] = {};
                                this.selected[setting.id].value = setting.defaultValue;
                            }
                            if (setting.options) {
                                this.domEvents.on(_singleSetting, "click touchstart", function(ev) {
                                    this._showChildOptions(setting);
                                }, this);
                            } else {
                                this._attachEventToElement(setting, _singleSetting);
                            }
                            container.appendChild(_singleSetting);
                        }, this);
                        this._animateFade(false, container);
                    }
                });
            },

            /**
             * Show inner child options of the setting
             * @param {Object} setting
             * @private
             */
            _showChildOptions: function(setting) {
                var _singleSettingElement, _label, _selected, _checkedIcon;
                this._buildSettingsContainer(function(err, container) {
                    if (err) {
                        console.warn('Error: ', err);
                    } else {
                        if (Objs.count(setting.options) > 0) {
                            this._createBackPointer(container);
                        } else return;

                        Objs.iter(setting.options, function(option) {
                            _singleSettingElement = document.createElement('li');
                            _selected = this.selected[setting.id].value === option.value;
                            _checkedIcon = _selected ? '<i class="' + this.dyn.get('csscommon') + '-icon-check' + '"></i>' : '';
                            _singleSettingElement.tabIndex = 0;
                            _singleSettingElement.className = 'ba-settings-popup-list-item ba-' + setting.className + '-list-item';
                            _singleSettingElement.className += _selected ? ' ba-settings-popup-selected-list-item' : '';
                            _label = this.dyn.string(option.label) || option.label;

                            _singleSettingElement.innerHTML = '<span class="ba-settings-label-icon">' + _checkedIcon + '</span> ' + _label;

                            this._attachEventToElement(setting, _singleSettingElement, option);
                            container.appendChild(_singleSettingElement);
                        }, this);
                    }
                    this._animateFade(false, container);
                });
            },

            /**
             * Create link to back to the main settings link
             * @private
             */
            _createBackPointer: function(container) {
                var _singleSettingElement, _leftAngleIcon;
                _singleSettingElement = document.createElement('li');
                _leftAngleIcon = '<span class="ba-settings-label-icon"><i class="' + this.dyn.get('csscommon') + '-icon-angle-left' + '"></i></span>';
                _singleSettingElement.innerHTML = _leftAngleIcon + this.dyn.string('all-settings');
                _singleSettingElement.className = 'ba-settings-popup-list-item ba-settings-back-to-settings';
                this.domEvents.on(_singleSettingElement, 'click touchstart', function() {
                    this._showRootSettings(this.options);
                }, this);
                container.appendChild(_singleSettingElement);
            },

            /**
             * Will attach provided events on
             * @param {Object} setting
             * @param element
             * @param {Object} option
             * @private
             */
            _attachEventToElement: function(setting, element, option) {
                Objs.map(setting.events, function(event) {
                    this.domEvents.on(element, event.type, function() {
                        _method = event.method;
                        if (option) {
                            this.selected[setting.id].value = option.value;
                            this.dyn.functions[_method].call(this.dyn, option.value);
                        } else
                            this.dyn.functions[_method].call(this.dyn);
                        if (option)
                            this._showRootSettings(this.options);
                        else
                            this.toggle_settings_block();
                    }, this);
                }, this);
            },

            /**
             * Remove Settings container
             * @private
             */
            _removeSettingsContent: function() {
                if (this.containerInner) {
                    if (this.containerInner.parentNode)
                        try {
                            this.containerInner.parentNode.removeChild(this.containerInner);
                            this.containerInner = null;
                        } catch (e) {
                            console.warn(e);
                        }
                }
            },

            /**
             * Animate fade in or out
             * @param {boolean} hide
             * @param {Object} container
             * @private
             */
            _animateFade: function(hide, container) {
                var _opacity, _step, _target, _timer;
                _opacity = hide ? 1.00 : 0.00;
                _step = hide ? -0.1 : 0.1;
                _target = hide ? 0.00 : 1.00;
                container.style.opacity = _opacity;
                Async.eventually(function() {
                    _timer = this.auto_destroy(new Timer({
                        context: this,
                        fire: function() {
                            container.style.opacity = _opacity;
                            _opacity = _opacity + (_step * 1.0);
                            if ((hide && _opacity < _target) || (!hide && _opacity > _target)) {
                                _timer.destroy();
                            }
                        },
                        delay: 30,
                        immediate: true
                    }));
                }, this, 100);
            }
        };
    }]);
});