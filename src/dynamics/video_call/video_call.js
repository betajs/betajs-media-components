Scoped.define("module:VideoCall.Dynamics.Call", [
    "base:Classes.ClassRegistry",
    "base:Promise",
    "base:States.Host",
    "dynamics:Dynamic",
    "module:Assets",
    "module:VideoCall.Dynamics.CallStates.Initial",
    "module:VideoCall.Dynamics.CallStates"
], function(ClassRegistry, Promise, Host, Dynamic, Assets, InitialState, CallStates, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_call.html') %>",

                attrs: {
                    local_camera_active: false,
                    local_microphone_active: false,
                    local_stream: undefined,
                    remote_camera_active: false,
                    remote_microphone_active: false,
                    remote_stream: undefined,
                    skipinitial: false
                },

                registerchannels: ["call"],

                channels: {
                    "call:leave_call": function() {
                        this.trigger("ended");
                    },
                    "call:toggle_camera": function() {
                        this.set("local_camera_active", !this.get("local_camera_active"));
                    },
                    "call:toggle_mute": function() {
                        this.set("local_microphone_active", !this.get("local_microphone_active"));
                    }
                },

                object_functions: ["leave"],

                functions: {
                    leave: function() {
                        if (!this.get("connected")) return;
                        this.channel("call").trigger("leave_call");
                    }
                },

                events: {
                    "change:local_camera_active": function(active) {
                        if (!this.get("local_stream")) return;
                        this.get("local_stream").getVideoTracks()[0].enabled = active;
                        if (!this._dataChannelIsReady()) return;
                        this._dataChannel.send(JSON.stringify({
                            remote_camera_active: active
                        }));
                    },
                    "change:local_microphone_active": function(active) {
                        if (!this.get("local_stream")) return;
                        this.get("local_stream").getAudioTracks()[0].enabled = active;
                        if (!this._dataChannelIsReady()) return;
                        this._dataChannel.send(JSON.stringify({
                            remote_microphone_active: active
                        }));
                    },
                    "change:local_stream": function(stream) {
                        if (!stream) return;
                        this.get("local_stream").getVideoTracks()[0].enabled = !!this.get("local_camera_active");
                        this.get("local_stream").getAudioTracks()[0].enabled = !!this.get("local_microphone_active");
                    }
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.persistentTrigger("loaded");
                },

                create: function() {
                    this._initStateMachine();
                },

                _initStateMachine: function() {
                    var host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.callStates())
                    });
                    host.dynamic = this;
                    host.initialize(InitialState);
                },

                _connect: function() { // Simulates connection, needs to be replaced with actual connection
                    var connectionPromise = Promise.create();
                    setTimeout(function() {
                        Promise.conditional(!this.get("local_stream"), function() {
                            var localStreamPromise = Promise.create();
                            this.once("change:local_stream", function(stream) {
                                if (stream) localStreamPromise.asyncSuccess(stream);
                            });
                            return localStreamPromise;
                        }.bind(this), this.get("local_stream")).success(function(stream) {
                            this.set("remote_stream", stream);
                            this.set("remote_camera_active", true);
                            this.set("remote_microphone_active", true);
                        }, this);
                        connectionPromise.asyncSuccess();
                    }.bind(this), 1000);
                    return connectionPromise;
                },

                _createPeerConnection: function(configuration) {
                    if (this._peerConnection) return;
                    this._peerConnection = new RTCPeerConnection(configuration);
                    this._createDataChannel();
                },

                _createDataChannel: function() {
                    if (!this._peerConnection) return;
                    this._dataChannel = this._peerConnection.createDataChannel("call", {
                        negotiated: true,
                        id: 0
                    });
                    this._dataChannel.onopen = function(event) {
                        this._dataChannel.send(JSON.stringify({
                            remote_camera_active: this.get("local_camera_active"),
                            remote_microphone_active: this.get("local_microphone_active")
                        }));
                    }.bind(this);
                    this._dataChannel.onmessage = function(event) {
                        this.setAll(JSON.parse(event.data));
                    }.bind(this);
                },

                _dataChannelIsReady: function() {
                    return this._dataChannel && this._dataChannel.readyState === "open";
                }
            };
        }, {
            callStates: function() {
                return [CallStates];
            }
        })
        .register("ba-video-call")
        .attachStringTable(Assets.strings)
        .addStrings({
            "call-ended": "Call ended",
            "connecting": "Connecting...",
            "connection-error": "There was an error while connecting, please click to try again."
        });
});