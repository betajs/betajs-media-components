Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
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
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video."
    });
});