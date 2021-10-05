/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.Ad", ["base:Class", "base:Objs", "base:Events.EventsMixin"], function(Class, Objs, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.sequence = null;
                this.system = null;
                this.title = null;
                this.description = null;
                this.advertiser = null;
                this.pricing = null;
                this.survey = null;
                this.errorURLTemplates = [];
                this.impressionURLTemplates = [];
                this.creatives = [];
                this.extensions = [];

                this.trackingEvents = {};
                this.availableTrackingEvents = ['creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'rewind', 'skip', 'closeLinear', 'close', 'mute', 'unmute', 'pause', 'resume', 'playerExpand', 'playerCollapse', 'acceptInvitationLinear', 'timeSpentViewing', 'otherAdInteraction', 'progress', 'acceptInvitation', 'adExpand', 'adCollapse', 'minimize', 'overlayViewDuration', 'fullscreen', 'exitFullscreen', 'clickthrough'];

                Objs.iter(this.availableTrackingEvents, function(_event) {
                    this.trackingEvents[_event] = null;
                }, this);

            }
        };
    }], {
        isNumeric: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        trackAd: function(URLTemplates, variables) {
            var URL, URLs, i, j, len, results;
            URLs = this.resolveURLTemplates(URLTemplates, variables);
            results = [];
            for (j = 0, len = URLs.length; j < len; j++) {
                URL = URLs[j];
                if (typeof window !== "undefined" && window !== null) {
                    i = new Image();
                    results.push(i.src = URL);
                } else {

                }
            }
            return results;
        },

        resolveURLTemplates: function(URLTemplates, variables) {
            var URLTemplate, URLs, j, key, len, macro1, macro2, resolveURL, value;
            if (!variables) {
                variables = {};
            }
            URLs = [];
            if (variables.ASSETURI) {
                variables.ASSETURI = this.encodeURIComponentRFC3986(variables.ASSETURI);
            }
            if (variables.CONTENTPLAYHEAD) {
                variables.CONTENTPLAYHEAD = this.encodeURIComponentRFC3986(variables.CONTENTPLAYHEAD);
            }
            if ((variables.ERRORCODE) && !/^[0-9]{3}$/.test(variables.ERRORCODE)) {
                variables.ERRORCODE = 900;
            }
            variables.CACHEBUSTING = this.leftpad(Math.round(Math.random() * 1.0e+8).toString());
            variables.TIMESTAMP = this.encodeURIComponentRFC3986((new Date()).toISOString());
            variables.RANDOM = variables.random = variables.CACHEBUSTING;
            for (j = 0, len = URLTemplates.length; j < len; j++) {
                URLTemplate = URLTemplates[j];
                resolveURL = URLTemplate;
                if (!resolveURL) {
                    continue;
                }
                for (key in variables) {
                    value = variables[key];
                    macro1 = "[" + key + "]";
                    macro2 = "%%" + key + "%%";
                    resolveURL = resolveURL.replace(macro1, value);
                    resolveURL = resolveURL.replace(macro2, value);
                }
                URLs.push(resolveURL);
            }
            return URLs;
        },

        leftpad: function(str) {
            if (str.length < 8) {
                return ((function() {
                    var j, ref, results;
                    results = [];
                    for (j = 0, ref = 8 - str.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
                        results.push('0');
                    }
                    return results;
                })()).join('') + str;
            } else {
                return str;
            }
        },

        encodeURIComponentRFC3986: function(str) {
            return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        },

        storage: (function() {
            var data, isDisabled, storage, storageError;
            try {
                storage = typeof window !== "undefined" && window !== null ? window.localStorage || window.sessionStorage : null;
            } catch (error) {
                storageError = error;
                storage = null;
            }
            isDisabled = function(store) {
                var e, testValue, storeValue;
                try {
                    testValue = '__VAST__';
                    storeValue = store.getItem(testValue);
                    store.setItem(testValue, testValue);
                    if (store.getItem(testValue) !== testValue) {
                        return true;
                    }
                    if (storeValue) store.setItem(testValue, storeValue);
                    else store.removeItem(testValue);
                } catch (error) {
                    e = error;
                    return true;
                }
                return false;
            };
            if ((storage === null) || isDisabled(storage)) {
                data = {};
                storage = {
                    length: 0,
                    getItem: function(key) {
                        return data[key];
                    },
                    setItem: function(key, value) {
                        data[key] = value;
                        this.length = Object.keys(data).length;
                    },
                    removeItem: function(key) {
                        delete data[key];
                        this.length = Object.keys(data).length;
                    },
                    clear: function() {
                        data = {};
                        this.length = 0;
                    }
                };
            }
            return storage;
        })()
    });
});