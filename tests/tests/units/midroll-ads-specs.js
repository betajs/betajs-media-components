/* This probably requires some Selenium-type interaction */
// Will test the initial state of the player // asyncTest

const interVal = 7;
const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
	element: $("#visible-fixture").get(0),
	attrs: {
		adsposition: `mid[${interVal}*]`,
	}
});

const reset = () => {
	player.set("midrollads", []);
	player.initMidRollAds();
	// set duration after calling above function
	player.set("duration", player.get("duration") + 10);
}

QUnit.test("test midroll ads positions count", assert => {
	const playerDuration = 60;
	player.initMidRollAds();
	player.set("duration", playerDuration);
	assert.equal(player.get("midrollads").length, Math.floor(playerDuration / interVal), "midroll ads count should be equal to the midroll ads positions count");
	assert.equal(player.get("midrollads")[0]?.position, interVal, "first midroll ad should be at the first midroll position");

	// Will check only mid
	player.set(`adsposition`, 'pre,mid');
	reset();
	assert.notEqual(player.get("midrollads")[0]?.poster, Math.floor(playerDuration / 2), "mid-rolls should be in the duration middle");
});
