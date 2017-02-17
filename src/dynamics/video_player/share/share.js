Scoped.define("module:VideoPlayer.Dynamics.Share", [
  "dynamics:Dynamic",
  "module:Templates",
  "module:Assets"
], function(Class, Templates, Assets, scoped) {
  return Class.extend({scoped: scoped}, function(inherited) {
    return {
      template: Templates.video_player_share,

      functions: {

        share_media: function ( social, url ) {
          switch(social) {
            case 'fb':
              window.open('https://facebook.com/sharer/sharer.php?u=' + url, 'pop', 'width=600 height=400' );
              break;
            case 'twitter':
              window.open('https://twitter.com/home?status=' + url, 'pop', 'width=600 height=400');
              break;
            case 'gplus':
              window.open('https://plus.google.com/share?url=' + url, 'pop', 'width=600 height=400');
              break;
            default:
              break;
          }
        },

        animate_to_left: function ( distance ) {
          var element = document.querySelector('div[css$=-share-action-container]');
          var position = -45;

          function frame() {

            position++; // update parameters

            element.style.right = position + 'px'; // show frame

            if (position == distance)  // check finish condition
              clearInterval(id)
          }

          var id = setInterval(frame, 25); // draw every 10ms
        }

      },

      attrs: {
        "css": "ba-videoplayer"
      }
    }
  }).register("ba-videoplayer-share")
    .attachStringTable(Assets.strings)
    .addStrings({
      "share": "Share video"
    });
});