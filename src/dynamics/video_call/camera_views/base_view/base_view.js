Scoped.define("module:VideoCall.Dynamics.BaseView", [
    "dynamics:Dynamic"
], [

], function(Dynamic, scoped) {
    return Dynamic.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: "<%= template(dirname + '/base_view.html') %>",

				attrs: {
					cssclass: "ba-call-camera-view"
				},

                events: {
                    "change:stream": function(stream) {
						if (!stream || !this.video) return;
                        this.video.srcObject = stream;
						this.video.play();
                    }
                },

                create: function() {
                    this.video = this.activeElement().querySelector("video");
					if (this.get("stream")) {
						this.video.srcObject = this.get("stream");
						this.video.play();
					}
                }
            };
        })
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/base_view.html') %>*/
        });
});