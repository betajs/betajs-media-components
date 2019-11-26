Scoped.define("module:PictureInPicture", [
    "base:Class",
    "browser:Dom",
    "browser:Info"
], function(Class, Dom, Info, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            /**
             * @param stream  // Audio stream
             * @param {object} options // additional options like height and active element
             */
            constructor: function(stream, options) {

            },

            launch: function() {
                if (Info.isChrome()) {

                } else if (Info.isSafari()) {

                } else {
                    console.warn('Could not detect browser capability via picture-in-picture mode');
                }
            }
        };
    }, {
        /**
         * @param {HTMLVideoElement} videoElement
         * @return {boolean}
         */
        supported: function(videoElement) {
            if (Info.isChrome())
                return (('pictureInPictureEnabled' in document) || !document.pictureInPictureEnabled);

            if (Info.isSafari())
                return (videoElement.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === "function");

            return false;
        }
    });
});