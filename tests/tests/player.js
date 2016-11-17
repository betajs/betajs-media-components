mytest("native video and poster", function () {
	$("#visible-fixture").html('<br/><ba-videoplayer ba-poster="' + testasset('movie.png') + '" ba-source="' + testasset('movie.mp4') + '"></ba-videoplayer>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#visible-fixture").get(0)
	});
	var player = dyn.scope(">[tagname='ba-videoplayer']").materialize(true);
	player.on("playing", function () {
		ok(true);
		start();
	});
	player.on("error", function () {
		ok(false);
		start();
	});
	player.on("postererror", function () {
		ok(false);
		start();
	});
	player.host.on("start:PosterReady", function () {
		QUnit.launcher(function () {
			BetaJS.Browser.Dom.triggerDomEvent($("#visible-fixture .ba-videoplayer-playbutton-button").parent().get(0), "click");
		}, this);
	});
}, {native_video: true, selenium_if_mobile: true});

mytest("fallback video and poster", function () {
	$("#visible-fixture").html('<br/><ba-videoplayer ba-poster="' + testasset('movie.png') + '" ba-source="' + testasset('movie.flv') + '"></ba-videoplayer>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#visible-fixture").get(0)
	});
	var player = dyn.scope(">[tagname='ba-videoplayer']").materialize(true);
	player.on("playing", function () {
		ok(true);
		setTimeout(function () {
			$("#visible-fixture").html("");
		}, 10);
		start();
	});
	player.on("error", function () {
		ok(false);
		start();
	});
	player.on("postererror", function () {
		ok(false);
		start();
	});
	player.host.on("start:PosterReady", function () {
		QUnit.launcher(function () {
			BetaJS.Browser.Dom.triggerDomEvent($("#visible-fixture .ba-videoplayer-playbutton-button").parent().get(0), "click");
		}, this);
	});
}, {flash: true});
