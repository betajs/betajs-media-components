Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_topmessage,
			
			attrs: {
				"css": "ba-videoplayer",
				"topmessage": ''
			}
			
		};
	}).register("ba-videoplayer-topmessage");
});
