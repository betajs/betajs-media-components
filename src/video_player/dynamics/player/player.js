Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "base:Dynamics.Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				"css": "ba-videoplayer"
			}
			
		};
	}).register("ba-videoplayer");
});