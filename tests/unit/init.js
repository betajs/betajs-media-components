const { JSDOM } = require("jsdom-recent");
const ResizeObserver = require('resize-observer-polyfill');

const dom = new JSDOM('<!DOCTYPE html>');
const { window } = dom;
const document = window.document;


const Scoped = require('../../node_modules/betajs-scoped/dist/scoped.js');
window.Scoped = Scoped;

global.window = window;
global.document = window.document;
global.ResizeObserver = ResizeObserver;

const BetaJS = require('../../node_modules/betajs/dist/beta-noscoped.js');
const components = [
    '../../node_modules/betajs-shims/dist/betajs-shims.js',
    '../../node_modules/betajs-browser/dist/betajs-browser-noscoped.js',
    '../../node_modules/betajs-media/dist/betajs-media-noscoped.js',
    '../../node_modules/betajs-dynamics/dist/betajs-dynamics-noscoped.js',
    '../../dist/betajs-media-components-noscoped.js',
];

let container = document.createElement('div');
document.body.appendChild(container);
components.forEach((component) => {
    require(component);
});

// Below is the polyfill for HTMLMediaElement, as it's not available in JSDOM
// this will prevent console the error when running the tests.
// But should be careful when using this polyfill, as it's not the real implementation
// and may cause the test to pass even if the real implementation is not working.
// We have pass these test on real browser via playwright to make sure it's working correctly
// if these are really needed we can implement: https://github.com/jsdom/jsdom/issues/2155#issuecomment-581862425
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

const init = (attrs) => {
    const player = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
        element: container,
        attrs: attrs || {}
    });
    player.activate();
    return player;
}

module.exports = {
    BetaJS,
    initPlayer: init,
};
