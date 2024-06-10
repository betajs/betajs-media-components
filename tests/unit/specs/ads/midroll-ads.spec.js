const { test } = require("qunit");
const initPlayer = require("../../utils/initPlayer");

const interVal = 7;
const playerDuration = 60;

const player = initPlayer({
	adsposition: `mid[${interVal}*]`,
	duration: playerDuration
});

const reset = () => {
	player.set("midrollads", []);
	player.initMidRollAds();
	// set duration after calling above function
	player.set("duration", player.get("duration") + 10);
}

test("test midroll ads positions count", assert => {
	player.initMidRollAds();
	player.set("duration", playerDuration);
	assert.equal(player.get("midrollads").length, Math.floor(playerDuration / interVal), "midroll ads count should be equal to the midroll ads positions count");
	assert.equal(player.get("midrollads")[0]?.position, interVal, "first midroll ad should be at the first midroll position");

	// Will check only mid
	player.set(`adsposition`, 'pre,mid');
	reset();
	assert.notEqual(player.get("midrollads")[0]?.poster, Math.floor(playerDuration / 2), "mid-rolls should be in the duration middle");
});
