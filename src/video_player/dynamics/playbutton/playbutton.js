Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "base:Dynamics.Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.playbutton,
			
			attrs: {
				"css": "ba-videoplayer"
			},
			
			functions: {
				
				play: function () {
					alert("play");
				}
				
			}
			
		};
	}).register("ba-videoplayer-playbutton");
});