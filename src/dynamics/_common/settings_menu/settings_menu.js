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
], function(Class, Objs, Async, Timer, Dom, DomEvents, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {

            return {

                template: "<%= template(dirname + '/settings_menu.html') %>",


                attrs: {
                    "css": "ba-common",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "settings": [],
                    "visiblesettings": [],
                    "selected": null,
                    "root": true,

                    "default": {
                        value: false,
                        label: 'setting-item',
                        visible: true, // small < 320 , medium < 400, normal >= 401, false
                        flashSupport: false,
                        mobileSupport: true,
                        showicon: true,
                        // https://www.htmlsymbols.xyz/unicode
                        trueicon: '&#x2713;',
                        falseicon: '&#x2573;',
                        icontruestyle: 'color: #5dbb96;',
                        iconfalsestyle: 'color: #dd4b39'
                    },

                    "predefined": {
                        player: [{
                            id: 'playerspeeds',
                            label: 'player-speed',
                            value: 1.0,
                            options: [0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00],
                            func: function(setting, value) {
                                /** @var Dynamic this */
                                if (typeof this.functions.set_speed === 'function' && value > 0) {
                                    this.functions.set_speed.call(this, value);
                                    return true;
                                } else {
                                    console.error('Wrong argument or function provided');
                                    return false;
                                }
                            }
                        }],
                        recorder: [{}]
                    }
                },

                computed: {
                    "settings": function() {
                        var predefined = typeof this.__parent.recorder !== 'object' ? this.get("predefined").player : this.get("predefined").recorder;
                        Objs.iter(predefined, function(setting, index) {
                            if (setting.visible || typeof setting.visible === 'undefined')
                                this.addSetting(setting);
                        }, this);
                        return this.get("settings");
                    }
                },

                events: {
                    "change:visiblesettings": function(newValue) {
                        var probe = Objs.peek(newValue);
                        if (typeof probe === 'object' && probe) {

                            // Reset selected setting
                            this.set("selected", null);

                            // If object has ID key, then it's menu item
                            if (probe.hasOwnProperty('id'))
                                this.set("root", true);

                        } else {
                            this.set("root", false);

                            this._animateFade(false, this.activeElement());
                        }
                    }
                },

                functions: {
                    show_root: function() {
                        this.switchToRoot();
                    },

                    /**
                     * @param {String} settingId
                     */
                    select_setting: function(settingId) {
                        Objs.iter(this.get("settings"), function(setting, i) {
                            if (setting.id === settingId)
                                this.build_setting(setting, settingId);
                        }, this);
                    },

                    /**
                     * Call function of the setting
                     * @param value
                     */
                    select_value: function(value) {
                        this._setSettingWithMethod(value);
                    },

                    add_new_settings_item: function(settingObject) {
                        this.addSetting(settingObject);
                    },

                    update_new_settings_item: function(id, updatedSetting) {
                        this.updateSetting(id, updatedSetting);
                    },

                    remove_settings_item: function(id) {
                        this.removeSetting(id);
                    }
                },

                /**
                 * Initial Function After Render
                 */
                create: function() {
                    this.domEvents = this.auto_destroy(new DomEvents());

                    // If mouse clicked outside of the element
                    this.domEvents.on(document, "click touchstart", function(event) {
                        var isClickInside = this.activeElement().contains(event.target);
                        if (!isClickInside && this.activeElement()) {
                            this.parent().set("settingsmenu_active", false);
                        }
                    }, this);
                },

                /**
                 * @param {object =} settingMenu
                 * @param {string =} settingId
                 */
                build_setting: function(settingMenu, settingId) {

                    if (!settingMenu || !settingId) {
                        console.warn('At least on of the arguments are required');
                        return;
                    }

                    if (Objs.count(settingMenu.options) > 1) {
                        this.set("selected", settingMenu);
                        this._buildChildMenu(settingMenu);
                    } else {
                        Objs.iter(this.get("settings"), function(setting, i) {
                            if (setting.id === settingId) {
                                setting.value = !setting.value;
                                this.set("selected", setting);
                                this._setSettingWithMethod(false, i);
                            }
                        }, this);
                    }
                },

                switchToRoot: function() {
                    this.set("visiblesettings", this.get("settings"));
                },

                /*
                 * @param {Object} setting
                 * @private
                 */
                _buildChildMenu: function(setting) {
                    this.set("selected", setting);
                    this.set("visiblesettings", setting.options);
                },

                /**
                 *
                 * @param {string | boolean =} value
                 * @param {int =} index
                 * @private
                 */
                _setSettingWithMethod: function(value, index) {
                    if (typeof this.get("selected").func === 'function') {
                        if (typeof this.get("selected").func.call(this.__parent, this, value, index) === 'boolean') {
                            if (value)
                                this.get("selected").value = value;
                            else
                                this.get("selected").value = !this.get("selected").value;
                            Objs.iter(this.get("settings"), function(setting, index) {
                                if (this.get("selected") && setting)
                                    if (this.get("selected").id === setting.id) {
                                        if (!value) {
                                            this.get("settings")[index].value = !this.get("settings")[index].value;
                                        }
                                        this.get("settings")[index] = this.get("selected");
                                        this.set("visiblesettings", []);
                                        this.set("visiblesettings", this.get("settings"));
                                        // In case if want do not leave child menu can comment above and uncomment below
                                        // this.set("visiblesettings", value ? this.get("selected").options : this.get("settings"));
                                    }
                            }, this);
                        }
                    }

                },

                /**
                 * @param {Object} newMenuItem
                 */
                addSetting: function(newMenuItem) {
                    if (typeof newMenuItem !== 'object') {
                        console.warn('Sorry you should add new option as an Object');
                        return;
                    }

                    if (!newMenuItem.func || !newMenuItem.id) {
                        console.warn('Your added new setting missing mandatory `id`, `func` or `label` keys, please add them');
                        return;
                    } else {
                        if (typeof newMenuItem.func !== 'function') {
                            console.warn('Sorry func key has to be function type');
                            return;
                        }
                    }

                    this.mergeAndRebuildSettings(this.get("default"), newMenuItem);
                },

                /**
                 * @param {string} settingId
                 * @param {object} newOptions
                 */
                updateSetting: function(settingId, newOptions) {
                    if (typeof newOptions !== 'object') {
                        console.warn('Sorry you should provide any new option as an Object');
                        return;
                    }

                    Objs.iter(this.get("settings"), function(setting, index) {
                        if (setting.id === settingId) {
                            this.get("settings")[index] = Objs.tree_merge(this.get("settings")[index], newOptions);
                            this.set("visiblesettings", []);
                            this.set("visiblesettings", this.get("settings"));
                        }
                    }, this);
                },

                /**
                 * @param {String} settingId
                 */
                removeSetting: function(settingId) {
                    if (typeof settingId !== 'string') {
                        console.warn('Sorry you should provide setting ID');
                        return;
                    }

                    Objs.iter(this.get("settings"), function(setting, index) {
                        if (setting.id === settingId) {
                            this.get("settings").splice(index);
                            this.set("visiblesettings", []);
                            this.set("visiblesettings", this.get("settings"));
                        }
                    }, this);
                },

                /**
                 *
                 * @param result
                 * @param initial
                 * @private
                 */
                mergeAndRebuildSettings: function(result, initial) {
                    var _setting = Objs.tree_merge(result, initial);
                    var _currentSettings = this.get("settings");
                    _currentSettings.push(_setting);
                    this.set("visiblesettings", []);
                    this.set("visiblesettings", _currentSettings);
                    this.set("settings", _currentSettings);
                },

                /**
                 * Animate fade in or out
                 *
                 * @param {boolean} hide
                 * @param {HTMLElement} container
                 * @param {boolean =} immedately
                 * @private
                 */
                _animateFade: function(hide, container, immedately) {
                    if (immedately) {
                        container.style.opacity = hide ? "0" : "1";
                    } else {
                        var _opacity, _step, _target, _timer;
                        _opacity = hide ? 1.00 : 0.00;
                        _step = hide ? -0.1 : 0.1;
                        _target = hide ? 0.00 : 1.00;
                        container.style.opacity = _opacity;
                        _timer = this.auto_destroy(new Timer({
                            context: this,
                            fire: function() {
                                container.style.opacity = _opacity;
                                _opacity = _opacity + (_step * 1.0);
                                if ((hide && _opacity < _target) || (!hide && _opacity > _target)) {
                                    this.__animationInProcess = false;
                                    _timer.destroy();
                                }
                            },
                            delay: 30,
                            immediate: true
                        }));
                    }
                }
            };
        })
        .register("ba-common-settingsmenu")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/settings_menu.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Click to play.",
            "setting-menu": "All settings",
            "source-quality": "Source quality",
            "player-speed": "Player speed",
            "set-menu-option": "Set option",
            "submit-video": "Confirm video",
            "picture-in-picture": "Picture in picture",
            "exit-fullscreen-video": "Exit fullscreen",
            "fullscreen-video": "Enter fullscreen"
        });
});