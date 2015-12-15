/*!
betajs-media-components - v0.0.5 - 2015-12-14
Copyright (c) Oliver Friedmann
MIT Software License.
*/
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