Scoped.define("module:Common.Dynamics.CircleProgress", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Async",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Events",
    "module:Assets"
], [

], function(Class, Objs, Async, Timer, Dom, DomEvents, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {

            return {

                construct: function() {
                    inherited.constructor.call(this);
                },

                template: "<%= template(dirname + '/circle-progress.html') %>",

                attrs: {
                    "css": "ba-common",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "cssprogressbar": "ba-progressbar",
                    "timeout": 5000,
                    "interval": 200,
                    "autostart": false,
                    "progresstext": null,
                    "stepelements": [],
                    "size": 45,
                    "showpercentage": false,
                    "progresscolor": "#FF9933",
                    "progresscachedcolor": "transparent"
                },

                types: {
                    "css": "string",
                    "csscommon": "string",
                    "cssplayer": "string",
                    "cssprogressbar": "string",
                    "timeout": "int",
                    "interval": "int",
                    "autostart": "boolean",
                    "progresstext": "string",
                    "stepelements": "array",
                    "size": "int",
                    "showpercentage": "boolean",
                    "progresscolor": "string",
                    "progresscachedcolor": "string",
                },

                computed: {
                    "itemStyles:size": function(size) {
                        size = parseInt(size) + "px";
                        return {
                            width: size,
                            height: size
                        }
                    },

                    "circleLeft:progress": function(progress) {
                        return {
                            strokeDashoffset: (progress * -1)
                        }
                    }
                },

                /**
                 * Initial Function After Render
                 */
                create: function() {
                    this.set("countdown", Number(parseFloat(this.get("timeout") > 1000 ? this.get("timeout") / 1000 : this.get("timeout")).toFixed(2)));
                    this.set("timeout", this.get("countdown"));
                },

                _afterActivate: function() {
                    this.init();
                    if (this.get("autostart")) this.start();
                },

                functions: {
                    start: function() {
                        this.call("start");
                    },
                    pause: function() {
                        this.call("pause");
                    },
                    resume: function() {
                        this.call("resume");
                    },
                    stop: function() {
                        this.call("stop");
                    },
                    restart: function() {
                        this.call("restart");
                    }
                },

                init: function() {
                    this.set("counter", 0);
                    this.set("progress", 0.00);
                    this.set("passedseconds", 0);

                    this.progressTimer = this._auto_destroy(new Timer({
                        delay: this.get("interval"),
                        fire: function() {
                            if (this.get("paused")) return;
                            if (Math.floor(this.get("counter") * this.get("interval") / 1000) >= this.get("passedseconds") + 1) {
                                if (this.get("countdown") - 1 <= 0) this.stop();
                                this.set("countdown", this.get("countdown") - 1);
                                this.set("passedseconds", this.get("passedseconds") + 1);
                            }

                            const passed = (this.get("counter") * this.get("interval") / 1000) / this.get("timeout");
                            this.set("progress", passed * 100);

                            if (this.get("progress") >= 100) this.stop();
                            this.set("counter", this.get("counter") + 1);
                        }.bind(this),
                        context: this,
                        start: this.get("autostart"),
                        immediate: this.get("autostart"),
                        destroy_on_stop: true
                    }));
                },

                start: function() {
                    this.progressTimer.start();
                },
                pause: function() {
                    this.progressTimer.pause();
                },
                resume: function() {
                    this.progressTimer.resume();
                },
                stop: function() {
                    if (this.progressTimer && !this.__stopped) {
                        this.progressTimer.stop();
                        this.__stopped = true
                    }
                },
                restart: function() {
                    this.stop();
                    this.init();
                }
            };
        })
        .register("ba-circle-progress")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/circle-progress.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "fullscreen-video": "Enter fullscreen"
        });
});