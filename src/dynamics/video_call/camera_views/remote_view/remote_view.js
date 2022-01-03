Scoped.define("module:VideoCall.Dynamics.RemoteView", [
    "module:VideoCall.Dynamics.BaseView"
], [

], function(BaseView, scoped) {
    return BaseView.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            template: inherited.template.replace("<video", "<%= template(dirname + '/remote_view_overlay.html') %><video"),

			attrs: {
				cssclass: "ba-call-remote-view"
			},

            create: function() {
				inherited.create.call(this);
            }
        };
    }).register("ba-remote-view");
});