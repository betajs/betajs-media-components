/*!
betajs-media-components - v0.0.57 - 2017-06-05
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("browser", "global:BetaJS.Browser");
Scoped.binding("module", "global:BetaJS.MediaComponents");

Scoped.extend("module:Assets.playerthemes", [
    "browser:Info"
], function(Info) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    var tmplcontrolbar = "<div data-selector=\"video-title-block\" class=\"{{css}}-video-title-container {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\" ba-if=\"{{title}}\">\n\t<p class=\"{{css}}-video-title\">\n\t\t{{title}}\n\t</p>\n</div>\n\n<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">\n        <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">\n            <div class=\"{{css}}-button-inner\">\n                {{string('submit-video')}}\n            </div>\n        </div>\n       <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">\n           <div class=\"{{css}}-button-inner\">\n               <i class=\"{{css}}-icon-ccw\"></i>\n           </div>\n       </div>\n\t<div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">\n\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t<i class=\"{{css}}-icon-play\"></i>\n\t\t</div>\n\t</div>\n\t<div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container {{disablepause ? css + '-disabled' : ''}}\"\n\t\t ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{disablepause ? string('pause-video-disabled') : string('pause-video')}}\">\n\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t<i class=\"{{css}}-icon-pause\"></i>\n\t\t</div>\n\t</div>\n\t<div class=\"{{css}}-time-container\">\n\t\t<div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}/{{formatTime(duration || position)}}</div>\n\t</div>\n\n\t<div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"\n\t\tba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\" >\n\t\t<div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">\n\t\t\t<i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>\n\t\t</div>\n\t</div>\n\n\n\t<div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">\n\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t<span class=\"{{css}}-button-text\">{{currentstream_label}}</span>\n\t\t</div>\n\t</div>\n\t<div class=\"{{css}}-volumebar\">\n\t\t<div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"\n\t\t        onmousedown=\"{{startUpdateVolume(domEvent)}}\"\n                onmouseup=\"{{stopUpdateVolume(domEvent)}}\"\n                onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"\n                onmousemove=\"{{progressUpdateVolume(domEvent)}}\">\n\t\t\t<div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>\n\t\t</div>\n\t</div>\n\t<div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container {{css}}-volume-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">\n\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t<i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>\n\t\t</div>\n\t</div>\n\t<div class=\"{{css}}-progressbar {{disableseeking ? css + '-disabled' : ''}}\">\n\t\t<div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar-inner\"\n\t\t     onmousedown=\"{{startUpdatePosition(domEvent)}}\"\n\t\t     onmouseup=\"{{stopUpdatePosition(domEvent)}}\"\n\t\t     onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"\n\t\t     onmousemove=\"{{progressUpdatePosition(domEvent)}}\">\n\t\t<div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>\n\t\t<div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>\n\t</div>\n</div>\n";
    return {
        "modern": {
            css: "ba-videoplayer-theme-modern",
            tmplcontrolbar: tmplcontrolbar,
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});
Scoped.extend("module:Assets.recorderthemes", [], function() {
    var tmplchooser = "<div class=\"{{css}}-chooser-container\">\n\n\t<div class=\"{{css}}-chooser-button-container\">\n\n\t\t<div class=\"{{css}}-chooser-icon-container\">\n\t\t\t<i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>\n\t\t</div>\n\t\t<div>\n\t\t\t<div data-selector=\"chooser-primary-button\" class=\"{{css}}-chooser-primary-button\"\n\t\t\t     ba-click=\"primary()\"\n\t\t\t     ba-if=\"{{has_primary}}\">\n\t\t\t\t<input data-selector=\"file-input-opt1\" ba-if=\"{{enable_primary_select && primary_select_capture}}\"\n\t\t\t\t       type=\"file\"\n\t\t\t\t       class=\"{{css}}-chooser-file\"\n\t\t\t\t       style=\"height:100\"\n\t\t\t\t       onchange=\"{{primary_select(domEvent)}}\"\n\t\t\t\t       accept=\"{{primary_accept_string}}\"\n\t\t\t\t       capture />\n\t\t\t\t<input data-selector=\"file-input-opt2\" ba-if=\"{{enable_primary_select && !primary_select_capture}}\"\n\t\t\t\t       type=\"file\"\n\t\t\t\t       class=\"{{css}}-chooser-file\"\n\t\t\t\t       style=\"height:100\"\n\t\t\t\t       onchange=\"{{primary_select(domEvent)}}\"\n\t\t\t\t       accept=\"{{primary_accept_string}}\" />\n\t\t\t\t<span>\n\t\t\t\t\t{{primary_label}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t\t<div>\n\t\t\t<div data-selector=\"chooser-secondary-button\" class=\"{{css}}-chooser-secondary-button\"\n\t\t\t     ba-click=\"secondary()\"\n\t\t\t     ba-if=\"{{has_secondary}}\">\n\t\t\t\t<input data-selector=\"file-input-secondary-opt1\" ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"\n\t\t\t\t       type=\"file\"\n\t\t\t\t       class=\"{{css}}-chooser-file\"\n\t\t\t\t       style=\"height:100\"\n\t\t\t\t       onchange=\"{{secondary_select(domEvent)}}\"\n\t\t\t\t       accept=\"{{secondary_accept_string}}\" />\n\t\t\t\t<input data-selector=\"file-input-secondary-opt2\" ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"\n\t\t\t\t       type=\"file\"\n\t\t\t\t       class=\"{{css}}-chooser-file\"\n\t\t\t\t       style=\"height:100\"\n\t\t\t\t       onchange=\"{{secondary_select(domEvent)}}\"\n\t\t\t\t       accept=\"{{secondary_accept_string}}\" />\n\t\t\t\t<span>\n\t\t\t\t\t{{secondary_label}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";
    return {
        "modern": {
            css: "ba-videorecorder-theme-modern",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmplchooser: tmplchooser
        }
    };
});
}).call(Scoped);