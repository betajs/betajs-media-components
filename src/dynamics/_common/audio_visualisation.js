Scoped.define("module:AudioVisualisation", [
    "base:Class",
    "browser:Dom"
], function(Class, Dom, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            /**
             * @param stream  // Audio stream
             * @param {object} options // additional options like height and active element
             */
            constructor: function(stream, options) {
                inherited.constructor.call(this);
                this.stream = stream;
                if (options.recorder) {
                    this.audioContext = options.globalAudioContext;

                    // Commented for the future use in audio recorder
                    // var recorder = options.recorder;
                    // this._analyser = recorder._analyser;
                    // this._audioContext = this._analyser._audioContext;
                    // this.audioContext = this._analyser._audioContext;
                    // this._analyserNode = this._analyser._analyserNode;
                    // this._audioInput = this._analyser._audioInput;
                } else {
                    var AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.audioContext = new AudioContext();
                }
                this.audioBufferSourceNode = this.audioContext.createBufferSource();
                this.createVisualisationCanvas(options.height, options.element);
                this.frameID = null;
            },

            createVisualisationCanvas: function(height, element) {
                var _height, _containerElement;
                _height = height || 120;
                _containerElement = (element.firstElementChild || element.firstChild);
                _containerElement.style.minHeight = _height + 'px';
                this.canvas = _containerElement.querySelector('canvas');
                this.canvas.style.display = 'block';
                this.canvas.width = parseFloat(window.getComputedStyle(_containerElement).width);
                this.canvas.height = _height;
                this.canvasContext = this.canvas.getContext("2d");
            },

            initializeVisualEffect: function() {
                try {
                    var _source;
                    if (this.audioContext || this.stream) {
                        this.analyser = this._analyser || this.audioContext.createAnalyser();
                        this.audioBufferSourceNode.connect(this.analyser);
                        _source = this.audioContext.createMediaElementSource(this.stream);
                        _source.connect(this.analyser);
                        if (this.audioContext.state === 'suspended') {
                            Dom.userInteraction(function() {
                                this.audioContext.resume();
                            }, this);
                        }
                        this.analyser.connect(this.audioContext.destination);
                        this.analyser.fftSize = 256;
                        this.bufferLength = this.analyser.frequencyBinCount;
                        this.dataArray = new Uint8Array(this.bufferLength);
                        // this.dataArray = new Float32Array( this.analyser.fftSize);
                        this.canvasWidth = this.canvas.width;
                        this.canvasHeigth = this.canvas.height;
                        this.barWidth = (this.canvasWidth / this.bufferLength) * 2.5;
                        this.barHeight = 0;
                        this.x = 0;
                        //this.renderFrame = this._renderFrame;
                        // If requestAnimationFrame is missing
                        if (!window.requestAnimationFrame) {
                            window.requestAnimationFrame = (function() {
                                return window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                                        window.setTimeout(callback, 1000 / 60);
                                    };
                            })();
                            window.cancelAnimationFrame = window.cancelAnimationFrame ||
                                window.mozCancelAnimationFrame ||
                                function(requestID) {
                                    clearTimeout(requestID);
                                }; //fall back
                        }
                    } else {
                        console.warn('Seems there is limitation by browser to create AudioContext instance');
                    }
                } catch (e) {
                    //this.set('visualeffectsupported', false);
                    console.warn('Web Audio API not supported', e);
                }
            },

            renderFrame: function() {
                // requestAnimationFrame(this.renderFrame.bind(this));
                var _self = this;
                this.frameID = requestAnimationFrame(function() {
                    _self.renderFrame();
                });
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteFrequencyData(this.dataArray);
                // this.dataArray = new Float32Array( this.analyser.fftSize);
                // this.analyser.getFloatTimeDomainData(this.dataArray);
                setTimeout(function() {
                    //debugger;
                }, 2000);
                this._drawBigBalloon();
            },

            cancelFrame: function(ID) {
                var _ID = ID || this.renderFrame;
                cancelAnimationFrame(_ID);
            },

            _drawRedBars: function() {
                this.x = 0;
                this.canvasContext.fillStyle = "#000";
                this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeigth);
                for (var i = 0; i < this.bufferLength; i++) {
                    this.barHeight = this.dataArray[i] / 2;
                    var r = this.barHeight + (25 * (i / this.bufferLength));
                    var g = 250 * (i / this.bufferLength);
                    var b = 50;
                    this.canvasContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    this.canvasContext.fillRect(this.x, this.canvasHeigth - this.barHeight, this.barWidth, this.barHeight);
                    this.x += this.barWidth + 1;
                }
            },

            _drawBigBalloon: function() {
                this.__canvasBackground(235);
                this.canvasContext.fillStyle = "#000";
                var s = this.__getRMS();
                this.canvasContext.fillStyle = this.__rgb(s * 2);
                this.__HfillEllipse(this.canvasWidth / 2, this.canvasHeigth / 2, s * 5, s * 5);
            },

            __getRMS: function() {
                var rms = 0;
                for (var i = 0; i < this.bufferLength; i++) {
                    rms += this.dataArray[i] * this.dataArray[i];
                }
                rms /= this.dataArray.length;
                rms = Math.sqrt(rms);
                return rms;
            },

            __canvasBackground: function(r, g, b, a) {
                if (typeof g === 'undefined') {
                    this.canvasContext.fillStyle = this.__rgb(r, r, r);
                } else if (typeof b === 'undefined' && typeof a === 'undefined') {
                    this.canvasContext.fillStyle = rgba(r, r, r, g);
                } else if (typeof a === 'undefined') {
                    this.canvasContext.fillStyle = this.__rgb(r, g, b);
                } else {
                    this.canvasContext.fillStyle = this.__rgba(r, g, b, a);
                }
                this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeigth);
            },

            __HfillEllipse: function(x, y, width, height) {
                if (typeof height === 'undefined') height = width;
                this.__Hellipse(x, y, width, height);
                this.canvasContext.fill();
                this.canvasContext.beginPath();
            },

            __Hellipse: function(x, y, width, height) {
                'use strict';
                if (typeof height === 'undefined') height = width;
                this.canvasContext.beginPath();
                for (var i = 0; i < Math.PI * 2; i += Math.PI / 64) {
                    this.canvasContext.lineTo(x + (Math.cos(i) * width / 2), y + (Math.sin(i) * height / 2));
                }
                this.canvasContext.closePath();
            },

            __rgb: function(r, g, b) {

                if (typeof g === 'undefined') g = r;
                if (typeof b === 'undefined') b = r;
                return 'rgb(' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(g), 0, 255) + ', ' + this.__clamp(Math.round(b), 0, 255) + ')';

            },

            __rgba: function(r, g, b, a) {
                if (typeof g === 'undefined') {
                    return 'rgb(' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(r), 0, 255) + ')';
                } else if (typeof b === 'undefined') {
                    return 'rgba(' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(g, 0, 1) + ')';
                } else if (typeof a === 'undefined') {
                    return 'rgba(' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(g), 0, 255) + ', ' + this.__clamp(Math.round(b), 0, 255) + ', 1)';
                } else {
                    return 'rgba(' + this.__clamp(Math.round(r), 0, 255) + ', ' + this.__clamp(Math.round(g), 0, 255) + ', ' + this.__clamp(Math.round(b), 0, 255) + ', ' + this.__clamp(a, 0, 1) + ')';
                }
            },

            __clamp: function(value, min, max) {
                return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
            }
        };
    }, {
        supported: function() {
            return !!(window.AudioContext || window.webkitAudioContext);
        }
    });
});