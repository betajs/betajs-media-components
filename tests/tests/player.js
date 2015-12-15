var testasset = function (s) {
	return BetaJS.Strings.splitLast(document.location.href, "/").head + "/tests/" + s;
};

test("native video and poster", function () {
	$("#qunit-fixture").html('<ba-videoplayer ba-poster="' + testasset('movie.png') + '" ba-source="' + testasset('movie.mp4') + '"></ba-videoplayer>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#qunit-fixture").get(0)
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
	stop();
	$("#qunit-fixture .ba-videoplayer-playbutton-button").click();
});

test("fallback video and poster", function () {
	$("#qunit-fixture").html('<ba-videoplayer ba-poster="' + testasset('movie.png') + '" ba-source="' + testasset('movie.flv') + '"></ba-videoplayer>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#qunit-fixture").get(0)
	});
	var player = dyn.scope(">[tagname='ba-videoplayer']").materialize(true);
	player.on("playing", function () {
		ok(true);
		start();
		// Need to fix this.
		dyn.destroy();
	});
	player.on("error", function () {
		ok(false);
		start();
	});
	player.on("postererror", function () {
		ok(false);
		start();
	});
	stop();
	$("#qunit-fixture .ba-videoplayer-playbutton-button").click();
});

test("native no video but poster", function () {
	$("#qunit-fixture").html('<ba-videoplayer ba-poster="' + testasset('movie.png') + '" ba-source="' + testasset('error.mp4') + '"></ba-videoplayer>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#qunit-fixture").get(0)
	});
	var player = dyn.scope(">[tagname='ba-videoplayer']").materialize(true);
	player.on("playing", function () {
		ok(false);
		start();
	});
	player.on("error", function () {
		ok(true);
		start();
	});
	player.on("postererror", function () {
		ok(false);
		start();
	});
	stop();
	$("#qunit-fixture .ba-videoplayer-playbutton-button").click();
});
