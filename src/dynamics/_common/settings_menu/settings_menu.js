Scoped.define("module:Common.Dynamics.Settingsmenu", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatElementPartial"
], function(Class, Objs, Async, Timer, Dom, Events, Assets, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {

        return {

            template: "<div class=\"{{csscommon}}-settings-menu {{csstheme}}-settings-menu\" role=\"settingsblock\">\n    <div class=\"{{csscommon}}-settings-overlay\">\n        <div class=\"{{csscommon}}-settings-menu-item\"\n             ba-repeat-element=\"{{item :: visiblesettings}}\"\n             ba-click=\"{{select_setting(item)}}\"\n        >\n            <div class=\"{{csscommon}}-settings-menu-label\" role=\"settingslabel\">\n                {item.label}\n            </div>\n            <div class=\"{{csscommon}}-settings-menu-value\" onclick=\"\" role=\"settingsvalue\"\n            >\n                {item.value}\n            </div>\n        </div>\n    </div>\n</div>\n",

            attrs: {
                "css": "ba-common",
                "csscommon": "ba-commoncss",
                "cssplayer": "ba-player",
                "settings": {},

                "predefined": {
                    player: [
                        {
                            id: 'playerspeeds',
                            label: 'player-speed',
                            value: 1.0,
                            visible: 'media-all',
                            flashSupport: false,
                            mobileSupport: true,
                            className: 'player-speed',
                            options: [
                                {
                                    label: 0.50,
                                    value: 0.50
                                },
                                {
                                    label: 0.75,
                                    value: 0.75
                                },
                                {
                                    label: 1.00,
                                    value: 1.00
                                },
                                {
                                    label: 1.25,
                                    value: 1.25
                                },
                                {
                                    label: 1.50,
                                    value: 1.50
                                },
                                {
                                    label: 1.75,
                                    value: 1.75
                                },
                                {
                                    label: 2.00,
                                    value: 2.00
                                }
                            ],
                            events: [{
                                type: 'click touchstart',
                                method: 'set_speed',
                                argument: true
                            }]
                        },
                        // INFO: left here just as an example
                        {
                            id: 'fullscreen',
                            label: '<i class="ba-commoncss-icon-resize-full"></i>',
                            visible: 'media-all',
                            flashSupport: true,
                            mobileSupport: true,
                            className: 'full-screen',
                            events: [{
                                type: 'click touchstart',
                                method: 'toggle_fullscreen',
                                argument: false
                            }]
                        }
                    ],
                    recorder: [{}]
                }
            },

            computed: {
                "visiblesettings": function() {
                    if (typeof this.__parent.recorder !== 'object') {
                        this.__isPlayer = true;
                        return this.get("predefined").player;
                    } else {
                        return this.get("predefined").recorder;
                    }
                }
            },

            events: {
                "change:visiblesettings": function(newValue) {
                    if (this.get("visiblesettings").hasKey("id")) {
                        this._showingMenuLevel = 'root';
                    } else {
                        this._showingMenuLevel = 'child';
                    }
                }
            },

            functions: {
                show_settings_menu: function() {
                    this.showSettingsMenu();
                },

                hide_settings_menu: function() {
                    this.hideSettingsMenu();
                },

                select_setting: function(menuItem) {
                    console.log('selected', menuItem);
                },

                add_new_settings_item: function(setting) {
                    this.addSetting(setting);
                },

                remove_settings_item: function(settingsId) {
                    this.removeSetting(settingsId);
                }
            },

            create: function() {
                this._menuInitiallyGenerated = false;
                this._showingMenuLevel = 'root';
            },

            showSettingsMenu: function() {
                console.log('STTINGS >> ', this.get("visiblesettings"));

                // if (!this._menuInitiallyGenerated)
                //     this._initSettingsMenu(function () {
                //
                //     });
            },

            hideSettingsMenu: function() {
                console.log('Hide Settings menu');
            },

            /**
             * @param {Object|String} newOption
             */
            addSetting: function(newOption) {
                if (typeof newOption === 'object') {
                    this.options.push();
                    Objs.extend(this.options, newOption);
                } else if (typeof newOption === 'string') {
                    Objs.extend(this.options, {
                        newOption: newOption
                    });
                }
            },

            /**
             * @param {String} settingId
             */
            removeSetting: function(settingId) {},


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
             * Hide settings
             */
            hide_settings: function() {
                if (this.containerInner) {
                    this._removeSettingsContent();
                    return;
                }
            },

            /**
             * If exists remove old inner container and create a new one
             * @private
             */
            _initSettingsMenu: function(callback) {
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
                        delay: 10,
                        immediate: true
                    }));
                }, this, 100);
            }
        };
    })
        .register("ba-common-settingsmenu")
        .registerFunctions({
            /**/
            "csscommon": function(obj) {
                with(obj) {
                    return csscommon;
                }
            },
            "csstheme": function(obj) {
                with(obj) {
                    return csstheme;
                }
            },
            "visiblesettings": function(obj) {
                with(obj) {
                    return visiblesettings;
                }
            },
            "select_setting(item)": function(obj) {
                with(obj) {
                    return select_setting(item);
                }
            } /**/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Click to play.",
            "rerecord": "Redo",
            "submit-video": "Confirm video"
        });
});
