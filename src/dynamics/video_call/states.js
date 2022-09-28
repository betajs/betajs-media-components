Scoped.define("module:VideoCall.Dynamics.CallStates.State", [
    "base:States.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _start: function() {
            this.dyn = this.host.dynamic;
            this._started();
        }
    });
});

Scoped.define("module:VideoCall.Dynamics.CallStates.Initial", [
    "module:VideoCall.Dynamics.CallStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn._getUserMedia({
                audio: true,
                video: true
            });

            if (this.dyn.get("skipinitial")) {
                this.next("Connecting");
                return;
            }

            this.dyn.channel("call").on("connect", function() {
                this.next("Connecting");
            }.bind(this));
            this.dyn.set("lobby_active", true);
        },

        _end: function() {
            this.dyn.set("lobby_active", false);
        }
    });
});

Scoped.define("module:VideoCall.Dynamics.CallStates.Connecting", [
    "module:VideoCall.Dynamics.CallStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn.set("message", this.dyn.string("connecting"));
            this.dyn.trigger("connecting");
            this.dyn._connect().success(function() {
                this.dyn.set("connected", true);
                this.dyn.trigger("connected", this.dyn.get("call_data"));
                this.next("Active");
            }.bind(this)).error(function() {
                this.next("ConnectionFailed");
            }.bind(this));
        },

        _end: function() {
            this.dyn.set("message", "");
        }
    });
});

Scoped.define("module:VideoCall.Dynamics.CallStates.ConnectionFailed", [
    "module:VideoCall.Dynamics.CallStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {
        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("connection-error"));
            this.dyn.activeElement().addEventListener("click", function() {
                this.next("Connecting");
            }.bind(this), {
                once: true
            });
        },

        _end: function() {
            this.dyn.set("message", "");
        }
    });
});

Scoped.define("module:VideoCall.Dynamics.CallStates.Active", [
    "module:VideoCall.Dynamics.CallStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {
        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("call_active", true);
            this.dyn.on("ended", function() {
                this.next("Ended");
            }.bind(this));
        },

        _end: function() {
            this.dyn.set("call_active", false);
        }
    });
});

Scoped.define("module:VideoCall.Dynamics.CallStates.Ended", [
    "module:VideoCall.Dynamics.CallStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {
        dynamics: ["loader"],

        _started: function() {
            this.dyn.get("local_stream").getVideoTracks()[0].stop();
            this.dyn.set("message", this.dyn.string("call-ended"));
        },

        _end: function() {
            this.set("message", "");
        }
    });
});