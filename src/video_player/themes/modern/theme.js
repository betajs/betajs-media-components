(function () {

var Scoped = this.subScope();

Scoped.binding("module", "global:BetaJS.MediaComponents");

Scoped.extend("module:Assets.themes", function () {
	return {
		modern: {
			css: "ba-videoplayer-theme-modern"
		}
	};
});

}).call(Scoped);