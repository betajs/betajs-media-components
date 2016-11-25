/*!
betajs-media-components - v0.0.39 - 2016-11-25
Copyright (c) Ziggeo,Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.MediaComponents');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('browser', 'global:BetaJS.Browser');
Scoped.binding('flash', 'global:BetaJS.Flash');
Scoped.binding('media', 'global:BetaJS.Media');
Scoped.binding('dynamics', 'global:BetaJS.Dynamics');
Scoped.binding('jquery', 'global:jQuery');
Scoped.define("module:", function () {
	return {
    "guid": "7a20804e-be62-4982-91c6-98eb096d2e70",
    "version": "60.1480100297208"
};
});
Scoped.assumeVersion('base:version', 502);
Scoped.assumeVersion('browser:version', 78);
Scoped.assumeVersion('flash:version', 33);
Scoped.assumeVersion('dynamics:version', 251);
Scoped.assumeVersion('media:version', 57);
Scoped.extend('module:Templates', function () {
return {"video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideonactivity ? (css + '-dashboard-hidden') : ''}}\">  <div class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}}\"       onmousedown=\"{{startUpdatePosition(domEvent)}}\"       onmouseup=\"{{stopUpdatePosition(domEvent)}}\"       onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"       onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">    <div class=\"{{css}}-progressbar-button\"></div>   </div>  </div>  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\"  ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-play\"></i>    </div>   </div>   <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>   </div>   <div class=\"{{css}}-time-container\">    <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>    <div class=\"{{css}}-time-sep\">/</div>    <div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{duration_formatted}}</div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css}}-icon-resize-full\"></i>    </div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">    <div class=\"{{css}}-button-inner\">     <span class=\"{{css}}-button-text\">{{currentstream_label}}</span>    </div>   </div>   <div class=\"{{css}}-volumebar\">    <div class=\"{{css}}-volumebar-inner\"         onmousedown=\"{{startUpdateVolume(domEvent)}}\"                  onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                  onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                  onmousemove=\"{{progressUpdateVolume(domEvent)}}\">     <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">         <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>     </div>    </div>   </div>   <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">    <div class=\"{{css}}-button-inner\">     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>    </div>   </div>  </div> </div> ","video_player_loader":" <div class=\"{{css}}-loader-container\">     <div class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">     </div> </div>","video_player_message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class='{{css}}-message-message'>         {{message}}     </div> </div>","playbutton":" <div class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div>  <div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">  <div class=\"{{css}}-rerecord-backbar\"></div>  <div class=\"{{css}}-rerecord-frontbar\">         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">             <div class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">          <div class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">           {{string('rerecord')}}          </div>         </div>  </div> </div> ","player":" <div     class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}\"     ba-on:mousemove=\"user_activity()\"     ba-on:mousedown=\"user_activity()\"     ba-on:touchstart=\"user_activity()\"     style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}\" >     <video class=\"{{css}}-video\" data-video=\"video\"></video>     <div class=\"{{css}}-overlay\" data-video=\"ad\" style=\"display:none\"></div>     <div class='{{css}}-overlay'>      <ba-{{dyncontrolbar}}       ba-css=\"{{csscontrolbar || css}}\"       ba-template=\"{{tmplcontrolbar}}\"       ba-show=\"{{controlbar_active}}\"       ba-playing=\"{{playing}}\"       ba-event:rerecord=\"rerecord\"       ba-event:submit=\"submit\"       ba-event:play=\"play\"       ba-event:pause=\"pause\"       ba-event:position=\"seek\"       ba-event:volume=\"set_volume\"       ba-event:fullscreen=\"toggle_fullscreen\"       ba-volume=\"{{volume}}\"       ba-duration=\"{{duration}}\"       ba-cached=\"{{buffered}}\"       ba-position=\"{{position}}\"       ba-activitydelta=\"{{activity_delta}}\"       ba-hideoninactivity=\"{{hideoninactivity}}\"       ba-rerecordable=\"{{rerecordable}}\"       ba-submittable=\"{{submittable}}\"       ba-streams=\"{{streams}}\"       ba-currentstream=\"{{=currentstream}}\"       ba-fullscreen=\"{{fullscreensupport && !nofullscreen}}\"       ba-source=\"{{source}}\"   ></ba-{{dyncontrolbar}}>      <ba-{{dynplaybutton}}       ba-css=\"{{cssplaybutton || css}}\"       ba-template=\"{{tmplplaybutton}}\"       ba-show=\"{{playbutton_active}}\"       ba-rerecordable=\"{{rerecordable}}\"       ba-submittable=\"{{submittable}}\"       ba-event:play=\"playbutton_click\"       ba-event:rerecord=\"rerecord\"       ba-event:submit=\"submit\"   ></ba-{{dynplaybutton}}>      <ba-{{dynloader}}       ba-css=\"{{cssloader || css}}\"       ba-template=\"{{tmplloader}}\"       ba-show=\"{{loader_active}}\"   ></ba-{{dynloader}}>      <ba-{{dynmessage}}       ba-css=\"{{cssmessage || css}}\"       ba-template=\"{{tmplmessage}}\"       ba-show=\"{{message_active}}\"       ba-message=\"{{message}}\"       ba-event:click=\"message_click\"   ></ba-{{dynmessage}}>    <ba-{{dyntopmessage}}       ba-css=\"{{csstopmessage || css}}\"       ba-template=\"{{tmpltopmessage}}\"       ba-show=\"{{topmessage}}\"       ba-topmessage=\"{{topmessage}}\"   ></ba-{{dyntopmessage}}>     </div> </div> ","video_player_topmessage":" <div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-background'>     </div>     <div class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div> ","video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">   <div>    <div class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div>","video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">  <div class=\"{{css}}-backbar\"></div>  <div class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">   <div class=\"{{css}}-settings-backbar\"></div>   <div class=\"{{css}}-settings-front\">    <ul ba-repeat=\"{{camera :: cameras}}\">     <li>      <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />      <span></span>      <label onclick=\"{{selectCamera(camera.id)}}\">       {{camera.label}}      </label>      </li>    </ul>    <hr ba-show=\"{{!noaudio}}\"/>    <ul ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{!noaudio}}\">     <li onclick=\"{{selectMicrophone(microphone.id)}}\">      <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />      <span></span>      <label>       {{microphone.label}}      </label>      </li>    </ul>   </div>  </div>  <div class=\"{{css}}-controlbar\">         <div class=\"{{css}}-leftbutton-container\" ba-show=\"{{settingsvisible}}\">             <div class=\"{{css}}-button-inner {{css}}-button-{{settingsopen ? 'selected' : 'unselected'}}\"                  onclick=\"{{settingsopen=!settingsopen}}\"                  onmouseenter=\"{{hover(string('settings'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-cog\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible}}\">             <div class=\"{{css}}-icon-inner\"                  onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{camerahealthy ? 'good' : 'bad' }}\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible && !noaudio}}\">             <div class=\"{{css}}-icon-inner\"                  onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>             </div>         </div>         <div class=\"{{css}}-lefticon-container\" ba-show=\"{{stopvisible && recordingindication}}\">             <div class=\"{{css}}-recording-indication\">             </div>         </div>         <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">          <div class=\"{{css}}-label-label\">           {{controlbarlabel}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">          <div class=\"{{css}}-button-primary\"                  onclick=\"{{record()}}\"                  onmouseenter=\"{{hover(string('record-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('record')}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">          <div class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                  <input type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{uploadCovershot(domEvent)}}\"            accept=\"{{covershot_accept_string}}\" />                  <span>            {{string('upload-covershot')}}           </span>          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{rerecordvisible}}\">          <div class=\"{{css}}-button-primary\"                  onclick=\"{{rerecord()}}\"                  onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('rerecord')}}          </div>         </div>         <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{stopvisible}}\">          <div class=\"{{css}}-button-primary\"                  onclick=\"{{stop()}}\"                  onmouseenter=\"{{hover(string('stop-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('stop')}}          </div>         </div>         <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">          <div class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">           {{string('skip')}}          </div>         </div>  </div> </div> ","video_recorder_imagegallery":"<div class=\"{{css}}-imagegallery-leftbutton\">  <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">   <i class=\"ba-videorecorder-icon-left-open\"></i>  </div> </div>   <div ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>      <div class=\"{{css}}-imagegallery-image\"           ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"           onclick=\"{{select(image)}}\">      </div> </div>   <div class=\"{{css}}-imagegallery-rightbutton\">  <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">   <i class=\"ba-videorecorder-icon-right-open\"></i>  </div> </div> ","video_recorder_loader":" <div class=\"{{css}}-loader-container\">     <div class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">  {{label}} </div>","video_recorder_message":" <div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class='{{css}}-message-message'>         {{message || \"\"}}     </div> </div>","recorder":" <div ba-show=\"{{!player_active}}\"      class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}\"      style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : 'width:100%;'}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : 'height:100%'}}\" >       <video class=\"{{css}}-video {{css}}-{{hasrecorder ? 'hasrecorder' : 'norecorder'}}\" data-video=\"video\"></video>     <div class='{{css}}-overlay' ba-show=\"{{!hideoverlay}}\" data-overlay=\"overlay\">   <ba-{{dynloader}}       ba-css=\"{{cssloader || css}}\"       ba-template=\"{{tmplloader}}\"       ba-show=\"{{loader_active}}\"       ba-tooltip=\"{{loadertooltip}}\"       ba-label=\"{{loaderlabel}}\"   ></ba-{{dynloader}}>      <ba-{{dynmessage}}       ba-css=\"{{cssmessage || css}}\"       ba-template=\"{{tmplmessage}}\"       ba-show=\"{{message_active}}\"       ba-message=\"{{message}}\"       ba-event:click=\"message_click\"   ></ba-{{dynmessage}}>    <ba-{{dyntopmessage}}       ba-css=\"{{csstopmessage || css}}\"       ba-template=\"{{tmpltopmessage}}\"       ba-show=\"{{topmessage_active && (topmessage || hovermessage)}}\"       ba-topmessage=\"{{hovermessage || topmessage}}\"   ></ba-{{dyntopmessage}}>      <ba-{{dynchooser}}       ba-css=\"{{csschooser || css}}\"       ba-template=\"{{tmplchooser}}\"       ba-show=\"{{chooser_active}}\"       ba-allowrecord=\"{{allowrecord}}\"       ba-allowupload=\"{{allowupload}}\"       ba-allowcustomupload=\"{{allowcustomupload}}\"       ba-primaryrecord=\"{{primaryrecord}}\"       ba-event:record=\"record_video\"       ba-event:upload=\"upload_video\"   ></ba-{{dynchooser}}>      <ba-{{dynimagegallery}}       ba-css=\"{{cssimagegallery || css}}\"       ba-template=\"{{tmplimagegallery}}\"       ba-if=\"{{imagegallery_active}}\"       ba-imagecount=\"{{gallerysnapshots}}\"       ba-imagenativewidth=\"{{recordingwidth}}\"       ba-imagenativeheight=\"{{recordingheight}}\"       ba-event:image-selected=\"select_image\"   ></ba-{{dynimagegallery}}>      <ba-{{dyncontrolbar}}       ba-css=\"{{csscontrolbar || css}}\"       ba-template=\"{{tmplcontrolbar}}\"       ba-show=\"{{controlbar_active}}\"       ba-cameras=\"{{cameras}}\"       ba-microphones=\"{{microphones}}\"       ba-noaudio=\"{{noaudio}}\"       ba-selectedcamera=\"{{selectedcamera || 0}}\"       ba-selectedmicrophone=\"{{selectedmicrophone || 0}}\"       ba-camerahealthy=\"{{camerahealthy}}\"       ba-microphonehealthy=\"{{microphonehealthy}}\"       ba-hovermessage=\"{{=hovermessage}}\"       ba-settingsvisible=\"{{settingsvisible}}\"       ba-recordvisible=\"{{recordvisible}}\"       ba-uploadcovershotvisible=\"{{uploadcovershotvisible}}\"       ba-rerecordvisible=\"{{rerecordvisible}}\"       ba-stopvisible=\"{{stopvisible}}\"       ba-skipvisible=\"{{skipvisible}}\"       ba-controlbarlabel=\"{{controlbarlabel}}\"       ba-event:select-camera=\"select_camera\"       ba-event:select-microphone=\"select_microphone\"       ba-event:invoke-record=\"record\"       ba-event:invoke-rerecord=\"rerecord\"       ba-event:invoke-stop=\"stop\"       ba-event:invoke-skip=\"invoke_skip\"       ba-event:upload-covershot=\"upload_covershot\"   ></ba-{{dyncontrolbar}}>     </div> </div>  <div ba-if=\"{{player_active}}\"      style=\"{{width ? 'width:' + width + ((width + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}{{height ? 'height:' + height + ((height + '').match(/^\\d+$/g) ? 'px' : '') + ';' : ''}}\" >  <ba-{{dynvideoplayer}} ba-theme=\"{{theme || 'default'}}\"                         ba-source=\"{{playbacksource}}\"                         ba-poster=\"{{playbackposter}}\"                         ba-hideoninactivity=\"{{false}}\"                         ba-forceflash=\"{{forceflash}}\"                         ba-noflash=\"{{noflash}}\"                         ba-stretch=\"{{stretch}}\"                         ba-attrs=\"{{playerattrs}}\"                         ba-data:id=\"player\"                         ba-width=\"{{width}}\"                         ba-height=\"{{height}}\"                         ba-rerecordable=\"{{rerecordable && (recordings === null || recordings > 0)}}\"                         ba-submittable=\"{{manualsubmit}}\"                         ba-reloadonplay=\"{{true}}\"                         ba-autoplay=\"{{autoplay}}\"                         ba-nofullscreen=\"{{nofullscreen}}\"                         ba-topmessage=\"{{playertopmessage}}\"                         ba-event:rerecord=\"rerecord\"                         ba-event:playing=\"playing\"                         ba-event:paused=\"paused\"                         ba-event:ended=\"ended\"                         ba-event:submit=\"manual_submit\"                         >  </ba-{{dynvideoplayer}}> </div>","video_recorder_topmessage":" <div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-background'>     </div>     <div class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div>","cube-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-left-block\">          <div class=\"{{css}}-button-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>          <div class=\"{{css}}-button-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-play\"></i>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>         </div>     </div>      <div class=\"{{css}}-right-block\">          <div class=\"{{css}}-button-container {{css}}-timer-container\">             <div class=\"{{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{duration_formatted}}</div>             </div>             <p> / </p>             <div class=\"{{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>           <div class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">             <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                 <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>             </div>         </div>          <div class=\"{{css}}-button-container\"  ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-resize-full\"></i>             </div>         </div>        </div>      <div class=\"{{css}}-progressbar\">         <div class=\"{{css}}-progressbar-inner\"              onmousedown=\"{{startUpdatePosition(domEvent)}}\"              onmouseup=\"{{stopUpdatePosition(domEvent)}}\"              onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"              onmousemove=\"{{progressUpdatePosition(domEvent)}}\">              <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>             <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>         </div>     </div>  </div> ","elevate-video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-top-block\">          <div class=\"{{css}}-top-right-block\">              <div class=\"{{css}}-time-container {{css}}-right-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{duration_formatted}}</div>             </div>          </div>          <div class=\"{{css}}-progressbar\">             <div class=\"{{css}}-progressbar-inner\"                  onmousedown=\"{{startUpdatePosition(domEvent)}}\"                  onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                  onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                  onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                  <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                 <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                     <div class=\"{{css}}-progressbar-button-description\" style=\"display: none\">                         <div class=\"{{css}}-current-stream-screen-shot\">                             <img src=\"\"/>                         </div>                         <div class=\"{{css}}-time-container\">                             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>                         </div>                     </div>                     <div class=\"{{css}}-progressbar-button\"></div>                 </div>             </div>         </div>      </div>      <div class=\"{{css}}-bottom-block\">          <div class=\"{{css}}-left-block\">              <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">                 <div class=\"{{css}}-button-inner\">                     {{string('submit-video')}}                 </div>             </div>              <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-ccw\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-play\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-pause\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                 </div>             </div>          </div>          <div class=\"{{css}}-center-block\">             <div class=\"{{css}}-video-title-block\">                              </div>         </div>          <div class=\"{{css}}-right-block\">              <div class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">                 <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                     <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>                 </div>             </div>              <div class=\"{{css}}-button-container\"  ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">                 <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                     <i class=\"{{css}}-icon-resize-full\"></i>                 </div>             </div>          </div>      </div> </div> ","minimalist-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class='{{css}}-controlbar-header'>         <div class=\"{{css}}-controlbar-header-icons-block\">              <div class=\"{{css}}-right-block\">                  <div class=\"{{css}}-button-container\"  ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">                     <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                         <i class=\"{{css}}-icon-resize-full\"></i>                     </div>                 </div>                  <div class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">                     <div class=\"{{css}}-button-inner\">                         <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>                     </div>                 </div>              </div>          </div>          <div class=\"{{css}}-controlbar-header-title-block\">             <div class=\"{{css}}-title\"><h4>Video Title</h4></div>         </div>     </div>      <div class=\"{{css}}-controlbar-footer\">          <div class=\"{{css}}-controlbar-top-block\">              <div class=\"{{css}}-button-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">                 <div class=\"{{css}}-button-inner\">                     {{string('submit-video')}}                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-ccw\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-play\"></i>                 </div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">                 <div class=\"{{css}}-button-inner\">                     <i class=\"{{css}}-icon-pause\"></i>                 </div>             </div>          </div>         <div class=\"{{css}}-controlbar-middle-block\">              <div class=\"{{css}}-progressbar\">                 <div class=\"{{css}}-progressbar-inner\"                      onmousedown=\"{{startUpdatePosition(domEvent)}}\"                      onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                      onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                      onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                      <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                     <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                         <div class=\"{{css}}-progressbar-button\"></div>                     </div>                 </div>             </div>          </div>         <div class=\"{{css}}-controlbar-bottom-block\">              <div class=\"{{css}}-button-container {{css}}-time-container\">                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>                 <p> / </p>                 <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{duration_formatted}}</div>             </div>              <div class=\"{{css}}-button-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">                 <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                     <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>                 </div>             </div>         </div>     </div>  </div> ","modern-video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>        <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>        </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-play\"></i>   </div>  </div>  <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">    <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-pause\"></i>   </div>  </div>  <div class=\"{{css}}-time-container\">   <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}/{{duration_formatted}}</div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{fullscreen}}\" ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css}}-icon-resize-full\"></i>   </div>  </div>  <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">   <div class=\"{{css}}-button-inner\">    <span class=\"{{css}}-button-text\">{{currentstream_label}}</span>   </div>  </div>  <div class=\"{{css}}-volumebar\">   <div class=\"{{css}}-volumebar-inner\"           onmousedown=\"{{startUpdateVolume(domEvent)}}\"                 onmouseup=\"{{stopUpdateVolume(domEvent)}}\"                 onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"                 onmousemove=\"{{progressUpdateVolume(domEvent)}}\">    <div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.ceil(1+Math.min(99, Math.round(volume * 100))) + '%'}}}\" title=\"{{string('volume-button')}}\"></div>       </div>  </div>  <div class=\"{{css}}-rightbutton-container {{css}}-volume-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">   <div class=\"{{css}}-button-inner\">    <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>   </div>  </div>  <div class=\"{{css}}-progressbar\">   <div class=\"{{css}}-progressbar-inner\"        onmousedown=\"{{startUpdatePosition(domEvent)}}\"        onmouseup=\"{{stopUpdatePosition(domEvent)}}\"        onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"        onmousemove=\"{{progressUpdatePosition(domEvent)}}\">   <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>   <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\"></div>  </div> </div> ","space-video_player_controlbar":"<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">       <div class='{{css}}-controlbar-header'>         <div class=\"{{css}}-title\">Title of the video</div>          <div class=\"{{css}}-rightbutton-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>          <div class=\"{{css}}-rightbutton-container {{css}}-share-button-container\" ba-click=\"share_media()\" title=\"{{string('share-media')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-cog\"></i>             </div>         </div>     </div>               <div class=\"{{css}}-controlbar-footer\">         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">            <div class=\"{{css}}-button-inner\">                {{string('submit-video')}}            </div>        </div>         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-ccw\"></i>            </div>        </div>         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-play\"></i>            </div>        </div>         <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">            <div class=\"{{css}}-button-inner\">                <i class=\"{{css}}-icon-pause\"></i>            </div>        </div>         <div class=\"{{css}}-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>        </div>         <div class=\"{{css}}-rightbutton-container\"  ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">            <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                <i class=\"{{css}}-icon-resize-full\"></i>            </div>        </div>         <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">            <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>            </div>        </div>         <div class=\"{{css}}-time-container {{css}}-rightbutton-container {{css}}-right-time-container\">            <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{duration_formatted}}</div>        </div>         <div class=\"{{css}}-progressbar\">            <div class=\"{{css}}-progressbar-inner\"                 onmousedown=\"{{startUpdatePosition(domEvent)}}\"                 onmouseup=\"{{stopUpdatePosition(domEvent)}}\"                 onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"                 onmousemove=\"{{progressUpdatePosition(domEvent)}}\">                 <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>                <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                    <div class=\"{{css}}-progressbar-button\"></div>                </div>            </div>        </div>             </div>  </div> ","space-video_player_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-first-inner-message-container\">         <div class=\"{{css}}-second-inner-message-container\">             <div class=\"{{css}}-third-inner-message-container\">                 <div class=\"{{css}}-fourth-inner-message-container\">                     <div class='{{css}}-message-message'>                         {{message || \"\"}}                     </div>                 </div>             </div>         </div>     </div> </div>","space-video_player_playbutton":" <div class=\"{{css}}-playbutton-container\" ba-click=\"play()\" title=\"{{string('tooltip')}}\">  <div class=\"{{css}}-playbutton-button\"></div> </div>  <div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">  <div class=\"{{css}}-rerecord-frontbar\">         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">             <div class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">                 {{string('submit-video')}}             </div>         </div>         <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">          <div class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">           {{string('rerecord')}}          </div>         </div>  </div> </div> ","theatre-video_player_controlbar":" <div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">      <div class=\"{{css}}-left-block\">          <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"submit()\">             <div class=\"{{css}}-button-inner\">                 {{string('submit-video')}}             </div>         </div>          <div class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\" ba-click=\"rerecord()\" title=\"{{string('rerecord-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-ccw\"></i>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-if=\"{{!playing}}\" ba-click=\"play()\" title=\"{{string('play-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-play\"></i>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-if=\"{{playing}}\" ba-click=\"pause()\" title=\"{{string('pause-video')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css}}-icon-pause\"></i>             </div>         </div>          <div class=\"{{css}}-button-container\" ba-click=\"toggle_volume()\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">             <div class=\"{{css}}-button-inner\">                 <i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>             </div>         </div>          <div class=\"{{css}}-time-container\">             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{position_formatted}}</div>         </div>     </div>      <div class=\"{{css}}-right-block\">          <div class=\"{{css}}-button-container {{css}}-fullscreen-icon-container\"  ba-click=\"toggle_fullscreen()\" title=\"{{string('fullscreen-video')}}\">             <div class=\"{{css}}-button-inner {{css}}-full-screen-btn-inner\">                 <i class=\"{{css}}-icon-resize-full\"></i>             </div>         </div>          <div class=\"{{css}}-button-container {{css}}-stream-label-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"toggle_stream()\" title=\"{{string('change-resolution')}}\">             <div class=\"{{css}}-button-inner {{css}}-stream-label-container\">                 <span class=\"{{css}}-button-text {{css}}-stream-label\">{{currentstream_label}}</span>             </div>         </div>          <div class=\"{{css}}-time-container {{css}}-right-time-container\">             <div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{duration_formatted}}</div>         </div>      </div>      <div class=\"{{css}}-progressbar\">         <div class=\"{{css}}-progressbar-inner\"              onmousedown=\"{{startUpdatePosition(domEvent)}}\"              onmouseup=\"{{stopUpdatePosition(domEvent)}}\"              onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"              onmousemove=\"{{progressUpdatePosition(domEvent)}}\">              <div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>             <div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">                 <div class=\"{{css}}-progressbar-button\"></div>             </div>         </div>     </div>  </div> ","cube-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">     <div class=\"{{css}}-chooser-icon-container\">    <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>   </div>   <div>    <div class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div>","cube-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div class=\"{{css}}-bubble-info\">     <ul ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-cube-button\" ba-show=\"{{settingsvisible}}\">      <div class=\"{{css}}-button-inner {{css}}-button-cube-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-cube-button\" ba-show=\"{{!noaudio}}\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{minrophonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-cube-button\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahelthy ? 'camerahealthy' : 'cameraunhelathy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","cube-video_recorder_imagegallery":"<div class=\"{{css}}-image-gallery-container\">   <div class=\"{{css}}-imagegallery-leftbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"ba-videorecorder-icon-left-open\"></i>   </div>  </div>   <div ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div class=\"{{css}}-imagegallery-rightbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"ba-videorecorder-icon-right-open\"></i>   </div>  </div>  </div> ","cube-video_recorder_loader":" <div class=\"{{css}}-loader-container\" ba-show=\"{{!label}}\">     <div class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">     <div class=\"{{css}}-loader-label-container\">         <div class=\"{{css}}-loader-countdown\">             <div class=\"{{css}}-button-primary\">                 {{string('starts-in')}} {{label}}             </div>         </div>         <div class=\"{{css}}-wait-button-container\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{freeze()}}\"                  onmouseenter=\"{{hover(string('wait-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('wait')}}             </div>         </div>     </div> </div>","cube-video_recorder_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","elevate-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">     <div class=\"{{css}}-chooser-icon-container\">    <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>   </div>   <div>    <div class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div>","minimalist-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <!-- Sidebar Settings -->  <div class=\"{{css}}-settings-left-sidebar\">    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">     <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->    <div class=\"{{css}}-settings {{css}}-settings-button-container\">      <div class=\"{{css}}-circle-button\" ba-show=\"{{settingsvisible}}\">       <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsopen}}\" >       <ul ba-repeat=\"{{camera :: cameras}}\">        <li>         <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />         <span></span>         <label onclick=\"{{selectCamera(camera.id)}}\">          {{camera.label}}         </label>        </li>       </ul>      </div>       <div class=\"{{css}}-button-inner {{css}}-button-circle-{{settingsopen ? 'selected' : 'unselected' }}\"        onclick=\"{{settingsopen=!settingsopen}}\"        onmouseenter=\"{{hover(string('settings'))}}\"        onmouseleave=\"{{unhover()}}\" >       <i class=\"{{css}}-icon-cog\"></i>      </div>      </div>                   <div class=\"{{css}}-circle-button\" ba-show=\"{{!noaudio}}\">                      <div class=\"{{css}}-bubble-info\" ba-show=\"{{settingsvisible && settingsopen && audio }}\">                         <ul ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">                             <li onclick=\"{{selectMicrophone(microphone.id)}}\">                                 <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />                                 <span></span>                                 <label>                                     {{microphone.label}}                                 </label>                             </li>                         </ul>                     </div>                      <div class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{minrophonehealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>                  <div class=\"{{css}}-circle-button\">                     <div class=\"{{css}}-button-inner\"                          onmouseenter=\"{{hover(string(camerahelthy ? 'camerahealthy' : 'cameraunhelathy'))}}\"                          onmouseleave=\"{{unhover()}}\">                         <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>                     </div>                 </div>     </div>   </div>   </div>   <div class=\"{{css}}-controlbar-middle-section\">    <div class=\"{{css}}-timer-container\" ba-show=\"{{stopvisible}}\">    <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">     <div class=\"{{css}}-label {{css}}-button-primary\">      {{controlbarlabel}}     </div>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>     <div class=\"{{css}}-primary-button-container\" ba-show=\"{{recordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-stop-button-container\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","minimalist-video_recorder_imagegallery":"<div class=\"{{css}}-image-gallery-container\">   <div class=\"{{css}}-imagegallery-leftbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"ba-videorecorder-icon-left-open\"></i>   </div>  </div>   <div ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div class=\"{{css}}-imagegallery-rightbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"ba-videorecorder-icon-right-open\"></i>   </div>  </div>  </div> ","minimalist-video_recorder_loader":"<div class=\"{{css}}-loader-container\" ba-show=\"{{!label}}\">     <div class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div class=\"{{css}}-loader-container\" ba-show=\"{{label}}\">     <div class=\"{{css}}-loader-countdown\">         <div class=\"{{css}}-button-primary\">             {{string('starts-in')}} {{label}}         </div>     </div> </div> <div class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">     <div class=\"{{css}}-loader-label-container\">         <div class=\"{{css}}-wait-button-container\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{freeze()}}\"                  onmouseenter=\"{{hover(string('wait-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('wait')}}             </div>         </div>     </div> </div>","minimalist-video_recorder_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","minimalist-video_recorder_topmessage":"<div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div>","modern-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">     <div class=\"{{css}}-chooser-icon-container\">    <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>   </div>   <div>    <div class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div>","space-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div class=\"{{css}}-bubble-info\">     <ul ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-circle-button\" ba-show=\"{{settingsvisible}}\">      <div class=\"{{css}}-button-inner {{css}}-button-circle-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-circle-button\" ba-show=\"{{!noaudio}}\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{minrophonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-circle-button\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahelthy ? 'camerahealthy' : 'cameraunhelathy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","space-video_recorder_imagegallery":"<div class=\"{{css}}-image-gallery-container\">   <div class=\"{{css}}-imagegallery-leftbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"ba-videorecorder-icon-left-open\"></i>   </div>  </div>   <div ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div class=\"{{css}}-imagegallery-rightbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"ba-videorecorder-icon-right-open\"></i>   </div>  </div>  </div> ","space-video_recorder_loader":" <div class=\"{{css}}-loader-container\" ba-show=\"{{!label}}\">     <div class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">     <div class=\"{{css}}-loader-label-container\">         <div class=\"{{css}}-loader-countdown\">             <div class=\"{{css}}-button-primary\">                 {{string('starts-in')}} {{label}}             </div>         </div>         <div class=\"{{css}}-wait-button-container\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{freeze()}}\"                  onmouseenter=\"{{hover(string('wait-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('wait')}}             </div>         </div>     </div> </div>","space-video_recorder_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> ","space-video_recorder_topmessage":"<div class=\"{{css}}-topmessage-container\">     <div class='{{css}}-topmessage-message'>         {{topmessage}}     </div> </div>","theatre-video_recorder_chooser":" <div class=\"{{css}}-chooser-container\">   <div class=\"{{css}}-chooser-button-container\">     <div class=\"{{css}}-chooser-icon-container\">    <i class=\"{{css}}-icon-{{primaryrecord ? 'videocam' : 'upload'}}\"></i>   </div>   <div>    <div class=\"{{css}}-chooser-primary-button\"         ba-click=\"primary()\"         ba-if=\"{{has_primary}}\">     <input ba-if=\"{{enable_primary_select && primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\"            capture />     <input ba-if=\"{{enable_primary_select && !primary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{primary_select(domEvent)}}\"            accept=\"{{primary_accept_string}}\" />     <span>      {{primary_label}}     </span>    </div>   </div>   <div>    <div class=\"{{css}}-chooser-secondary-button\"         ba-click=\"secondary()\"         ba-if=\"{{has_secondary}}\">     <input ba-if=\"{{enable_secondary_select && secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <input ba-if=\"{{enable_secondary_select && !secondary_select_capture}}\"            type=\"file\"            class=\"{{css}}-chooser-file\"            style=\"height:100\"            onchange=\"{{secondary_select(domEvent)}}\"            accept=\"{{secondary_accept_string}}\" />     <span>      {{secondary_label}}     </span>    </div>   </div>  </div> </div>","theatre-video_recorder_controlbar":"<div class=\"{{css}}-dashboard\">   <div class=\"{{css}}-settings-front\">    <!-- Popup Settings Selections, initially hidden, appear when click button for settings -->   <div class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">    <div class=\"{{css}}-bubble-info\">     <ul ba-repeat=\"{{camera :: cameras}}\">      <li>       <input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />       <span></span>       <label onclick=\"{{selectCamera(camera.id)}}\">        {{camera.label}}       </label>      </li>     </ul>     <ul ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{audio}}\">      <li onclick=\"{{selectMicrophone(microphone.id)}}\">       <input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />       <span></span>       <label>        {{microphone.label}}       </label>      </li>     </ul>    </div>   </div>   </div>   <!-- Control bar, footer part which holds all buttons -->  <div class=\"{{css}}-controlbar\">    <div class=\"{{css}}-controlbar-center-section\">     <div class=\"{{css}}-button-container\" ba-show=\"{{rerecordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{rerecord()}}\"       onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('rerecord')}}     </div>    </div>    </div>    <div class=\"{{css}}-controlbar-left-section\" ba-show=\"{{settingsvisible}}\">              <div class=\"{{css}}-cube-button\" ba-show=\"{{settingsvisible}}\">      <div class=\"{{css}}-button-inner {{css}}-button-cube-{{settingsopen ? 'selected' : 'unselected' }}\"       onclick=\"{{settingsopen=!settingsopen}}\"       onmouseenter=\"{{hover(string('settings'))}}\"       onmouseleave=\"{{unhover()}}\" >      <i class=\"{{css}}-icon-cog\"></i>     </div>     </div>     <div class=\"{{css}}-cube-button\" ba-show=\"{{!noaudio}}\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"      onmouseleave=\"{{unhover()}}\">      <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{minrophonehealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>     <div class=\"{{css}}-cube-button\">     <div class=\"{{css}}-button-inner\"      onmouseenter=\"{{hover(string(camerahelthy ? 'camerahealthy' : 'cameraunhelathy'))}}\"      onmouseleave=\"{{unhover()}}\">                     <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{ camerahealthy ? 'good' : 'bad' }}\"></i>     </div>    </div>   </div>    <div class=\"{{css}}-controlbar-right-section\">     <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{record()}}\"       onmouseenter=\"{{hover(string('record-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('record')}}     </div>    </div>    </div>    <div class=\"{{css}}-stop-container\" ba-show=\"{{stopvisible}}\">     <div class=\"{{css}}-timer-container\">     <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">      <div class=\"{{css}}-label {{css}}-button-primary\">       {{controlbarlabel}}      </div>     </div>    </div>     <div class=\"{{css}}-stop-button-container\">     <div class=\"{{css}}-button-primary\"       onclick=\"{{stop()}}\"       onmouseenter=\"{{hover(string('stop-tooltip'))}}\"       onmouseleave=\"{{unhover()}}\">      {{string('stop')}}     </div>    </div>   </div>          <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{skip()}}\"                  onmouseenter=\"{{hover(string('skip-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('skip')}}             </div>         </div>           <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">             <div class=\"{{css}}-button-primary\"                  onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 <input type=\"file\"                        class=\"{{css}}-chooser-file\"                        style=\"height:100px\"                        onchange=\"{{uploadCovershot(domEvent)}}\"                        accept=\"{{covershot_accept_string}}\" />                 <span>                     {{string('upload-covershot')}}                 </span>             </div>         </div>   </div>  </div> ","theatre-video_recorder_imagegallery":"<div class=\"{{css}}-image-gallery-container\">   <div class=\"{{css}}-imagegallery-leftbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">    <i class=\"ba-videorecorder-icon-left-open\"></i>   </div>  </div>   <div ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>   <div class=\"{{css}}-imagegallery-image\"     ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"     onclick=\"{{select(image)}}\">   </div>  </div>   <div class=\"{{css}}-imagegallery-rightbutton\">   <div class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">    <i class=\"ba-videorecorder-icon-right-open\"></i>   </div>  </div>  </div> ","theatre-video_recorder_loader":" <div class=\"{{css}}-loader-container\" ba-show=\"{{!label}}\">     <div class=\"{{css}}-loader-loader\" title=\"{{tooltip}}\">     </div> </div> <div class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">     <div class=\"{{css}}-loader-label-container\">         <div class=\"{{css}}-loader-countdown\">             <div class=\"{{css}}-button-primary\">                 {{string('starts-in')}} {{label}}             </div>         </div>         <div class=\"{{css}}-wait-button-container\">             <div class=\"{{css}}-button-primary\"                  onclick=\"{{freeze()}}\"                  onmouseenter=\"{{hover(string('wait-tooltip'))}}\"                  onmouseleave=\"{{unhover()}}\">                 {{string('wait')}}             </div>         </div>     </div> </div>","theatre-video_recorder_message":"<div class=\"{{css}}-message-container\" ba-click=\"click()\">     <div class=\"{{css}}-top-inner-message-container\">         <div class=\"{{css}}-first-inner-message-container\">             <div class=\"{{css}}-second-inner-message-container\">                 <div class=\"{{css}}-third-inner-message-container\">                     <div class=\"{{css}}-fourth-inner-message-container\">                         <div class='{{css}}-message-message'>                             {{message || \"\"}}                         </div>                     </div>                 </div>             </div>         </div>     </div> </div> "};
});
Scoped.define("module:Ads.AdSenseVideoAdProvider", [
		"module:Ads.AbstractVideoAdProvider", "module:Ads.AdSensePrerollAd" ],
function(AbstractVideoAdProvider, AdSensePrerollAd, scoped) {
	return AbstractVideoAdProvider.extend({
		scoped : scoped
	}, {

		_newPrerollAd : function(options) {
			return new AdSensePrerollAd(this, options);
		}

	});
});


Scoped.define("module:Ads.AdSensePrerollAd", [
  	"module:Ads.AbstractPrerollAd"
  ], function (AbstractVideoPrerollAd, scoped) {
  	return AbstractVideoPrerollAd.extend({scoped: scoped}, function (inherited) {
  		return {
  				
  			constructor: function (provider, options) {
  				inherited.constructor.call(this, provider, options);
  				this._adDisplayContainer = new google.ima.AdDisplayContainer(this._options.adElement, this._options.videoElement);
  				// Must be done as the result of a user action on mobile
  				this._adDisplayContainer.initialize();
  				//Re-use this AdsLoader instance for the entire lifecycle of your page.
  				this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);
  	
  				var self = this;
  				this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () {
  					self._adError();
  				}, false);
  				this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function () {
  					self._adLoaded.apply(self, arguments);
  				}, false);
  				
  				this._adsRequest = new google.ima.AdsRequest();
  				this._adsRequest.adTagUrl = this._provider.options().adTagUrl;
  			},
  			
  			_executeAd: function (options) {
  				// Specify the linear and nonlinear slot sizes. This helps the SDK to
  				// select the correct creative if multiple are returned.
  				this._adsRequest.linearAdSlotWidth = options.width;
  				this._adsRequest.linearAdSlotHeight = options.height;
  				// adsRequest.nonLinearAdSlotWidth = 640;
  				// adsRequest.nonLinearAdSlotHeight = 150;
  				
  				this._adsLoader.requestAds(this._adsRequest);
  			},
  			
  			_adError: function () {
  				if (this._adsManager)
  					this._adsManager.destroy();
  				this._adFinished();
  			},
  			
  			_adLoaded: function (adsManagerLoadedEvent) {
  				  // Get the ads manager.
  				  this._adsManager = adsManagerLoadedEvent.getAdsManager(this._options.videoElement);
  				  // See API reference for contentPlayback
  				
  				  try {
  					    // Initialize the ads manager. Ad rules playlist will start at this time.
  					  this._adsManager.init(this._adsRequest.linearAdSlotWidth, this._adsRequest.linearAdSlotHeight, google.ima.ViewMode.NORMAL);
  					    // Call start to show ads. Single video and overlay ads will
  					    // start at this time; this call will be ignored for ad rules, as ad rules
  					    // ads start when the adsManager is initialized.
  					  this._adsManager.start();
  					  } catch (adError) {
  					    // An error may be thrown if there was a problem with the VAST response.
  					  }
  	
  				  var self = this;
  				  // Add listeners to the required events.
  				  this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () {
  				      self._adError();
  				  }, false);
  				
  				  //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
  				  this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
  					  self._adFinished();
  				  });
  			}
  		
  		};	
  	});
  });

Scoped.define("module:Ads.AbstractVideoAdProvider", [ "base:Class" ], function(
		Class, scoped) {
	return Class.extend({
		scoped : scoped
	}, function(inherited) {
		return {

			constructor : function(options) {
				inherited.constructor.call(this);
				this._options = options;
			},

			options : function() {
				return this._options;
			},

			_newPrerollAd : function(options) {
			},

			newPrerollAd : function(options) {
				return this._newPrerollAd(options);
			},
			
			register: function (name) {
				this.cls.registry[name] = this;
			}

		};
	}, {
		
		registry: {}
		
	});
});


Scoped.define("module:Ads.AbstractPrerollAd", [ "base:Class",
		"base:Events.EventsMixin", "jquery:" ], function(Class, EventsMixin, $, scoped) {
	return Class.extend({
		scoped : scoped
	}, [ EventsMixin, function(inherited) {
		return {

			constructor : function(provider, options) {
				inherited.constructor.call(this);
				this._provider = provider;
				this._options = options;
			},

			executeAd : function(options) {
				$(this._options.adElement).show();
				this._executeAd(options);
			},

			_adFinished : function() {
				$(this._options.adElement).hide();
				this.trigger("finished");
			}

		};
	} ]);
});

Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "browser:Info"
], function (LocaleTable, Info) {
	
	var strings = new LocaleTable();
	strings.setWeakLocale(Info.language());
	
	return {
		
		strings: strings,
		
		playerthemes: {},
		
		recorderthemes: {}
		
	};
});
Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "module:Templates",
    "jquery:",
    "module:Assets",
    "browser:Info",
    "media:Player.Support"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function (Class, TimeFormat, Comparators, Templates, $, Assets, Info, PlayerSupport, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 0,
				"position": 0,
				"cached": 0,
				"volume": 1.0,
				"expandedprogress": true,
				"playing": false,
				"rerecordable": false,
				"submittable": false,
				"streams": [],
				"currentstream": null,
				"fullscreen": true,
				"activitydelta": 0
			},
			
			computed: {
				"currentstream_label:currentstream": function () {
					var cs = this.get("currentstream");
					return cs ? (cs.label ? cs.label : PlayerSupport.resolutionToLabel(cs.width, cs.height)): "";
				}
			},
			
			functions: {

				share_media: function() {},

				startUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", true);
					this.call("progressUpdatePosition", event);
				},
				
				progressUpdatePosition: function (event) {
					event[0].preventDefault();
					if (!this.get("_updatePosition"))
						return;
					this.set("position", this.get("duration") * (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("position", this.get("position"));
				},
				
				stopUpdatePosition: function (event) {
					event[0].preventDefault();
					this.set("_updatePosition", false);
				},
				
				startUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressUpdateVolume", event);
				},
				
				progressUpdateVolume: function (event) {
					event[0].preventDefault();
					if (!this.get("_updateVolume"))
						return;
					this.set("volume", (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("volume", this.get("volume"));
				},
				
				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				play: function () {
					this.trigger("play");
				},
				
				pause: function () {
					this.trigger("pause");
				},
				
				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else 
						this.set("volume", this.__oldVolume || 1);
					this.trigger("volume", this.get("volume"));
				},
				
				toggle_fullscreen: function () {
					this.trigger("fullscreen");
				},
				
				rerecord: function () {
					this.trigger("rerecord");
				},
				
				submit: function () {
					this.set("submittable", false);
					this.set("rerecordable", false);
					this.trigger("submit");
				},
				
				toggle_stream: function () {
					var streams = this.get("streams");
					var current = streams.length - 1;
					streams.forEach(function (stream, i) {
						if (Comparators.deepEqual(stream, this.get("currentstream")))
							current = i;
					}, this);
					this.set("currentstream", streams[(current + 1) % streams.length]);
				}
				
			},
			
			create: function () {
				this.properties().compute("position_formatted", function () {
					return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, this.get("position") * 1000);
				}, ['position']);
				this.properties().compute("duration_formatted", function () {
					return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, this.get("duration") * 1000);
				}, ['duration']);
				this.set("ismobile", Info.isMobile());
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Redo video?",
    	"submit-video": "Confirm video",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound",
    	"change-resolution": "Change resolution",
			"share-media": "Share this media"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_loader,
			
			attrs: {
				"css": "ba-videoplayer"
			}
			
		};
	})
	.register("ba-videoplayer-loader")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Loading video..."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic",
    "module:Templates"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_message,
			
			attrs: {
				"css": "ba-videoplayer",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					this.trigger("click");
				}
				
			}
			
		};
	}).register("ba-videoplayer-message");
});
Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.playbutton,
			
			attrs: {
				"css": "ba-videoplayer",
				"rerecordable": false,
				"submittable": false
			},
			
			functions: {
				
				play: function () {
					this.trigger("play");
				},
				
				submit: function () {
					this.set("submittable", false);
					this.set("rerecordable", false);
					this.trigger("submit");
				},

				rerecord: function () {
					this.trigger("rerecord");
				}				
				
			}
			
		};
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video.",
    	"rerecord": "Redo",
    	"submit-video": "Confirm video"    	
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "media:Player.VideoPlayerWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates",
    "module:Ads.AbstractVideoAdProvider"
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, VideoPlayerWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, AdProvider, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				/* CSS */
				"css": "ba-videoplayer",
				"iecss": "ba-videoplayer",
				"cssplaybutton": "",
				"cssloader": "",
				"cssmessage": "",
				"csstopmessage": "",
				"csscontrolbar": "",
				"width": "",
				"height": "",
				/* Themes */
				"theme": "",
				"csstheme": "",
				/* Dynamics */
				"dynplaybutton": "videoplayer-playbutton",
				"dynloader": "videoplayer-loader",
				"dynmessage": "videoplayer-message",
				"dyntopmessage": "videoplayer-topmessage",
				"dyncontrolbar": "videoplayer-controlbar",
				/* Templates */
				"tmplplaybutton": "",
				"tmplloader": "",
				"tmplmessage": "",
				"tmpltopmessage": "",
				"tmplcontrolbar": "",
				/* Attributes */
				"poster": "",
				"source": "",
				"sources": [],
				"sourcefilter": {},
				"streams": [],
				"currentstream": null,
				"playlist": null,
				"volume": 1.0,
				/* Configuration */
				"forceflash": false,
				"noflash": false,
				"reloadonplay": false,
				/* Ads */
				"adprovider": null,
				"preroll": false,
				/* Options */
				"rerecordable": false,
				"submittable": false,
				"autoplay": false,
				"preload": false,
				"loop": false,
				"nofullscreen": false,
				"ready": true,
				"stretch": false,
				"hideoninactivity": true,
				"skipinitial": false,
				"topmessage": "",
				/* States */
				"states": {
					"poster_error": {
						"ignore": false,
						"click_play": true
					}
				}				
			},

			types: {
				"forceflash": "boolean",
				"noflash": "boolean",
				"rerecordable": "boolean",
				"loop": "boolean",
				"autoplay": "boolean",
				"preload": "boolean",
				"ready": "boolean",
				"nofullscreen": "boolean",
				"stretch": "boolean",
				"preroll": "boolean",
				"hideoninactivity": "boolean",
				"skipinitial": "boolean",
				"volume": "float"
			},
			
			extendables: ["states"],
			
			remove_on_destroy: true,
			
			create: function () {
				if (Info.isMobile()) {
					this.set("autoplay", false);
					this.set("loop", false);
				}
				if (this.get("theme") in Assets.playerthemes) {
					Objs.iter(Assets.playerthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}
				if (this.get("adprovider")) {
					this._adProvider = this.get("adprovider");
					if (Types.is_string(this._adProvider))
						this._adProvider = AdProvider.registry[this._adProvider];
				}
				if (this.get("playlist")) {
					var pl0 = (this.get("playlist"))[0];
					this.set("poster", pl0.poster);
					this.set("source", pl0.source);
					this.set("sources", pl0.sources);
				}
				if (this.get("streams") && !this.get("currentstream"))
					this.set("currentstream", (this.get("streams"))[0]);
				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("duration", 0.0);
				this.set("position", 0.0);
				this.set("buffered", 0.0);
				this.set("message", "");
				this.set("fullscreensupport", false);
				this.set("csssize", "normal");
				
				this.set("loader_active", false);
				this.set("playbutton_active", false);
				this.set("controlbar_active", false);
				this.set("message_active", false);

				this.set("last_activity", Time.now());
				this.set("activity_delta", 0);
				
				this.set("playing", false);
				
				this.__attachRequested = false;
				this.__activated = false;
				this.__error = null;
				this.__currentStretch = null;
				
				this.on("change:stretch", function () {
					this._updateStretch();
				}, this);
				this.host = this.auto_destroy(new Host({
					stateRegistry: new ClassRegistry(this.cls.playerStates())
				}));
				this.host.dynamic = this;
				this.host.initialize(InitialState);
				
				this._timer = this.auto_destroy(new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 100,
					start: true
				}));
				
				this.properties().compute("buffering", function () {
					return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
				}, ["buffered", "position", "last_position_change_delta", "playing"]);
				
			},
			
			state: function () {
				return this.host.state();
			},
			
			videoAttached: function () {
				return !!this.player;
			},
			
			videoLoaded: function () {
				return this.videoAttached() && this.player.loaded();
			},
			
			videoError: function () {
				return this.__error;
			},
			
			_error: function (error_type, error_code) {
				this.__error = {
					error_type: error_type,
					error_code: error_code
				};
				this.trigger("error:" + error_type, error_code);
				this.trigger("error", error_type, error_code);
			},
			
			_clearError: function () {
				this.__error = null;
			},
			
			_detachVideo: function () {
				this.set("playing", false);
				if (this.player)
					this.player.weakDestroy();
				if (this._prerollAd)
					this._prerollAd.weakDestroy();
				this.player = null;
			},
			
			_attachVideo: function () {
				if (this.videoAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.__attachRequested = false;
				var video = this.element().find("[data-video='video']").get(0);
				this._clearError();
				VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
			    	element: video,
			    	forceflash: !!this.get("forceflash"),
			    	noflash: !!this.get("noflash"),
			    	preload: !!this.get("preload"),
					loop: !!this.get("loop"),
					reloadonplay: !!this.get("reloadonplay")
			    })).error(function (e) {
			    	if (this.destroyed())
			    		return;
			    	this._error("attach", e);
			    }, this).success(function (instance) {
			    	if (this.destroyed())
			    		return;
					if (this._adProvider && this.get("preroll")) {
						this._prerollAd = this._adProvider.newPrerollAd({
							videoElement: this.element().find("[data-video='video']").get(0),
							adElement: this.element().find("[data-video='ad']").get(0)
						});
					}
			    	this.player = instance;			    	
					this.player.on("postererror", function () {
				    	this._error("poster");
					}, this);					
					this.player.on("playing", function () {
						this.set("playing", true);
						this.trigger("playing");
					}, this);
					this.player.on("error", function (e) {
						this._error("video", e);
					}, this);
			        if (this.player.error())
			        	this.player.trigger("error", this.player.error());
			        this.player.on("paused", function () {
			        	this.set("playing", false);
			        	this.trigger("paused");
			        }, this);
					this.player.on("ended", function () {
						this.set("playing", false);
						this.trigger("ended");
					}, this);
			    	this.trigger("attached", instance);
					this.player.once("loaded", function () {
						var volume = Math.min(1.0, this.get("volume"));
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0);
						this.set("duration", this.player.duration());
						this.set("fullscreensupport", this.player.supportsFullscreen());
						this.trigger("loaded");
						this._updateStretch();
					}, this);
					if (this.player.loaded())
						this.player.trigger("loaded");
					this._updateStretch();
			    }, this);
			},
			
			_getSources: function () {
				var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
				var poster = this.get("poster");
				var source = this.get("source");
				var sources = filter ? Objs.filter(this.get("sources"), function (source) {
					return Objs.subset_of(filter, source);
				}, this) : this.get("sources");
				Objs.iter(sources, function (s) {
					if (s.poster)
						poster = s.poster;
				});
				return {
					poster: poster,
					source: source,
					sources: sources
				};
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachVideo();
			},
			
			reattachVideo: function () {
				this._detachVideo();
				this._attachVideo();
			},

			object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],
			
			functions: {
				
				user_activity: function () {
					this.set("last_activity", Time.now());
					this.set("activity_delta", 0);
				},
				
				message_click: function () {
					this.trigger("message:click");
				},
				
				playbutton_click: function () {
					this.host.state().play();
				},
				
				play: function () {
					this.host.state().play();
				},
				
				rerecord: function () {
					if (!this.get("rerecordable"))
						return;
					this.trigger("rerecord");
				},
				
				submit: function () {
					if (!this.get("submittable"))
						return;
					this.trigger("submit");
					this.set("submittable", false);
					this.set("rerecordable", false);
				},

				pause: function () {
					if (this.get("playing"))
						this.player.pause();
				},
				
				stop: function () {
					if (!this.videoLoaded())
						return;
					if (this.get("playing"))
						this.player.pause();
					this.player.setPosition(0);
					this.trigger("stopped");
				},			
				
				seek: function (position) {
					if (this.videoLoaded())
						this.player.setPosition(position);
					this.trigger("seek", position);
				},

				set_volume: function (volume) {
					volume = Math.min(1.0, volume);
					this.set("volume", volume);
					if (this.videoLoaded()) {
						this.player.setVolume(volume);
						this.player.setMuted(volume <= 0);
					}
				},
				
				toggle_fullscreen: function () {
					if (this.videoLoaded())
						this.player.enterFullscreen();
				} 
			
			},
			
			destroy: function () {
				this._detachVideo();
				inherited.destroy.call(this);
			},
			
			_timerFire: function () {
				if (this.destroyed())
					return;
				try {
					if (this.videoLoaded()) {
						this.set("activity_delta", Time.now() - this.get("last_activity"));
						var new_position = this.player.position();
						if (new_position != this.get("position") || this.get("last_position_change"))
							this.set("last_position_change", Time.now());
						this.set("last_position_change_delta", Time.now() - this.get("last_position_change"));
						this.set("position", new_position);
						this.set("buffered", this.player.buffered());
						this.set("duration", this.player.duration());
					}
				} catch (e) {}
				this._updateStretch();
				this._updateCSSSize();
			},
			
			_updateCSSSize: function () {
				this.set("csssize", this.element().width() > 400 ? "normal" : (this.element().width() > 300 ? "medium" : "small"));
			},
			
			videoHeight: function () {
				return this.videoAttached() ? this.player.videoHeight() : NaN;
			},
			
			videoWidth: function () {
				return this.videoAttached() ? this.player.videoWidth() : NaN;
			},
			
			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},
			
			parentWidth: function () {
				return this.activeElement().parent().width();
			},
			
			parentHeight: function () {
				return this.activeElement().parent().height();
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},
			
			_updateStretch: function () {
				var newStretch = null;
				if (this.get("stretch")) {
					var ar = this.aspectRatio();
					if (isFinite(ar)) {
						var par = this.parentAspectRatio();
						if (isFinite(par)) {
							if (par > ar)
								newStretch = "height";
							if (par < ar)
								newStretch = "width";
						} else if (par === Infinity)
							newStretch = "height";
					}
				}
				if (this.__currentStretch !== newStretch) {
					if (this.__currentStretch)
						this.activeElement().removeClass(this.get("css") + "-stretch-" + this.__currentStretch);
					if (newStretch)
						this.activeElement().addClass(this.get("css") + "-stretch-" + newStretch);
				}
				this.__currentStretch = newStretch;				
			}

		};
	}, {
		
		playerStates: function () {
			return [PlayerStates];
		}
		
	}).register("ba-videoplayer")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"video-error": "An error occurred, please try again later. Click to retry."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"loader": false,
				"message": false,
				"playbutton": false,
				"controlbar": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this._started();
		},
		
		_started: function () {},
		
		play: function () {
			this.dyn.set("autoplay", true);
		}
	
	}]);
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("video-error"));
		}

	});
});






Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader"],

		_started: function () {
			if (this.dyn.get("ready"))
				this.next("LoadPlayer");
			else {
				this.listenOn(this.dyn, "change:ready", function () {
					this.next("LoadPlayer");
				});
			}
		}
	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
			
		dynamics: ["loader"],

		_started: function () {
			this.listenOn(this.dyn, "error:attach", function () {
				this.next("LoadError");
			}, this);
			this.listenOn(this.dyn, "error:poster", function () {
				if (!this.dyn.get("states").poster_error.ignore)
					this.next("PosterError");
			}, this);
			this.listenOn(this.dyn, "attached", function () {
				this.next("PosterReady");
			}, this);
			this.dyn.reattachVideo();
		}
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["playbutton"],

		_started: function () {
			this.listenOn(this.dyn, "error:poster", function () {
				if (!this.dyn.get("states").poster_error.ignore)
					this.next("PosterError");
			}, this);
			if (this.dyn.get("autoplay") || this.dyn.get("skipinitial"))
				this.play();
		},
		
		play: function () {
			this.next("Preroll");
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Preroll", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: [],

		_started: function () {
			if (this.dyn._prerollAd) {
				this.dyn._prerollAd.once("finished", function () {
					this.next("LoadVideo");
				}, this);
				this.dyn._prerollAd.executeAd({
					width: this.dyn.videoWidth(),
					height: this.dyn.videoHeight()
				});
			} else
				this.next("LoadVideo");
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterError", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		
		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
			}, this);
		}

	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State",
	"base:Async"
], function (State, Async, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],

		_started: function () {
			this.listenOn(this.dyn, "error:video", function () {
				this.next("ErrorVideo");
			}, this);
			this.listenOn(this.dyn, "playing", function () {
				if (this.destroyed() || this.dyn.destroyed())
					return;
				if (this.dyn.get("autoseek"))
					this.dyn.execute("seek", this.dyn.get("autoseek"));
				this.next("PlayVideo");
			}, this);
			if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay"))
				this.next("PlayVideo");
			else
				this.dyn.player.play();
		}
	
	});
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],

		_started: function () {
			this.dyn.set("message", this.dyn.string("video-error"));
			this.listenOn(this.dyn, "message:click", function () {
				this.next("LoadVideo");
			}, this);
		}
	
	});
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["controlbar"],

		_started: function () {
			this.dyn.set("autoplay", false);
			this.listenOn(this.dyn, "change:currentstream", function () {
				this.dyn.set("autoplay", true);
				this.dyn.set("autoseek", this.dyn.player.position());
				this.dyn.reattachVideo();
				this.next("LoadPlayer");
			}, this);
			this.listenOn(this.dyn, "ended", function () {
				this.dyn.set("autoseek", null);
				this.next("NextVideo");
			}, this);
			this.listenOn(this.dyn, "change:buffering", function () {
				this.dyn.set("loader_active", this.dyn.get("buffering"));
			}, this);
			this.listenOn(this.dyn, "error:video", function () {
				this.next("ErrorVideo");
			}, this);
		},
		
		play: function () {
			if (!this.dyn.get("playing"))
				this.dyn.player.play();
		}

	});
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.NextVideo", [
	"module:VideoPlayer.Dynamics.PlayerStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {

		_started: function () {
			if (this.dyn.get("playlist")) {
				var list = this.dyn.get("playlist");
				var head = list.shift();
				if (this.dyn.get("loop"))
					list.push(head);
				this.dyn.set("playlist", list);
				if (list.length > 0) {
					var pl0 = list[0];
					this.dyn.set("poster", pl0.poster);
					this.dyn.set("source", pl0.source);
					this.dyn.set("sources", pl0.sources);
					this.dyn.reattachVideo();
					this.dyn.set("autoplay", true);
					this.next("LoadPlayer");
					return;
				}
			}
			this.next("PosterReady");
		}

	});
});


Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_player_topmessage,
			
			attrs: {
				"css": "ba-videoplayer",
				"topmessage": ''
			}
			
		};
	}).register("ba-videoplayer-topmessage");
});



/*
Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
	"dynamics:Dynamic",
	"jquery:",
	"module:Templates",
	"module:Assets",
	"browser:Info"
], [
	"dynamics:Partials.StylesPartial",
	"dynamics:Partials.ShowPartial",
	"dynamics:Partials.IfPartial",
	"dynamics:Partials.ClickPartial"
], function (Class, $, Templates, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {

			template: Templates.video_player_topmessage,

			attrs: {
				"css": "ba-videoplayer",
				"volume": 1.0,
				"fullscreen": true,
				"topmessage": ''
			},

			functions: {

				share_media: function() {},

				toggle_fullscreen: function () {
					this.trigger("fullscreen");
				},

				startUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", true);
					this.call("progressUpdateVolume", event);
				},

				progressUpdateVolume: function (event) {
					event[0].preventDefault();
					if (!this.get("_updateVolume"))
						return;
					this.set("volume", (event[0].clientX - $(event[0].currentTarget).offset().left) / $(event[0].currentTarget).width());
					this.trigger("volume", this.get("volume"));
				},

				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else
						this.set("volume", this.__oldVolume || 1);
					this.trigger("volume", this.get("volume"));
				}
			}

		};
	}).register("ba-videoplayer-topmessage")
		.attachStringTable(Assets.strings)
		.addStrings({
			"volume-button": "Set volume",
			"fullscreen-video": "Enter fullscreen",
			"volume-mute": "Mute sound",
			"volume-unmute": "Unmute sound",
			"share-media": "Share this media"
		});
});
*/
Scoped.define("module:VideoRecorder.Dynamics.Chooser", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.IfPartial"
], function (Class, Templates, Assets, Info, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_chooser,
			
			attrs: {
				"css": "ba-videorecorder",
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"primaryrecord": true
			},
			
			create: function () {
				this.set("has_primary", true);
				this.set("enable_primary_select", false);
				this.set("primary_label", this.string(this.get("primaryrecord") && this.get("allowrecord") ? "record-video" : "upload-video"));
				this.set("secondary_label", this.string(this.get("primaryrecord") ? "upload-video" : "record-video"));
				if (!this.get("allowrecord") || !this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_primary_select", true);
					this.set("primary_select_capture", Info.isMobile() && this.get("allowrecord") && this.get("primaryrecord"));
					this.set("primary_accept_string", Info.isMobile() && this.get("allowrecord") && this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : (Info.isMobile() || !this.get("allowcustomupload") ? "video/*,video/mp4" : ""));
				}
				this.set("has_secondary", this.get("allowrecord") && this.get("allowupload"));
				this.set("enable_secondary_select", false);
				if (this.get("primaryrecord") || (Info.isMobile() && (!Info.isAndroid() || !Info.isCordova()))) {
					this.set("enable_secondary_select", true);
					this.set("secondary_select_capture", Info.isMobile() && !this.get("primaryrecord"));
					this.set("secondary_accept_string", Info.isMobile() && !this.get("primaryrecord") ? "video/*,video/mp4;capture=camcorder" : (Info.isMobile() || !this.get("allowcustomupload") ? "video/*,video/mp4" : ""));
				}
			},
			
			__recordCordova: function () {
				var self = this;
				navigator.device.capture.captureVideo(function (mediaFiles) {
				    var mediaFile = mediaFiles[0];
				    self.trigger("upload", mediaFile);
				}, function (error) {}, {limit:1});
			},
			
			functions: {
				primary: function () {
					if (this.get("enable_primary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				secondary: function () {
					if (this.get("enable_secondary_select"))
						return;
					if (Info.isMobile() && Info.isAndroid() && Info.isCordova())
						this.__recordCordova();
					else
						this.trigger("record");
				},
				primary_select: function (domEvent) {
					if (!this.get("enable_primary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				},
				secondary_select: function (domEvent) {
					if (!this.get("enable_secondary_select"))
						return;
					this.trigger("upload", domEvent[0].target);
				}
			}
			
		};
	}).register("ba-videorecorder-chooser")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"record-video": "Record Your Video",
    	"upload-video": "Upload Video"
    });
});

Scoped.define("module:VideoRecorder.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "base:Timers.Timer"
], [
	"dynamics:Partials.ShowPartial",
	"dynamics:Partials.RepeatPartial"	
], function (Class, Templates, Assets, Timer, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_controlbar,
			
			attrs: {
				"css": "ba-videorecorder",
				"hovermessage": "",
				"recordingindication": true,
				"covershot_accept_string":  "image/*,image/png,image/jpg,image/jpeg"
			},
			
			create: function () {
				this.auto_destroy(new Timer({
					context: this,
					fire: function () {
						this.set("recordingindication", !this.get("recordingindication"));
					},
					delay: 500
				})); },
			
			functions: {
				selectCamera: function (cameraId) {
					this.trigger("select-camera", cameraId);
				},
				selectMicrophone: function (microphoneId) {
					this.trigger("select-microphone", microphoneId);
				},
				hover: function (text) {
					this.set("hovermessage", text);
				},
				unhover: function () {
					this.set("hovermessage", "");
				},
				record: function () {
					this.trigger("invoke-record");
				},
				rerecord: function () {
					this.trigger("invoke-rerecord");
				},
				stop: function () {
					this.trigger("invoke-stop");
				},
				skip: function () {
					this.trigger("invoke-skip");
				},
				uploadCovershot: function (domEvent) {
					this.trigger("upload-covershot", domEvent[0].target);
				}
			}
			
		};
	})
	.register("ba-videorecorder-controlbar")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"settings": "Settings",
    	"camerahealthy": "Lighting is good",
    	"cameraunhealthy": "Lighting is not optimal",
    	"microphonehealthy": "Sound is good",
    	"microphoneunhealthy": "Cannot pick up any sound",
    	"record": "Record",
    	"record-tooltip": "Click here to record.",
    	"rerecord": "Redo",
    	"rerecord-tooltip": "Click here to redo.",
    	"upload-covershot": "Upload",
    	"upload-covershot-tooltip": "Click here to upload custom cover shot",
    	"stop": "Stop",
    	"stop-tooltip": "Click here to stop.",
    	"skip": "Skip",
    	"skip-tooltip": "Click here to skip."
    });
});
Scoped.define("module:VideoRecorder.Dynamics.Imagegallery", [
    "dynamics:Dynamic",
    "module:Templates",
    "base:Collections.Collection",
    "base:Properties.Properties",
    "jquery:",
    "base:Timers.Timer"
], [
    "dynamics:Partials.StylesPartial"
], function (Class, Templates, Collection, Properties, $, Timer, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_imagegallery,
			
			attrs: {
				"css": "ba-videorecorder",
				"imagecount": 3,
				"imagenativewidth": 0,
				"imagenativeheight": 0,
				"containerwidth": 0,
				"containerheight": 0,
				"containeroffset": 0,
				"deltafrac": 1/8
			},
			
			computed: {
				"imagewidth:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 0)
						return 0.0;
					return this.get("containerwidth") * (1 - this.get("deltafrac")) / this.get("imagecount");
				},
				"imagedelta:imagecount,containerwidth,deltafrac": function () {
					if (this.get("imagecount") <= 1)
						return 0.0;
					return this.get("containerwidth") * (this.get("deltafrac")) / (this.get("imagecount") - 1);
				},
				"imageheight:imagewidth,imagenativewidth,imagenativeheight": function () {
					return this.get("imagenativeheight") * this.get("imagewidth") / this.get("imagenativewidth");
				}
			},
			
			create: function () {
				var images = this.auto_destroy(new Collection());
				this.set("images", images);
				this.snapshotindex = 0;
				this._updateImageCount();
				this.on("change:imagecount", this._updateImageCount, this);
				this.on("change:imagewidth change:imageheight change:imagedelta", this._recomputeImageBoxes, this);
				this.auto_destroy(new Timer({
					context: this,
					delay: 1000,
					fire: function () {
						this.updateContainerSize();
					}
				}));
			},
			
			destroy: function () {
				this.get("images").iterate(function (image) {
					if (image.snapshotDisplay && this.parent().recorder)
						this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
				}, this);
				inherited.destroy.call(this);
			},
			
			_updateImageCount: function () {
				var images = this.get("images");
				var n = this.get("imagecount");
				while (images.count() < n) {
					var image = new Properties({index: images.count()});
					this._recomputeImageBox(image);
					images.add(image);
				}
				while (images.count() > n)
					images.remove(images.getByIndex(images.count() - 1));
			},
			
			_recomputeImageBoxes: function () {
				this.get("images").iterate(function (image) {
					this._recomputeImageBox(image);
				}, this);
			},
			
			_recomputeImageBox: function (image) {
				if (!this.parent().recorder)
					return;
				var i = image.get("index");
				var iw = this.get("imagewidth");
				var ih = this.get("imageheight");
				var id = this.get("imagedelta");
				var h = this.get("containerheight");
				image.set("left", 1+Math.round(i * (iw + id)));
				image.set("top", 1+Math.round((h - ih) / 2));
				image.set("width", 1+Math.round(iw));
				image.set("height", 1+Math.round(ih));
				if (image.snapshot && image.snapshotDisplay) {
					this.parent().recorder.updateSnapshotDisplay(
						image.snapshot,
						image.snapshotDisplay,
						image.get("left") + this.get("containeroffset"),
						image.get("top"),
						image.get("width"),
						image.get("height")
					);
				}
			},
			
			updateContainerSize: function () {
				var container = this.activeElement().find("[data-gallery-container]");
				this.set("containeroffset", parseInt(container.position().left, 10));
				this.set("containerheight", parseInt(container.height(), 10));
				this.set("containerwidth", parseInt(container.width(), 10));
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.apply(this, arguments);
				this.updateContainerSize();
			},
			
			loadImageSnapshot: function (image, snapshotindex) {
				if (image.snapshotDisplay) {
					this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
					image.snapshotDisplay = null;
				}
				var snapshots = this.parent().snapshots;
				image.snapshot = snapshots[((snapshotindex % snapshots.length) + snapshots.length) % snapshots.length]; 
				image.snapshotDisplay = this.parent().recorder.createSnapshotDisplay(
					this.activeElement().get(0),
					image.snapshot,
					image.get("left") + this.get("containeroffset"),
					image.get("top"),
					image.get("width"),
					image.get("height")
				);
			},
			
			loadSnapshots: function () {
				this.get("images").iterate(function (image) {
					this.loadImageSnapshot(image, this.snapshotindex + image.get("index"));
				}, this);
			},
			
			nextSnapshots: function () {
				this.snapshotindex += this.get("imagecount");
				this.loadSnapshots();
			},
			
			prevSnapshots: function () {
				this.snapshotindex -= this.get("imagecount");
				this.loadSnapshots();
			},
			
			functions: {
				left: function () {
					this.prevSnapshots();
				},
				right: function () {
					this.nextSnapshots();
				},
				select: function (image) {
					this.trigger("image-selected", image.snapshot);
				}
			}
			
		};
	}).register("ba-videorecorder-imagegallery");
});
Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets"
], [
	"dynamics:Partials.ShowPartial"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_loader,
			
			attrs: {
				"css": "ba-videorecorder",
				"tooltip": "",
				"label": "",
				"message": ""
			},

			functions: {
        hover: function (text) {
          this.set("hovermessage", text);
        },

        unhover: function () {
          this.set("hovermessage", "");
        },

				freeze: function () {
        	console.log('Will stop timer');
				}
			}
			
		};
	}).register("ba-videorecorder-loader")
		.attachStringTable(Assets.strings)
      .addStrings({
        "starts-in": "Starts in ",
				"wait": "Wait",
				"wait-tooltip": "Wait"
      });
});
Scoped.define("module:VideoRecorder.Dynamics.Message", [
    "dynamics:Dynamic",
    "module:Templates"
], [
    "dynamics:Partials.ClickPartial"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_message,
			
			attrs: {
				"css": "ba-videorecorder",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					this.trigger("click");
				}
				
			}
			
		};
	}).register("ba-videorecorder-message");
});

Scoped.define("module:VideoRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Templates",
    "module:Assets",
    "browser:Info",
    "browser:Upload.MultiUploader",
    "browser:Upload.FileUploader",
    "media:Recorder.VideoRecorderWrapper",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "base:Collections.Collection",
    "base:Promise",
    "module:VideoRecorder.Dynamics.RecorderStates.Initial",
    "module:VideoRecorder.Dynamics.RecorderStates"
], [
    "module:VideoRecorder.Dynamics.Imagegallery",
    "module:VideoRecorder.Dynamics.Loader",
    "module:VideoRecorder.Dynamics.Controlbar",
    "module:VideoRecorder.Dynamics.Message",
    "module:VideoRecorder.Dynamics.Topmessage",
    "module:VideoRecorder.Dynamics.Chooser",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.TemplatePartial"
], function (Class, Templates, Assets, Info, MultiUploader, FileUploader, VideoRecorderWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.recorder,
			
			attrs: {
				/* CSS */
				"css": "ba-videorecorder",
				"iecss": "ba-videorecorder",
				"cssimagegallery": "",
				"cssloader": "",
				"csscontrolbar": "",
				"cssmessage": "",
				"csstopmessage": "",
				"csschooser": "",
				"width": "",
				"height": "",
				"gallerysnapshots": 3,

				/* Themes */
				"theme": "",
				"csstheme": "",

				/* Dynamics */
				"dynimagegallery": "videorecorder-imagegallery",
				"dynloader": "videorecorder-loader",
				"dyncontrolbar": "videorecorder-controlbar",
				"dynmessage": "videorecorder-message",
				"dyntopmessage": "videorecorder-topmessage",
				"dynchooser": "videorecorder-chooser",
				"dynvideoplayer": "videoplayer",

				/* Templates */
				"tmplimagegallery": "",
				"tmplloader": "",
				"tmplcontrolbar": "",
				"tmplmessage": "",
				"tmpltopmessage": "",
				"tmplchooser": "",

				/* Attributes */
				"autorecord": false,
				"autoplay": false,
				"allowrecord": true,
				"allowupload": true,
				"allowcustomupload": true,
				"primaryrecord": true,
				"nofullscreen": false,
				"recordingwidth": 640,
				"recordingheight": 480,
				"countdown": 3,
				"snapshotmax": 15,
				"framerate": null,
				"snapshottype": "jpg",
				"picksnapshots": true,
				"playbacksource": "",
				"playbackposter": "",
				"recordermode": true,
				"skipinitial": false,
				"timelimit": null,
				"timeminlimit": null,
				"rtmpstreamtype": "mp4",
				"rtmpmicrophonecodec": "speex",
				"microphone-volume": 1.0,
				"flip-camera": false,
				"early-rerecord": false,
				"custom-covershots": false,
				"manualsubmit": false,
				"allowedextensions": null,
				"filesizelimit": null,

				/* Configuration */
				"forceflash": false,
				"noflash": false,
				"noaudio": false,
				"flashincognitosupport": false,
				"localplayback": false,
				"uploadoptions": {},
				"playerattrs": {},

				/* Options */
				"rerecordable": true,
				"recordings": null,
				"ready": true,
				"stretch": false
			},
			
			scopes: {
				player: ">[id='player']"
			},

			types: {
				"forceflash": "boolean",
				"noflash": "boolean",
				"rerecordable": "boolean",
				"ready": "boolean",
				"stretch": "boolean",
				"autorecord": "boolean",
				"autoplay": "boolean",
				"allowrecord": "boolean",
				"allowupload": "boolean",
				"allowcustomupload": "boolean",
				"primaryrecord": "boolean",
				"flashincognitosupport": "boolean",
				"recordermode": "boolean",
				"nofullscreen": "boolean",
				"picksnapshots": "boolean",
				"localplayback": "boolean",
				"noaudio": "boolean",
				"skipinitial": "boolean",
				"microphone-volume": "float",
				"flip-camera": "boolean",
				"early-rerecord": "boolean",
				"custom-covershots": "boolean",
				"manualsubmit": "boolean"
			},
			
			extendables: ["states"],
			
			remove_on_destroy: true,
			
			create: function () {
				
				if (this.get("theme") in Assets.recorderthemes) {
					Objs.iter(Assets.recorderthemes[this.get("theme")], function (value, key) {
						if (!this.isArgumentAttr(key))
							this.set(key, value);
					}, this);
				}
				this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
				this.set("hideoverlay", false);
				
				if (Info.isMobile())
					this.set("skipinitial", false);

				this.__attachRequested = false;
				this.__activated = false;
				this._bound = false;
				this.__recording = false;
				this.__error = null;
				this.__currentStretch = null;
				
				this.on("change:stretch", function () {
					this._updateStretch();
				}, this);
				this.host = this.auto_destroy(new Host({
					stateRegistry: new ClassRegistry(this.cls.recorderStates())
				}));
				this.host.dynamic = this;
				this.host.initialize(InitialState);
				
				this._timer = this.auto_destroy(new Timers.Timer({
					context: this,
					fire: this._timerFire,
					delay: 250,
					start: true
				}));
				
				this.__cameraResponsive = true;
				this.__cameraSignal = true;
				
			},
			
			state: function () {
				return this.host.state();
			},
			
			recorderAttached: function () {
				return !!this.recorder;
			},
			
			videoError: function () {
				return this.__error;
			},
			
			_error: function (error_type, error_code) {
				this.__error = {
					error_type: error_type,
					error_code: error_code
				};
				this.trigger("error:" + error_type, error_code);
				this.trigger("error", error_type, error_code);
			},
			
			_clearError: function () {
				this.__error = null;
			},
			
			_detachRecorder: function () {
				if (this.recorder)
					this.recorder.weakDestroy();
				this.recorder = null;
				this.set("hasrecorder", false);
			},
			
			_attachRecorder: function () {
				if (this.recorderAttached())
					return;
				if (!this.__activated) {
					this.__attachRequested = true;
					return;
				}
				this.set("hasrecorder", true);
				this.snapshots = [];
				this.__attachRequested = false;
				var video = this.element().find("[data-video='video']").get(0);
				this._clearError();
				this.recorder = VideoRecorderWrapper.create({
					element: video,
			    	forceflash: this.get("forceflash"),
			    	noflash: this.get("noflash"),
			    	recordVideo: true,
			    	recordAudio: !this.get("noaudio"),
			    	recordingWidth: this.get("recordingwidth"),
			    	recordingHeight: this.get("recordingheight"),
			    	flashFullSecurityDialog: !this.get("flashincognitosupport"),
			    	rtmpStreamType: this.get("rtmpstreamtype"),
			    	rtmpMicrophoneCodec: this.get("rtmpmicrophonecodec"),
			    	framerate: this.get("framerate"),
			    	flip: this.get("flip-camera")
			    });
				if (!this.recorder)
					this._error("attach");
			},
			
			_bindMedia: function () {
				if (this._bound || !this.recorderAttached() || !this.recorder)
					return;
				this.recorder.ready.success(function () {
					this.recorder.on("require_display", function () {
						this.set("hideoverlay", true);
					}, this);
					this.recorder.bindMedia().error(function (e) {
						this.trigger("access_forbidden", e);
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this._error("bind", e);
					}, this).success(function () {
						this.trigger("access_granted");
						this.recorder.setVolumeGain(this.get("microphone-volume"));
						this.set("hideoverlay", false);
						this.off("require_display", null, this);
						this.recorder.enumerateDevices().success(function (devices) {
							var selected = this.recorder.currentDevices();
							this.set("selectedcamera", selected.video);
							this.set("selectedmicrophone", selected.audio);
							this.set("cameras", new Collection(Objs.values(devices.video)));
							this.set("microphones", new Collection(Objs.values(devices.audio)));
						}, this);
						if (!this.get("noaudio"))
							this.recorder.testSoundLevel(true);
						this.set("devicetesting", true);
						this._updateStretch();
						while (this.snapshots.length > 0) {
							var snapshot = this.snapshots.unshift();
							this.recorder.removeSnapshot(snapshot);
						}
						this._bound = true;
						this.trigger("bound");
					}, this);
				}, this);
			},
			
			isFlash: function () {
				return this.recorder && this.recorder.isFlash();
			},
			
			_initializeUploader: function () {
				if (this._dataUploader)
					this._dataUploader.weakDestroy();
				this._dataUploader = new MultiUploader();
			},
			
			_unbindMedia: function () {
				if (!this._bound)
					return;
				this.recorder.unbindMedia();
				this._bound = false;
			},
			
			_uploadCovershot: function (image) {
				this.__lastCovershotUpload = image;
				var uploader = this.recorder.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image);
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_uploadCovershotFile: function (file) {
				this.__lastCovershotUpload = file;
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").image));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},

			_uploadVideoFile: function (file) {
				var uploader = FileUploader.create(Objs.extend({ source: file }, this.get("uploadoptions").video));
				uploader.upload();
				this._dataUploader.addUploader(uploader);
			},
			
			_prepareRecording: function () {
				return Promise.create(true);
			},
			
			_startRecording: function () {
				if (this.__recording)
					return Promise.error(true);
				if (!this.get("noaudio"))
					this.recorder.testSoundLevel(false);
				this.set("devicetesting", false);
				return this.recorder.startRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio
				}).success(function () {
					this.__recording = true;
					this.__recording_start_time = Time.now();
				}, this);
			},
			
			_stopRecording: function () {
				if (!this.__recording)
					return Promise.error(true);
				return this.recorder.stopRecord({
					rtmp: this.get("uploadoptions").rtmp,
					video: this.get("uploadoptions").video,
					audio: this.get("uploadoptions").audio
				}).success(function (uploader) {
					this.__recording = false;
					uploader.upload();
					this._dataUploader.addUploader(uploader);
				}, this);
			},
			
			_verifyRecording: function () {
				return Promise.create(true);
			},
			
			_afterActivate: function (element) {
				inherited._afterActivate.call(this, element);
				this.__activated = true;
				if (this.__attachRequested)
					this._attachRecorder();
			},
			
			_showBackgroundSnapshot: function () {
				this._hideBackgroundSnapshot();
				this.__backgroundSnapshot = this.recorder.createSnapshot(this.get("snapshottype"));
				var el = this.activeElement().find("[data-video]");
				this.__backgroundSnapshotDisplay = this.recorder.createSnapshotDisplay(
					el.get(0),
					this.__backgroundSnapshot,
					0,
					0,
					parseInt(el.width(), 10),
					parseInt(el.height(), 10)
				);
			},
			
			_hideBackgroundSnapshot: function () {
				if (this.__backgroundSnapshotDisplay)
					this.recorder.removeSnapshotDisplay(this.__backgroundSnapshotDisplay);
				delete this.__backgroundSnapshotDisplay;
				if (this.__backgroundSnapshot)
					this.recorder.removeSnapshot(this.__backgroundSnapshot);
				delete this.__backgroundSnapshot;
			},
			
			object_functions: ["record", "rerecord", "stop", "play", "pause", "reset"],

			functions: {
				
				record: function () {
					this.host.state().record();
				},
				
				record_video: function () {
					this.host.state().selectRecord();
				},
				
				upload_video: function (file) {
					this.host.state().selectUpload(file);
				},
				
				upload_covershot: function (file) {
					this.host.state().uploadCovershot(file);
				},

				select_camera: function (camera_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({video: camera_id});
						this.set("selectedcamera", camera_id);
					}
				},
				
				select_microphone: function (microphone_id) {
					if (this.recorder) {
						this.recorder.setCurrentDevices({audio: microphone_id});
						this.recorder.testSoundLevel(true);
						this.set("selectedmicrophone", microphone_id);
					}
					this.set("microphonehealthy", false);
				},
				
				invoke_skip: function () {
					this.trigger("invoke-skip");
				},
				
				select_image: function (image) {
					this.trigger("select-image", image);
				},
				
				rerecord: function () {
					if (confirm(this.string("rerecord-confirm")))
						this.host.state().rerecord();
				},

				stop: function () {
					this.host.state().stop();
				},
				
				play: function () {
					this.host.state().play();
				},

				pause: function () {
					this.host.state().pause();
				},
				
				message_click: function () {
					this.trigger("message-click");
				},
				
				playing: function () {
					this.trigger("playing");
				},
				
				paused: function () {
					this.trigger("paused");
				},
				
				ended: function () {
					this.trigger("ended");
				},
				
				reset: function () {
					this._stopRecording().callback(function () {
						this._detachRecorder();
						this.host.state().next("Initial");
					}, this);
				},
				
				manual_submit: function () {
					this.set("rerecordable", false);
					this.set("manualsubmit", false);
					this.trigger("manually_submitted");
				}
						
			},
			
			destroy: function () {
				this._detachRecorder();
				inherited.destroy.call(this);
			},
			
			deltaCoefficient: function () {
				return this.recorderAttached() ? this.recorder.deltaCoefficient() : null;
			},

			blankLevel: function () {
				return this.recorderAttached() ? this.recorder.blankLevel() : null;
			},

			lightLevel: function () {
				return this.recorderAttached() ? this.recorder.lightLevel() : null;
			},
			
			soundLevel: function () {
				return this.recorderAttached() ? this.recorder.soundLevel() : null;
			},
			
			_timerFire: function () {
				try {
					if (this.recorderAttached() && this.get("devicetesting")) {
						var lightLevel = this.lightLevel();
						this.set("camerahealthy", lightLevel >= 100 && lightLevel <= 200);
						if (!this.get("noaudio") && !this.get("microphonehealthy") && this.soundLevel() >= 1.01) {
							this.set("microphonehealthy", true);
							this.recorder.testSoundLevel(false);
						}
					}
				} catch (e) {}
				
				if (this.__recording && this.__recording_start_time + 500 < Time.now()) {
					var p = this.snapshots.length < this.get("snapshotmax") ? 0.25 : 0.05;
					if (Math.random() <= p) {
						var snap = this.recorder.createSnapshot(this.get("snapshottype"));
						if (snap) {
							if (this.snapshots.length < this.get("snapshotmax")) {
								this.snapshots.push(snap);
							} else {
								var i = Math.floor(Math.random() * this.get("snapshotmax"));
								this.recorder.removeSnapshot(this.snapshots[i]);
								this.snapshots[i] = snap;
							}
						}
					}
				}
				
				try {
					if (this.recorderAttached() && this._timer.fire_count() % 20 === 0 && this._accessing_camera) {
						var signal = this.blankLevel() >= 0.01;
						if (signal !== this.__cameraSignal) {
							this.__cameraSignal = signal;
							this.trigger(signal ? "camera_signal" : "camera_nosignal");
						}
					}
					if (this.recorderAttached() && this._timer.fire_count() % 20 === 10 && this._accessing_camera) {
						var delta = this.recorder.deltaCoefficient(); 
						var responsive = delta === null || delta >= 0.5;
						if (responsive !== this.__cameraResponsive) {
							this.__cameraResponsive = responsive;
							this.trigger(responsive ? "camera_responsive" : "camera_unresponsive");
						}
					}
				} catch (e) {}
				
				this._updateStretch();
				this._updateCSSSize();
			},
			
			_updateCSSSize: function () {
				this.set("csssize", this.element().width() > 400 ? "normal" : (this.element().width() > 300 ? "medium" : "small"));
			},
			
			videoHeight: function () {
				return this.recorderAttached() ? this.recorder.cameraHeight() : NaN;
			},
			
			videoWidth: function () {
				return this.recorderAttached() ? this.recorder.cameraWidth() : NaN;
			},
			
			aspectRatio: function () {
				return this.videoWidth() / this.videoHeight();
			},
			
			parentWidth: function () {
				return this.get("width") || this.activeElement().width();
			},
			
			parentHeight: function () {
				return this.get("height") || this.activeElement().height();
			},

			parentAspectRatio: function () {
				return this.parentWidth() / this.parentHeight();
			},
			
			averageFrameRate: function () {
				return this.recorderAttached() ? this.recorder.averageFrameRate() : null;
			},
			
			_updateStretch: function () {
				var newStretch = null;
				if (this.get("stretch")) {
					var ar = this.aspectRatio();
					if (isFinite(ar)) {
						var par = this.parentAspectRatio();
						if (isFinite(par)) {
							if (par > ar)
								newStretch = "height";
							if (par < ar)
								newStretch = "width";
						} else if (par === Infinity)
							newStretch = "height";
					}
				}
				if (this.__currentStretch !== newStretch) {
					if (this.__currentStretch)
						this.activeElement().removeClass(this.get("css") + "-stretch-" + this.__currentStretch);
					if (newStretch)
						this.activeElement().addClass(this.get("css") + "-stretch-" + newStretch);
				}
				this.__currentStretch = newStretch;				
			}
			
		};
	}, {
		
		recorderStates: function () {
			return [RecorderStates];
		}
		
	}).register("ba-videorecorder")
	.attachStringTable(Assets.strings)
    .addStrings({
    	"recorder-error": "An error occurred, please try again later. Click to retry.",
    	"attach-error": "We could not access the camera interface. Depending on the device and browser, you might need to install Flash or access the page via SSL.",
    	"access-forbidden": "Access to the camera was forbidden. Click to retry.",
    	"pick-covershot": "Pick a covershot.",
    	"uploading": "Uploading",
    	"uploading-failed": "Uploading failed - click here to retry.",
    	"verifying": "Verifying",
    	"verifying-failed": "Verifying failed - click here to retry.",
    	"rerecord-confirm": "Do you really want to redo your video?",
    	"video_file_too_large": "Your video file is too large - click here to try again with a smaller video file.",
    	"unsupported_video_type": "Please upload: %s - click here to retry."    		
    });
});
Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function (State, ListenMixin, Objs, scoped) {
	return State.extend({scoped: scoped}, [ListenMixin, {

		dynamics: [],
	
		_start: function () {
			this.dyn = this.host.dynamic;
			Objs.iter(Objs.extend({
				"message": false,
				"chooser": false,
				"topmessage": false,
				"controlbar": false,
				"loader": false,
				"imagegallery": false
			}, Objs.objectify(this.dynamics)), function (value, key) {
				this.dyn.set(key + "_active", value);
			}, this);
			this.dyn.set("playertopmessage", "");
			this.dyn._accessing_camera = false;
			this._started();
		},
		
		_started: function () {},
		
		record: function () {
			this.dyn.set("autorecord", true);
		},
		
		stop: function () {
			this.dyn.scopes.player.execute('stop');
		},
		
		play: function () {
			this.dyn.scopes.player.execute('play');
		},
		
		pause: function () {
			this.dyn.scopes.player.execute('pause');
		},		
		
		rerecord: function () {},
		
		selectRecord: function () {},
		
		selectUpload: function (file) {},
		
		uploadCovershot: function (file) {}
	
	}]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"browser:Info",
	"base:Timers.Timer"
], function (State, Info, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["message"],
		_locals: ["message", "retry", "flashtest"],

		_started: function () {
			this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
			this.listenOn(this.dyn, "message-click", function () {
				if (this._retry)
					this.next(this._retry);
			});
			if (this._flashtest && !Info.isMobile() && Info.flash().supported() && !Info.flash().installed()) {
				this.auto_destroy(new Timer({
					delay: 500,
					context: this,
					fire: function () {
						if (Info.flash(true).installed())
							this.next(this._retry);
					}
				}));
				if (Info.isSafari() && Info.safariVersion() >= 10)
					document.location.href = "//get.adobe.com/flashplayer";
			}
		}

	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		_started: function () {
			this.dyn.set("player_active", false);
			this.dyn._initializeUploader();
			if (!this.dyn.get("recordermode"))
				this.next("Player");
			else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
				this.eventualNext("CameraAccess");
			else
				this.next("Chooser");
		}
	
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		rerecord: function () {
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		_started: function () {
			this.dyn.set("player_active", true);
		},
		
		_end: function () {
			this.dyn.set("player_active", false);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"jquery:",
	"base:Strings",
	"browser:Info"
], function (State, $, Strings, Info, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["chooser"],
		
		record: function () {
			this.dyn.set("autorecord", true);
			this.selectRecord();
		},
		
		selectRecord: function () {
			this.next("CameraAccess");
		},
		
		selectUpload: function (file) {
			if (!(Info.isMobile() && Info.isAndroid() && Info.isCordova())) {
				if (this.dyn.get("allowedextensions")) {
					var filename = $(file).val().toLowerCase();
					var found = false;
					this.dyn.get("allowedextensions").forEach(function (extension) {
						if (Strings.ends_with(filename, "." + extension.toLowerCase()))
							found = true;
					}, this);
					if (!found) {
						this.next("FatalError", {
							message: this.dyn.strings("unsupported_video_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
							retry: "Chooser"
						});
						return;
					}
				}
				if (this.dyn.get("filesizelimit")) {
					var f = file;
					if (f.files && f.files.length > 0 && f.files[0].size > this.dyn.get("filesizelimit")) {
						this.next("FatalError", {
							message: this.dyn.strings("video_file_too_large"),
							retry: "Chooser"
						});
						return;
					}
				}
			}
			this.dyn._prepareRecording().success(function () {
				this.dyn._uploadVideoFile(file);
				this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "Chooser" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer"
], function (State, Timer, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			this.listenOn(this.dyn, "bound", function () {
				var timer = this.auto_destroy(new Timer({
					start: true,
					delay: 100,
					context: this,
					fire: function () {
						if (this.dyn.recorder.blankLevel() >= 0.01 && this.dyn.recorder.deltaCoefficient() >= 0.01) {
							timer.stop();
							this.next("CameraHasAccess");
						}
					}
				}));
			}, this);
			this.listenOn(this.dyn, "error", function (s) {
				this.next("FatalError", { message: this.dyn.string("attach-error"), retry: "Initial", flashtest: true });
			}, this);
			this.listenOn(this.dyn, "access_forbidden", function () {
				this.next("FatalError", { message: this.dyn.string("access-forbidden"), retry: "Initial" });
			}, this);
			this.dyn._attachRecorder();
			if (this.dyn)
				this.dyn._bindMedia();
		}
				
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraHasAccess", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", true);
			this.dyn.set("recordvisible", true);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
			if (this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		},
		
		record: function () {
			if (!this.dyn.get("autorecord"))
				this.next("RecordPrepare");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RecordPrepare", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time"
], function (State, Timer, Time, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["loader"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this._promise = this.dyn._prepareRecording();
			this.dyn.set("message", "");
			if (this.dyn.get("countdown")) {
				this.dyn.set("loaderlabel", this.dyn.get("countdown"));
				var endTime = Time.now() + this.dyn.get("countdown") * 1000;
				var timer = new Timer({
					context: this,
					delay: 100,
					fire: function () {
						var time_left = Math.max(0, endTime - Time.now());
						this.dyn.set("loaderlabel", "" + Math.round(time_left / 1000));
						this.dyn.trigger("countdown", time_left);
						if (endTime <= Time.now()) {
							this.dyn.set("loaderlabel", "");
							timer.stop();
							this._startRecording();
						}
					}
				});				
				this.auto_destroy(timer);
			} else
				this._startRecording();
		},
		
		record: function () {
			this._startRecording();
		},

		_startRecording: function () {
			this._promise.success(function () {
				this.dyn._startRecording().success(function () {
					this.next("Recording");
				}, this).error(function (s) {
					this.next("FatalError", { message: s, retry: "CameraAccess" });
				}, this);
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Recording", [
	"module:VideoRecorder.Dynamics.RecorderStates.State",
	"base:Timers.Timer",
	"base:Time",
	"base:TimeFormat"
], function (State, Timer, Time, TimeFormat, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["topmessage", "controlbar"],
		
		_started: function () {
			this.dyn._accessing_camera = true;
			this.dyn.trigger("recording");
			this.dyn.set("settingsvisible", false);
			this.dyn.set("rerecordvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", true);
			this.dyn.set("skipvisible", false);
			this._startTime = Time.now();
			this._stopping = false;
			this._timer = this.auto_destroy(new Timer({
				immediate: true,
				delay: 10,
				context: this,
				fire: this._timerFire
			}));
		},
		
		_timerFire: function () {
			var limit = this.dyn.get("timelimit");
			var current = Time.now();
			var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
			this.dyn.set("controlbarlabel", TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display));
			if (limit && this._startTime + limit * 1000 <= current) {
				this._timer.stop();
				this.stop();
			}
		},
		
		stop: function () {
			var minlimit = this.dyn.get("timeminlimit");
			if (minlimit) {
				var delta = Time.now() - this._startTime;
				if (delta < minlimit) {
					var limit = this.dyn.get("timelimit");
					if (!limit || limit > delta)
						return;
				}
			}
			if (this._stopping)
				return;
			this._stopping = true;
			this.dyn._stopRecording().success(function () {
				this.dyn._showBackgroundSnapshot();
				this.dyn._unbindMedia();
				this.dyn.trigger("recording_stopped");
				if (this.dyn.get("picksnapshots") && this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
					this.next("CovershotSelection");
				else
					this.next("Uploading");
			}, this).error(function (s) {
				this.next("FatalError", { message: s, retry: "CameraAccess" });
			}, this);
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CovershotSelection", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, {
		
		dynamics: ["imagegallery", "topmessage", "controlbar"],
		
		_started: function () {
			this.dyn.set("settingsvisible", false);
			this.dyn.set("recordvisible", false);
			this.dyn.set("stopvisible", false);
			this.dyn.set("skipvisible", false);
			this.dyn.set("controlbarlabel", "");
      this.dyn.set("rerecordvisible", true);
			//this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			this.dyn.set("uploadcovershotvisible", this.dyn.get("custom-covershots"));
			this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
			var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
			imagegallery.loadSnapshots();
			imagegallery.updateContainerSize();
			this.listenOn(this.dyn, "invoke-skip", function () {
				this.next("Uploading");
			}, this);
			this.listenOn(this.dyn, "select-image", function (image) {
				this.dyn._uploadCovershot(image);
				this.next("Uploading");
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		},
		
		uploadCovershot: function (file) {
			this.dyn._uploadCovershotFile(file);
			this.next("Uploading");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("uploading");
			this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
			if (this.dyn.get("early-rerecord"))
				this.dyn.set("controlbar_active", true);
			this.dyn.set("topmessage", "");
			this.dyn.set("message", this.dyn.string("uploading"));
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			var uploader = this.dyn._dataUploader;
			this.listenOn(uploader, "success", function () {
				this.dyn.trigger("uploaded");
				this.next("Verifying");
			});
			this.listenOn(uploader, "error", function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("uploading-failed"),
					retry: this.dyn.recorderAttached() ? "Uploading" : "Initial"
				});
			});
			this.listenOn(uploader, "progress", function (uploaded, total) {
				if (total !== 0) {
					this.dyn.trigger("upload_progress", uploaded / total);
					this.dyn.set("message", this.dyn.string("uploading") + ": " + Math.round(uploaded / total * 100) + "%");
					this.dyn.set("playertopmessage", this.dyn.get("message"));
				}
			});
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("playbacksource", this.dyn.recorder.localPlaybackSource());
				if (this.dyn.__lastCovershotUpload)
					this.dyn.set("playbackposter", this.dyn.recorder.snapshotToLocalPoster(this.dyn.__lastCovershotUpload));
				this.dyn.set("loader_active", false);
				this.dyn.set("message_active", false);
				this.dyn._hideBackgroundSnapshot();
				this.dyn.set("player_active", true);
			}
			uploader.reset();
			uploader.upload();
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		}
		
	});
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Verifying", [
	"module:VideoRecorder.Dynamics.RecorderStates.State"
], function (State, scoped) {
	return State.extend({scoped: scoped}, { 
		
		dynamics: ["loader", "message"],
		
		_started: function () {
			this.dyn.trigger("verifying");
			this.dyn.set("message", this.dyn.string("verifying") + "...");
			this.dyn.set("playertopmessage", this.dyn.get("message"));
			if (this.dyn.get("localplayback") && this.dyn.recorder && this.dyn.recorder.supportsLocalPlayback()) {
				this.dyn.set("loader_active", false);
				this.dyn.set("message_active", false);
			} else {
				this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
				if (this.dyn.get("early-rerecord"))
					this.dyn.set("controlbar_active", true);
			}
			this.dyn._verifyRecording().success(function () {
				this.dyn.trigger("verified");
				this.dyn._hideBackgroundSnapshot();
				this.dyn._detachRecorder();
				if (this.dyn.get("recordings"))
					this.dyn.set("recordings", this.dyn.get("recordings") - 1);
				this.next("Player");
			}, this).error(function () {
				this.dyn.set("player_active", false);
				this.next("FatalError", {
					message: this.dyn.string("verifying-failed"),
					retry: this.dyn.recorderAttached() ? "Verifying" : "Initial"
				});
			}, this);
		},
		
		rerecord: function () {
			this.dyn._hideBackgroundSnapshot();
			this.dyn._detachRecorder();
			this.dyn.trigger("rerecord");
			this.dyn.set("recordermode", true);
			this.next("Initial");
		}
		
	});
});
Scoped.define("module:VideoRecorder.Dynamics.Topmessage", [
    "dynamics:Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.video_recorder_topmessage,
			
			attrs: {
				"css": "ba-videorecorder",
				"topmessage": ''
			}
			
		};
	}).register("ba-videorecorder-topmessage");
});
}).call(Scoped);