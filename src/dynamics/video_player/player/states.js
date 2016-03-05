Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"loader": false,
				"message": false,
				"playbutton": false,
				"controlbar": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this._started();
		},
		
		_started: function () {},
		
		play: function () {
			this.dyn.set("autoplay", true);
		}
	
	}]);
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("video-error"));
		}

	});
});






Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader"],

		_started: function () {
			if (this.dyn.get("ready"))
				this.next("LoadPlayer");
			else {
				this.listenOn(this.dyn, "change:ready", function () {
					this.next("LoadPlayer");
				});
			}
		}
	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
			
		dynamics: ["loader"],

		_started: function () {
			this.listenOn(this.dyn, "error:attach", function () {
				this.next("LoadError");
			}, this);
			this.listenOn(this.dyn, "error:poster", function () {
				if (!this.dyn.get("states").poster_error.ignore)
					this.next("PosterError");
			}, this);
			this.listenOn(this.dyn, "attached", function () {
				this.next("PosterReady");
			}, this);
			this.dyn.reattachVideo();
		}
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["playbutton"],

		_started: function () {
			this.listenOn(this.dyn, "error:poster", function () {
				if (!this.dyn.get("states").poster_error.ignore)
					this.next("PosterError");
			}, this);
			if (this.dyn.get("autoplay"))
				this.play();
		},
		
		play: function () {
			this.next("LoadVideo");
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		
		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State",
	"base:Async"
], function (State, Async, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],

		_started: function () {
			this.listenOn(this.dyn, "error:video", function () {
				this.next("ErrorVideo");
			}, this);
			this.listenOn(this.dyn, "playing", function () {
				this.next("PlayVideo");
			}, this);
			this.dyn.player.play();
		}
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadVideo");
			}, this);
		}
	
	});
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["controlbar"],

		_started: function () {
			this.listenOn(this.dyn, "ended", function () {
				this.next("PosterReady");
			}, this);
			this.listenOn(this.dyn, "change:buffering", function () {
				this.dyn.set("loader_active", this.dyn.get("buffering"));
			}, this);
			this.listenOn(this.dyn, "error:video", function () {
				this.next("ErrorVideo");
			}, this);
		},
		
		play: function () {
			if (!this.dyn.get("playing"))
				this.dyn.player.play();
		}

	});
});

