Scoped.define("module:VideoPlayer.Dynamics.Tooltip", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Time",
    "base:Async",
    "base:Timers",
    "module:Assets"
], function(Class, Objs, Time, Async, Timers, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_tooltip.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player"
                },

                computed: {
                    "tooltipleftprogressstyle:disappearafter": function(left) {
                        var widthPercentage = Number((left / this.get("disappearafterinitial")).toFixed(2)) * 100;
                        return {
                            width: widthPercentage + "%"
                        };
                    }
                },

                events: {
                    "change:tooltiptext": function(message) {
                        // If no message or disappear after seconds is set to -1, don't hide automatically
                        if (!message || this.get("disappearafter") < 0) return;
                        var progressbarSteps = 100;
                        this._timer = this.auto_destroy(new Timers.Timer({
                            context: this,
                            fire: function() {
                                if (this.get("hovered")) return;
                                this.set("disappearafter", this.get("disappearafter") - progressbarSteps);
                                if (this.get("disappearafter") <= 0) {
                                    this.destroy();
                                }
                            },
                            delay: progressbarSteps,
                            start: true,
                            destroy_on_stop: true
                        }));
                    }
                },

                functions: {
                    close: function() {
                        this.destroy();
                    },
                    mouseover: function() {
                        if (this.get("pauseonhover")) this.set("hovered", true);
                    },
                    mouseout: function() {
                        this.set("hovered", false);
                    }
                },

                create: function() {
                    var tooltipCollection = this.get("tooltip");
                    if (tooltipCollection && typeof tooltipCollection.get === "function") {
                        this.set("closeable", tooltipCollection.get("closeable") || false);
                        this.set("position", tooltipCollection.get("position") || 'top-right');
                        this.set("disappearafterinitial", (tooltipCollection.get("disappearafterseconds") || 2) * 1000);
                        this.set("disappearafter", this.get("disappearafterinitial"));
                        this.set("showonhover", tooltipCollection.get("showonhover") || false);
                        this.set("showprogressbar", tooltipCollection.get("showprogressbar") || false);
                        this.set("pauseonhover", tooltipCollection.get("pauseonhover") || true);

                        // NOTE: this line should be the last as, it will trigger change:tooltiptext event
                        this.set("tooltiptext", this.get("tooltip").get("tooltiptext"));
                    }
                },

                destroy: function() {
                    this.set("tooltiptext", null);
                    this.parent().hideTooltip(this.get("position"), this.get("id"));
                    if (!this.destroyed()) inherited.destroy.call(this);
                }
            };
        })
        .register("ba-videoplayer-tooltip")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/video_player_tooltip.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Tooltip",
            "hover-to-pause-tooltip-close": "Hold mouse on, to pause tooltip closing"
        });
});
