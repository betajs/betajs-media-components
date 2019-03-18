Scoped.define("module:TrackTags", [
    "base:Class",
    "base:Objs",
    "base:Events.EventsMixin",
    "base:Async",
    "browser:Dom",
    "browser:Info",
    "browser:Events"
], function(Class, Objs, EventsMixin, Async, Dom, Info, DomEvents, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            /**
             * @param {Object} options
             * @param {Object} dynamics
             */
            constructor: function(options, dynamics) {
                this._dyn = dynamics;
                this._trackTags = dynamics.get("tracktags");
                this._video = dynamics.__video;
                this.hasThumbs = false;
                dynamics.set("tracktagssupport", this._trackTags && this._trackTags.length > 0 &&
                    ('track' in document.createElement('track')));
                if (!this._video || !this._trackTags || this._trackTags.length === 0)
                    return;
                this._loadTrackTags();
                // To be able play default subtitle in with custom style
                if (dynamics.get("tracktagsstyled")) this._setDefaultTrackOnPlay();

                // Will trigger meta tag on-load event
                Async.eventually(function() {
                    this._loadMetaTrackTags();
                }, this);
            },

            /**
             * Appear track elements inside video element
             * @private
             */
            _loadTrackTags: function() {
                if (!this._dyn.get("tracktagssupport")) return;
                var _flag = true;
                Objs.iter(this._trackTags, function(subtitle, index) {
                    var _trackTag = document.createElement("track");
                    var _domEvent = this.auto_destroy(new DomEvents());

                    /** kind could be on of the: subtitles, captions, descriptions, chapters, metadata */
                    try {
                        if (subtitle.content && !subtitle.src)
                            _trackTag.src = URL.createObjectURL(new Blob([subtitle.content], {
                                type: 'text/plain'
                            }));
                    } catch (e) {}
                    switch (subtitle.kind) {
                        case 'thumbnails':
                            _trackTag.id = this._dyn.get("css") + '-track-thumbnails';
                            _trackTag.kind = 'metadata';
                            _trackTag.src = subtitle.src;
                            _trackTag.mode = 'hidden';
                            this.__appendThumbnailTrackTags(subtitle, index, _trackTag, _domEvent);
                            break;
                        default: // Will be subtitles, as mostly it's using for this purpose
                            _trackTag.id = this._dyn.get("css") + '-tack-' + index;
                            _trackTag.kind = subtitle.kind || 'subtitles';
                            _trackTag.label = subtitle.label || 'English';
                            _trackTag.srclang = subtitle.lang || 'en';
                            _trackTag.src = subtitle.src || null;
                            this.__appendTextTrackTags(subtitle, index, _trackTag, _flag, _domEvent);
                            if (this._trackTags.length > 1) {
                                this._dyn.on("switch-track", function(selectedTrack) {
                                    this._dyn.set("tracktextvisible", true);
                                    this._dyn.set("trackcuetext", null);
                                    this._setSelectedTag(selectedTrack);
                                }, this);
                            }
                            break;
                    }
                    this._video.appendChild(_trackTag);
                }, this);
            },

            /**
             *
             * @param {Object} subtitle
             * @param {Integer} index
             * @param {HTMLElement} trackTag
             * @param {Boolean} flag
             * @param {EventListenerOrEventListenerObject} domEvent
             * @private
             */
            __appendTextTrackTags: function(subtitle, index, trackTag, flag, domEvent) {
                if (subtitle.enabled && flag) {
                    trackTag.setAttribute('default', '');
                    this._dyn.set("tracktaglang", subtitle.lang);
                    this._dyn.set("tracktextvisible", true);
                }
                trackTag.setAttribute('data-selector', 'track-tag');
                domEvent.on(trackTag, "load", function() {
                    if (subtitle.enabled && flag) {
                        this.mode = "showing";
                        if (this._video) this._video.textTracks[index].mode = "showing"; // Firefox
                        flag = false;
                    } else {
                        this.mode = "hidden";
                        if (this._video) this._video.textTracks[index].mode = "hidden"; // Firefox
                    }
                }, this);
            },

            /**
             *
             * @param {Object} subtitle
             * @param {Integer} index
             * @param {HTMLElement} trackTag
             * @param {EventListenerOrEventListenerObject} domEvent
             * @private
             */
            __appendThumbnailTrackTags: function(subtitle, index, trackTag, domEvent) {
                var _self = this,
                    _track, _image, _splitText, _dimensions, thumbLink;
                trackTag.setAttribute('data-selector', 'thumb-track-tag');
                domEvent.on(trackTag, "load", function(ev) {
                    _track = this.track;
                    if (_track.cues[0].text) {
                        _splitText = _track.cues[0].text.split('#xywh=');
                        thumbLink = _splitText[0];
                        _dimensions = _track.cues[0].text.split('#xywh=')[1].split(',');

                        _image = new Image();
                        _image.src = thumbLink;

                        domEvent.on(_image, "load", function() {
                            this.hasThumbs = true;

                            var _thumbContainer = document.createElement('div');
                            var _thumbImageContainer = document.createElement('div');
                            var _timeContainer = document.createElement('span');

                            Dom.elementAddClass(_thumbContainer, this._dyn.get('css') + '-seeking-thumb-container');

                            _thumbImageContainer.style.height = +(_dimensions[3]) + 'px';
                            _thumbImageContainer.style.width = +(_dimensions[2]) + 'px';
                            _thumbImageContainer.style.backgroundImage = "url('" + thumbLink + "')";
                            _thumbImageContainer.style.backgroundRepeat = 'no-repeat';
                            _thumbImageContainer.style.backgroundAttachment = 'background-attachment';

                            _thumbContainer.appendChild(_thumbImageContainer);
                            _thumbContainer.appendChild(_timeContainer);

                            this._dyn.set("thumbimage", {
                                image: _image,
                                url: _image.src,
                                height: _image.naturalHeight || _image.height,
                                width: _image.naturalWidth || _image.width,
                                thumbWidth: Number(_dimensions[2]),
                                thumbHeight: Number(_dimensions[3])
                            });
                            this.thumbContainer = _thumbContainer;
                            this.__generateThumbnails(_track);
                        }, _self);
                    }
                });
            },

            /**
             * Generate
             * @param {Object} track
             * @private
             */
            __generateThumbnails: function(track) {
                Objs.iter(track.cues, function(cue, index) {
                    if (typeof cue === 'object') {
                        var _lineSplit = cue.text.trim().split('#xywh=')[1];
                        this.get("thumbcuelist").push({
                            startTime: cue.startTime,
                            endTime: cue.endTime,
                            text: _lineSplit
                        });
                    }
                }, this._dyn);
            },

            /**
             * If custom styled text track selected
             * @param {Object} track
             * @param {String} lang
             * @private
             */
            _showTracksInCustomElement: function(track, lang) {
                var _lang = lang || this._dyn.get("tracktaglang");
                var _dyn = this._dyn;
                if (track.language === _lang) {
                    var _cues = track.cues;
                    Objs.iter(_cues, function(cue, index) {
                        if (typeof _cues[index] === 'object' && _cues[index]) {
                            cue.onenter = function(ev) {
                                track.mode = 'hidden';
                                if (_dyn.get("tracktextvisible"))
                                    _dyn.set("trackcuetext", this.text);
                            };
                            cue.onexit = function(ev) {
                                _dyn.set("trackcuetext", null);
                            };
                        }
                    }, this);
                }
            },

            /**
             * Load meta data kind Track Elements
             * @private
             */
            _loadMetaTrackTags: function() {
                if (this._video)
                    Objs.iter(this._video.textTracks, function(track, index) {
                        if (typeof this._video.textTracks[index] === 'object' && this._video.textTracks[index]) {
                            var _track = this._video.textTracks[index];
                            // If set custom style to true show cue text in our element
                            if (_track.kind === 'metadata') _track.mode = 'hidden';
                        }
                    }, this);
            },

            /**
             * Will set default language text track
             * @private
             */
            _setDefaultTrackOnPlay: function() {
                this._dyn.player.once("playing", function() {
                    Objs.iter(this._trackTags, function(track, index) {
                        var _track = this._video.textTracks[index];
                        if (typeof _track === 'object' && _track) {
                            if (_track.mode === 'showing')
                                this._showTracksInCustomElement(_track, _track.language);
                        }
                    }, this);
                }, this);
            },

            /**
             * When user select other language or different text track
             * @param {Object} selectedTrack
             * @private
             */
            _setSelectedTag: function(selectedTrack) {
                var _status = null;
                var _track = null;
                Objs.iter(this._video.textTracks, function(track, index) {
                    _track = this._video.textTracks[index];
                    if (typeof _track === 'object' && _track) {
                        _status = _track.language === selectedTrack.lang ? (this._dyn.get("tracktagsstyled") ? 'hidden' : 'showing') : 'disabled';
                        if (!this._dyn.get("tracktextvisible")) _status = 'disabled';
                        _track.mode = _status;
                        if (_track.language === selectedTrack.lang)
                            this._triggerTrackChange(this._video, _track, _status, selectedTrack.lang);
                    }
                }, this);
            },

            // Fixed issue when unable switch directly to showing from disabled
            _triggerTrackChange: function(video, track, status, lang) {
                var _trackElement = video.querySelector("#" + track.id);
                var _flag = true;
                var onTrackEvent = this.auto_destroy(new DomEvents());
                if (track.oncuechange !== undefined && !((Info.isInternetExplorer() || Info.isEdge()) && this._dyn.get("tracktagsstyled"))) {
                    onTrackEvent.on(track, "cuechange", function() {
                        if (_flag) {
                            if (status.length) track.mode = status;
                            if (this._dyn.get("tracktagsstyled"))
                                this._showTracksInCustomElement(track, lang);
                            else if (_trackElement) {
                                _trackElement.mode = status;
                                // _trackElement.setAttribute('default', '');
                            }
                            _flag = false;
                        }
                    }, this);
                } else {
                    onTrackEvent(video, "timeupdate", function() {
                        if (status.length) track.mode = status;
                        if (this._dyn.get("tracktagsstyled"))
                            this._showTracksInCustomElement(track, lang);
                    }, this);
                }
            }
        };
    }]);
});