/* This probably requires some Selenium-type interaction */
// Will test the initial state of the player // asyncTest

const interVal = 7;
const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
	element: $("#visible-fixture").get(0),
	attrs: {
		adsposition: `mid[${interVal}*]`,
		minadintervals: 5,
	}
});

QUnit.test("test midroll ads positions count", assert => {
	const playerDuration = 60;
	player.initMidRollAds();
	player.set("duration", playerDuration);
	assert.gte(player.get("midrollads").length, Math.floor(playerDuration / interVal), "midroll ads count should be greater than or equal to the midroll ads positions count");
	assert.eq(player.get("midrollads")[0], interVal, "first midroll ad should be at the first midroll position");
});
