const { container } = require('../index.js');

module.exports = (attrs) => {
    const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
        element: container,
        attrs: attrs || {}
    });

    player.__video = player.__video || document.createElement("video");
    player.activate();
    return player;
}
