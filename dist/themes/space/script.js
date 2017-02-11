/*!
betajs-media-components - v0.0.43 - 2017-02-11
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("browser", "global:BetaJS.Browser");
Scoped.binding("module", "global:BetaJS.MediaComponents");

Scoped.extend('module:Templates', function () {
return {"space-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">       <div class='{{css}}-controlbar-header'>         <div class=\"{{css}}-title\" ba-if=\"{{title}}\">             <p>{{title}}</p>         </div>          <div class=\"{{css}}-volumebar\">             <div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"                  onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">                 <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>             </div>         </div>          <div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>          <div data-selector=\"button-icon-cog\" class=\"{{css}}-rightbutton-container {{css}}-share-button-container\" ba-click=\"share_media()\" title=\"{{string('share-media')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-share\"></i>             </div>         </div>     </div>       <div class=\"{{css}}-controlbar-footer\">          <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">            <div class=\"{{css}}-button-inner\">                {{string('submit-video')}}            </div>         </div>          <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>         </div>          <div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-play\"></i>            </div>         </div>          <div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-pause\"></i>            </div>         </div>          <div class=\"{{css}}-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>         </div>          <div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"              ba-if=\"{{!nofullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\" >             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-{{fullscreened ? 'resize-minimize' : 'full-screen'}}\"></i>             </div>         </div>          <div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">            <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>            </div>         </div>          <div class=\"{{css}}-time-container {{css}}-rightbutton-container {{css}}-right-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>         </div>          <div class=\"{{css}}-progressbar\">            <div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"                 onmousedown=\"{{startUpdatePosition(domEvent)}}\"                 onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                 onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                 onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                 <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                    <div class=\"{{css}}-progressbar-button\"></div>                </div>            </div>         </div>      </div>  </div> ","space-video_player_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div data-selector=\"message-block\" class=\"{{css}}-first-inner-message-container\">         <div class=\"{{css}}-second-inner-message-container\">             <div class=\"{{css}}-third-inner-message-container\">                 <div class=\"{{css}}-fourth-inner-message-container\">                     <div class='{{css}}-message-message'>                         {{message || \"\"}}                     </div>                 </div>             </div>         </div>     </div> </div> ","space-video_player_playbutton":" <div data-selector=\"play-button\" class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div>  <div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">  <div class=\"{{css}}-rerecord-frontbar\">         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">             <div data-selector=\"player-submit-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">          <div data-selector=\"player-rerecord-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">           {{string('rerecord')}}          </div>         </div>  </div> </div> "};
});
Scoped.extend("module:Assets.playerthemes", [
    "module:Templates",
    "browser:Info"
], function (Templates, Info) {
	var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
	return {
		"space": {
			css: "ba-videoplayer-space-theme",
			csstheme: "ba-videoplayer-space-theme",
			tmplcontrolbar: Templates["space-video_player_controlbar"],
      tmplplaybutton: Templates["space-video_player_playbutton"],
      tmplmessage: Templates["space-video_player_message"],
			cssloader: ie8 ? "ba-videoplayer" : "",
			cssmessage: "ba-videoplayer",
			cssplaybutton: ie8 ? "ba-videoplayer" : ""
		}
	};
});

Scoped.extend("module:Assets.recorderthemes", [
    "module:Templates"
], function (Templates) {
	return {
		"space": {
			css: "ba-videorecorder-theme-space",
			cssmessage: "ba-videorecorder",
			cssloader: "ba-videorecorder",
			tmplchooser: Templates["space-video_recorder_chooser"],
      tmpltopmessage: Templates["space-video_recorder_topmessage"],
      tmplcontrolbar: Templates["space-video_recorder_controlbar"],
      tmplimagegallery: Templates["space-recorder_imagegallery"],
			tmplloader: Templates["space-video_recorder_loader"],
      tmplmessage: Templates["space-video_recorder_message"]
		}
	};
});

}).call(Scoped);