Scoped.define("module:VideoCall.Dynamics.LocalView", [
    "module:Assets",
    "module:VideoCall.Dynamics.BaseView"
], [

], function(Assets, BaseView, scoped) {
    return BaseView.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                template: inherited.template.replace("<video", "<%= template(dirname + '/local_view_overlay.html') %><video muted"),

				attrs: {
					cssclass: "ba-call-local-view"
				},

                channels: {
                    "errors:local_camera_error": function() {
                        this.set("error", this.string("local-camera-connection-error"));
                    }
                },

                functions: {
                    retry: function() {
                        this.set("error", "");
                        this.channel("local_camera").trigger("retry");
                    }
                }
            };
        })
        .register("ba-local-view")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/local_view_overlay.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "local-camera-connection-error": "There was an error when connecting to local camera. Click to try again."
        });
});