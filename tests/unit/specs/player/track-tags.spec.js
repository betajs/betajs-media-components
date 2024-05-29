const { BetaJS, QUnit: { test } } = require('../../index');
const initPlayer = require("../../utils/initPlayer");

const { TrackTags } = BetaJS.MediaComponents;

const attrs = {
    width: 200,
    source: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    poster: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg`
};

const transcript = {
    "words": [
        "The Peach Open Movie Project presents One,",
        "big rabbit Three rodents",
        "And one giant payback Get ready Big",
        "Buck\n Bunny Coming soon."
    ],
    "times": [
        {
            "start": 0, "end": 450
        },
        {
            "start": 1050, "end": 2100
        },
        {
            "start": 4400, "end": 5800
        },
        {
            "start": 8400, "end": 8600
        }
    ]
}

// Will test the initial state of the player // asyncTest
test(`generate vtt file from transcript object`, (assert) => {
    const validationRegex = new RegExp(/^(WEBVTT|$)|(\.\d{3}\s-->\s\d\d:\d\d:\d\d\.)/g);
    const vttContent = TrackTags.generateVTTFromObject(transcript);

    assert.equal(vttContent.match(validationRegex)[0], 'WEBVTT', "First line of the VTT file is WEBVTT");
    assert.equal(vttContent.match(validationRegex)[1], '.000 --> 00:00:00.', "First start time should be from .000");
    assert.true(vttContent.match(validationRegex).length >= 3, "New generated VTT file is valid, and has more 3 subtitles, as expected");

    assert.throws(() => {
        TrackTags.generateVTTFromObject({})
    }, 'As expected has to show error');

    const wrongVttContent = TrackTags.generateVTTFromObject({words: [], times: [{ start: 0, end:0 }]});
    assert.equal(wrongVttContent.match(validationRegex)[0], 'WEBVTT', "First line of the VTT file is WEBVTT");
    assert.notEqual(wrongVttContent.match(validationRegex)[1], '.000 --> 00:00:00.', "First start time should be from .000");
});
