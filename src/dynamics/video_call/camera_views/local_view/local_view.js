Scoped.define("module:VideoCall.Dynamics.LocalView", [
    "module:VideoCall.Dynamics.BaseView"
], [

], function(BaseView, scoped) {
    return BaseView.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: inherited.template.replace("<video", "<%= template(dirname + '/local_view_overlay.html') %><video muted"),

				attrs: {
					cssclass: "ba-call-local-view"
				},

                create: function() {
					inherited.create.call(this);
                    if (!this.get("stream")) this.call("init_camera");
                },

                functions: {
                    init_camera: function() {
                        navigator.mediaDevices.getUserMedia({
                            audio: true,
                            video: true
                        }).then(function(stream) {
                            this.set("stream", stream);
                        }.bind(this))["catch"](function() {
                            console.log("error", arguments);
                        });
                    }
                }
            };
        })
        .register("ba-local-view");
});