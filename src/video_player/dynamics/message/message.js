Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "base:Dynamics.Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.message,
			
			attrs: {
				"css": "ba-videoplayer",
				"message": 'Foobar'
			},
			
			functions: {
				
				click: function () {
					alert("click");
				}
				
			}
			
		};
	}).register("ba-videoplayer-message");
});