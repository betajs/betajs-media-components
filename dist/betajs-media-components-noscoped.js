/*!
betajs-media-components - v0.0.87 - 2018-01-22
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
Scoped.define("module:", function () {
	return {
    "guid": "7a20804e-be62-4982-91c6-98eb096d2e70",
    "version": "0.0.87"
};
});
Scoped.assumeVersion('base:version', '~1.0.96');
Scoped.assumeVersion('browser:version', '~1.0.65');
Scoped.assumeVersion('flash:version', '~0.0.18');
Scoped.assumeVersion('dynamics:version', '~0.0.83');
Scoped.assumeVersion('media:version', '~0.0.45');
Scoped.extend("module:Assets", ["module:Assets"], function (Assets) {
    var languages = {"language:ar":{"ba-videoplayer-playbutton.tooltip":"&#x627;&#x646;&#x642;&#x631; &#x644;&#x62A;&#x634;&#x63A;&#x64A;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;.","ba-videoplayer-playbutton.rerecord":"&#x627;&#x639;&#x62F; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;","ba-videoplayer-playbutton.submit-video":"&#x62A;&#x623;&#x643;&#x64A;&#x62F; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videoplayer-loader.tooltip":"&#x62C;&#x627;&#x631; &#x62A;&#x62D;&#x645;&#x64A;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648; ...","ba-videoplayer-controlbar.change-resolution":"&#x62A;&#x63A;&#x64A;&#x64A;&#x631; &#x627;&#x644;&#x62F;&#x642;&#x629;","ba-videoplayer-controlbar.video-progress":"&#x62A;&#x642;&#x62F;&#x645; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videoplayer-controlbar.rerecord-video":"&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;&#x61F;","ba-videoplayer-controlbar.submit-video":"&#x62A;&#x623;&#x643;&#x64A;&#x62F; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videoplayer-controlbar.play-video":"&#x634;&#x63A;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videoplayer-controlbar.pause-video":"&#x625;&#x64A;&#x642;&#x627;&#x641; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648; &#x645;&#x624;&#x642;&#x62A;&#x627;","ba-videoplayer-controlbar.elapsed-time":"&#x627;&#x644;&#x648;&#x642;&#x62A; &#x627;&#x644;&#x645;&#x646;&#x642;&#x636;&#x64A;","ba-videoplayer-controlbar.total-time":"&#x637;&#x648;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648; &#x627;&#x644;&#x643;&#x644;&#x64A;","ba-videoplayer-controlbar.fullscreen-video":"&#x639;&#x631;&#x636; &#x645;&#x644;&#x621; &#x627;&#x644;&#x634;&#x627;&#x634;&#x629;","ba-videoplayer-controlbar.volume-button":"&#x62A;&#x639;&#x64A;&#x64A;&#x646; &#x645;&#x633;&#x62A;&#x648;&#x649; &#x627;&#x644;&#x635;&#x648;&#x62A;","ba-videoplayer-controlbar.volume-mute":"&#x643;&#x62A;&#x645; &#x627;&#x644;&#x635;&#x648;&#x62A;","ba-videoplayer-controlbar.volume-unmute":"&#x625;&#x644;&#x63A;&#x627;&#x621; &#x643;&#x62A;&#x645; &#x627;&#x644;&#x635;&#x648;&#x62A;","ba-videoplayer.video-error":"&#x644;&#x642;&#x62F; &#x62D;&#x62F;&#x62B; &#x62E;&#x637;&#x623;&#x60C; &#x631;&#x62C;&#x627;&#x621; &#x623;&#x639;&#x62F; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629; &#x644;&#x627;&#x62D;&#x642;&#x627;. &#x627;&#x646;&#x642;&#x631; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videorecorder-chooser.record-video":"&#x62A;&#x633;&#x62C;&#x64A;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videorecorder-chooser.upload-video":"&#x631;&#x641;&#x639; &#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videorecorder-controlbar.settings":"&#x625;&#x639;&#x62F;&#x627;&#x62F;&#x627;&#x62A;","ba-videorecorder-controlbar.camerahealthy":"&#x627;&#x644;&#x625;&#x636;&#x627;&#x621;&#x629; &#x62C;&#x64A;&#x62F;&#x629;","ba-videorecorder-controlbar.cameraunhealthy":"&#x627;&#x644;&#x625;&#x636;&#x627;&#x621;&#x629; &#x644;&#x64A;&#x633;&#x62A; &#x627;&#x644;&#x623;&#x645;&#x62B;&#x644;","ba-videorecorder-controlbar.microphonehealthy":"&#x627;&#x644;&#x635;&#x648;&#x62A; &#x62C;&#x64A;&#x62F;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x644;&#x627; &#x64A;&#x645;&#x643;&#x646; &#x627;&#x644;&#x62A;&#x642;&#x627;&#x637; &#x623;&#x64A; &#x635;&#x648;&#x62A;","ba-videorecorder-controlbar.record":"&#x633;&#x62C;&#x644;","ba-videorecorder-controlbar.record-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x644;&#x62A;&#x633;&#x62C;&#x64A;&#x644;.","ba-videorecorder-controlbar.rerecord":"&#x627;&#x639;&#x62F; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x644;&#x625;&#x639;&#x627;&#x62F;&#x629;.","ba-videorecorder-controlbar.upload-covershot":"&#x631;&#x641;&#x639; &#x635;&#x648;&#x631;&#x629; &#x627;&#x644;&#x648;&#x627;&#x62C;&#x647;&#x629;.","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x62A;&#x62D;&#x645;&#x64A;&#x644; &#x644;&#x642;&#x637;&#x629; &#x645;&#x62E;&#x635;&#x635;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videorecorder-controlbar.stop":"&#x62A;&#x648;&#x642;&#x641;","ba-videorecorder-controlbar.stop-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x644;&#x62A;&#x648;&#x642;&#x641;.","ba-videorecorder-controlbar.skip":"&#x62A;&#x62E;&#x637;&#x649;","ba-videorecorder-controlbar.skip-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x644;&#x62A;&#x62E;&#x637;&#x64A;.","ba-videorecorder.recorder-error":"&#x644;&#x642;&#x62F; &#x62D;&#x62F;&#x62B; &#x62E;&#x637;&#x623;&#x60C; &#x631;&#x62C;&#x627;&#x621; &#x623;&#x639;&#x62F; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629; &#x644;&#x627;&#x62D;&#x642;&#x627;. &#x627;&#x646;&#x642;&#x631; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videorecorder.attach-error":"&#x644;&#x645; &#x646;&#x62A;&#x645;&#x643;&#x646; &#x645;&#x646; &#x627;&#x644;&#x648;&#x635;&#x648;&#x644; &#x625;&#x644;&#x649; &#x648;&#x627;&#x62C;&#x647;&#x629; &#x627;&#x644;&#x643;&#x627;&#x645;&#x64A;&#x631;&#x627;. &#x627;&#x639;&#x62A;&#x645;&#x627;&#x62F;&#x627; &#x639;&#x644;&#x649; &#x627;&#x644;&#x62C;&#x647;&#x627;&#x632; &#x648;&#x627;&#x644;&#x645;&#x62A;&#x635;&#x641;&#x62D;&#x60C; &#x642;&#x62F; &#x62A;&#x62D;&#x62A;&#x627;&#x62C; &#x625;&#x644;&#x649; &#x62A;&#x62B;&#x628;&#x64A;&#x62A; &#x641;&#x644;&#x627;&#x634; &#x623;&#x648; &#x627;&#x644;&#x648;&#x635;&#x648;&#x644; &#x625;&#x644;&#x649; &#x627;&#x644;&#x635;&#x641;&#x62D;&#x629; &#x639;&#x628;&#x631; &#x645;&#x62A;&#x635;&#x641;&#x62D; &#x627;&#x62E;&#x631;.","ba-videorecorder.access-forbidden":"&#x62A;&#x645; &#x62D;&#x638;&#x631; &#x627;&#x644;&#x62F;&#x62E;&#x648;&#x644; &#x625;&#x644;&#x649; &#x627;&#x644;&#x643;&#x627;&#x645;&#x64A;&#x631;&#x627;. &#x627;&#x646;&#x642;&#x631; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;","ba-videorecorder.pick-covershot":"&#x627;&#x62E;&#x62A;&#x64A;&#x627;&#x631; &#x635;&#x648;&#x631;&#x629; &#x627;&#x644;&#x648;&#x627;&#x62C;&#x647;&#x629;.","ba-videorecorder.uploading":"&#x62C;&#x627;&#x631;&#x64A; &#x627;&#x644;&#x631;&#x641;&#x639;","ba-videorecorder.uploading-failed":"&#x641;&#x634;&#x644; &#x641;&#x64A; &#x627;&#x644;&#x631;&#x641;&#x639; - &#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videorecorder.verifying":"&#x62C;&#x627;&#x631;&#x64A; &#x627;&#x644;&#x62A;&#x62D;&#x642;&#x642;","ba-videorecorder.verifying-failed":"&#x641;&#x634;&#x644; &#x639;&#x645;&#x644;&#x64A;&#x629; &#x627;&#x644;&#x62A;&#x62D;&#x642;&#x642; - &#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videorecorder.rerecord-confirm":"&#x62A;&#x622;&#x643;&#x64A;&#x62F; &#x627;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;&#x61F;","ba-videorecorder.video_file_too_large":"&#x645;&#x644;&#x641; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648; &#x643;&#x628;&#x64A;&#x631; &#x62C;&#x62F;&#x627; (&#x66A; s) - &#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629; &#x628;&#x627;&#x633;&#x62A;&#x62E;&#x62F;&#x627;&#x645; &#x645;&#x644;&#x641; &#x641;&#x64A;&#x62F;&#x64A;&#x648; &#x623;&#x635;&#x63A;&#x631;.","ba-videorecorder.unsupported_video_type":"&#x635;&#x64A;&#x63A;&#x629; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648; &#x63A;&#x64A;&#x631; &#x645;&#x62F;&#x639;&#x648;&#x645;&#x629; :&#x66A; s - &#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x625;&#x639;&#x627;&#x62F;&#x629; &#x627;&#x644;&#x645;&#x62D;&#x627;&#x648;&#x644;&#x629;.","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x627;&#x644;&#x62E;&#x631;&#x648;&#x62C; &#x645;&#x646; &#x627;&#x644;&#x634;&#x627;&#x634;&#x629; &#x627;&#x644;&#x643;&#x627;&#x645;&#x644;&#x629;","ba-videoplayer-share.share":"&#x634;&#x627;&#x631;&#x643; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;","ba-videorecorder-chooser.record-screen":"&#x633;&#x62C;&#x644; &#x627;&#x644;&#x634;&#x627;&#x634;&#x629;","ba-videoplayer-controlbar.pause-video-disabled":"&#x625;&#x64A;&#x642;&#x627;&#x641; &#x645;&#x624;&#x642;&#x62A; &#x63A;&#x64A;&#x631; &#x645;&#x62A;&#x648;&#x627;&#x641;&#x642;","ba-videorecorder-chooser.record-audio":"&#x62A;&#x633;&#x62C;&#x64A;&#x644; &#x635;&#x648;&#x62A;&#x64A;","ba-videorecorder-controlbar.stop-available-after":"&#x627;&#x644;&#x62D;&#x62F; &#x627;&#x644;&#x623;&#x62F;&#x646;&#x649; &#x644;&#x648;&#x642;&#x62A; &#x627;&#x644;&#x62A;&#x633;&#x62C;&#x64A;&#x644; &#x647;&#x648;&#x66A; d &#x62B;&#x627;&#x646;&#x64A;&#x629;","ba-videorecorder-controlbar.cancel":"&#x625;&#x644;&#x63A;&#x627;&#x621;","ba-videorecorder-controlbar.cancel-tooltip":"&#x627;&#x646;&#x642;&#x631; &#x647;&#x646;&#x627; &#x644;&#x644;&#x625;&#x644;&#x63A;&#x627;&#x621;.","ba-videorecorder.cancel-confirm":"&#x647;&#x644; &#x62A;&#x631;&#x64A;&#x62F; &#x62D;&#x642;&#x627; &#x625;&#x644;&#x63A;&#x627;&#x621; &#x62A;&#x62D;&#x645;&#x64A;&#x644; &#x627;&#x644;&#x641;&#x64A;&#x62F;&#x64A;&#x648;&#x61F;","ba-videoplayer-adslot.elapsed-time":"&#x648;&#x642;&#x62A; &#x625;&#x644;&#x627;&#x633;&#x628;&#x62F;","ba-videoplayer-adslot.volume-button":"&#x62A;&#x639;&#x64A;&#x64A;&#x646; &#x645;&#x633;&#x62A;&#x648;&#x649; &#x627;&#x644;&#x635;&#x648;&#x62A;","ba-videoplayer-adslot.volume-mute":"&#x635;&#x648;&#x62A; &#x645;&#x646;&#x62E;&#x641;&#x636;","ba-videoplayer-adslot.volume-unmute":"&#x625;&#x644;&#x63A;&#x627;&#x621; &#x635;&#x648;&#x62A; &#x627;&#x644;&#x635;&#x648;&#x62A;","ba-videoplayer-adslot.ad-will-end-after":"&#x633;&#x64A;&#x646;&#x62A;&#x647;&#x64A; &#x627;&#x644;&#x625;&#x639;&#x644;&#x627;&#x646; &#x628;&#x639;&#x62F;&#x66A; s","ba-videoplayer-adslot.can-skip-after":"&#x62A;&#x62E;&#x637;&#x64A; &#x628;&#x639;&#x62F;&#x66A; d","ba-videoplayer-adslot.skip-ad":"&#x62A;&#x62C;&#x627;&#x647;&#x644; &#x627;&#x644;&#x627;&#x639;&#x644;&#x627;&#x646;&#x627;&#x62A;","ba-videorecorder.software-required":"&#x64A;&#x631;&#x62C;&#x649; &#x627;&#x644;&#x646;&#x642;&#x631; &#x623;&#x62F;&#x646;&#x627;&#x647; &#x644;&#x62A;&#x62B;&#x628;&#x64A;&#x62A; / &#x62A;&#x641;&#x639;&#x64A;&#x644; &#x627;&#x644;&#x645;&#x62A;&#x637;&#x644;&#x628;&#x627;&#x62A; &#x627;&#x644;&#x62A;&#x627;&#x644;&#x64A;&#x629; &#x645;&#x646; &#x623;&#x62C;&#x644; &#x627;&#x644;&#x645;&#x636;&#x64A; &#x642;&#x62F;&#x645;&#x627;.","ba-videorecorder.software-waiting":"&#x641;&#x64A; &#x627;&#x646;&#x62A;&#x638;&#x627;&#x631; &#x627;&#x644;&#x645;&#x62A;&#x637;&#x644;&#x628;&#x627;&#x62A; &#x644;&#x64A;&#x62A;&#x645; &#x62A;&#x62B;&#x628;&#x64A;&#x62A;&#x647;&#x627; / &#x62A;&#x641;&#x639;&#x64A;&#x644;&#x647;&#x627;. &#x642;&#x62F; &#x62A;&#x62D;&#x62A;&#x627;&#x62C; &#x625;&#x644;&#x649; &#x62A;&#x62D;&#x62F;&#x64A;&#x62B; &#x627;&#x644;&#x635;&#x641;&#x62D;&#x629; &#x628;&#x639;&#x62F; &#x627;&#x644;&#x627;&#x646;&#x62A;&#x647;&#x627;&#x621;."},"language:az":{"ba-videoplayer-playbutton.tooltip":"Videoya baxmaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videoplayer-playbutton.rerecord":"Yenid&#x259;n yazmaq","ba-videoplayer-playbutton.submit-video":"Videonu t&#x259;sdiq et","ba-videoplayer-loader.tooltip":"Video y&#xFC;kl&#x259;nir ...","ba-videoplayer-controlbar.change-resolution":"G&#xF6;r&#xFC;nt&#xFC;n&#xFC;n keyfiyy&#x259;tini d&#x259;yi&#x15F;","ba-videoplayer-controlbar.video-progress":"Videonun davamiyy&#x259;ti","ba-videoplayer-controlbar.rerecord-video":"Video yenid&#x259;n yaz&#x131;ls&#x131;n?","ba-videoplayer-controlbar.submit-video":"Videonu t&#x259;sdiq et","ba-videoplayer-controlbar.play-video":"Videonu g&#xF6;st&#x259;r","ba-videoplayer-controlbar.pause-video":"Videonu dayand&#x131;r","ba-videoplayer-controlbar.elapsed-time":"G&#xF6;st&#x259;rilmi&#x15F; vaxt","ba-videoplayer-controlbar.total-time":"Videonu tam uzunlu&#x11F;u","ba-videoplayer-controlbar.fullscreen-video":"Tam ekran edin","ba-videoplayer-controlbar.volume-button":"S&#x259;s d&#xFC;ym&#x259;si","ba-videoplayer-controlbar.volume-mute":"S&#x259;ssiz et","ba-videoplayer-controlbar.volume-unmute":"S&#x259;sli et","ba-videoplayer.video-error":"X&#x259;ta ba&#x15F; vermi&#x15F;dir. Xahi&#x15F; edirik bir az sonra yenid&#x259;n c&#x259;hd edin. Yenid&#x259;n yoxlamaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder-chooser.record-video":"Videonu yaz","ba-videorecorder-chooser.upload-video":"Videonu y&#xFC;kl&#x259;","ba-videorecorder-controlbar.settings":"Ayarlar","ba-videorecorder-controlbar.camerahealthy":"&#x130;&#x15F;&#x131;qland&#x131;rma yax&#x15F;&#x131;d&#x131;r","ba-videorecorder-controlbar.cameraunhealthy":"&#x130;&#x15F;&#x131;qland&#x131;rma optimal deyil","ba-videorecorder-controlbar.microphonehealthy":"S&#x259;s yax&#x15F;&#x131; e&#x15F;idilir","ba-videorecorder-controlbar.microphoneunhealthy":"Mikrofonun s&#x259;si e&#x15F;idilmir","ba-videorecorder-controlbar.record":"Yazmaq","ba-videorecorder-controlbar.record-tooltip":"Videonu yazmaq &#xFC;&#xE7;&#xFC;n bas&#x131;n","ba-videorecorder-controlbar.rerecord":"Videonu yenid&#x259;n yaz","ba-videorecorder-controlbar.rerecord-tooltip":"Yenid&#x259;n yazmaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder-controlbar.upload-covershot":"Y&#xFC;kl&#x259;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#xDC;zl&#xFC;k &#x15F;&#x259;kli y&#xFC;kl&#x259;m&#x259;k &#xFC;&#xE7;&#xFC;n bas&#x131;n","ba-videorecorder-controlbar.stop":"Dayand&#x131;rmaq","ba-videorecorder-controlbar.stop-tooltip":"Dayand&#x131;rmaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder-controlbar.skip":"N&#x259;z&#x259;r&#x259; alma","ba-videorecorder-controlbar.skip-tooltip":"N&#x259;z&#x259;r&#x259; almadan ke&#xE7;m&#x259;k &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder.recorder-error":"X&#x259;ta ba&#x15F; verdi. Xahi&#x15F; edirik bir az sonra yenid&#x259;n c&#x259;hd edin. Yenid&#x259;n yoxlamaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder.attach-error":"Kamera g&#xF6;r&#xFC;nt&#xFC;s&#xFC;n&#xFC; &#x259;ld&#x259; etm&#x259;k m&#xFC;mk&#xFC;n olmad&#x131;. Sizin istifad&#x259; etdiyiniz cihazdan v&#x259; brauzerd&#x259;n as&#x131;l&#x131; olaraq siz ya Flash proqram&#x131; y&#xFC;kl&#x259;nm&#x259;li v&#x259; ya veb s&#x259;hif&#x259;y&#x259; SSL il&#x259; daxil olmal&#x131;s&#x131;z.","ba-videorecorder.access-forbidden":"Kamera g&#xF6;r&#xFC;nt&#xFC;s&#xFC;n&#x259; icaz&#x259; verilm&#x259;di. Yenid&#x259;n yoxlamaq &#xFC;&#xE7;&#xFC;n bas&#x131;n.","ba-videorecorder.pick-covershot":"&#xDC;zl&#xFC;k &#x15F;&#x259;klini se&#xE7;in.","ba-videorecorder.uploading":"Y&#xFC;kl&#x259;nir","ba-videorecorder.uploading-failed":"Y&#xFC;kl&#x259;nm&#x259; zaman&#x131; x&#x259;ta ba&#x15F; verdi, t&#x259;krar etm&#x259;k &#xFC;&#xE7;&#xFC;n buraya bas&#x131;n.","ba-videorecorder.verifying":"Yoxlama","ba-videorecorder.verifying-failed":"Yoxlama u&#x11F;ursuzluqla bitdi - t&#x259;krar &#xFC;&#xE7;&#xFC;n buraya bas&#x131;n.","ba-videorecorder.rerecord-confirm":"Siz, h&#x259;qiq&#x259;t&#x259;n, videonu yenid&#x259;n yazmaq ist&#x259;yirsiniz?","ba-videorecorder.video_file_too_large":"Sizin video fayl&#x131;n h&#x259;cmi (%s) &#xE7;ox b&#xF6;y&#xFC;kd&#xFC;r - ki&#xE7;ik h&#x259;cmli video fayl il&#x259; yenid&#x259;n c&#x259;hd &#xFC;&#xE7;&#xFC;n buraya bas&#x131;n.","ba-videorecorder.unsupported_video_type":"Y&#xFC;kl&#x259;yin: %s - yenid&#x259;n yoxlamaq &#xFC;&#xE7;&#xFC;n buraya bas&#x131;n.","ba-videoplayer-controlbar.exit-fullscreen-video":"Tam ekran rejimind&#x259;n &#xE7;&#x131;x&#x131;&#x15F;","ba-videoplayer-share.share":"Videonu payla&#x15F;","ba-videorecorder-chooser.record-screen":"S&#x259;s ekran&#x131;","ba-videoplayer-controlbar.pause-video-disabled":"Pauza d&#x259;st&#x259;kl&#x259;nmir","ba-videorecorder-chooser.record-audio":"Record Audio","ba-videorecorder-controlbar.stop-available-after":"Minimum qeydiyyatdan ke&#xE7;m&#x259; m&#xFC;dd&#x259;ti %d saniy&#x259;dir","ba-videorecorder-controlbar.cancel":"L&#x259;&#x11F;v et","ba-videorecorder-controlbar.cancel-tooltip":"L&#x259;&#x11F;v etm&#x259;k &#xFC;&#xE7;&#xFC;n buraya bas&#x131;n.","ba-videorecorder.cancel-confirm":"Video y&#xFC;kl&#x259;m&#x259;yini h&#x259;qiq&#x259;t&#x259;n l&#x259;&#x11F;v etm&#x259;k ist&#x259;yirsiniz?","ba-videoplayer-adslot.elapsed-time":"Elasped vaxt","ba-videoplayer-adslot.volume-button":"H&#x259;cmi se&#xE7;in","ba-videoplayer-adslot.volume-mute":"S&#x259;s s&#x259;si","ba-videoplayer-adslot.volume-unmute":"S&#x259;sin s&#x259;sl&#x259;ndirilm&#x259;si","ba-videoplayer-adslot.ad-will-end-after":"Reklam %s sonra sona &#xE7;atacaq","ba-videoplayer-adslot.can-skip-after":" %D sonra atlay&#x131;n","ba-videoplayer-adslot.skip-ad":"Reklam&#x131; atlay&#x131;n","ba-videorecorder.software-required":"Davam etm&#x259;k &#xFC;&#xE7;&#xFC;n a&#x15F;a&#x11F;&#x131;dak&#x131; t&#x259;l&#x259;bl&#x259;ri qurmaq / aktivl&#x259;&#x15F;dirm&#x259;k &#xFC;&#xE7;&#xFC;n a&#x15F;a&#x11F;&#x131;ya bas&#x131;n.","ba-videorecorder.software-waiting":"Qurulacaq / aktivl&#x259;&#x15F;diril&#x259;c&#x259;k t&#x259;l&#x259;bl&#x259;ri g&#xF6;zl&#x259;yir&#x259;m. Tamamland&#x131;qdan sonra s&#x259;hif&#x259;ni yenil&#x259;m&#x259;k laz&#x131;md&#x131;r."},"language:bg":{"ba-videoplayer-playbutton.tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x438;&#x433;&#x440;&#x430;&#x44F;&#x442; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;.","ba-videoplayer-playbutton.rerecord":"&#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;","ba-videoplayer-playbutton.submit-video":"&#x41F;&#x43E;&#x442;&#x432;&#x44A;&#x440;&#x436;&#x434;&#x430;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-loader.tooltip":"&#x417;&#x430;&#x440;&#x435;&#x436;&#x434;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E; ...","ba-videoplayer-controlbar.change-resolution":"&#x41F;&#x440;&#x43E;&#x43C;&#x44F;&#x43D;&#x430; &#x43D;&#x430; &#x440;&#x430;&#x437;&#x434;&#x435;&#x43B;&#x438;&#x442;&#x435;&#x43B;&#x43D;&#x430;&#x442;&#x430; &#x441;&#x43F;&#x43E;&#x441;&#x43E;&#x431;&#x43D;&#x43E;&#x441;&#x442;","ba-videoplayer-controlbar.video-progress":"&#x43F;&#x440;&#x43E;&#x433;&#x440;&#x435;&#x441; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.rerecord-video":"&#x412;&#x44A;&#x437;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x44F;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-controlbar.submit-video":"&#x41F;&#x43E;&#x442;&#x432;&#x44A;&#x440;&#x436;&#x434;&#x430;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.play-video":"&#x432;&#x44A;&#x437;&#x43F;&#x440;&#x43E;&#x438;&#x437;&#x432;&#x435;&#x436;&#x434;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.pause-video":"Pause &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.elapsed-time":"Elasped &#x432;&#x440;&#x435;&#x43C;&#x435;","ba-videoplayer-controlbar.total-time":"&#x41E;&#x431;&#x449;&#x430; &#x434;&#x44A;&#x43B;&#x436;&#x438;&#x43D;&#x430; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.fullscreen-video":"&#x412;&#x44A;&#x432;&#x435;&#x434;&#x435;&#x442;&#x435; &#x446;&#x44F;&#x43B; &#x435;&#x43A;&#x440;&#x430;&#x43D;","ba-videoplayer-controlbar.volume-button":"Set &#x43E;&#x431;&#x435;&#x43C;","ba-videoplayer-controlbar.volume-mute":"Mute &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-controlbar.volume-unmute":"&#x438;&#x437;&#x43A;&#x43B;&#x44E;&#x447;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer.video-error":"&#x412;&#x44A;&#x437;&#x43D;&#x438;&#x43A;&#x43D;&#x430; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x430;. &#x41C;&#x43E;&#x43B;&#x44F;, &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x439;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x43F;&#x43E;-&#x43A;&#x44A;&#x441;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder-chooser.record-video":"&#x417;&#x430;&#x43F;&#x438;&#x448;&#x435;&#x442;&#x435; &#x432;&#x430;&#x448;&#x438;&#x442;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.upload-video":"&#x41A;&#x430;&#x447;&#x438; &#x412;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.settings":"&#x41D;&#x430;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x43A;&#x438;","ba-videorecorder-controlbar.camerahealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x43B;&#x435;&#x43D;&#x438;&#x435;&#x442;&#x43E; &#x435; &#x434;&#x43E;&#x431;&#x440;&#x43E;","ba-videorecorder-controlbar.cameraunhealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x43B;&#x435;&#x43D;&#x438;&#x435; &#x43D;&#x435; &#x435; &#x43E;&#x43F;&#x442;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x43E;","ba-videorecorder-controlbar.microphonehealthy":"&#x417;&#x432;&#x443;&#x43A;&#x44A;&#x442; &#x435; &#x434;&#x43E;&#x431;&#x44A;&#x440;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x41D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x432;&#x437;&#x435;&#x43C;&#x435;&#x442;&#x435; &#x432;&#x441;&#x435;&#x43A;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.record":"&#x440;&#x435;&#x43A;&#x43E;&#x440;&#x434;","ba-videorecorder-controlbar.record-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x437;&#x430;&#x43F;&#x438;&#x448;&#x435;&#x442;&#x435;.","ba-videorecorder-controlbar.rerecord":"&#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C;.","ba-videorecorder-controlbar.upload-covershot":"&#x41A;&#x430;&#x447;&#x438;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43A;&#x430;&#x447;&#x438;&#x442;&#x435; &#x43F;&#x43E;&#x442;&#x440;&#x435;&#x431;&#x438;&#x442;&#x435;&#x43B;&#x441;&#x43A;&#x438; &#x43F;&#x43E;&#x43A;&#x440;&#x438;&#x442;&#x438;&#x435; &#x443;&#x434;&#x430;&#x440;","ba-videorecorder-controlbar.stop":"&#x421;&#x43F;&#x440;&#x438; &#x441;&#x435;","ba-videorecorder-controlbar.stop-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x441;&#x43F;&#x440;&#x435;.","ba-videorecorder-controlbar.skip":"&#x43F;&#x43E;&#x434;&#x441;&#x43A;&#x430;&#x447;&#x430;&#x43C;","ba-videorecorder-controlbar.skip-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x43D;&#x435;&#x442;&#x435;.","ba-videorecorder.recorder-error":"&#x412;&#x44A;&#x437;&#x43D;&#x438;&#x43A;&#x43D;&#x430; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x430;. &#x41C;&#x43E;&#x43B;&#x44F;, &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x439;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x43F;&#x43E;-&#x43A;&#x44A;&#x441;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.attach-error":"&#x41D;&#x438;&#x435; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43B;&#x443;&#x447;&#x438;&#x442;&#x435; &#x434;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x438;&#x43D;&#x442;&#x435;&#x440;&#x444;&#x435;&#x439;&#x441;&#x430; &#x43D;&#x430; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x430;&#x442;&#x430;. &#x412; &#x437;&#x430;&#x432;&#x438;&#x441;&#x438;&#x43C;&#x43E;&#x441;&#x442; &#x43E;&#x442; &#x443;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x441;&#x442;&#x432;&#x43E;&#x442;&#x43E; &#x438; &#x431;&#x440;&#x430;&#x443;&#x437;&#x44A;&#x440;&#x430;, &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x441;&#x435; &#x43D;&#x430;&#x43B;&#x43E;&#x436;&#x438; &#x434;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; Flash &#x438;&#x43B;&#x438; &#x434;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x430;&#x442;&#x430; &#x447;&#x440;&#x435;&#x437; SSL.","ba-videorecorder.access-forbidden":"&#x414;&#x43E;&#x441;&#x442;&#x44A;&#x43F; &#x434;&#x43E; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x430;&#x442;&#x430; &#x435; &#x437;&#x430;&#x431;&#x440;&#x430;&#x43D;&#x435;&#x43D;&#x43E;. &#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.pick-covershot":"&#x418;&#x437;&#x431;&#x435;&#x440;&#x435;&#x442;&#x435; covershot.","ba-videorecorder.uploading":"&#x41A;&#x430;&#x447;&#x432;&#x430;&#x43D;&#x435;","ba-videorecorder.uploading-failed":"&#x41A;&#x430;&#x447;&#x432;&#x430; &#x441;&#x435; &#x43F;&#x440;&#x43E;&#x432;&#x430;&#x43B;&#x438; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.verifying":"&#x41F;&#x440;&#x43E;&#x432;&#x435;&#x440;&#x43A;&#x430;","ba-videorecorder.verifying-failed":"&#x423;&#x434;&#x43E;&#x441;&#x442;&#x43E;&#x432;&#x435;&#x440;&#x44F;&#x432;&#x430;&#x43D;&#x435;&#x442;&#x43E; &#x441;&#x435; &#x43F;&#x440;&#x43E;&#x432;&#x430;&#x43B;&#x438; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.rerecord-confirm":"&#x41D;&#x430;&#x438;&#x441;&#x442;&#x438;&#x43D;&#x430; &#x43B;&#x438; &#x438;&#x441;&#x43A;&#x430;&#x442;&#x435; &#x434;&#x430; &#x440;&#x435;&#x43C;&#x43E;&#x43D;&#x442;&#x438;&#x440;&#x430;&#x43C; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x441;&#x438;?","ba-videorecorder.video_file_too_large":"&#x412;&#x430;&#x448;&#x438;&#x44F;&#x442; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x439;&#x43B; &#x435; &#x442;&#x432;&#x44A;&#x440;&#x434;&#x435; &#x433;&#x43E;&#x43B;&#x44F;&#x43C; (%s) - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E; &#x441; &#x43F;&#x43E;-&#x43C;&#x430;&#x43B;&#x44A;&#x43A; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x439;&#x43B;.","ba-videorecorder.unsupported_video_type":"&#x41C;&#x43E;&#x43B;&#x44F;, &#x43A;&#x430;&#x447;&#x435;&#x442;&#x435;: %s - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x43F;&#x438;&#x442;&#x430;&#x442;&#x435; &#x43E;&#x442;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x418;&#x437;&#x43B;&#x438;&#x437;&#x430;&#x43D;&#x435; &#x43E;&#x442; &#x446;&#x44F;&#x43B; &#x200B;&#x200B;&#x435;&#x43A;&#x440;&#x430;&#x43D;","ba-videoplayer-share.share":"&#x421;&#x43F;&#x43E;&#x434;&#x435;&#x43B;&#x44F;&#x43D;&#x435; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;&#x43A;&#x43B;&#x438;&#x43F;","ba-videorecorder-chooser.record-screen":"&#x415;&#x43A;&#x440;&#x430;&#x43D; &#x437;&#x430; &#x437;&#x430;&#x43F;&#x438;&#x441;","ba-videoplayer-controlbar.pause-video-disabled":"&#x41F;&#x430;&#x443;&#x437;&#x430;&#x442;&#x430; &#x43D;&#x435; &#x441;&#x435; &#x43F;&#x43E;&#x434;&#x434;&#x44A;&#x440;&#x436;&#x430;","ba-videorecorder-chooser.record-audio":"&#x417;&#x430;&#x43F;&#x438;&#x441;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x430;&#x443;&#x434;&#x438;&#x43E;","ba-videorecorder-controlbar.stop-available-after":"&#x41C;&#x438;&#x43D;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x43E;&#x442;&#x43E; &#x432;&#x440;&#x435;&#x43C;&#x435; &#x437;&#x430; &#x437;&#x430;&#x43F;&#x438;&#x441; &#x435; %d &#x441;&#x435;&#x43A;&#x443;&#x43D;&#x434;&#x438;","ba-videorecorder-controlbar.cancel":"&#x41E;&#x442;&#x43A;&#x430;&#x437;","ba-videorecorder-controlbar.cancel-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x442;&#x443;&#x43A;, &#x437;&#x430; &#x434;&#x430; &#x43E;&#x442;&#x43C;&#x435;&#x43D;&#x438;&#x442;&#x435;.","ba-videorecorder.cancel-confirm":"&#x41D;&#x430;&#x438;&#x441;&#x442;&#x438;&#x43D;&#x430; &#x43B;&#x438; &#x438;&#x441;&#x43A;&#x430;&#x442;&#x435; &#x434;&#x430; &#x430;&#x43D;&#x443;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; &#x43A;&#x430;&#x447;&#x432;&#x430;&#x43D;&#x435;&#x442;&#x43E; &#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;&#x43A;&#x43B;&#x438;&#x43F;&#x430; &#x441;&#x438;?","ba-videoplayer-adslot.elapsed-time":"&#x418;&#x437;&#x433;&#x43B;&#x430;&#x434;&#x438; &#x432;&#x440;&#x435;&#x43C;&#x435;&#x442;&#x43E;","ba-videoplayer-adslot.volume-button":"&#x417;&#x430;&#x434;&#x430;&#x439;&#x442;&#x435; &#x441;&#x438;&#x43B;&#x430; &#x43D;&#x430; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-adslot.volume-mute":"&#x421;&#x43F;&#x438;&#x440;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-adslot.volume-unmute":"&#x417;&#x430;&#x433;&#x43B;&#x443;&#x448;&#x430;&#x432;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-adslot.ad-will-end-after":"&#x420;&#x435;&#x43A;&#x43B;&#x430;&#x43C;&#x430;&#x442;&#x430; &#x449;&#x435; &#x43F;&#x440;&#x438;&#x43A;&#x43B;&#x44E;&#x447;&#x438; &#x441;&#x43B;&#x435;&#x434; %s","ba-videoplayer-adslot.can-skip-after":"&#x41F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x43D;&#x435;&#x442;&#x435; &#x441;&#x43B;&#x435;&#x434; %d","ba-videoplayer-adslot.skip-ad":"&#x41F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x43D;&#x435;&#x442;&#x435; &#x43E;&#x431;&#x44F;&#x432;&#x430;","ba-videorecorder.software-required":"&#x41C;&#x43E;&#x43B;&#x44F;, &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x43F;&#x43E;-&#x434;&#x43E;&#x43B;&#x443;, &#x437;&#x430; &#x434;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x438;&#x440;&#x430;&#x442;&#x435; &#x441;&#x43B;&#x435;&#x434;&#x43D;&#x438;&#x442;&#x435; &#x438;&#x437;&#x438;&#x441;&#x43A;&#x432;&#x430;&#x43D;&#x438;&#x44F;, &#x437;&#x430; &#x434;&#x430; &#x43F;&#x440;&#x43E;&#x434;&#x44A;&#x43B;&#x436;&#x438;&#x442;&#x435;.","ba-videorecorder.software-waiting":"&#x418;&#x437;&#x447;&#x430;&#x43A;&#x432;&#x430;&#x43D;&#x435; &#x437;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x43D;&#x435; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x438;&#x440;&#x430;&#x43D;&#x435; &#x43D;&#x430; &#x438;&#x437;&#x438;&#x441;&#x43A;&#x432;&#x430;&#x43D;&#x438;&#x44F;&#x442;&#x430;. &#x41C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x441;&#x435; &#x43D;&#x430;&#x43B;&#x43E;&#x436;&#x438; &#x434;&#x430; &#x43E;&#x43F;&#x440;&#x435;&#x441;&#x43D;&#x438;&#x442;&#x435; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x430;&#x442;&#x430; &#x441;&#x43B;&#x435;&#x434; &#x437;&#x430;&#x432;&#x44A;&#x440;&#x448;&#x432;&#x430;&#x43D;&#x435;."},"language:cat":{"ba-videoplayer-playbutton.tooltip":"Feu clic per veure el v&#xED;deo.","ba-videoplayer-playbutton.rerecord":"refer","ba-videoplayer-playbutton.submit-video":"confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Carregant v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"Canviar la resoluci&#xF3;","ba-videoplayer-controlbar.video-progress":"el progr&#xE9;s de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Torneu a fer el v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"reproducci&#xF3; de v&#xED;deo","ba-videoplayer-controlbar.pause-video":"pausa de v&#xED;deo","ba-videoplayer-controlbar.elapsed-time":"temps Elasped","ba-videoplayer-controlbar.total-time":"Durada total de v&#xED;deo","ba-videoplayer-controlbar.fullscreen-video":"Introdu&#xEF;u a pantalla completa","ba-videoplayer-controlbar.volume-button":"volum de s&#xE8;ries","ba-videoplayer-controlbar.volume-mute":"silenciar so","ba-videoplayer-controlbar.volume-unmute":"activar so","ba-videoplayer.video-error":"Hi ha hagut un error. Siusplau, torni a intentar-ho m&#xE9;s tard. Feu clic per tornar a intentar-ho.","ba-videorecorder-chooser.record-video":"Gravar el v&#xED;deo","ba-videorecorder-chooser.upload-video":"Pujar v&#xED;deo","ba-videorecorder-controlbar.settings":"ajustos","ba-videorecorder-controlbar.camerahealthy":"La il&#xB7;luminaci&#xF3; &#xE9;s bona","ba-videorecorder-controlbar.cameraunhealthy":"La il&#xB7;luminaci&#xF3; no &#xE9;s &#xF2;ptima","ba-videorecorder-controlbar.microphonehealthy":"El so &#xE9;s bo","ba-videorecorder-controlbar.microphoneunhealthy":"No es pot recollir qualsevol so","ba-videorecorder-controlbar.record":"registre","ba-videorecorder-controlbar.record-tooltip":"Feu clic aqu&#xED; per gravar.","ba-videorecorder-controlbar.rerecord":"refer","ba-videorecorder-controlbar.rerecord-tooltip":"Cliqueu aqu&#xED; per fer de nou.","ba-videorecorder-controlbar.upload-covershot":"Pujar","ba-videorecorder-controlbar.upload-covershot-tooltip":"Feu clic aqu&#xED; per pujar foto de portada personalitzada","ba-videorecorder-controlbar.stop":"aturar","ba-videorecorder-controlbar.stop-tooltip":"Feu clic aqu&#xED; per aturar.","ba-videorecorder-controlbar.skip":"Omet","ba-videorecorder-controlbar.skip-tooltip":"Feu clic aqu&#xED; per saltar.","ba-videorecorder.recorder-error":"Hi ha hagut un error. Siusplau, torni a intentar-ho m&#xE9;s tard. Feu clic per tornar a intentar-ho.","ba-videorecorder.attach-error":"No hem pogut accedir a la interf&#xED;cie de la c&#xE0;mera. En funci&#xF3; del dispositiu i del navegador, &#xE9;s possible que hagi de instal &#xB7; lar Flash o accedir a la p&#xE0;gina a trav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"Estava prohibit l&#x27;acc&#xE9;s a la c&#xE0;mera. Feu clic per tornar a intentar-ho.","ba-videorecorder.pick-covershot":"Tria una covershot.","ba-videorecorder.uploading":"pujant","ba-videorecorder.uploading-failed":"C&#xE0;rrega fallat - fer clic aqu&#xED; per tornar a intentar-ho.","ba-videorecorder.verifying":"verificant","ba-videorecorder.verifying-failed":"fallat la verificaci&#xF3; de - fer clic aqu&#xED; per tornar a intentar-ho.","ba-videorecorder.rerecord-confirm":"De veritat vol tornar a fer el v&#xED;deo?","ba-videorecorder.video_file_too_large":"L&#x27;arxiu de v&#xED;deo &#xE9;s massa gran (%s) - fer clic aqu&#xED; per tornar a intentar-ho amb un arxiu de v&#xED;deo m&#xE9;s petita.","ba-videorecorder.unsupported_video_type":"Si us plau, puja: %s - fer clic aqu&#xED; per tornar a intentar-ho.","ba-videoplayer-controlbar.exit-fullscreen-video":"Surt de la pantalla completa","ba-videoplayer-share.share":"compartir v&#xED;deo","ba-videorecorder-chooser.record-screen":"Pantalla de registre","ba-videoplayer-controlbar.pause-video-disabled":"Pausa no &#xE9;s compatible","ba-videorecorder-chooser.record-audio":"Enregistrament d&#x27;&#xE0;udio","ba-videorecorder-controlbar.stop-available-after":"El temps d&#x27;enregistrament m&#xED;nim &#xE9;s %d segons","ba-videorecorder-controlbar.cancel":"Cancel &#xB7; lar","ba-videorecorder-controlbar.cancel-tooltip":"Feu clic aqu&#xED; per cancel&#xB7;lar.","ba-videorecorder.cancel-confirm":"Realment vols cancel&#xB7;lar la c&#xE0;rrega del teu v&#xED;deo?","ba-videoplayer-adslot.elapsed-time":"Elasped temps","ba-videoplayer-adslot.volume-button":"Estableix el volum","ba-videoplayer-adslot.volume-mute":"Silenciar el so","ba-videoplayer-adslot.volume-unmute":"Silenciar el so","ba-videoplayer-adslot.ad-will-end-after":"L&#x27;anunci finalitzar&#xE0; despr&#xE9;s de %s","ba-videoplayer-adslot.can-skip-after":"Passa despr&#xE9;s de %d","ba-videoplayer-adslot.skip-ad":"Saltar anunci","ba-videorecorder.software-required":"Feu clic a sota per instal&#xB7;lar / activar els requisits seg&#xFC;ents per continuar.","ba-videorecorder.software-waiting":"Esperant que s&#x27;instal&#xB7;lin / activin els requisits. &#xC9;s possible que h&#xE0;giu d&#x27;actualitzar la p&#xE0;gina una vegada finalitzada."},"language:da":{"ba-videoplayer-playbutton.tooltip":"Klik for at afspille video.","ba-videoplayer-playbutton.rerecord":"redo","ba-videoplayer-playbutton.submit-video":"Bekr&#xE6;ft video","ba-videoplayer-loader.tooltip":"Indl&#xE6;ser video ...","ba-videoplayer-controlbar.change-resolution":"Skift opl&#xF8;sning","ba-videoplayer-controlbar.video-progress":"fremskridt Video","ba-videoplayer-controlbar.rerecord-video":"Redo video?","ba-videoplayer-controlbar.submit-video":"Bekr&#xE6;ft video","ba-videoplayer-controlbar.play-video":"Afspil video","ba-videoplayer-controlbar.pause-video":"Pause video","ba-videoplayer-controlbar.elapsed-time":"Elasped tid","ba-videoplayer-controlbar.total-time":"Samlet l&#xE6;ngde af video","ba-videoplayer-controlbar.fullscreen-video":"Indtast fullscreen","ba-videoplayer-controlbar.volume-button":"Indstil lydstyrke","ba-videoplayer-controlbar.volume-mute":"Sl&#xE5; lyden","ba-videoplayer-controlbar.volume-unmute":"Sl&#xE5; lyden til","ba-videoplayer.video-error":"Der opstod en fejl. Pr&#xF8;v venligst igen senere. Klik for at pr&#xF8;ve igen.","ba-videorecorder-chooser.record-video":"Optag din video","ba-videorecorder-chooser.upload-video":"Upload video","ba-videorecorder-controlbar.settings":"Indstillinger","ba-videorecorder-controlbar.camerahealthy":"Belysning er god","ba-videorecorder-controlbar.cameraunhealthy":"Belysning er ikke optimal","ba-videorecorder-controlbar.microphonehealthy":"Lyden er god","ba-videorecorder-controlbar.microphoneunhealthy":"Kan ikke afhente nogen lyd","ba-videorecorder-controlbar.record":"Optage","ba-videorecorder-controlbar.record-tooltip":"Klik her for at optage.","ba-videorecorder-controlbar.rerecord":"redo","ba-videorecorder-controlbar.rerecord-tooltip":"Klik her for at gentage.","ba-videorecorder-controlbar.upload-covershot":"Upload","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klik her for at uploade brugerdefinerede d&#xE6;kning shot","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Klik her for at stoppe.","ba-videorecorder-controlbar.skip":"Springe","ba-videorecorder-controlbar.skip-tooltip":"Klik her for at springe.","ba-videorecorder.recorder-error":"Der opstod en fejl. Pr&#xF8;v venligst igen senere. Klik for at pr&#xF8;ve igen.","ba-videorecorder.attach-error":"Vi kunne ikke f&#xE5; adgang til kameraet interface. Afh&#xE6;ngigt af enheden og browseren, skal du muligvis installere Flash eller adgang til siden via SSL.","ba-videorecorder.access-forbidden":"Adgang til kameraet var forbudt. Klik for at pr&#xF8;ve igen.","ba-videorecorder.pick-covershot":"V&#xE6;lg en covershot.","ba-videorecorder.uploading":"Upload","ba-videorecorder.uploading-failed":"Upload mislykkedes - klik her for at pr&#xF8;ve igen.","ba-videorecorder.verifying":"Bekr&#xE6;ftelse","ba-videorecorder.verifying-failed":"mislykkedes verificering - klik her for at pr&#xF8;ve igen.","ba-videorecorder.rerecord-confirm":"Vil du virkelig &#xF8;nsker at gentage din video?","ba-videorecorder.video_file_too_large":"Din video filen er for stor (%s) - klik her for at pr&#xF8;ve igen med et mindre videofil.","ba-videorecorder.unsupported_video_type":"upload venligst: %s - klik her for at pr&#xF8;ve igen.","ba-videoplayer-controlbar.exit-fullscreen-video":"Afslut fuldsk&#xE6;rm","ba-videoplayer-share.share":"Del video","ba-videorecorder-chooser.record-screen":"Optagelsessk&#xE6;rm","ba-videoplayer-controlbar.pause-video-disabled":"Pause ikke underst&#xF8;ttet","ba-videorecorder-chooser.record-audio":"Optag lyd","ba-videorecorder-controlbar.stop-available-after":"Mindste optagetid er %d sekunder","ba-videorecorder-controlbar.cancel":"Afbestille","ba-videorecorder-controlbar.cancel-tooltip":"Klik her for at annullere.","ba-videorecorder.cancel-confirm":"Vil du virkelig annullere din video upload?","ba-videoplayer-adslot.elapsed-time":"Elasped tid","ba-videoplayer-adslot.volume-button":"Indstil lydstyrke","ba-videoplayer-adslot.volume-mute":"D&#xE6;mp lyd","ba-videoplayer-adslot.volume-unmute":"Sluk lyden","ba-videoplayer-adslot.ad-will-end-after":"Annoncen slutter efter %s","ba-videoplayer-adslot.can-skip-after":"Spring over efter %d","ba-videoplayer-adslot.skip-ad":"Spring annoncen over","ba-videorecorder.software-required":"Klik nedenfor for at installere / aktivere f&#xF8;lgende krav for at forts&#xE6;tte.","ba-videorecorder.software-waiting":"Venter p&#xE5; de krav, der skal installeres / aktiveres. Du skal m&#xE5;ske opdatere siden efter f&#xE6;rdigg&#xF8;relsen."},"language:de":{"ba-videoplayer-playbutton.tooltip":"Hier klicken um Wiedergabe zu starten.","ba-videoplayer-playbutton.rerecord":"Video neu aufnehmen","ba-videoplayer-playbutton.submit-video":"Video akzeptieren","ba-videoplayer-loader.tooltip":"Video wird geladen...","ba-videoplayer-controlbar.change-resolution":"Aufl&#xF6;sung anpassen","ba-videoplayer-controlbar.video-progress":"Videofortschritt","ba-videoplayer-controlbar.rerecord-video":"Video erneut aufnehmen?","ba-videoplayer-controlbar.submit-video":"Video akzeptieren","ba-videoplayer-controlbar.play-video":"Video wiedergeben","ba-videoplayer-controlbar.pause-video":"Video pausieren","ba-videoplayer-controlbar.elapsed-time":"Vergangene Zeit","ba-videoplayer-controlbar.total-time":"L&#xE4;nge des Videos","ba-videoplayer-controlbar.fullscreen-video":"Vollbildmodus","ba-videoplayer-controlbar.volume-button":"Lautst&#xE4;rke regulieren","ba-videoplayer-controlbar.volume-mute":"Ton abstellen","ba-videoplayer-controlbar.volume-unmute":"Ton wieder aktivieren","ba-videoplayer.video-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder-chooser.record-video":"Video aufnehmen","ba-videorecorder-chooser.upload-video":"Video hochladen","ba-videorecorder-chooser.record-screen":"Desktop aufnehmen","ba-videorecorder-controlbar.settings":"Einstellungen","ba-videorecorder-controlbar.camerahealthy":"Gute Beleuchtung","ba-videorecorder-controlbar.cameraunhealthy":"Beleuchtung nicht optimal","ba-videorecorder-controlbar.microphonehealthy":"Soundqualit&#xE4;t einwandfrei","ba-videorecorder-controlbar.microphoneunhealthy":"Mikrofon bis jetzt stumm","ba-videorecorder-controlbar.record":"Video aufnehmen","ba-videorecorder-controlbar.record-tooltip":"Hier klicken um Aufnahme zu starten.","ba-videorecorder-controlbar.rerecord":"Video neu aufnehmen","ba-videorecorder-controlbar.rerecord-tooltip":"Hier klicken um Video erneut aufzunehmen.","ba-videorecorder-controlbar.upload-covershot":"Hochladen","ba-videorecorder-controlbar.upload-covershot-tooltip":"Hier klicken um einen Covershot hochzuladen.","ba-videorecorder-controlbar.stop":"Aufnahme stoppen","ba-videorecorder-controlbar.stop-tooltip":"Hier klicken um Aufnahme zu stoppen.","ba-videorecorder-controlbar.skip":"&#xDC;berspringen","ba-videorecorder-controlbar.skip-tooltip":"Hier klicken um zu &#xDC;berspringen.","ba-videorecorder.recorder-error":"Es ist ein Fehler aufgetreten, bitte versuchen Sie es sp&#xE4;ter noch einmal. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.attach-error":"Wir konnten nicht auf das Medieninterface zugreifen. Je nach Browser und Ger&#xE4;t muss m&#xF6;glicherweise Flash installiert oder die Seite &#xFC;ber SSL geladen werden.","ba-videorecorder.access-forbidden":"Zugriff auf das Medieninterface wurde verweigert. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.pick-covershot":"Bitte w&#xE4;hlen Sie einen Covershot aus.","ba-videorecorder.uploading":"Hochladen","ba-videorecorder.uploading-failed":"Hochladen fehlgeschlagen. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.verifying":"Verifizieren","ba-videorecorder.verifying-failed":"Verifizierung fehlgeschlagen. Hier klicken, um es noch einmal zu probieren.","ba-videorecorder.rerecord-confirm":"M&#xF6;chten Sie Ihr Video wirklich noch einmal aufnehmen?","ba-videorecorder.video_file_too_large":"Die angegebene Videodatei ist zu gro&#xDF; (%s). Hier klicken, um eine kleinere Videodatei hochzuladen.","ba-videorecorder.unsupported_video_type":"Bitte laden Sie Dateien des folgenden Typs hoch: %s. Hier klicken, um es noch einmal zu probieren.","ba-videoplayer-controlbar.exit-fullscreen-video":"Den Vollbildmous verlassen","ba-videoplayer-share.share":"Video teilen","ba-videoplayer-controlbar.pause-video-disabled":"Pause wird nicht unterst&#xFC;tzt","ba-videorecorder-chooser.record-audio":"Ton aufnehmen","ba-videorecorder-controlbar.stop-available-after":"Die minimale Aufnahmezeit ist %d Sekunden","ba-videorecorder-controlbar.cancel":"Stornieren","ba-videorecorder-controlbar.cancel-tooltip":"Klicken Sie hier, um abzubrechen.","ba-videorecorder.cancel-confirm":"M&#xF6;chten Sie Ihren Video-Upload wirklich abbrechen?","ba-videoplayer-adslot.elapsed-time":"Elased Zeit","ba-videoplayer-adslot.volume-button":"Lautst&#xE4;rke einstellen","ba-videoplayer-adslot.volume-mute":"Ton stummschalten","ba-videoplayer-adslot.volume-unmute":"Ton nicht h&#xF6;ren","ba-videoplayer-adslot.ad-will-end-after":"Die Anzeige endet nach %s","ba-videoplayer-adslot.can-skip-after":"&#xDC;berspringen nach %d","ba-videoplayer-adslot.skip-ad":"&#xDC;berspringen","ba-videorecorder.software-required":"Bitte klicken Sie hier, um die folgenden Voraussetzungen zu installieren bzw. zu aktivieren.","ba-videorecorder.software-waiting":"Warte auf Abschluss der Installation bzw. der Aktivierung. M&#xF6;glicherweise m&#xFC;ssen Sie die Seite nach dem Abschluss aktualisieren."},"language:es":{"ba-videoplayer-playbutton.tooltip":"Haga clic para ver el video.","ba-videoplayer-playbutton.rerecord":"Regrabar","ba-videoplayer-playbutton.submit-video":"Confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Cargando v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"Cambiar la resoluci&#xF3;n","ba-videoplayer-controlbar.video-progress":"Progreso de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Regrabar v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"Confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"Reproducir video","ba-videoplayer-controlbar.pause-video":"Pausar v&#xED;deo","ba-videoplayer-controlbar.elapsed-time":"Tiempo transcurrido","ba-videoplayer-controlbar.total-time":"Duraci&#xF3;n total de video","ba-videoplayer-controlbar.fullscreen-video":"Ingrese a pantalla completa","ba-videoplayer-controlbar.volume-button":"Boton de volumen","ba-videoplayer-controlbar.volume-mute":"Silenciar sonido","ba-videoplayer-controlbar.volume-unmute":"Activar sonido","ba-videoplayer.video-error":"Se produjo un error, por favor intente de nuevo m&#xE1;s tarde. Haga clic para volver a intentarlo.","ba-videorecorder-chooser.record-video":"Grabar v&#xED;deo","ba-videorecorder-chooser.upload-video":"Subir v&#xED;deo","ba-videorecorder-controlbar.settings":"Ajustes","ba-videorecorder-controlbar.camerahealthy":"La iluminaci&#xF3;n es buena","ba-videorecorder-controlbar.cameraunhealthy":"La iluminaci&#xF3;n no es &#xF3;ptima","ba-videorecorder-controlbar.microphonehealthy":"El sonido es bueno","ba-videorecorder-controlbar.microphoneunhealthy":"Problemas con sonido","ba-videorecorder-controlbar.record":"Grabar","ba-videorecorder-controlbar.record-tooltip":"Haga clic aqu&#xED; para grabar.","ba-videorecorder-controlbar.rerecord":"Rehacer","ba-videorecorder-controlbar.rerecord-tooltip":"Haga clic aqu&#xED; para grabar de nuevo.","ba-videorecorder-controlbar.upload-covershot":"Subir","ba-videorecorder-controlbar.upload-covershot-tooltip":"Haga clic aqu&#xED; para subir foto de portada personalizada","ba-videorecorder-controlbar.stop":"Detener","ba-videorecorder-controlbar.stop-tooltip":"Haga clic aqu&#xED; para detener.","ba-videorecorder-controlbar.skip":"Saltear","ba-videorecorder-controlbar.skip-tooltip":"Haga clic aqu&#xED; para saltear.","ba-videorecorder.recorder-error":"Se produjo un error, por favor intente de nuevo m&#xE1;s tarde. Haga clic para volver a intentarlo.","ba-videorecorder.attach-error":"No hemos podido acceder a la interfaz de la c&#xE1;mara. Dependiendo del dispositivo y del navegador, es posible que tenga que instalar Flash o acceder a la p&#xE1;gina a trav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"Acceso denegado a la c&#xE1;mara. Haga clic para volver a intentarlo.","ba-videorecorder.pick-covershot":"Elige una foto de portada.","ba-videorecorder.uploading":"Subiendo","ba-videorecorder.uploading-failed":"La subida ha fallado - hacer clic aqu&#xED; para volver a intentarlo.","ba-videorecorder.verifying":"Verificando","ba-videorecorder.verifying-failed":"Fall&#xF3; la verificaci&#xF3;n - hacer clic aqu&#xED; para volver a intentarlo.","ba-videorecorder.rerecord-confirm":"&#xBF;Est&#xE1; seguro quiere volver a hacer el v&#xED;deo?","ba-videorecorder.video_file_too_large":"El archivo de v&#xED;deo es demasiado grande (%s) - hacer clic aqu&#xED; para volver a intentarlo con un archivo de v&#xED;deo m&#xE1;s peque&#xF1;o.","ba-videorecorder.unsupported_video_type":"Por favor, sube: %s - haz clic aqu&#xED; para volver a intentarlo.","ba-videoplayer-controlbar.exit-fullscreen-video":"Salir de pantalla completa","ba-videoplayer-share.share":"Compartir video","ba-videorecorder-chooser.record-screen":"Grabar pantalla","ba-videoplayer-controlbar.pause-video-disabled":"Pausa no admitida","ba-videorecorder-chooser.record-audio":"Grabar audio","ba-videorecorder-controlbar.stop-available-after":"El tiempo de grabaci&#xF3;n m&#xED;nimo es %d segundos","ba-videorecorder-controlbar.cancel":"Cancelar","ba-videorecorder-controlbar.cancel-tooltip":"Haga clic aqu&#xED; para cancelar.","ba-videorecorder.cancel-confirm":"&#xBF;Realmente quieres cancelar tu carga de video?","ba-videoplayer-adslot.elapsed-time":"Tiempo Transcurrido","ba-videoplayer-adslot.volume-button":"Establecer el volumen","ba-videoplayer-adslot.volume-mute":"Sin sonido","ba-videoplayer-adslot.volume-unmute":"Dejar de silenciar el sonido","ba-videoplayer-adslot.ad-will-end-after":"El anuncio finalizar&#xE1; despu&#xE9;s de %s","ba-videoplayer-adslot.can-skip-after":"Omitir despu&#xE9;s de %d","ba-videoplayer-adslot.skip-ad":"Omitir aviso publicitario","ba-videorecorder.software-required":"Haga click a continuaci&#xF3;n para instalar / activar los siguientes requisitos y as&#xED; poder continuar.","ba-videorecorder.software-waiting":"Esperando a que se instalen / activen los requisitos. Es posible que deba actualizar la p&#xE1;gina despu&#xE9;s de finalizar."},"language:fi":{"ba-videoplayer-playbutton.tooltip":"Toista video.","ba-videoplayer-playbutton.rerecord":"tehd&#xE4; uudelleen","ba-videoplayer-playbutton.submit-video":"vahvista video","ba-videoplayer-loader.tooltip":"Ladataan videota ...","ba-videoplayer-controlbar.change-resolution":"Muuta resoluutio","ba-videoplayer-controlbar.video-progress":"video edistyminen","ba-videoplayer-controlbar.rerecord-video":"Tee uudelleen video?","ba-videoplayer-controlbar.submit-video":"vahvista video","ba-videoplayer-controlbar.play-video":"Toista video","ba-videoplayer-controlbar.pause-video":"tauko video","ba-videoplayer-controlbar.elapsed-time":"Elasped aika","ba-videoplayer-controlbar.total-time":"Kokonaispituus video","ba-videoplayer-controlbar.fullscreen-video":"Anna koko n&#xE4;yt&#xF6;n","ba-videoplayer-controlbar.volume-button":"Set tilavuus","ba-videoplayer-controlbar.volume-mute":"&#xE4;&#xE4;nen mykistys","ba-videoplayer-controlbar.volume-unmute":"Poista mykistys","ba-videoplayer.video-error":"Tapahtui virhe, yrit&#xE4; my&#xF6;hemmin uudelleen. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder-chooser.record-video":"Tallenna videon","ba-videorecorder-chooser.upload-video":"Lataa video","ba-videorecorder-controlbar.settings":"Asetukset","ba-videorecorder-controlbar.camerahealthy":"Valaistus on hyv&#xE4;","ba-videorecorder-controlbar.cameraunhealthy":"Valaistus ei ole optimaalinen","ba-videorecorder-controlbar.microphonehealthy":"&#xC4;&#xE4;ni on hyv&#xE4;","ba-videorecorder-controlbar.microphoneunhealthy":"Voi poimia mit&#xE4;&#xE4;n &#xE4;&#xE4;nt&#xE4;","ba-videorecorder-controlbar.record":"Enn&#xE4;tys","ba-videorecorder-controlbar.record-tooltip":"T&#xE4;&#xE4;lt&#xE4; tallentaa.","ba-videorecorder-controlbar.rerecord":"tehd&#xE4; uudelleen","ba-videorecorder-controlbar.rerecord-tooltip":"T&#xE4;&#xE4;lt&#xE4; redo.","ba-videorecorder-controlbar.upload-covershot":"Lataa","ba-videorecorder-controlbar.upload-covershot-tooltip":"T&#xE4;&#xE4;lt&#xE4; ladata mukautettuja kansi ammuttu","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"T&#xE4;&#xE4;lt&#xE4; lopettaa.","ba-videorecorder-controlbar.skip":"hyppi&#xE4;","ba-videorecorder-controlbar.skip-tooltip":"T&#xE4;&#xE4;lt&#xE4; ohittaa.","ba-videorecorder.recorder-error":"Tapahtui virhe, yrit&#xE4; my&#xF6;hemmin uudelleen. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder.attach-error":"Emme voineet k&#xE4;ytt&#xE4;&#xE4; Kameraliit&#xE4;nn&#xE4;t. Laitteesta riippuen ja selainta, sinun on ehk&#xE4; asennettava Flash tai k&#xE4;ytt&#xE4;&#xE4; sivun kautta SSL.","ba-videorecorder.access-forbidden":"P&#xE4;&#xE4;sy kameraan oli kielletty. Yrit&#xE4; uudelleen klikkaamalla.","ba-videorecorder.pick-covershot":"Valitse covershot.","ba-videorecorder.uploading":"lataaminen","ba-videorecorder.uploading-failed":"Lataaminen ep&#xE4;onnistui - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen.","ba-videorecorder.verifying":"Tarkistetaan","ba-videorecorder.verifying-failed":"Varmentaa ep&#xE4;onnistui - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen.","ba-videorecorder.rerecord-confirm":"Haluatko todella redo videon?","ba-videorecorder.video_file_too_large":"Videotiedosto on liian suuri (%s) - klikkaa t&#xE4;st&#xE4; yritt&#xE4;&#xE4; uudelleen pienemm&#xE4;ll&#xE4; videotiedosto.","ba-videorecorder.unsupported_video_type":"Lataa: %s - klikkaa t&#xE4;st&#xE4; yrit&#xE4; uudelleen.","ba-videoplayer-controlbar.exit-fullscreen-video":"exit fullscreen","ba-videoplayer-share.share":"Jaa video","ba-videorecorder-chooser.record-screen":"Tallennusn&#xE4;ytt&#xF6;","ba-videoplayer-controlbar.pause-video-disabled":"Tauko ei ole tuettu","ba-videorecorder-chooser.record-audio":"&#xC4;&#xE4;nit&#xE4; &#xE4;&#xE4;nt&#xE4;","ba-videorecorder-controlbar.stop-available-after":"Minimi tallennusaika on %d sekuntia","ba-videorecorder-controlbar.cancel":"Peruuttaa","ba-videorecorder-controlbar.cancel-tooltip":"Peruuta napsauttamalla t&#xE4;t&#xE4;.","ba-videorecorder.cancel-confirm":"Haluatko todella peruuttaa videon l&#xE4;hett&#xE4;misen?","ba-videoplayer-adslot.elapsed-time":"Elpytty aika","ba-videoplayer-adslot.volume-button":"Aseta &#xE4;&#xE4;nen voimakkuus","ba-videoplayer-adslot.volume-mute":"Mykist&#xE4; &#xE4;&#xE4;ni","ba-videoplayer-adslot.volume-unmute":"Sammuta &#xE4;&#xE4;ni","ba-videoplayer-adslot.ad-will-end-after":"Mainos p&#xE4;&#xE4;ttyy %s: n j&#xE4;lkeen","ba-videoplayer-adslot.can-skip-after":"Ohita %d j&#xE4;lkeen","ba-videoplayer-adslot.skip-ad":"Ohita mainos","ba-videorecorder.software-required":"Napsauta alla olevaa asentaaksesi / aktivoi seuraavat vaatimukset jatkaaksesi.","ba-videorecorder.software-waiting":"Odottaa, ett&#xE4; vaatimukset asennetaan / aktivoidaan. Sinun on ehk&#xE4; p&#xE4;ivitett&#xE4;v&#xE4; sivusi valmiiksi."},"language:fr":{"ba-videoplayer-playbutton.tooltip":"Cliquez ici pour voir la vid&#xE9;o.","ba-videoplayer-playbutton.rerecord":"Revoir","ba-videoplayer-playbutton.submit-video":"Confirmer vid&#xE9;o","ba-videoplayer-loader.tooltip":"T&#xE9;l&#xE9;chargez votre vid&#xE9;o...","ba-videoplayer-controlbar.change-resolution":"Modifiez la r&#xE9;solution d&#x2019;&#xE9;cran","ba-videoplayer-controlbar.video-progress":"Vid&#xE9;o en cours de chargement","ba-videoplayer-controlbar.rerecord-video":"Revoir la vid&#xE9;o?","ba-videoplayer-controlbar.submit-video":"Validez la vid&#xE9;o","ba-videoplayer-controlbar.play-video":"Lire la vid&#xE9;o","ba-videoplayer-controlbar.pause-video":"Pause vid&#xE9;o","ba-videoplayer-controlbar.elapsed-time":"Temps &#xE9;coul&#xE9; ou expir&#xE9;","ba-videoplayer-controlbar.total-time":"Dur&#xE9;e total de la vid&#xE9;o","ba-videoplayer-controlbar.fullscreen-video":"S&#xE9;lectionnez le mode plein &#xE9;cran","ba-videoplayer-controlbar.volume-button":"R&#xE9;glez ou ajustez le volume","ba-videoplayer-controlbar.volume-mute":"Silencieux","ba-videoplayer-controlbar.volume-unmute":"Silencieux d&#xE9;sactiv&#xE9;","ba-videoplayer.video-error":"Une s&#x2019;est produite, r&#xE9;essayez ult&#xE9;rieurement &#x2013; cliquez ici pour r&#xE9;essayer.","ba-videorecorder-chooser.record-video":"Enregistrez votre vid&#xE9;o","ba-videorecorder-chooser.upload-video":"T&#xE9;l&#xE9;chargez votre vid&#xE9;o","ba-videorecorder-controlbar.settings":"R&#xE9;glage ou mise &#xE0; jour","ba-videorecorder-controlbar.camerahealthy":"Bon &#xE9;clairage","ba-videorecorder-controlbar.cameraunhealthy":"L&#x2019;&#xE9;clairage n&#x2019;est pas ideal","ba-videorecorder-controlbar.microphonehealthy":"Bonne acoustique","ba-videorecorder-controlbar.microphoneunhealthy":"Acoustique n&#x27;est pas ideal","ba-videorecorder-controlbar.record":"Enregistrer","ba-videorecorder-controlbar.record-tooltip":"Cliquez ici pour enregistrez.","ba-videorecorder-controlbar.rerecord":"Revoir","ba-videorecorder-controlbar.rerecord-tooltip":"Cliquez ici pour recommencer.","ba-videorecorder-controlbar.upload-covershot":"T&#xE9;l&#xE9;chargez","ba-videorecorder-controlbar.upload-covershot-tooltip":"Cliquez ici pour t&#xE9;l&#xE9;charger une couverture personnalis&#xE9;e.","ba-videorecorder-controlbar.stop":"Arr&#xEA;ter","ba-videorecorder-controlbar.stop-tooltip":"Cliquez ici pour arr&#xEA;ter.","ba-videorecorder-controlbar.skip":"Sauter","ba-videorecorder-controlbar.skip-tooltip":"Cliquez ici pour sauter.","ba-videorecorder.recorder-error":"Une s&#x2019;est produite, r&#xE9;essayez ult&#xE9;rieurement &#x2013; cliquez ici pour r&#xE9;essayer.","ba-videorecorder.attach-error":"Nous ne pouvons pas acc&#xE9;der &#xE0; l&#x2019;interface de l&#x2019;appareil- cela d&#xE9;pend du syst&#xE8;me et de l&#x2019;explorateur. Cela peut n&#xE9;cessiter d&#x2019;installer flash ou une acc&#xE9;dez &#xE0; la page via SSL.","ba-videorecorder.access-forbidden":"L&#x2019;acc&#xE8;s &#xE0; l&#x2019;appareil est interdit. Cliquez pour recommencer.","ba-videorecorder.pick-covershot":"Choisissez une page de couverture.","ba-videorecorder.uploading":"T&#xE9;l&#xE9;chargez","ba-videorecorder.uploading-failed":"T&#xE9;l&#xE9;chargement &#xE9;chou&#xE9;- Cliquez ici pour recommencer ou r&#xE9;essayer.","ba-videorecorder.verifying":"V&#xE9;rification","ba-videorecorder.verifying-failed":"V&#xE9;rification &#xE9;chou&#xE9;e - Cliquez ici pour recommencer ou r&#xE9;essayer.","ba-videorecorder.rerecord-confirm":"Souhaitez vous r&#xE9;ellement recommencer la vid&#xE9;o?","ba-videorecorder.video_file_too_large":"La taille de votre fichier est trop grande (%s). Cliquez ici pour ajuster la taille.","ba-videorecorder.unsupported_video_type":"S&#x27;il vous pla&#xEE;t t&#xE9;l&#xE9;charger: %s - cliquez ici pour r&#xE9;essayer.","ba-videoplayer-controlbar.exit-fullscreen-video":"Quitter le mode plein &#xE9;cran","ba-videoplayer-share.share":"Partager la vid&#xE9;o","ba-videorecorder-chooser.record-screen":"&#xC9;cran d&#x27;enregistrement","ba-videoplayer-controlbar.pause-video-disabled":"Pause non prise en charge","ba-videorecorder-chooser.record-audio":"Enregistrement audio","ba-videorecorder-controlbar.stop-available-after":"La dur&#xE9;e d&#x27;enregistrement minimale est de %d secondes","ba-videorecorder-controlbar.cancel":"Annuler","ba-videorecorder-controlbar.cancel-tooltip":"Cliquez ici pour annuler","ba-videorecorder.cancel-confirm":"Voulez-vous vraiment annuler votre t&#xE9;l&#xE9;chargement de vid&#xE9;o?","ba-videoplayer-adslot.elapsed-time":"Temps &#xE9;lasped","ba-videoplayer-adslot.volume-button":"D&#xE9;finir le volume","ba-videoplayer-adslot.volume-mute":"Son muet","ba-videoplayer-adslot.volume-unmute":"Activer le son","ba-videoplayer-adslot.ad-will-end-after":"L&#x27;annonce se termine apr&#xE8;s %s","ba-videoplayer-adslot.can-skip-after":"Passer apr&#xE8;s %d","ba-videoplayer-adslot.skip-ad":"Passer la pub","ba-videorecorder.software-required":"Veuillez cliquer ci-dessous pour installer / activer les conditions suivantes afin de continuer.","ba-videorecorder.software-waiting":"Attendre que les exigences soient install&#xE9;es / activ&#xE9;es. Vous devrez peut-&#xEA;tre actualiser la page apr&#xE8;s l&#x27;ach&#xE8;vement."},"language:hi":{"ba-videoplayer-playbutton.tooltip":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x91A;&#x932;&#x93E;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-playbutton.rerecord":"&#x92B;&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92A;&#x941;&#x928;&#x903; &#x930;&#x93F;&#x915;&#x949;&#x93F;&#x921; &#x915;&#x93F;","ba-videoplayer-playbutton.submit-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x91C;&#x92E;&#x93E; &#x915;&#x93F;","ba-videoplayer-loader.tooltip":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x932;&#x94B;&#x921; &#x939;&#x94B; &#x930;&#x939;&#x93E; &#x939;&#x948; ...","ba-videoplayer-controlbar.change-resolution":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; - &#x93F;&#x947;&#x938;&#x94B;&#x932;&#x941;&#x936;&#x928; &#x92C;&#x926;&#x932;&#x94B;","ba-videoplayer-controlbar.video-progress":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92C;&#x922;&#x93C; &#x93F;&#x939;&#x93E; &#x939;","ba-videoplayer-controlbar.rerecord-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92A;&#x941;&#x928;&#x903; &#x930;&#x93F;&#x915;&#x949;&#x93F;&#x921; &#x915;&#x93F;","ba-videoplayer-controlbar.submit-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x91C;&#x92E;&#x93E; &#x915;&#x93F;","ba-videoplayer-controlbar.play-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x91A;&#x932;&#x93E;&#x90F;&#x902;","ba-videoplayer-controlbar.pause-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x930;&#x94B;&#x915;&#x947;&#x902;","ba-videoplayer-controlbar.elapsed-time":"&#x92C;&#x940;&#x924;&#x93E;  &#x906; &#x938;&#x92E;&#x92F;","ba-videoplayer-controlbar.total-time":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x915;&#x940; &#x915;&#x941;&#x932; &#x932;&#x902;&#x92C;&#x93E;&#x908;","ba-videoplayer-controlbar.fullscreen-video":"&#x92A;&#x942;&#x930;&#x94D;&#x923; &#x938;&#x94D;&#x915;&#x94D;&#x930;&#x940;&#x928; &#x926;&#x930;&#x94D;&#x91C; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-controlbar.volume-button":"&#x92E;&#x93E;&#x924;&#x94D;&#x930;&#x93E; &#x938;&#x947;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-controlbar.volume-mute":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x92E;&#x94D;&#x92F;&#x942;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-controlbar.volume-unmute":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x915;&#x94B; &#x905;&#x928;&#x92E;&#x94D;&#x92F;&#x942;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer.video-error":"&#x905; &#x93E;&#x924;  &#x941;&#x921;&#x93F; | &#x92A;&#x941;&#x928;&#x903;  &#x92F;&#x93E;&#x938; &#x915;&#x93F;&#x928;&#x947; &#x915;&#x947; &#x921;&#x932;&#x90F;  &#x93F;&#x915; &#x915;&#x93F;","ba-videorecorder-chooser.record-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x930;&#x93F;&#x915;&#x949;&#x930;&#x94D;&#x921; &#x915;&#x930;&#x94B;","ba-videorecorder-chooser.upload-video":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x905;&#x92A;&#x932;&#x94B;&#x921; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder-controlbar.settings":"&#x938;&#x947;&#x91F;&#x93F;&#x902;&#x917;&#x94D;&#x938;","ba-videorecorder-controlbar.camerahealthy":"&#x92A;&#x94D;&#x930;&#x915;&#x93E;&#x936; &#x905;&#x91A;&#x94D;&#x91B;&#x93E; &#x939;&#x948;","ba-videorecorder-controlbar.cameraunhealthy":"&#x92A;&#x94D;&#x930;&#x915;&#x93E;&#x936; &#x907;&#x937;&#x94D;&#x91F;&#x924;&#x92E; &#x928;&#x939;&#x940;&#x902; &#x939;&#x948;","ba-videorecorder-controlbar.microphonehealthy":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x905;&#x91A;&#x94D;&#x91B;&#x940; &#x939;&#x948;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x915;&#x94B;&#x908; &#x92D;&#x940; &#x906;&#x935;&#x93E;&#x91C; &#x928;&#x939;&#x940;&#x902; &#x909;&#x920;&#x93E; &#x938;&#x915;&#x924;&#x93E;","ba-videorecorder-controlbar.record":"&#x930;&#x93F;&#x915;&#x949;&#x93F;&#x921;","ba-videorecorder-controlbar.record-tooltip":"&#x930;&#x93F;&#x915;&#x949;&#x930;&#x94D;&#x921; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder-controlbar.rerecord":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92A;&#x941;&#x928;&#x903; &#x930;&#x93F;&#x915;&#x949;&#x93F;&#x921; &#x915;&#x93F;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x92B;&#x93F;&#x930; &#x938;&#x947; &#x915;&#x930;&#x947;&#x902; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder-controlbar.upload-covershot":"&#x905;&#x92A;&#x932;&#x94B;&#x921;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x915;&#x938;&#x94D;&#x91F;&#x92E; &#x915;&#x935;&#x930; &#x936;&#x949;&#x91F; &#x905;&#x92A;&#x932;&#x94B;&#x921; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder-controlbar.stop":"&#x930;&#x941;&#x915;&#x947;&#x902;","ba-videorecorder-controlbar.stop-tooltip":"&#x930;&#x94B;&#x915;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder-controlbar.skip":"&#x91B;&#x94B;&#x921;&#x93C;&#x947;&#x902;","ba-videorecorder-controlbar.skip-tooltip":"&#x91B;&#x94B;&#x921;&#x93C;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder.recorder-error":"&#x90F;&#x915; &#x924;&#x94D;&#x930;&#x941;&#x91F;&#x93F; &#x918;&#x91F;&#x93F;&#x924; &#x939;&#x941;&#x908; &#x939;&#x948;, &#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x92C;&#x93E;&#x926; &#x92E;&#x947;&#x902; &#x92A;&#x941;&#x928;: &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x947;&#x902;&#x964; &#x92A;&#x941;&#x928;&#x903; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder.attach-error":"&#x939;&#x92E; &#x915;&#x948;&#x92E;&#x930;&#x947; &#x915;&#x947; &#x907;&#x902;&#x91F;&#x930;&#x92B;&#x93C;&#x947;&#x938; &#x924;&#x915; &#x92A;&#x939;&#x941;&#x902;&#x91A; &#x928;&#x939;&#x940;&#x902; &#x938;&#x915;&#x947;&#x964; &#x921;&#x93F;&#x935;&#x93E;&#x907;&#x938; &#x914;&#x930; &#x92C;&#x94D;&#x930;&#x93E;&#x909;&#x91C;&#x93C;&#x930; &#x915;&#x947; &#x906;&#x927;&#x93E;&#x930; &#x92A;&#x930;, &#x906;&#x92A;&#x915;&#x94B; &#x92B;&#x94D;&#x932;&#x948;&#x936; &#x907;&#x902;&#x938;&#x94D;&#x91F;&#x949;&#x932; &#x915;&#x930;&#x928;&#x93E; &#x92F;&#x93E; &#x92A;&#x943;&#x937;&#x94D;&#x920; &#x92A;&#x930; &#x90F;&#x938;&#x90F;&#x938;&#x90F;&#x932; &#x915;&#x947; &#x92E;&#x93E;&#x927;&#x94D;&#x92F;&#x92E; &#x938;&#x947; &#x92A;&#x94D;&#x930;&#x935;&#x947;&#x936; &#x915;&#x930;&#x928;&#x93E; &#x92A;&#x921;&#x93C; &#x938;&#x915;&#x924;&#x93E; &#x939;&#x948;","ba-videorecorder.access-forbidden":"&#x915;&#x948;&#x92E;&#x930;&#x947; &#x924;&#x915; &#x92A;&#x939;&#x941;&#x902;&#x91A; &#x92E;&#x928;&#x93E;&#x908; &#x917;&#x908; &#x925;&#x940; &#x92A;&#x941;&#x928;&#x903; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder.pick-covershot":"&#x936;&#x949;&#x93F;&#x921;&#x915;&#x93F; &#x915;&#x93E; &#x91A;&#x941;&#x928;&#x93E;&#x935; &#x915;&#x940;&#x921;&#x91C;&#x90F;","ba-videorecorder.uploading":"&#x905;&#x92A;&#x932;&#x94B;&#x921; &#x939;&#x94B; &#x930;&#x939;&#x93E; &#x939;&#x948;","ba-videorecorder.uploading-failed":"&#x905;&#x92A;&#x932;&#x94B;&#x921; &#x915;&#x930;&#x928;&#x93E; &#x935;&#x93F;&#x92B;&#x932; - &#x92A;&#x941;&#x928;&#x903; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder.verifying":"&#x91C;&#x93E; &#x91A; &#x91C;&#x93E;&#x93F;&#x940; &#x939;&#x948;","ba-videorecorder.verifying-failed":"&#x938;&#x924;&#x94D;&#x92F;&#x93E;&#x92A;&#x928; &#x935;&#x93F;&#x92B;&#x932; - &#x92A;&#x941;&#x928;&#x903; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder.rerecord-confirm":"&#x915;&#x94D;&#x92F;&#x93E; &#x906;&#x92A; &#x935;&#x93E;&#x938;&#x94D;&#x924;&#x935; &#x92E;&#x947;&#x902; &#x905;&#x92A;&#x928;&#x947; &#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x915;&#x94B; &#x92B;&#x93F;&#x930; &#x938;&#x947; &#x915;&#x930;&#x928;&#x93E; &#x91A;&#x93E;&#x939;&#x924;&#x947; &#x939;&#x948;&#x902;?","ba-videorecorder.video_file_too_large":"&#x906;&#x92A;&#x915;&#x940; &#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92B;&#x93C;&#x93E;&#x907;&#x932; &#x92C;&#x939;&#x941;&#x924; &#x92C;&#x921;&#x93C;&#x940; &#x939;&#x948; ( %s) - &#x90F;&#x915; &#x91B;&#x94B;&#x91F;&#x947; &#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x92B;&#x93C;&#x93E;&#x907;&#x932; &#x915;&#x947; &#x938;&#x93E;&#x925; &#x92B;&#x93F;&#x930; &#x938;&#x947; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder.unsupported_video_type":"&#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x905;&#x92A;&#x932;&#x94B;&#x921; &#x915;&#x930;&#x947;&#x902;: %s - &#x92A;&#x941;&#x928;&#x903; &#x92A;&#x94D;&#x930;&#x92F;&#x93E;&#x938; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x92A;&#x942;&#x930;&#x94D;&#x923; &#x938;&#x94D;&#x915;&#x94D;&#x930;&#x940;&#x928; &#x938;&#x947; &#x92C;&#x93E;&#x939;&#x930; &#x928;&#x93F;&#x915;&#x932;&#x947;&#x902;","ba-videoplayer-share.share":"&#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x936;&#x947;&#x92F;&#x930; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder-chooser.record-screen":"&#x930;&#x93F;&#x915;&#x949;&#x930;&#x94D;&#x921; &#x938;&#x94D;&#x915;&#x94D;&#x930;&#x940;&#x928;","ba-videoplayer-controlbar.pause-video-disabled":"&#x930;&#x94B;&#x915;&#x947;&#x902; &#x938;&#x92E;&#x930;&#x94D;&#x925;&#x93F;&#x924; &#x928;&#x939;&#x940;&#x902; &#x939;&#x948;","ba-videorecorder-chooser.record-audio":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x930;&#x93F;&#x915;&#x949;&#x930;&#x94D;&#x921; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder-controlbar.stop-available-after":"&#x928;&#x94D;&#x92F;&#x942;&#x928;&#x924;&#x92E; &#x930;&#x93F;&#x915;&#x949;&#x930;&#x94D;&#x921;&#x93F;&#x902;&#x917; &#x938;&#x92E;&#x92F; %d &#x938;&#x947;&#x915;&#x902;&#x921; &#x939;&#x948;","ba-videorecorder-controlbar.cancel":"&#x930;&#x926;&#x94D;&#x926; &#x915;&#x930;&#x928;&#x93E;","ba-videorecorder-controlbar.cancel-tooltip":"&#x930;&#x926;&#x94D;&#x926; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x92F;&#x939;&#x93E;&#x902; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;","ba-videorecorder.cancel-confirm":"&#x915;&#x94D;&#x92F;&#x93E; &#x906;&#x92A; &#x935;&#x93E;&#x915;&#x908; &#x905;&#x92A;&#x928;&#x93E; &#x935;&#x940;&#x921;&#x93F;&#x92F;&#x94B; &#x905;&#x92A;&#x932;&#x94B;&#x921; &#x930;&#x926;&#x94D;&#x926; &#x915;&#x930;&#x928;&#x93E; &#x91A;&#x93E;&#x939;&#x924;&#x947; &#x939;&#x948;&#x902;?","ba-videoplayer-adslot.elapsed-time":"Elasped &#x938;&#x92E;&#x92F;","ba-videoplayer-adslot.volume-button":"&#x92E;&#x93E;&#x924;&#x94D;&#x930;&#x93E; &#x938;&#x947;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-adslot.volume-mute":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x92E;&#x94D;&#x92F;&#x942;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-adslot.volume-unmute":"&#x927;&#x94D;&#x935;&#x928;&#x93F; &#x915;&#x94B; &#x905;&#x928;&#x92E;&#x94D;&#x92F;&#x942;&#x91F; &#x915;&#x930;&#x947;&#x902;","ba-videoplayer-adslot.ad-will-end-after":"&#x935;&#x93F;&#x91C;&#x94D;&#x91E;&#x93E;&#x92A;&#x928; %s &#x915;&#x947; &#x92C;&#x93E;&#x926; &#x938;&#x92E;&#x93E;&#x92A;&#x94D;&#x924; &#x939;&#x94B; &#x91C;&#x93E;&#x90F;&#x917;&#x93E;","ba-videoplayer-adslot.can-skip-after":" %D &#x915;&#x947; &#x92C;&#x93E;&#x926; &#x91B;&#x94B;&#x921;&#x93C;&#x947;&#x902;","ba-videoplayer-adslot.skip-ad":"&#x935;&#x93F;&#x91C;&#x94D;&#x91E;&#x93E;&#x92A;&#x928; &#x938;&#x947; &#x906;&#x917;&#x947; &#x92C;&#x922;&#x93C;&#x947;&#x902;","ba-videorecorder.software-required":"&#x906;&#x917;&#x947; &#x92C;&#x922;&#x93C;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x915;&#x943;&#x92A;&#x92F;&#x93E; &#x928;&#x93F;&#x92E;&#x94D;&#x928;&#x932;&#x93F;&#x916;&#x93F;&#x924; &#x906;&#x935;&#x936;&#x94D;&#x92F;&#x915;&#x924;&#x93E;&#x913;&#x902; &#x915;&#x94B; &#x938;&#x94D;&#x925;&#x93E;&#x92A;&#x93F;&#x924; / &#x938;&#x915;&#x94D;&#x930;&#x93F;&#x92F; &#x915;&#x930;&#x928;&#x947; &#x915;&#x947; &#x932;&#x93F;&#x90F; &#x928;&#x940;&#x91A;&#x947; &#x915;&#x94D;&#x932;&#x93F;&#x915; &#x915;&#x930;&#x947;&#x902;&#x964;","ba-videorecorder.software-waiting":"&#x906;&#x935;&#x936;&#x94D;&#x92F;&#x915;&#x924;&#x93E;&#x913;&#x902; &#x915;&#x94B; &#x938;&#x94D;&#x925;&#x93E;&#x92A;&#x93F;&#x924; / &#x938;&#x915;&#x94D;&#x930;&#x93F;&#x92F; &#x915;&#x930;&#x928;&#x947; &#x915;&#x940; &#x92A;&#x94D;&#x930;&#x924;&#x940;&#x915;&#x94D;&#x937;&#x93E; &#x915;&#x930; &#x930;&#x939;&#x93E; &#x939;&#x948; &#x906;&#x92A;&#x915;&#x94B; &#x92A;&#x942;&#x930;&#x93E; &#x939;&#x94B;&#x928;&#x947; &#x915;&#x947; &#x92C;&#x93E;&#x926; &#x92A;&#x943;&#x937;&#x94D;&#x920; &#x915;&#x94B; &#x930;&#x940;&#x92B;&#x93C;&#x94D;&#x930;&#x947;&#x936; &#x915;&#x930;&#x928;&#x93E; &#x92A;&#x921;&#x93C; &#x938;&#x915;&#x924;&#x93E; &#x939;&#x948;"},"language:hr":{"ba-videoplayer-playbutton.tooltip":"Kliknite za reprodukciju video zapisa.","ba-videoplayer-playbutton.rerecord":"preurediti","ba-videoplayer-playbutton.submit-video":"Potvrda videa","ba-videoplayer-loader.tooltip":"U&#x10D;itavanje videa ...","ba-videoplayer-controlbar.change-resolution":"Promjena razlu&#x10D;ivosti","ba-videoplayer-controlbar.video-progress":"napredak Video","ba-videoplayer-controlbar.rerecord-video":"Ponovi video?","ba-videoplayer-controlbar.submit-video":"Potvrda videa","ba-videoplayer-controlbar.play-video":"Reprodukcija videozapisa","ba-videoplayer-controlbar.pause-video":"Pauza Video","ba-videoplayer-controlbar.elapsed-time":"Elasped vrijeme","ba-videoplayer-controlbar.total-time":"Ukupna du&#x17E;ina videa","ba-videoplayer-controlbar.fullscreen-video":"Idi na puni zaslon","ba-videoplayer-controlbar.volume-button":"Set volumen","ba-videoplayer-controlbar.volume-mute":"Bez zvuka","ba-videoplayer-controlbar.volume-unmute":"Vrati zvuk","ba-videoplayer.video-error":"Do&#x161;lo je do pogre&#x161;ke. Molimo poku&#x161;ajte ponovno kasnije. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder-chooser.record-video":"Snimanje videa","ba-videorecorder-chooser.upload-video":"Dodaj video","ba-videorecorder-controlbar.settings":"Postavke","ba-videorecorder-controlbar.camerahealthy":"Rasvjeta je dobra","ba-videorecorder-controlbar.cameraunhealthy":"Rasvjeta nije optimalno","ba-videorecorder-controlbar.microphonehealthy":"Zvuk je dobar","ba-videorecorder-controlbar.microphoneunhealthy":"ne mo&#x17E;e podi&#x107;i bilo koji zvuk","ba-videorecorder-controlbar.record":"Snimiti","ba-videorecorder-controlbar.record-tooltip":"Kliknite ovdje za snimanje.","ba-videorecorder-controlbar.rerecord":"preurediti","ba-videorecorder-controlbar.rerecord-tooltip":"Kliknite ovdje ponoviti.","ba-videorecorder-controlbar.upload-covershot":"Postavi","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kliknite ovdje kako biste poslali prilago&#x111;ene cover metak","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Kliknite ovdje da se zaustavi.","ba-videorecorder-controlbar.skip":"Presko&#x10D;iti","ba-videorecorder-controlbar.skip-tooltip":"Kliknite ovdje presko&#x10D;iti.","ba-videorecorder.recorder-error":"Do&#x161;lo je do pogre&#x161;ke. Molimo poku&#x161;ajte ponovno kasnije. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder.attach-error":"Nismo mogli pristupiti su&#x10D;elju fotoaparata. Ovisno o ure&#x111;aju i preglednika, mo&#x17E;da &#x107;ete morati instalirati Flash ili pristupiti stranici putem SSL-a.","ba-videorecorder.access-forbidden":"Pristup kameri je zabranjeno. Kliknite za ponovni poku&#x161;aj.","ba-videorecorder.pick-covershot":"Izaberite covershot.","ba-videorecorder.uploading":"Prijenos","ba-videorecorder.uploading-failed":"Prijenos nije uspio - kliknite ovdje za ponovni poku&#x161;aj.","ba-videorecorder.verifying":"Potvr&#x111;ivanje","ba-videorecorder.verifying-failed":"Potvr&#x111;ivanje nije uspjelo - kliknite ovdje za ponovni poku&#x161;aj.","ba-videorecorder.rerecord-confirm":"Da li zaista &#x17E;elite ponoviti svoj video?","ba-videorecorder.video_file_too_large":"Va&#x161; video datoteka je prevelika (%s) - kliknite ovdje kako bi poku&#x161;ali ponovno s manjim video datoteka.","ba-videorecorder.unsupported_video_type":"Prenesite: %s - kliknite ovdje za ponovni poku&#x161;aj.","ba-videoplayer-controlbar.exit-fullscreen-video":"Iza&#x111;ite iz cijelog zaslona","ba-videoplayer-share.share":"Dijeljenje videozapisa","ba-videorecorder-chooser.record-screen":"Zaslon za snimanje","ba-videoplayer-controlbar.pause-video-disabled":"Pauza nije podr&#x17E;ana","ba-videorecorder-chooser.record-audio":"Snimanje zvuka","ba-videorecorder-controlbar.stop-available-after":"Minimalno vrijeme snimanja je %d sekundi","ba-videorecorder-controlbar.cancel":"Otkazati","ba-videorecorder-controlbar.cancel-tooltip":"Kliknite ovdje kako biste odustali.","ba-videorecorder.cancel-confirm":"&#x17D;elite li zaista odustati od prijenosa videozapisa?","ba-videoplayer-adslot.elapsed-time":"Otpremljeno vrijeme","ba-videoplayer-adslot.volume-button":"Postavite glasno&#x107;u","ba-videoplayer-adslot.volume-mute":"Isklju&#x10D;ite zvuk","ba-videoplayer-adslot.volume-unmute":"Uklju&#x10D;i zvuk","ba-videoplayer-adslot.ad-will-end-after":"Oglas zavr&#x161;ava nakon %s","ba-videoplayer-adslot.can-skip-after":"Presko&#x10D;i nakon %d","ba-videoplayer-adslot.skip-ad":"Presko&#x10D;ite oglas","ba-videorecorder.software-required":"Kliknite dolje da biste instalirali / aktivirali sljede&#x107;e uvjete kako biste nastavili.","ba-videorecorder.software-waiting":"&#x10C;eka se postavljanje / aktiviranje zahtjeva. Mo&#x17E;da &#x107;ete morati osvje&#x17E;iti stranicu nakon zavr&#x161;etka."},"language:hu":{"ba-videoplayer-playbutton.tooltip":"Kattintson ide a vide&#xF3; lej&#xE1;tsz&#xE1;s&#xE1;hoz.","ba-videoplayer-playbutton.rerecord":"&#xDA;jra","ba-videoplayer-playbutton.submit-video":"Er&#x151;s&#xED;tse vide&#xF3;","ba-videoplayer-loader.tooltip":"Vide&#xF3; bet&#xF6;lt&#xE9;se ...","ba-videoplayer-controlbar.change-resolution":"a felbont&#xE1;s m&#xF3;dos&#xED;t&#xE1;sa","ba-videoplayer-controlbar.video-progress":"vide&#xF3; halad&#xE1;s","ba-videoplayer-controlbar.rerecord-video":"&#xDA;jra vide&#xF3;t?","ba-videoplayer-controlbar.submit-video":"Er&#x151;s&#xED;tse vide&#xF3;","ba-videoplayer-controlbar.play-video":"vide&#xF3; lej&#xE1;tsz&#xE1;sa","ba-videoplayer-controlbar.pause-video":"sz&#xFC;net vide&#xF3;","ba-videoplayer-controlbar.elapsed-time":"Eltelt id&#x151;","ba-videoplayer-controlbar.total-time":"Teljes hossza vide&#xF3;","ba-videoplayer-controlbar.fullscreen-video":"a teljes k&#xE9;perny&#x151;s","ba-videoplayer-controlbar.volume-button":"&#xC1;ll&#xED;tsa be a hanger&#x151;t","ba-videoplayer-controlbar.volume-mute":"hang eln&#xE9;m&#xED;t&#xE1;sa","ba-videoplayer-controlbar.volume-unmute":"Unmute hang","ba-videoplayer.video-error":"Hiba t&#xF6;rt&#xE9;nt. K&#xE9;rj&#xFC;k, pr&#xF3;b&#xE1;lkozzon k&#xE9;s&#x151;bb. Kattintson ide &#xFA;jra.","ba-videorecorder-chooser.record-video":"A vide&#xF3; r&#xF6;gz&#xED;t&#xE9;s&#xE9;nek","ba-videorecorder-chooser.upload-video":"Vide&#xF3; felt&#xF6;lt&#xE9;se","ba-videorecorder-controlbar.settings":"Be&#xE1;ll&#xED;t&#xE1;sok","ba-videorecorder-controlbar.camerahealthy":"Vil&#xE1;g&#xED;t&#xE1;s j&#xF3;","ba-videorecorder-controlbar.cameraunhealthy":"Vil&#xE1;g&#xED;t&#xE1;s nem optim&#xE1;lis","ba-videorecorder-controlbar.microphonehealthy":"Hang j&#xF3;","ba-videorecorder-controlbar.microphoneunhealthy":"Nem lehet felvenni minden hang","ba-videorecorder-controlbar.record":"Rekord","ba-videorecorder-controlbar.record-tooltip":"Kattintson ide, hogy r&#xF6;gz&#xED;ti.","ba-videorecorder-controlbar.rerecord":"&#xDA;jra","ba-videorecorder-controlbar.rerecord-tooltip":"Kattintson ide, hogy &#xFA;jra.","ba-videorecorder-controlbar.upload-covershot":"Felt&#xF6;lt&#xE9;s","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kattintson ide felt&#xF6;lthet&#x151; egyedi fed&#xE9;l l&#xF6;v&#xE9;s","ba-videorecorder-controlbar.stop":"&#xC1;llj meg","ba-videorecorder-controlbar.stop-tooltip":"Kattintson ide, hogy hagyja abba.","ba-videorecorder-controlbar.skip":"Skip","ba-videorecorder-controlbar.skip-tooltip":"Kattintson ide, hogy kihagyja.","ba-videorecorder.recorder-error":"Hiba t&#xF6;rt&#xE9;nt. K&#xE9;rj&#xFC;k, pr&#xF3;b&#xE1;lkozzon k&#xE9;s&#x151;bb. Kattintson ide &#xFA;jra.","ba-videorecorder.attach-error":"Nem tudtuk el&#xE9;rni a kamera interface. Att&#xF3;l f&#xFC;gg&#x151;en, hogy a k&#xE9;sz&#xFC;l&#xE9;k &#xE9;s a b&#xF6;ng&#xE9;sz&#x151;ben, akkor telep&#xED;tenie kell a Flash vagy el&#xE9;rni az oldalt SSL.","ba-videorecorder.access-forbidden":"Hozz&#xE1;f&#xE9;r&#xE9;s a kamera tilos volt. Kattintson ide &#xFA;jra.","ba-videorecorder.pick-covershot":"V&#xE1;lassz egy covershot.","ba-videorecorder.uploading":"Felt&#xF6;lt&#xE9;s","ba-videorecorder.uploading-failed":"Felt&#xF6;lt&#xE9;s sikertelen - ide kattintva &#xFA;jra.","ba-videorecorder.verifying":"ellen&#x151;rz&#xE9;se","ba-videorecorder.verifying-failed":"Ellen&#x151;rz&#xE9;s&#xE9;&#xE9;rt sikertelen - ide kattintva &#xFA;jra.","ba-videorecorder.rerecord-confirm":"T&#xE9;nyleg azt akarja ism&#xE9;telni a vide&#xF3;?","ba-videorecorder.video_file_too_large":"A vide&#xF3; f&#xE1;jl t&#xFA;l nagy (%s) - ide kattintva pr&#xF3;b&#xE1;lkozzon &#xFA;jra egy kisebb video f&#xE1;jlt.","ba-videorecorder.unsupported_video_type":"K&#xE9;rj&#xFC;k, t&#xF6;lts&#xF6;n fel: %s - ide kattintva &#xFA;jra.","ba-videoplayer-controlbar.exit-fullscreen-video":"Kil&#xE9;p&#xE9;s a teljes k&#xE9;perny&#x151;s","ba-videoplayer-share.share":"Vide&#xF3; megoszt&#xE1;sa","ba-videorecorder-chooser.record-screen":"Felv&#xE9;tel k&#xE9;perny&#x151;","ba-videoplayer-controlbar.pause-video-disabled":"A sz&#xFC;neteltet&#xE9;s nem t&#xE1;mogatott","ba-videorecorder-chooser.record-audio":"Hang r&#xF6;gz&#xED;t&#xE9;se","ba-videorecorder-controlbar.stop-available-after":"A minim&#xE1;lis felv&#xE9;teli id&#x151; %d m&#xE1;sodperc","ba-videorecorder-controlbar.cancel":"Megsz&#xFC;nteti","ba-videorecorder-controlbar.cancel-tooltip":"Kattintson ide a lemond&#xE1;shoz.","ba-videorecorder.cancel-confirm":"T&#xE9;nyleg t&#xF6;r&#xF6;lni szeretn&#xE9; a vide&#xF3; felt&#xF6;lt&#xE9;s&#xE9;t?","ba-videoplayer-adslot.elapsed-time":"Elkelt id&#x151;","ba-videoplayer-adslot.volume-button":"&#xC1;ll&#xED;tsa be a hanger&#x151;t","ba-videoplayer-adslot.volume-mute":"Eln&#xE9;m&#xED;tja a hangot","ba-videoplayer-adslot.volume-unmute":"Csengessen a hang","ba-videoplayer-adslot.ad-will-end-after":"A hirdet&#xE9;s a %s ut&#xE1;n befejez&#x151;dik","ba-videoplayer-adslot.can-skip-after":"Ugr&#xE1;s a %d ut&#xE1;n","ba-videoplayer-adslot.skip-ad":"Hirdet&#xE9;s &#xE1;tugr&#xE1;sa","ba-videorecorder.software-required":"K&#xE9;rj&#xFC;k, kattintson az al&#xE1;bbi gombra a k&#xF6;vetkez&#x151; k&#xF6;vetelm&#xE9;nyek telep&#xED;t&#xE9;s&#xE9;hez / aktiv&#xE1;l&#xE1;s&#xE1;hoz a folytat&#xE1;shoz.","ba-videorecorder.software-waiting":"V&#xE1;rakoz&#xE1;s a telep&#xED;t&#xE9;s / aktiv&#xE1;l&#xE1;s k&#xF6;vetelm&#xE9;nyeire. Lehet, hogy friss&#xED;tenie kell az oldalt befejez&#xE9;se ut&#xE1;n."},"language:id":{"ba-videoplayer-playbutton.tooltip":"Klik untuk memutar video.","ba-videoplayer-playbutton.rerecord":"Mengulangi","ba-videoplayer-playbutton.submit-video":"Konfirmasi video","ba-videoplayer-loader.tooltip":"Memuat video ...","ba-videoplayer-controlbar.change-resolution":"Ubah resolusi","ba-videoplayer-controlbar.video-progress":"Kemajuan video","ba-videoplayer-controlbar.rerecord-video":"Redo video?","ba-videoplayer-controlbar.submit-video":"Konfirmasi video","ba-videoplayer-controlbar.play-video":"Putar video","ba-videoplayer-controlbar.pause-video":"Jeda video","ba-videoplayer-controlbar.elapsed-time":"Elasped waktu","ba-videoplayer-controlbar.total-time":"Panjang video total","ba-videoplayer-controlbar.fullscreen-video":"Memasuki layar penuh","ba-videoplayer-controlbar.volume-button":"Setel volume","ba-videoplayer-controlbar.volume-mute":"Bisu terdengar","ba-videoplayer-controlbar.volume-unmute":"Suarakan suara","ba-videoplayer.video-error":"Terjadi kesalahan, coba lagi nanti. Klik untuk mencoba lagi.","ba-videorecorder-chooser.record-video":"Merekam video","ba-videorecorder-chooser.upload-video":"Upload Video","ba-videorecorder-controlbar.settings":"Pengaturan","ba-videorecorder-controlbar.camerahealthy":"Pencahayaan itu bagus","ba-videorecorder-controlbar.cameraunhealthy":"Pencahayaan tidak optimal","ba-videorecorder-controlbar.microphonehealthy":"Suara bagus","ba-videorecorder-controlbar.microphoneunhealthy":"Tidak bisa mengambil suara apapun","ba-videorecorder-controlbar.record":"Merekam","ba-videorecorder-controlbar.record-tooltip":"Klik di sini untuk merekam.","ba-videorecorder-controlbar.rerecord":"Mengulangi","ba-videorecorder-controlbar.rerecord-tooltip":"Klik di sini untuk mengulang.","ba-videorecorder-controlbar.upload-covershot":"Upload","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klik di sini untuk mengunggah tangkapan sampul khusus","ba-videorecorder-controlbar.stop":"Berhenti","ba-videorecorder-controlbar.stop-tooltip":"Klik di sini untuk berhenti.","ba-videorecorder-controlbar.skip":"Melewatkan","ba-videorecorder-controlbar.skip-tooltip":"Klik di sini untuk melompat.","ba-videorecorder.recorder-error":"Terjadi kesalahan, coba lagi nanti. Klik untuk mencoba lagi.","ba-videorecorder.attach-error":"Kami tidak dapat mengakses antarmuka kamera. Bergantung pada perangkat dan browser, Anda mungkin perlu menginstal Flash atau mengakses halaman melalui SSL.","ba-videorecorder.access-forbidden":"Akses ke kamera dilarang. Klik untuk mencoba lagi.","ba-videorecorder.pick-covershot":"Pilih sebuah coverhot.","ba-videorecorder.uploading":"Mengunggah","ba-videorecorder.uploading-failed":"Mengunggah gagal - klik di sini untuk mencoba lagi.","ba-videorecorder.verifying":"Memverifikasi","ba-videorecorder.verifying-failed":"Verifikasi gagal - klik di sini untuk mencoba lagi.","ba-videorecorder.rerecord-confirm":"Apakah Anda benar-benar ingin mengulang video Anda?","ba-videorecorder.video_file_too_large":"File video Anda terlalu besar ( %s) - klik di sini untuk mencoba lagi dengan file video yang lebih kecil.","ba-videorecorder.unsupported_video_type":"Silakan upload: %s - klik di sini untuk mencoba lagi.","ba-videoplayer-controlbar.exit-fullscreen-video":"Keluar dari layar penuh","ba-videoplayer-share.share":"Berbagi video","ba-videorecorder-chooser.record-screen":"Layar rekam","ba-videoplayer-controlbar.pause-video-disabled":"Jeda tidak didukung","ba-videorecorder-chooser.record-audio":"Suara rekaman","ba-videorecorder-controlbar.stop-available-after":"Waktu perekaman minimum adalah %d detik","ba-videorecorder-controlbar.cancel":"Membatalkan","ba-videorecorder-controlbar.cancel-tooltip":"Klik disini untuk membatalkan","ba-videorecorder.cancel-confirm":"Apakah Anda benar-benar ingin membatalkan upload video Anda?","ba-videoplayer-adslot.elapsed-time":"Elasped waktu","ba-videoplayer-adslot.volume-button":"Setel volume","ba-videoplayer-adslot.volume-mute":"Bisu terdengar","ba-videoplayer-adslot.volume-unmute":"Suarakan suara","ba-videoplayer-adslot.ad-will-end-after":"Iklan akan berakhir setelah %s","ba-videoplayer-adslot.can-skip-after":"Lewati setelah %d","ba-videoplayer-adslot.skip-ad":"Melewatkan iklan","ba-videorecorder.software-required":"Silahkan klik di bawah ini untuk menginstal / mengaktifkan persyaratan berikut agar bisa melanjutkan.","ba-videorecorder.software-waiting":"Menunggu persyaratan untuk dipasang / diaktifkan. Anda mungkin perlu menyegarkan halaman setelah selesai."},"language:it":{"ba-videoplayer-playbutton.tooltip":"Clicca per giocare video.","ba-videoplayer-playbutton.rerecord":"Rifare","ba-videoplayer-playbutton.submit-video":"confermare il video","ba-videoplayer-loader.tooltip":"Caricamento video...","ba-videoplayer-controlbar.change-resolution":"Cambiare la risoluzione","ba-videoplayer-controlbar.video-progress":"progresso Video","ba-videoplayer-controlbar.rerecord-video":"Ripeti video?","ba-videoplayer-controlbar.submit-video":"confermare il video","ba-videoplayer-controlbar.play-video":"Guarda il video","ba-videoplayer-controlbar.pause-video":"il video Pause","ba-videoplayer-controlbar.elapsed-time":"tempo Elasped","ba-videoplayer-controlbar.total-time":"La lunghezza totale di Video","ba-videoplayer-controlbar.fullscreen-video":"Vai a tutto schermo","ba-videoplayer-controlbar.volume-button":"Impostare il volume","ba-videoplayer-controlbar.volume-mute":"suono muto","ba-videoplayer-controlbar.volume-unmute":"disattivare l&#x27;audio","ba-videoplayer.video-error":"&#xC8; verificato un errore, riprova pi&#xF9; tardi. Fare clic per riprovare.","ba-videorecorder-chooser.record-video":"Registra il tuo video","ba-videorecorder-chooser.upload-video":"Carica video","ba-videorecorder-controlbar.settings":"impostazioni","ba-videorecorder-controlbar.camerahealthy":"L&#x27;illuminazione &#xE8; buona","ba-videorecorder-controlbar.cameraunhealthy":"L&#x27;illuminazione non &#xE8; ottimale","ba-videorecorder-controlbar.microphonehealthy":"Il suono &#xE8; buono","ba-videorecorder-controlbar.microphoneunhealthy":"Non &#xE8; possibile udire i suoni","ba-videorecorder-controlbar.record":"Disco","ba-videorecorder-controlbar.record-tooltip":"Clicca qui per registrare.","ba-videorecorder-controlbar.rerecord":"Rifare","ba-videorecorder-controlbar.rerecord-tooltip":"Clicca qui per rifare.","ba-videorecorder-controlbar.upload-covershot":"Caricare","ba-videorecorder-controlbar.upload-covershot-tooltip":"Clicca qui per caricare copertina personalizzata colpo","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Clicca qui per fermare.","ba-videorecorder-controlbar.skip":"Salta","ba-videorecorder-controlbar.skip-tooltip":"Clicca qui per saltare.","ba-videorecorder.recorder-error":"&#xC8; verificato un errore, riprova pi&#xF9; tardi. Fare clic per riprovare.","ba-videorecorder.attach-error":"Non abbiamo potuto accedere alla interfaccia della fotocamera. A seconda del dispositivo e del browser, potrebbe essere necessario installare Flash o accedere alla pagina tramite SSL.","ba-videorecorder.access-forbidden":"L&#x27;accesso alla telecamera era proibito. Fare clic per riprovare.","ba-videorecorder.pick-covershot":"Scegli una covershot.","ba-videorecorder.uploading":"Caricamento","ba-videorecorder.uploading-failed":"Caricamento fallito - clicca qui per riprovare.","ba-videorecorder.verifying":"verifica","ba-videorecorder.verifying-failed":"Verifica non riuscita - clicca qui per riprovare.","ba-videorecorder.rerecord-confirm":"Vuoi davvero di rifare il video?","ba-videorecorder.video_file_too_large":"Il file video &#xE8; troppo grande (%s) - clicca qui per provare di nuovo con un file video pi&#xF9; piccolo.","ba-videorecorder.unsupported_video_type":"Si prega di caricare: %s - clicca qui per riprovare.","ba-videoplayer-controlbar.exit-fullscreen-video":"Uscire da schermo intero","ba-videoplayer-share.share":"Condividi il Video","ba-videorecorder-chooser.record-screen":"Registra schermo","ba-videoplayer-controlbar.pause-video-disabled":"Pausa non supportata","ba-videorecorder-chooser.record-audio":"Registra audio","ba-videorecorder-controlbar.stop-available-after":"Il tempo di registrazione minimo &#xE8; %d secondi","ba-videorecorder-controlbar.cancel":"Annulla","ba-videorecorder-controlbar.cancel-tooltip":"Clicca qui per cancellare.","ba-videorecorder.cancel-confirm":"Vuoi veramente cancellare il tuo caricamento video?","ba-videoplayer-adslot.elapsed-time":"Tempo trascorso","ba-videoplayer-adslot.volume-button":"Imposta il volume","ba-videoplayer-adslot.volume-mute":"Suono muto","ba-videoplayer-adslot.volume-unmute":"Riattiva il suono","ba-videoplayer-adslot.ad-will-end-after":"L&#x27;annuncio terminer&#xE0; dopo %s","ba-videoplayer-adslot.can-skip-after":"Salta dopo %d","ba-videoplayer-adslot.skip-ad":"Salta annuncio","ba-videorecorder.software-required":"Clicca qui sotto per installare / attivare i seguenti requisiti per procedere.","ba-videorecorder.software-waiting":"Aspettando che i requisiti siano installati / attivati. Potrebbe essere necessario aggiornare la pagina dopo il completamento."},"language:nl":{"ba-videoplayer-playbutton.tooltip":"Klik om video af te spelen.","ba-videoplayer-playbutton.rerecord":"opnieuw","ba-videoplayer-playbutton.submit-video":"Bevestig video","ba-videoplayer-loader.tooltip":"Loading video ...","ba-videoplayer-controlbar.change-resolution":"resolutie Change","ba-videoplayer-controlbar.video-progress":"video vooruitgang","ba-videoplayer-controlbar.rerecord-video":"Opnieuw video?","ba-videoplayer-controlbar.submit-video":"Bevestig video","ba-videoplayer-controlbar.play-video":"Video afspelen","ba-videoplayer-controlbar.pause-video":"pauze video","ba-videoplayer-controlbar.elapsed-time":"Verstreken tijd","ba-videoplayer-controlbar.total-time":"De totale lengte van de video","ba-videoplayer-controlbar.fullscreen-video":"Voer fullscreen","ba-videoplayer-controlbar.volume-button":"Volume instellen","ba-videoplayer-controlbar.volume-mute":"geluid uitschakelen","ba-videoplayer-controlbar.volume-unmute":"geluid vrijgeven","ba-videoplayer.video-error":"Er is een fout opgetreden, probeer het later opnieuw. Klik hier om opnieuw te proberen.","ba-videorecorder-chooser.record-video":"Neem uw video","ba-videorecorder-chooser.upload-video":"Upload Video","ba-videorecorder-controlbar.settings":"instellingen","ba-videorecorder-controlbar.camerahealthy":"Verlichting is goed","ba-videorecorder-controlbar.cameraunhealthy":"Verlichting is niet optimaal","ba-videorecorder-controlbar.microphonehealthy":"Het geluid is goed","ba-videorecorder-controlbar.microphoneunhealthy":"Kan niet pikken elk geluid","ba-videorecorder-controlbar.record":"Record","ba-videorecorder-controlbar.record-tooltip":"Klik hier om te registreren.","ba-videorecorder-controlbar.rerecord":"opnieuw","ba-videorecorder-controlbar.rerecord-tooltip":"Klik hier om opnieuw te doen.","ba-videorecorder-controlbar.upload-covershot":"Uploaden","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klik hier om te uploaden aangepaste hoes schot","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Klik hier om te stoppen.","ba-videorecorder-controlbar.skip":"Overspringen","ba-videorecorder-controlbar.skip-tooltip":"Klik hier om over te slaan.","ba-videorecorder.recorder-error":"Er is een fout opgetreden, probeer het later opnieuw. Klik hier om opnieuw te proberen.","ba-videorecorder.attach-error":"We konden geen toegang tot de camera-interface. Afhankelijk van het apparaat en de browser, moet u misschien Flash installeren of toegang tot de pagina via SSL.","ba-videorecorder.access-forbidden":"De toegang tot de camera was verboden. Klik hier om opnieuw te proberen.","ba-videorecorder.pick-covershot":"Kies een covershot.","ba-videorecorder.uploading":"uploaden","ba-videorecorder.uploading-failed":"Uploaden mislukt - klik hier om opnieuw te proberen.","ba-videorecorder.verifying":"Het verifi&#xEB;ren","ba-videorecorder.verifying-failed":"Verifying mislukt - klik hier om opnieuw te proberen.","ba-videorecorder.rerecord-confirm":"Wil je echt wilt uw video opnieuw te doen?","ba-videorecorder.video_file_too_large":"Uw video bestand is te groot (%s) - klik hier om opnieuw te proberen met een kleinere videobestand.","ba-videorecorder.unsupported_video_type":"Upload: %s - klik hier om opnieuw te proberen.","ba-videoplayer-controlbar.exit-fullscreen-video":"Verlaat volledig scherm","ba-videoplayer-share.share":"Deel Video","ba-videorecorder-chooser.record-screen":"Record scherm","ba-videoplayer-controlbar.pause-video-disabled":"Pauzeren niet ondersteund","ba-videorecorder-chooser.record-audio":"Geluid opnemen","ba-videorecorder-controlbar.stop-available-after":"Minimale opnametijd is %d seconden","ba-videorecorder-controlbar.cancel":"Annuleer","ba-videorecorder-controlbar.cancel-tooltip":"Klik hier om te annuleren.","ba-videorecorder.cancel-confirm":"Wil je je video-upload echt annuleren?","ba-videoplayer-adslot.elapsed-time":"Elasped tijd","ba-videoplayer-adslot.volume-button":"Volume instellen","ba-videoplayer-adslot.volume-mute":"Geluid dempen","ba-videoplayer-adslot.volume-unmute":"Geluid dempen","ba-videoplayer-adslot.ad-will-end-after":"Advertentie eindigt na %s","ba-videoplayer-adslot.can-skip-after":"Skip na %d","ba-videoplayer-adslot.skip-ad":"Advertentie overslaan","ba-videorecorder.software-required":"Klik hieronder om de volgende vereisten te installeren / activeren om door te gaan.","ba-videorecorder.software-waiting":"Wacht tot de vereisten zijn ge&#xEF;nstalleerd / geactiveerd. Mogelijk moet u de pagina na voltooiing vernieuwen."},"language:no":{"ba-videoplayer-playbutton.tooltip":"Klikk for &#xE5; spille video.","ba-videoplayer-playbutton.rerecord":"Gj&#xF8;re om","ba-videoplayer-playbutton.submit-video":"bekreft video","ba-videoplayer-loader.tooltip":"Laster video ...","ba-videoplayer-controlbar.change-resolution":"Endre oppl&#xF8;sning","ba-videoplayer-controlbar.video-progress":"video fremgang","ba-videoplayer-controlbar.rerecord-video":"Gj&#xF8;r om videoen?","ba-videoplayer-controlbar.submit-video":"bekreft video","ba-videoplayer-controlbar.play-video":"spill video","ba-videoplayer-controlbar.pause-video":"pause video","ba-videoplayer-controlbar.elapsed-time":"Elasped tid","ba-videoplayer-controlbar.total-time":"Total lengde p&#xE5; video","ba-videoplayer-controlbar.fullscreen-video":"Skriv fullskjerm","ba-videoplayer-controlbar.volume-button":"Still inn volum","ba-videoplayer-controlbar.volume-mute":"lyd","ba-videoplayer-controlbar.volume-unmute":"lyd","ba-videoplayer.video-error":"En feil oppstod. Vennligst pr&#xF8;v igjen senere. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder-chooser.record-video":"Spill av video","ba-videorecorder-chooser.upload-video":"Last opp video","ba-videorecorder-controlbar.settings":"innstillinger","ba-videorecorder-controlbar.camerahealthy":"Belysning er god","ba-videorecorder-controlbar.cameraunhealthy":"Belysning er ikke optimal","ba-videorecorder-controlbar.microphonehealthy":"Lyden er god","ba-videorecorder-controlbar.microphoneunhealthy":"Kan ikke plukke opp noen lyd","ba-videorecorder-controlbar.record":"Ta opp","ba-videorecorder-controlbar.record-tooltip":"Klikk her for &#xE5; spille inn.","ba-videorecorder-controlbar.rerecord":"Gj&#xF8;re om","ba-videorecorder-controlbar.rerecord-tooltip":"Klikk her for &#xE5; gj&#xF8;re om.","ba-videorecorder-controlbar.upload-covershot":"Laste opp","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klikk her for &#xE5; laste opp egendefinerte dekke skudd","ba-videorecorder-controlbar.stop":"Stoppe","ba-videorecorder-controlbar.stop-tooltip":"Klikk her for &#xE5; stoppe.","ba-videorecorder-controlbar.skip":"Hopp","ba-videorecorder-controlbar.skip-tooltip":"Klikk her for &#xE5; hoppe.","ba-videorecorder.recorder-error":"En feil oppstod. Vennligst pr&#xF8;v igjen senere. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.attach-error":"Vi kunne ikke f&#xE5; tilgang til kameraet grensesnitt. Avhengig av enheten og nettleser, kan det hende du m&#xE5; installere Flash eller tilgang til siden via SSL.","ba-videorecorder.access-forbidden":"Tilgang til kameraet ble forbudt. Klikk for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.pick-covershot":"Plukk en covershot.","ba-videorecorder.uploading":"Laster opp","ba-videorecorder.uploading-failed":"Opplasting mislyktes - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.verifying":"Bekrefter","ba-videorecorder.verifying-failed":"Bekrefter mislyktes - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videorecorder.rerecord-confirm":"Har du virkelig &#xF8;nsker &#xE5; gj&#xF8;re om videoen?","ba-videorecorder.video_file_too_large":"Videofilen er for stor (%s) - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt med en mindre videofil.","ba-videorecorder.unsupported_video_type":"Last opp: %s - klikk her for &#xE5; pr&#xF8;ve p&#xE5; nytt.","ba-videoplayer-controlbar.exit-fullscreen-video":"Avslutt fullskjerm","ba-videoplayer-share.share":"Del video","ba-videorecorder-chooser.record-screen":"Opptaksskjerm","ba-videoplayer-controlbar.pause-video-disabled":"Pause ikke st&#xF8;ttet","ba-videorecorder-chooser.record-audio":"Ta opp lyd","ba-videorecorder-controlbar.stop-available-after":"Minimum opptakstid er %d sekunder","ba-videorecorder-controlbar.cancel":"Avbryt","ba-videorecorder-controlbar.cancel-tooltip":"Klikk her for &#xE5; avbryte.","ba-videorecorder.cancel-confirm":"Vil du virkelig slette videoopplasting?","ba-videoplayer-adslot.elapsed-time":"Elasped tid","ba-videoplayer-adslot.volume-button":"Angi volum","ba-videoplayer-adslot.volume-mute":"Dempe lyd","ba-videoplayer-adslot.volume-unmute":"Sl&#xE5; av lyden","ba-videoplayer-adslot.ad-will-end-after":"Annonsen slutter etter %s","ba-videoplayer-adslot.can-skip-after":"Hopp over etter %d","ba-videoplayer-adslot.skip-ad":"Hopp over annonse","ba-videorecorder.software-required":"Vennligst klikk nedenfor for &#xE5; installere / aktivere f&#xF8;lgende krav for &#xE5; fortsette.","ba-videorecorder.software-waiting":"Venter p&#xE5; kravene som skal installeres / aktiveres. Du m&#xE5; kanskje oppdatere siden etter ferdigstillelse."},"language:pl":{"ba-videoplayer-playbutton.tooltip":"Kliknij, aby odtworzy&#x107; film.","ba-videoplayer-playbutton.rerecord":"Przerobi&#x107;","ba-videoplayer-playbutton.submit-video":"Potwierd&#x17A; wideo","ba-videoplayer-loader.tooltip":"&#x141;adowanie wideo ...","ba-videoplayer-controlbar.change-resolution":"zmiana rozdzielczo&#x15B;ci","ba-videoplayer-controlbar.video-progress":"post&#x119;p wideo","ba-videoplayer-controlbar.rerecord-video":"Redo wideo?","ba-videoplayer-controlbar.submit-video":"Potwierd&#x17A; wideo","ba-videoplayer-controlbar.play-video":"play video","ba-videoplayer-controlbar.pause-video":"Pauza wideo","ba-videoplayer-controlbar.elapsed-time":"czas, jaki up&#x142;yn&#x105;&#x142;","ba-videoplayer-controlbar.total-time":"Ca&#x142;kowita d&#x142;ugo&#x15B;&#x107; wideo","ba-videoplayer-controlbar.fullscreen-video":"Otworzy&#x107; w trybie pe&#x142;noekranowym","ba-videoplayer-controlbar.volume-button":"Ustaw g&#x142;o&#x15B;no&#x15B;&#x107;","ba-videoplayer-controlbar.volume-mute":"Wycisz d&#x17A;wi&#x119;k","ba-videoplayer-controlbar.volume-unmute":"W&#x142;&#x105;cz d&#x17A;wi&#x119;k","ba-videoplayer.video-error":"Wyst&#x105;pi&#x142; b&#x142;&#x105;d. Prosz&#x119; spr&#xF3;bowa&#x107; p&#xF3;&#x17A;niej. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder-chooser.record-video":"Nagraj wideo","ba-videorecorder-chooser.upload-video":"Prze&#x15B;lij wideo","ba-videorecorder-controlbar.settings":"Ustawienia","ba-videorecorder-controlbar.camerahealthy":"O&#x15B;wietlenie jest dobre","ba-videorecorder-controlbar.cameraunhealthy":"O&#x15B;wietlenie nie jest optymalna","ba-videorecorder-controlbar.microphonehealthy":"D&#x17A;wi&#x119;k jest dobry","ba-videorecorder-controlbar.microphoneunhealthy":"Nie mog&#x119; odebra&#x107; &#x17C;adnego d&#x17A;wi&#x119;ku","ba-videorecorder-controlbar.record":"Rekord","ba-videorecorder-controlbar.record-tooltip":"Kliknij tutaj, aby nagra&#x107;.","ba-videorecorder-controlbar.rerecord":"Przerobi&#x107;","ba-videorecorder-controlbar.rerecord-tooltip":"Kliknij tutaj, aby ponowi&#x107;.","ba-videorecorder-controlbar.upload-covershot":"Przekaza&#x107; plik","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kliknij tu aby przes&#x142;a&#x107; niestandardowy ok&#x142;adk&#x119; strza&#x142;","ba-videorecorder-controlbar.stop":"Zatrzymaj si&#x119;","ba-videorecorder-controlbar.stop-tooltip":"Kliknij tutaj, aby zatrzyma&#x107;.","ba-videorecorder-controlbar.skip":"Pomin&#x105;&#x107;","ba-videorecorder-controlbar.skip-tooltip":"Kliknij tutaj, aby przej&#x15B;&#x107;.","ba-videorecorder.recorder-error":"Wyst&#x105;pi&#x142; b&#x142;&#x105;d. Prosz&#x119; spr&#xF3;bowa&#x107; p&#xF3;&#x17A;niej. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.attach-error":"Nie mogli&#x15B;my uzyska&#x107; dost&#x119;p do interfejsu aparatu. W zale&#x17C;no&#x15B;ci od urz&#x105;dzenia i przegl&#x105;darki, mo&#x17C;e by&#x107; konieczne zainstalowanie Flash lub wej&#x15B;&#x107; na stron&#x119; za po&#x15B;rednictwem protoko&#x142;u SSL.","ba-videorecorder.access-forbidden":"Dost&#x119;p do kamery by&#x142;o zabronione. Kliknij, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.pick-covershot":"Wybierz covershot.","ba-videorecorder.uploading":"Przesy&#x142;anie","ba-videorecorder.uploading-failed":"Przesy&#x142;anie nie powiod&#x142;o si&#x119; - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.verifying":"Weryfikacja","ba-videorecorder.verifying-failed":"Sprawdzanie poprawno&#x15B;ci nie powiod&#x142;o si&#x119; - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videorecorder.rerecord-confirm":"Czy na pewno chcesz przerobi&#x107; sw&#xF3;j film?","ba-videorecorder.video_file_too_large":"Plik wideo jest zbyt du&#x17C;a (%s) - kliknij tutaj, aby spr&#xF3;bowa&#x107; ponownie z mniejszym pliku wideo.","ba-videorecorder.unsupported_video_type":"Prosz&#x119; przes&#x142;a&#x107;: %s - kliknij tutaj, aby ponowi&#x107; pr&#xF3;b&#x119;.","ba-videoplayer-controlbar.exit-fullscreen-video":"Zamknij pe&#x142;ny ekran","ba-videoplayer-share.share":"Udost&#x119;pnij film","ba-videorecorder-chooser.record-screen":"Ekran nagrywania","ba-videoplayer-controlbar.pause-video-disabled":"Wstrzymanie nie jest obs&#x142;ugiwane","ba-videorecorder-chooser.record-audio":"Nagra&#x107; d&#x17A;wi&#x119;k","ba-videorecorder-controlbar.stop-available-after":"Minimalny czas nagrywania to %d sekund","ba-videorecorder-controlbar.cancel":"Anuluj","ba-videorecorder-controlbar.cancel-tooltip":"Kliknij tutaj, aby anulowa&#x107;.","ba-videorecorder.cancel-confirm":"Czy na pewno chcesz anulowa&#x107; przesy&#x142;anie wideo?","ba-videoplayer-adslot.elapsed-time":"Wyd&#x142;u&#x17C;ony czas","ba-videoplayer-adslot.volume-button":"Ustaw g&#x142;o&#x15B;no&#x15B;&#x107;","ba-videoplayer-adslot.volume-mute":"Wycisz d&#x17A;wi&#x119;k","ba-videoplayer-adslot.volume-unmute":"W&#x142;&#x105;cz d&#x17A;wi&#x119;k","ba-videoplayer-adslot.ad-will-end-after":"Reklama zako&#x144;czy si&#x119; po %s","ba-videoplayer-adslot.can-skip-after":"Pomi&#x144; po %d","ba-videoplayer-adslot.skip-ad":"Pomi&#x144; reklam&#x119;","ba-videorecorder.software-required":"Kliknij poni&#x17C;ej, aby zainstalowa&#x107; / aktywowa&#x107; nast&#x119;puj&#x105;ce wymagania, aby kontynuowa&#x107;.","ba-videorecorder.software-waiting":"Oczekiwanie na zainstalowanie / aktywacj&#x119; wymaga&#x144;. Po zako&#x144;czeniu mo&#x17C;e by&#x107; konieczne od&#x15B;wie&#x17C;enie strony."},"language:pt-br":{"ba-videoplayer-playbutton.tooltip":"Clique para reproduzir v&#xED;deo.","ba-videoplayer-playbutton.rerecord":"Refazer","ba-videoplayer-playbutton.submit-video":"confirmar v&#xED;deo","ba-videoplayer-loader.tooltip":"Carregando v&#xED;deo ...","ba-videoplayer-controlbar.change-resolution":"altera&#xE7;&#xE3;o de resolu&#xE7;&#xE3;o","ba-videoplayer-controlbar.video-progress":"o progresso de v&#xED;deo","ba-videoplayer-controlbar.rerecord-video":"Refazer v&#xED;deo?","ba-videoplayer-controlbar.submit-video":"confirmar v&#xED;deo","ba-videoplayer-controlbar.play-video":"reprodu&#xE7;&#xE3;o de v&#xED;deo","ba-videoplayer-controlbar.pause-video":"v&#xED;deo pausa","ba-videoplayer-controlbar.elapsed-time":"tempo elasped","ba-videoplayer-controlbar.total-time":"comprimento total de v&#xED;deo","ba-videoplayer-controlbar.fullscreen-video":"Entrar em tela cheia","ba-videoplayer-controlbar.volume-button":"volume definido","ba-videoplayer-controlbar.volume-mute":"som Mute","ba-videoplayer-controlbar.volume-unmute":"ativar o som","ba-videoplayer.video-error":"Ocorreu um erro. Por favor tente novamente mais tarde. Clique para tentar novamente.","ba-videorecorder-chooser.record-video":"Grave o seu v&#xED;deo","ba-videorecorder-chooser.upload-video":"Upload video","ba-videorecorder-controlbar.settings":"Configura&#xE7;&#xF5;es","ba-videorecorder-controlbar.camerahealthy":"A ilumina&#xE7;&#xE3;o &#xE9; boa","ba-videorecorder-controlbar.cameraunhealthy":"Ilumina&#xE7;&#xE3;o n&#xE3;o &#xE9; o ideal","ba-videorecorder-controlbar.microphonehealthy":"O som &#xE9; bom","ba-videorecorder-controlbar.microphoneunhealthy":"n&#xE3;o pode pegar qualquer som","ba-videorecorder-controlbar.record":"Registro","ba-videorecorder-controlbar.record-tooltip":"Clique aqui para registrar.","ba-videorecorder-controlbar.rerecord":"Refazer","ba-videorecorder-controlbar.rerecord-tooltip":"Clique aqui para refazer.","ba-videorecorder-controlbar.upload-covershot":"Envio","ba-videorecorder-controlbar.upload-covershot-tooltip":"Clique aqui para enviar capa personalizada tiro","ba-videorecorder-controlbar.stop":"Pare","ba-videorecorder-controlbar.stop-tooltip":"Clique aqui para parar.","ba-videorecorder-controlbar.skip":"Pular","ba-videorecorder-controlbar.skip-tooltip":"Clique aqui para pular.","ba-videorecorder.recorder-error":"Ocorreu um erro. Por favor tente novamente mais tarde. Clique para tentar novamente.","ba-videorecorder.attach-error":"N&#xF3;s n&#xE3;o poderia acessar a interface da c&#xE2;mera. Dependendo do dispositivo e navegador, pode ser necess&#xE1;rio instalar o Flash ou acessar a p&#xE1;gina atrav&#xE9;s de SSL.","ba-videorecorder.access-forbidden":"foi proibido o acesso &#xE0; c&#xE2;mera. Clique para tentar novamente.","ba-videorecorder.pick-covershot":"Escolha um covershot.","ba-videorecorder.uploading":"upload","ba-videorecorder.uploading-failed":"Upload falhou - clique aqui para tentar novamente.","ba-videorecorder.verifying":"Verificando","ba-videorecorder.verifying-failed":"Verificando falhou - clique aqui para tentar novamente.","ba-videorecorder.rerecord-confirm":"Voc&#xEA; realmente quer refazer seu v&#xED;deo?","ba-videorecorder.video_file_too_large":"O arquivo de v&#xED;deo &#xE9; muito grande (%s) - clique aqui para tentar novamente com um arquivo de v&#xED;deo menor.","ba-videorecorder.unsupported_video_type":"Fa&#xE7;a o upload: %s - clique aqui para tentar novamente.","ba-videoplayer-controlbar.exit-fullscreen-video":"Sair do ecr&#xE3; inteiro","ba-videoplayer-share.share":"Compartilhar video","ba-videorecorder-chooser.record-screen":"Tela de registro","ba-videoplayer-controlbar.pause-video-disabled":"Pausa n&#xE3;o suportada","ba-videorecorder-chooser.record-audio":"Gravar audio","ba-videorecorder-controlbar.stop-available-after":"O tempo m&#xED;nimo de grava&#xE7;&#xE3;o &#xE9; %d segundos","ba-videorecorder-controlbar.cancel":"Cancelar","ba-videorecorder-controlbar.cancel-tooltip":"Clique aqui para cancelar.","ba-videorecorder.cancel-confirm":"Voc&#xEA; deseja realmente cancelar o upload de seu v&#xED;deo?","ba-videoplayer-adslot.elapsed-time":"Tempo Elasped","ba-videoplayer-adslot.volume-button":"Definir volume","ba-videoplayer-adslot.volume-mute":"Som mudo","ba-videoplayer-adslot.volume-unmute":"Somar som","ba-videoplayer-adslot.ad-will-end-after":"O an&#xFA;ncio terminar&#xE1; ap&#xF3;s %s","ba-videoplayer-adslot.can-skip-after":"Ignorar ap&#xF3;s %d","ba-videoplayer-adslot.skip-ad":"Pular An&#xFA;ncio","ba-videorecorder.software-required":"Clique abaixo para instalar / ativar os seguintes requisitos para prosseguir.","ba-videorecorder.software-waiting":"Esperando que os requisitos sejam instalados / ativados. Talvez seja necess&#xE1;rio atualizar a p&#xE1;gina ap&#xF3;s a conclus&#xE3;o."},"language:pt":{"ba-videoplayer-playbutton.tooltip":"Clique para ver","ba-videoplayer-playbutton.rerecord":"Repetir","ba-videoplayer-playbutton.submit-video":"Enviar v&#xED;deo","ba-videoplayer-loader.tooltip":"A Carregar...","ba-videoplayer-controlbar.change-resolution":"Alterar resolu&#xE7;&#xE3;o","ba-videoplayer-controlbar.video-progress":"Progress&#xE3;o","ba-videoplayer-controlbar.rerecord-video":"Repetir?","ba-videoplayer-controlbar.submit-video":"Confirmar","ba-videoplayer-controlbar.play-video":"Ver V&#xED;deo","ba-videoplayer-controlbar.pause-video":"Pausa","ba-videoplayer-controlbar.elapsed-time":"Tempo decorrido","ba-videoplayer-controlbar.total-time":"Tempo Total","ba-videoplayer-controlbar.fullscreen-video":"Modo ecr&#xE3; inteiro","ba-videoplayer-controlbar.volume-button":"Definir volume","ba-videoplayer-controlbar.volume-mute":"Som silencioso","ba-videoplayer-controlbar.volume-unmute":"Aumentar Som","ba-videoplayer.video-error":"Ocorreu um erro. Por favor tente de novo mais tarde. Clique para tentar novamente.","ba-videorecorder-chooser.record-video":"Gravar V&#xED;deo","ba-videorecorder-chooser.upload-video":"Enviar V&#xED;deo","ba-videorecorder-controlbar.settings":"Configura&#xE7;&#xF5;es","ba-videorecorder-controlbar.camerahealthy":"A ilumina&#xE7;&#xE3;o &#xE9; boa","ba-videorecorder-controlbar.cameraunhealthy":"A ilumina&#xE7;&#xE3;o n&#xE3;o &#xE9; a ideal","ba-videorecorder-controlbar.microphonehealthy":"O som est&#xE1; bom","ba-videorecorder-controlbar.microphoneunhealthy":"N&#xE3;o foi poss&#xED;vel ouvir nenhum som","ba-videorecorder-controlbar.record":"Gravar","ba-videorecorder-controlbar.record-tooltip":"Clique aqui para gravar","ba-videorecorder-controlbar.rerecord":"Repetir","ba-videorecorder-controlbar.rerecord-tooltip":"Clique aqui para repetir","ba-videorecorder-controlbar.upload-covershot":"Enviar","ba-videorecorder-controlbar.upload-covershot-tooltip":"Clique aqui para enviar a captura de capa personalizada","ba-videorecorder-controlbar.stop":"Parar","ba-videorecorder-controlbar.stop-tooltip":"Clique aqui para parar","ba-videorecorder-controlbar.skip":"Ignorar","ba-videorecorder-controlbar.skip-tooltip":"Clique aqui para ignorar","ba-videorecorder.recorder-error":"Ocorreu um erro. Por favor tente novamente mais tarde. Clique para tentar novamente.","ba-videorecorder.attach-error":"N&#xE3;o conseguimos aceder &#xE0; c&#xE2;mara. Dependendo do dispositivo e do navegador, pode ser necess&#xE1;rio instalar o Flash ou aceder &#xE0; p&#xE1;gina via SSL.","ba-videorecorder.access-forbidden":"O acesso &#xE0; c&#xE2;mara foi pro&#xED;bido. Clique para tentar novamente.","ba-videorecorder.pick-covershot":"Escolha uma capa personalizada","ba-videorecorder.uploading":"A enviar","ba-videorecorder.uploading-failed":"O envio falhou - clique para tentar de novo","ba-videorecorder.verifying":"A verificar","ba-videorecorder.verifying-failed":"A verifica&#xE7;&#xE3;o falhou - clique para tentar de novo","ba-videorecorder.rerecord-confirm":"Quer mesmo repetir o seu v&#xED;deo?","ba-videorecorder.video_file_too_large":"O seu v&#xED;deo &#xE9; demasiado grande (%s) - clique para tentar de novo com um v&#xED;deo mais pequeno.","ba-videorecorder.unsupported_video_type":"Please upload: %s - clique para tentar de novo.","ba-videoplayer-controlbar.exit-fullscreen-video":"Sair do modo ecr&#xE3; inteiro","ba-videoplayer-share.share":"Partilhar a grava&#xE7;&#xE3;o","ba-videoplayer-controlbar.pause-video-disabled":"A pausa n&#xE3;o &#xE9; suportada","ba-videorecorder-chooser.record-audio":"Gravar Audio","ba-videorecorder-chooser.record-screen":"Tela de registro","ba-videorecorder-controlbar.stop-available-after":"O tempo m&#xED;nimo de grava&#xE7;&#xE3;o &#xE9; %d segundos","ba-videorecorder-controlbar.cancel":"Cancelar","ba-videorecorder-controlbar.cancel-tooltip":"Clique aqui para cancelar.","ba-videorecorder.cancel-confirm":"Voc&#xEA; deseja realmente cancelar o upload de seu v&#xED;deo?","ba-videoplayer-adslot.elapsed-time":"Tempo Elasped","ba-videoplayer-adslot.volume-button":"Definir volume","ba-videoplayer-adslot.volume-mute":"Som mudo","ba-videoplayer-adslot.volume-unmute":"Somar som","ba-videoplayer-adslot.ad-will-end-after":"O an&#xFA;ncio terminar&#xE1; ap&#xF3;s %s","ba-videoplayer-adslot.can-skip-after":"Ignorar ap&#xF3;s %d","ba-videoplayer-adslot.skip-ad":"Pular An&#xFA;ncio","ba-videorecorder.software-required":"Clique abaixo para instalar / ativar os seguintes requisitos para prosseguir.","ba-videorecorder.software-waiting":"Esperando que os requisitos sejam instalados / ativados. Talvez seja necess&#xE1;rio atualizar a p&#xE1;gina ap&#xF3;s a conclus&#xE3;o."},"language:ro":{"ba-videoplayer-playbutton.tooltip":"Click aici pentru a reda video.","ba-videoplayer-playbutton.rerecord":"Reface","ba-videoplayer-playbutton.submit-video":"confirm&#x103; film","ba-videoplayer-loader.tooltip":"Se &#xEE;ncarc&#x103; videoclipul ...","ba-videoplayer-controlbar.change-resolution":"Schimba&#x21B;i rezolu&#x21B;ia","ba-videoplayer-controlbar.video-progress":"progresul video","ba-videoplayer-controlbar.rerecord-video":"Reface&#x21B;i video?","ba-videoplayer-controlbar.submit-video":"confirm&#x103; film","ba-videoplayer-controlbar.play-video":"Ruleaz&#x103; video","ba-videoplayer-controlbar.pause-video":"video de pauz&#x103;","ba-videoplayer-controlbar.elapsed-time":"timp scurs","ba-videoplayer-controlbar.total-time":"Lungimea total&#x103; a videoclipului","ba-videoplayer-controlbar.fullscreen-video":"intra pe tot ecranul","ba-videoplayer-controlbar.volume-button":"set de volum","ba-videoplayer-controlbar.volume-mute":"sunet mut","ba-videoplayer-controlbar.volume-unmute":"repornirea sunetului","ba-videoplayer.video-error":"A ap&#x103;rut o eroare, v&#x103; rug&#x103;m s&#x103; &#xEE;ncerca&#x21B;i din nou mai t&#xE2;rziu. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder-chooser.record-video":"&#xCE;nregistrarea imaginilor video dvs.","ba-videorecorder-chooser.upload-video":"&#xCE;ncarc&#x103; film","ba-videorecorder-controlbar.settings":"set&#x103;rile","ba-videorecorder-controlbar.camerahealthy":"De iluminat este bun","ba-videorecorder-controlbar.cameraunhealthy":"De iluminat nu este optim","ba-videorecorder-controlbar.microphonehealthy":"Sunetul este bun","ba-videorecorder-controlbar.microphoneunhealthy":"Nu se poate ridica nici un sunet","ba-videorecorder-controlbar.record":"Record","ba-videorecorder-controlbar.record-tooltip":"Apasa aici pentru a &#xEE;nregistra.","ba-videorecorder-controlbar.rerecord":"Reface","ba-videorecorder-controlbar.rerecord-tooltip":"Apasa aici pentru a reface.","ba-videorecorder-controlbar.upload-covershot":"&#xCE;nc&#x103;rca&#x21B;i","ba-videorecorder-controlbar.upload-covershot-tooltip":"Apasa aici pentru a &#xEE;nc&#x103;rca capac personalizat lovitur&#x103;","ba-videorecorder-controlbar.stop":"Stop","ba-videorecorder-controlbar.stop-tooltip":"Apasa aici pentru a opri.","ba-videorecorder-controlbar.skip":"s&#x103;ri","ba-videorecorder-controlbar.skip-tooltip":"Apasa aici pentru a s&#x103;ri peste.","ba-videorecorder.recorder-error":"A ap&#x103;rut o eroare, v&#x103; rug&#x103;m s&#x103; &#xEE;ncerca&#x21B;i din nou mai t&#xE2;rziu. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.attach-error":"Nu am putut accesa interfa&#x21B;a camerei. &#xCE;n func&#x21B;ie de dispozitiv &#x219;i browser-ul, poate fi necesar s&#x103; instala&#x21B;i Flash sau accesa pagina prin SSL.","ba-videorecorder.access-forbidden":"Accesul la camera a fost interzis&#x103;. Click aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.pick-covershot":"Alege un covershot.","ba-videorecorder.uploading":"Se &#xEE;ncarc&#x103;","ba-videorecorder.uploading-failed":"Se &#xEE;ncarc&#x103; nu a reu&#x219;it - clic aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.verifying":"Se verific&#x103;","ba-videorecorder.verifying-failed":"Care verific&#x103; dac&#x103; nu a reu&#x219;it - clic aici pentru a &#xEE;ncerca din nou.","ba-videorecorder.rerecord-confirm":"Chiar vrei s&#x103; reface&#x21B;i videoclipul?","ba-videorecorder.video_file_too_large":"Fi&#x219;ierul dvs. video este prea mare (%s) - click aici pentru a &#xEE;ncerca din nou cu un fi&#x219;ier video mai mic.","ba-videorecorder.unsupported_video_type":"V&#x103; rug&#x103;m s&#x103; &#xEE;nc&#x103;rca&#x21B;i: %s - clic aici pentru a &#xEE;ncerca din nou.","ba-videoplayer-controlbar.exit-fullscreen-video":"Ie&#x219;i&#x21B;i din ecranul complet","ba-videoplayer-share.share":"Distribui&#x21B;i videoclipul","ba-videorecorder-chooser.record-screen":"Ecranul de &#xEE;nregistrare","ba-videoplayer-controlbar.pause-video-disabled":"&#xCE;ntreruperea nu este acceptat&#x103;","ba-videorecorder-chooser.record-audio":"&#xCE;nregistreaz&#x103; audio","ba-videorecorder-controlbar.stop-available-after":"Durata minim&#x103; de &#xEE;nregistrare este %d secunde","ba-videorecorder-controlbar.cancel":"Anulare","ba-videorecorder-controlbar.cancel-tooltip":"Face&#x21B;i clic aici pentru a anula.","ba-videorecorder.cancel-confirm":"Chiar vrei s&#x103; anulezi &#xEE;nc&#x103;rcarea videoclipului?","ba-videoplayer-adslot.elapsed-time":"Elased timp","ba-videoplayer-adslot.volume-button":"Seta&#x21B;i volumul","ba-videoplayer-adslot.volume-mute":"Opri&#x21B;i sunetul","ba-videoplayer-adslot.volume-unmute":"Repeta&#x21B;i sunetul","ba-videoplayer-adslot.ad-will-end-after":"Anun&#x21B;ul se va &#xEE;ncheia dup&#x103; %s","ba-videoplayer-adslot.can-skip-after":"S&#x103;ri&#x21B;i dup&#x103; %d","ba-videoplayer-adslot.skip-ad":"&#x218;terge&#x21B;i anun&#x21B;ul","ba-videorecorder.software-required":"Face&#x21B;i clic mai jos pentru a instala / activa urm&#x103;toarele cerin&#x21B;e pentru a continua.","ba-videorecorder.software-waiting":"Se a&#x219;teapt&#x103; ca cerin&#x21B;ele s&#x103; fie instalate / activate. Poate fi necesar s&#x103; actualiza&#x21B;i pagina dup&#x103; finalizare."},"language:ru":{"ba-videoplayer-playbutton.tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x432;&#x43E;&#x441;&#x43F;&#x440;&#x43E;&#x438;&#x437;&#x432;&#x435;&#x441;&#x442;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;.","ba-videoplayer-playbutton.rerecord":"&#x41F;&#x435;&#x440;&#x435;&#x437;&#x430;&#x43F;&#x438;&#x441;&#x430;&#x442;&#x44C;","ba-videoplayer-loader.tooltip":"&#x417;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43A;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E; ...","ba-videoplayer-controlbar.change-resolution":"&#x418;&#x437;&#x43C;&#x435;&#x43D;&#x438;&#x442;&#x44C; &#x440;&#x430;&#x437;&#x440;&#x435;&#x448;&#x435;&#x43D;&#x438;&#x435;","ba-videoplayer-controlbar.video-progress":"&#x425;&#x43E;&#x434; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.rerecord-video":"&#x41F;&#x435;&#x440;&#x435;&#x437;&#x430;&#x43F;&#x438;&#x441;&#x430;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-controlbar.play-video":"&#x41F;&#x440;&#x43E;&#x438;&#x433;&#x440;&#x430;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.pause-video":"&#x41F;&#x440;&#x438;&#x43E;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.elapsed-time":"&#x41F;&#x440;&#x43E;&#x439;&#x434;&#x435;&#x43D;&#x43D;&#x43E;&#x435; &#x432;&#x440;&#x435;&#x43C;&#x44F;","ba-videoplayer-controlbar.total-time":"&#x41E;&#x431;&#x449;&#x430;&#x44F; &#x434;&#x43B;&#x438;&#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.fullscreen-video":"&#x41F;&#x43E;&#x43B;&#x43D;&#x43E;&#x44D;&#x43A;&#x440;&#x430;&#x43D;&#x43D;&#x44B;&#x439; &#x440;&#x435;&#x436;&#x438;&#x43C;","ba-videoplayer-controlbar.volume-button":"&#x413;&#x440;&#x43E;&#x43C;&#x43A;&#x43E;&#x441;&#x442;&#x44C;","ba-videoplayer-controlbar.volume-mute":"&#x41E;&#x442;&#x43A;&#x43B;&#x44E;&#x447;&#x438;&#x442;&#x44C; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-controlbar.volume-unmute":"&#x412;&#x43A;&#x43B;&#x44E;&#x447;&#x438;&#x442;&#x44C; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer.video-error":"&#x41F;&#x440;&#x43E;&#x438;&#x437;&#x43E;&#x448;&#x43B;&#x430; &#x43E;&#x448;&#x438;&#x431;&#x43A;&#x430;. &#x41F;&#x43E;&#x436;&#x430;&#x43B;&#x443;&#x439;&#x441;&#x442;&#x430;, &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x435; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443; &#x43F;&#x43E;&#x437;&#x436;&#x435;. &#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videorecorder-chooser.record-video":"&#x417;&#x430;&#x43F;&#x438;&#x448;&#x438;&#x442;&#x435; &#x441;&#x432;&#x43E;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.upload-video":"&#x417;&#x430;&#x433;&#x440;&#x443;&#x437;&#x438;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.settings":"&#x41D;&#x430;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x43A;&#x438;","ba-videorecorder-controlbar.camerahealthy":"&#x41E;&#x441;&#x432;&#x435;&#x449;&#x435;&#x43D;&#x438;&#x435; &#x445;&#x43E;&#x440;&#x43E;&#x448;&#x435;&#x435;","ba-videorecorder-controlbar.cameraunhealthy":"&#x421;&#x43B;&#x430;&#x431;&#x43E;&#x435; &#x43E;&#x441;&#x432;&#x435;&#x449;&#x435;&#x43D;&#x438;&#x435;","ba-videorecorder-controlbar.microphonehealthy":"&#x417;&#x432;&#x443;&#x43A; &#x445;&#x43E;&#x440;&#x43E;&#x448;&#x438;&#x439;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x41D;&#x435;&#x432;&#x43E;&#x437;&#x43C;&#x43E;&#x436;&#x43D;&#x43E; &#x43F;&#x43E;&#x43B;&#x443;&#x447;&#x438;&#x442;&#x44C; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.record":"&#x417;&#x430;&#x43F;&#x438;&#x441;&#x44C;","ba-videorecorder-controlbar.record-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x437;&#x430;&#x43F;&#x438;&#x441;&#x430;&#x442;&#x44C;.","ba-videorecorder-controlbar.stop":"&#x421;&#x442;&#x43E;&#x43F;","ba-videorecorder-controlbar.stop-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43E;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C;.","ba-videorecorder-controlbar.skip":"&#x41F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x442;&#x438;&#x442;&#x44C;","ba-videorecorder-controlbar.skip-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x442;&#x438;&#x442;&#x44C;.","ba-videorecorder.recorder-error":"&#x41F;&#x440;&#x43E;&#x438;&#x437;&#x43E;&#x448;&#x43B;&#x430; &#x43E;&#x448;&#x438;&#x431;&#x43A;&#x430;. &#x41F;&#x43E;&#x436;&#x430;&#x43B;&#x443;&#x439;&#x441;&#x442;&#x430;, &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x435; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443; &#x43F;&#x43E;&#x437;&#x436;&#x435;. &#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videorecorder.access-forbidden":"&#x414;&#x43E;&#x441;&#x442;&#x443;&#x43F; &#x43A; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x435; &#x431;&#x44B;&#x43B; &#x437;&#x430;&#x43F;&#x440;&#x435;&#x449;&#x435;&#x43D;. &#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videorecorder.pick-covershot":"&#x412;&#x44B;&#x431;&#x435;&#x440;&#x438;&#x442;&#x435; &#x441;&#x43D;&#x438;&#x43C;&#x43E;&#x43A;.","ba-videorecorder.uploading":"&#x417;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43A;&#x430;","ba-videorecorder.uploading-failed":"&#x41E;&#x448;&#x438;&#x431;&#x43A;&#x430; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43A;&#x438;: &#x43D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videorecorder.verifying":"&#x41F;&#x440;&#x43E;&#x432;&#x435;&#x440;&#x43A;&#x430;","ba-videorecorder.verifying-failed":"&#x41E;&#x448;&#x438;&#x431;&#x43A;&#x430; &#x43F;&#x43E;&#x434;&#x442;&#x432;&#x435;&#x440;&#x436;&#x434;&#x435;&#x43D;&#x438;&#x44F;. &#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videorecorder.rerecord-confirm":"&#x412;&#x44B; &#x434;&#x435;&#x439;&#x441;&#x442;&#x432;&#x438;&#x442;&#x435;&#x43B;&#x44C;&#x43D;&#x43E; &#x445;&#x43E;&#x442;&#x438;&#x442;&#x435; &#x43F;&#x435;&#x440;&#x435;&#x437;&#x430;&#x43F;&#x438;&#x441;&#x430;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videorecorder.video_file_too_large":"&#x421;&#x43B;&#x438;&#x448;&#x43A;&#x43E;&#x43C; &#x431;&#x43E;&#x43B;&#x44C;&#x448;&#x43E;&#x439; &#x432;&#x438;&#x434;&#x435;&#x43E;&#x444;&#x430;&#x439;&#x43B;. &#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443; &#x441; &#x43C;&#x435;&#x43D;&#x44C;&#x448;&#x438;&#x43C; &#x432;&#x438;&#x434;&#x435;&#x43E;&#x444;&#x430;&#x439;&#x43B;&#x43E;&#x43C;.","ba-videorecorder.unsupported_video_type":"&#x41F;&#x43E;&#x436;&#x430;&#x43B;&#x443;&#x439;&#x441;&#x442;&#x430; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x438;&#x442;&#x435;: %s - &#x43D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x43E;&#x432;&#x442;&#x43E;&#x440;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x43F;&#x44B;&#x442;&#x43A;&#x443;.","ba-videoplayer-playbutton.submit-video":"&#x41F;&#x43E;&#x434;&#x442;&#x432;&#x435;&#x440;&#x434;&#x438;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.submit-video":"&#x41F;&#x43E;&#x434;&#x442;&#x432;&#x435;&#x440;&#x434;&#x438;&#x442;&#x44C; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.rerecord":"&#x41F;&#x435;&#x440;&#x435;&#x434;&#x435;&#x43B;&#x430;&#x442;&#x44C;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x435;&#x440;&#x435;&#x437;&#x430;&#x43F;&#x438;&#x441;&#x430;&#x442;&#x44C;","ba-videorecorder-controlbar.upload-covershot":"&#x417;&#x430;&#x433;&#x440;&#x443;&#x437;&#x438;&#x442;&#x44C;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x438;&#x442;&#x44C; &#x43B;&#x438;&#x447;&#x43D;&#x443;&#x44E; &#x43E;&#x431;&#x43B;&#x43E;&#x436;&#x43A;&#x443;","ba-videorecorder.attach-error":"&#x22;&#x41D;&#x435; &#x443;&#x434;&#x430;&#x43B;&#x43E;&#x441;&#x44C; &#x43F;&#x43E;&#x43B;&#x443;&#x447;&#x438;&#x442;&#x44C; &#x434;&#x43E;&#x441;&#x442;&#x443;&#x43F; &#x43A; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x435;. &#x412; &#x437;&#x430;&#x432;&#x438;&#x441;&#x438;&#x43C;&#x43E;&#x441;&#x442;&#x438; &#x43E;&#x442; &#x443;&#x441;&#x442;&#x440;&#x43E;&#x439;&#x441;&#x442;&#x432;&#x430; &#x438;&#x43B;&#x438; &#x431;&#x440;&#x430;&#x443;&#x437;&#x435;&#x440;&#x430;, &#x432;&#x430;&#x43C; &#x43C;&#x43E;&#x436;&#x435;&#x442; &#x43F;&#x43E;&#x43D;&#x430;&#x434;&#x43E;&#x431;&#x438;&#x442;&#x44C;&#x441;&#x44F; &#x443;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C; Flash &#x438;&#x43B;&#x438; &#x43F;&#x43E;&#x43B;&#x443;&#x447;&#x438;&#x442;&#x44C; &#x434;&#x43E;&#x441;&#x442;&#x443;&#x43F; &#x43A; &#x441;&#x430;&#x439;&#x442;&#x443; &#x447;&#x435;&#x440;&#x435;&#x437; SSL.&#x22;","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x412;&#x44B;&#x439;&#x442;&#x438; &#x438;&#x437; &#x440;&#x435;&#x436;&#x438;&#x43C;&#x430; &#x43F;&#x43E;&#x43B;&#x43D;&#x43E;&#x433;&#x43E; &#x43E;&#x43A;&#x43D;&#x430;","ba-videoplayer-share.share":"&#x41F;&#x43E;&#x434;&#x435;&#x43B;&#x438;&#x442;&#x44C;&#x441;&#x44F; &#x441; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.record-screen":"&#x42D;&#x43A;&#x440;&#x430;&#x43D; &#x437;&#x430;&#x43F;&#x438;&#x441;&#x438;","ba-videoplayer-controlbar.pause-video-disabled":"&#x41F;&#x430;&#x443;&#x437;&#x430; &#x43D;&#x435; &#x43F;&#x43E;&#x434;&#x434;&#x435;&#x440;&#x436;&#x438;&#x432;&#x430;&#x435;&#x442;&#x441;&#x44F;","ba-videorecorder-chooser.record-audio":"&#x417;&#x430;&#x43F;&#x438;&#x441;&#x44C; &#x430;&#x443;&#x434;&#x438;&#x43E;","ba-videorecorder-controlbar.stop-available-after":"&#x41C;&#x438;&#x43D;&#x438;&#x43C;&#x430;&#x43B;&#x44C;&#x43D;&#x43E;&#x435; &#x432;&#x440;&#x435;&#x43C;&#x44F; &#x437;&#x430;&#x43F;&#x438;&#x441;&#x438;: %d &#x441;&#x435;&#x43A;&#x443;&#x43D;&#x434;","ba-videorecorder-controlbar.cancel":"&#x41E;&#x442;&#x43C;&#x435;&#x43D;&#x430;","ba-videorecorder-controlbar.cancel-tooltip":"&#x41D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x437;&#x434;&#x435;&#x441;&#x44C;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43E;&#x442;&#x43C;&#x435;&#x43D;&#x438;&#x442;&#x44C;.","ba-videorecorder.cancel-confirm":"&#x412;&#x44B; &#x434;&#x435;&#x439;&#x441;&#x442;&#x432;&#x438;&#x442;&#x435;&#x43B;&#x44C;&#x43D;&#x43E; &#x445;&#x43E;&#x442;&#x438;&#x442;&#x435; &#x43E;&#x442;&#x43C;&#x435;&#x43D;&#x438;&#x442;&#x44C; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43A;&#x443; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-adslot.elapsed-time":"&#x423;&#x43A;&#x43E;&#x440;&#x43E;&#x447;&#x435;&#x43D;&#x43D;&#x43E;&#x435; &#x432;&#x440;&#x435;&#x43C;&#x44F;","ba-videoplayer-adslot.volume-button":"&#x423;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C; &#x433;&#x440;&#x43E;&#x43C;&#x43A;&#x43E;&#x441;&#x442;&#x44C;","ba-videoplayer-adslot.volume-mute":"&#x41E;&#x442;&#x43A;&#x43B;&#x44E;&#x447;&#x438;&#x442;&#x44C; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-adslot.volume-unmute":"&#x412;&#x43A;&#x43B;&#x44E;&#x447;&#x438;&#x442;&#x44C; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-adslot.ad-will-end-after":"&#x41E;&#x431;&#x44A;&#x44F;&#x432;&#x43B;&#x435;&#x43D;&#x438;&#x435; &#x431;&#x443;&#x434;&#x435;&#x442; &#x437;&#x430;&#x432;&#x435;&#x440;&#x448;&#x435;&#x43D;&#x43E; &#x43F;&#x43E;&#x441;&#x43B;&#x435; %s","ba-videoplayer-adslot.can-skip-after":"&#x41F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x442;&#x438;&#x442;&#x44C; &#x43F;&#x43E;&#x441;&#x43B;&#x435; %d","ba-videoplayer-adslot.skip-ad":"&#x41F;&#x440;&#x43E;&#x43F;&#x443;&#x441;&#x442;&#x438;&#x442;&#x44C; &#x440;&#x435;&#x43A;&#x43B;&#x430;&#x43C;&#x443;","ba-videorecorder.software-required":"&#x41F;&#x43E;&#x436;&#x430;&#x43B;&#x443;&#x439;&#x441;&#x442;&#x430;, &#x43D;&#x430;&#x436;&#x43C;&#x438;&#x442;&#x435; &#x43D;&#x438;&#x436;&#x435;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x443;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x438;&#x440;&#x43E;&#x432;&#x430;&#x442;&#x44C; &#x441;&#x43B;&#x435;&#x434;&#x443;&#x44E;&#x449;&#x438;&#x435; &#x442;&#x440;&#x435;&#x431;&#x43E;&#x432;&#x430;&#x43D;&#x438;&#x44F;, &#x447;&#x442;&#x43E;&#x431;&#x44B; &#x43F;&#x440;&#x43E;&#x434;&#x43E;&#x43B;&#x436;&#x438;&#x442;&#x44C;.","ba-videorecorder.software-waiting":"&#x41E;&#x436;&#x438;&#x434;&#x430;&#x43D;&#x438;&#x435; &#x442;&#x440;&#x435;&#x431;&#x43E;&#x432;&#x430;&#x43D;&#x438;&#x439; &#x43A; &#x443;&#x441;&#x442;&#x430;&#x43D;&#x43E;&#x432;&#x43A;&#x435; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x430;&#x446;&#x438;&#x438;. &#x412;&#x43E;&#x437;&#x43C;&#x43E;&#x436;&#x43D;&#x43E;, &#x432;&#x430;&#x43C; &#x43F;&#x440;&#x438;&#x434;&#x435;&#x442;&#x441;&#x44F; &#x43E;&#x431;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x44C; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x443; &#x43F;&#x43E;&#x441;&#x43B;&#x435; &#x437;&#x430;&#x432;&#x435;&#x440;&#x448;&#x435;&#x43D;&#x438;&#x44F;."},"language:sk":{"ba-videoplayer-playbutton.tooltip":"Pre prehratie videa kliknite.","ba-videoplayer-playbutton.rerecord":"Znovu nahra&#x165;","ba-videoplayer-playbutton.submit-video":"Potvr&#x10F;te video","ba-videoplayer-loader.tooltip":"Nahr&#xE1;vanie...","ba-videoplayer-controlbar.change-resolution":"Zme&#x148;te rozl&#xED;&#x161;enie","ba-videoplayer-controlbar.video-progress":"Progres","ba-videoplayer-controlbar.rerecord-video":"Nahra&#x165; znovu?","ba-videoplayer-controlbar.submit-video":"Potvrdi&#x165;","ba-videoplayer-controlbar.play-video":"Prehra&#x165;","ba-videoplayer-controlbar.pause-video":"Pozastavi&#x165;","ba-videoplayer-controlbar.elapsed-time":"Uplynut&#xFD; &#x10D;as","ba-videoplayer-controlbar.total-time":"Celkov&#xE1; d&#x13A;&#x17E;ka","ba-videoplayer-controlbar.fullscreen-video":"Zobrazi&#x165; na cel&#xFA; obrazovku","ba-videoplayer-controlbar.volume-button":"Nastavi&#x165; hlasitos&#x165;","ba-videoplayer-controlbar.volume-mute":"Vypn&#xFA;&#x165; zvuk","ba-videoplayer-controlbar.volume-unmute":"Zapn&#xFA;&#x165; zvuk","ba-videoplayer.video-error":"Vyskytla sa chyba. Sk&#xFA;ste to znova.","ba-videorecorder-chooser.record-video":"Nahra&#x165; nov&#xE9; video","ba-videorecorder-chooser.upload-video":"Prilo&#x17E;i&#x165; existuj&#xFA;ce video","ba-videorecorder-controlbar.settings":"Nastavenia","ba-videorecorder-controlbar.camerahealthy":"Osvetlenie vyzer&#xE1; dobre","ba-videorecorder-controlbar.cameraunhealthy":"Osvetlenie nie je optim&#xE1;lne","ba-videorecorder-controlbar.microphonehealthy":"Zvuk je v poriadku","ba-videorecorder-controlbar.microphoneunhealthy":"Nepodarilo sa zachyti&#x165; &#x17E;iaden zvuk","ba-videorecorder-controlbar.record":"Nahra&#x165;","ba-videorecorder-controlbar.record-tooltip":"Kliknite sem pre nahr&#xE1;vanie.","ba-videorecorder-controlbar.rerecord":"Znovu nahra&#x165;","ba-videorecorder-controlbar.rerecord-tooltip":"Kliknite sem pre zopakovanie nahr&#xE1;vania.","ba-videorecorder-controlbar.upload-covershot":"Prilo&#x17E;i&#x165;","ba-videorecorder-controlbar.upload-covershot-tooltip":"Kliknite sem pre nahratie vlastnej &#xFA;vodnej sn&#xED;mky","ba-videorecorder-controlbar.stop":"Zastavi&#x165;","ba-videorecorder-controlbar.stop-tooltip":"Kliknite sem pre zastavenie.","ba-videorecorder-controlbar.skip":"Presko&#x10D;i&#x165;","ba-videorecorder-controlbar.skip-tooltip":"Kliknite sem pre presko&#x10D;enie.","ba-videorecorder.recorder-error":"Vyskytla sa chyba. Kliknut&#xED;m sk&#xFA;ste znova.","ba-videorecorder.attach-error":"Nepodarilo sa n&#xE1;m z&#xED;ska&#x165; pr&#xED;stup k rozhraniu fotoapar&#xE1;tu. V z&#xE1;vislosti od zariadenia a prehliada&#x10D;a budete mo&#x17E;no musie&#x165; nain&#x161;talova&#x165; Flash alebo pristupova&#x165; na str&#xE1;nku cez protokol SSL.","ba-videorecorder.access-forbidden":"Pr&#xED;stup ku kamere bol zak&#xE1;zan&#xFD;. Kliknut&#xED;m sk&#xFA;ste znova.","ba-videorecorder.pick-covershot":"Vyberte si &#xFA;vodn&#xFA; sn&#xED;mku.","ba-videorecorder.uploading":"Nahr&#xE1;vanie","ba-videorecorder.uploading-failed":"Nahr&#xE1;vanie zlyhalo - kliknite sem pre zopakovanie.","ba-videorecorder.verifying":"Overovanie","ba-videorecorder.verifying-failed":"Overovanie zlyhalo - kliknite sem pre zopakovanie.","ba-videorecorder.rerecord-confirm":"Skuto&#x10D;ne chcete toto video prerobi&#x165;?","ba-videorecorder.video_file_too_large":"Va&#x161;e video je pr&#xED;li&#x161; dlh&#xE9; (%s) - kliknite sem pre zopakovanie s men&#x161;&#xED;m videos&#xFA;borom.","ba-videorecorder.unsupported_video_type":"Pros&#xED;m nahrajte: %s - kliknite sem pre zopakovanie.","ba-videoplayer-controlbar.exit-fullscreen-video":"Zru&#x161;i&#x165; zobrazenie na cel&#xFA; obrazovku","ba-videoplayer-share.share":"Zdie&#x13E;a&#x165;","ba-videoplayer-controlbar.pause-video-disabled":"Pozastavenie nie je mo&#x17E;n&#xE9;","ba-videorecorder-chooser.record-audio":"Nahra&#x165; zvuk","ba-videorecorder-controlbar.stop-available-after":"Minimum nahr&#xE1;vacieho &#x10D;asu je %d sek&#xFA;nd","ba-videorecorder-controlbar.cancel":"Zru&#x161;i&#x165;","ba-videorecorder-controlbar.cancel-tooltip":"Kliknite sem pre zru&#x161;enie.","ba-videorecorder.cancel-confirm":"Naozaj chcete zru&#x161;i&#x165; nahr&#xE1;vanie videa?","ba-videorecorder-chooser.record-screen":"Obrazovka nahr&#xE1;vania","ba-videoplayer-adslot.elapsed-time":"Elasped &#x10D;as","ba-videoplayer-adslot.volume-button":"Nastavte hlasitos&#x165;","ba-videoplayer-adslot.volume-mute":"Stlmenie zvuku","ba-videoplayer-adslot.volume-unmute":"Zru&#x161;i&#x165; zvuk","ba-videoplayer-adslot.ad-will-end-after":"Reklama sa skon&#x10D;&#xED; po %s","ba-videoplayer-adslot.can-skip-after":"Presko&#x10D;i&#x165; za %d","ba-videoplayer-adslot.skip-ad":"Presko&#x10D;i&#x165; reklamu","ba-videorecorder.software-required":"Ak chcete pokra&#x10D;ova&#x165;, kliknite na ni&#x17E;&#x161;ie a nain&#x161;talujte / aktivujte nasleduj&#xFA;ce po&#x17E;iadavky.","ba-videorecorder.software-waiting":"&#x10C;ak&#xE1; sa na po&#x17E;iadavky na in&#x161;tal&#xE1;ciu / aktiv&#xE1;ciu. Po skon&#x10D;en&#xED; str&#xE1;nky mo&#x17E;no budete musie&#x165; obnovi&#x165; str&#xE1;nku."},"language:sr":{"ba-videoplayer-playbutton.tooltip":"&#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43B;&#x430;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;.","ba-videoplayer-playbutton.rerecord":"&#x43F;&#x440;&#x435;&#x43F;&#x440;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videoplayer-playbutton.submit-video":"&#x43F;&#x43E;&#x442;&#x432;&#x440;&#x434;&#x438;&#x442;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-loader.tooltip":"&#x41B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433; &#x432;&#x438;&#x434;&#x435;&#x43E; ...","ba-videoplayer-controlbar.change-resolution":"&#x41F;&#x440;&#x43E;&#x43C;&#x435;&#x43D;&#x430; &#x440;&#x435;&#x437;&#x43E;&#x43B;&#x443;&#x446;&#x438;&#x458;&#x435;","ba-videoplayer-controlbar.video-progress":"&#x432;&#x438;&#x434;&#x435;&#x43E; &#x43D;&#x430;&#x43F;&#x440;&#x435;&#x434;&#x430;&#x43A;","ba-videoplayer-controlbar.rerecord-video":"&#x420;&#x435;&#x434;&#x43E; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videoplayer-controlbar.submit-video":"&#x43F;&#x43E;&#x442;&#x432;&#x440;&#x434;&#x438;&#x442;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.play-video":"&#x43F;&#x43B;&#x430;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.pause-video":"&#x43F;&#x430;&#x443;&#x437;&#x430; video","ba-videoplayer-controlbar.elapsed-time":"&#x415;&#x43B;&#x430;&#x441;&#x43F;&#x435;&#x434; &#x432;&#x440;&#x435;&#x43C;&#x435;","ba-videoplayer-controlbar.total-time":"&#x423;&#x43A;&#x443;&#x43F;&#x43D;&#x430; &#x434;&#x443;&#x436;&#x438;&#x43D;&#x430; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videoplayer-controlbar.fullscreen-video":"&#x415;&#x43D;&#x442;&#x435;&#x440; &#x444;&#x443;&#x43B;&#x43B;&#x441;&#x446;&#x440;&#x435;&#x435;&#x43D;","ba-videoplayer-controlbar.volume-button":"&#x41F;&#x43E;&#x434;&#x435;&#x448;&#x430;&#x432;&#x430;&#x45A;&#x435; &#x458;&#x430;&#x447;&#x438;&#x43D;&#x435; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-controlbar.volume-mute":"&#x43C;&#x443;&#x442;&#x435; &#x441;&#x43E;&#x443;&#x43D;&#x434;","ba-videoplayer-controlbar.volume-unmute":"&#x423;&#x43A;&#x459;&#x443;&#x447;&#x438; &#x437;&#x432;&#x443;&#x43A; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer.video-error":"&#x414;&#x43E;&#x448;&#x43B;&#x43E; &#x458;&#x435; &#x434;&#x43E; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x435;. &#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E;, &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430;&#x458;&#x442;&#x435; &#x43A;&#x430;&#x441;&#x43D;&#x438;&#x458;&#x435;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder-chooser.record-video":"&#x421;&#x43D;&#x438;&#x43C;&#x438;&#x442;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.upload-video":"&#x414;&#x43E;&#x434;&#x430;&#x458; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-controlbar.settings":"&#x41F;&#x43E;&#x434;&#x435;&#x448;&#x430;&#x432;&#x430;&#x45A;&#x430;","ba-videorecorder-controlbar.camerahealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x459;&#x435;&#x45A;&#x435; &#x458;&#x435; &#x434;&#x43E;&#x431;&#x440;&#x43E;","ba-videorecorder-controlbar.cameraunhealthy":"&#x41E;&#x441;&#x432;&#x435;&#x442;&#x459;&#x435;&#x45A;&#x435; &#x43D;&#x438;&#x458;&#x435; &#x43E;&#x43F;&#x442;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x430;","ba-videorecorder-controlbar.microphonehealthy":"&#x417;&#x432;&#x443;&#x43A; &#x458;&#x435; &#x434;&#x43E;&#x431;&#x430;&#x440;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x41D;&#x435; &#x43C;&#x43E;&#x433;&#x443; &#x443;&#x437;&#x435;&#x442;&#x438; &#x431;&#x438;&#x43B;&#x43E; &#x43A;&#x43E;&#x458;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.record":"&#x437;&#x430;&#x43F;&#x438;&#x441;","ba-videorecorder-controlbar.record-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x437;&#x430; &#x441;&#x43D;&#x438;&#x43C;&#x430;&#x45A;&#x435;.","ba-videorecorder-controlbar.rerecord":"&#x43F;&#x440;&#x435;&#x43F;&#x440;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x437;&#x430; &#x43F;&#x43E;&#x43D;&#x430;&#x432;&#x459;&#x430;&#x45A;&#x435;.","ba-videorecorder-controlbar.upload-covershot":"&#x43E;&#x442;&#x43F;&#x440;&#x435;&#x43C;&#x430;&#x45A;&#x435;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x431;&#x438;&#x441;&#x442;&#x435; &#x43F;&#x440;&#x438;&#x43B;&#x430;&#x433;&#x43E;&#x452;&#x435;&#x43D;&#x443; &#x43D;&#x430;&#x441;&#x43B;&#x43E;&#x432;&#x43D;&#x443; &#x43C;&#x435;&#x442;&#x430;&#x43A;","ba-videorecorder-controlbar.stop":"&#x417;&#x430;&#x443;&#x441;&#x442;&#x430;&#x432;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.stop-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x441;&#x435; &#x437;&#x430;&#x443;&#x441;&#x442;&#x430;&#x432;&#x438;.","ba-videorecorder-controlbar.skip":"&#x43F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438;&#x442;&#x438;","ba-videorecorder-controlbar.skip-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438;&#x442;&#x435;.","ba-videorecorder.recorder-error":"&#x414;&#x43E;&#x448;&#x43B;&#x43E; &#x458;&#x435; &#x434;&#x43E; &#x433;&#x440;&#x435;&#x448;&#x43A;&#x435;. &#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E;, &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430;&#x458;&#x442;&#x435; &#x43A;&#x430;&#x441;&#x43D;&#x438;&#x458;&#x435;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder.attach-error":"&#x41C;&#x438; &#x43D;&#x435; &#x43C;&#x43E;&#x436;&#x435; &#x434;&#x430; &#x43F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F;&#x438; &#x438;&#x43D;&#x442;&#x435;&#x440;&#x444;&#x435;&#x458;&#x441; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x435;. &#x423; &#x437;&#x430;&#x432;&#x438;&#x441;&#x43D;&#x43E;&#x441;&#x442;&#x438; &#x43E;&#x434; &#x443;&#x440;&#x435;&#x452;&#x430;&#x458;&#x430; &#x438; &#x43F;&#x440;&#x435;&#x442;&#x440;&#x430;&#x436;&#x438;&#x432;&#x430;&#x447;&#x430;, &#x43C;&#x43E;&#x436;&#x434;&#x430; &#x45B;&#x435;&#x442;&#x435; &#x43C;&#x43E;&#x440;&#x430;&#x442;&#x438; &#x434;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x435; &#x424;&#x43B;&#x430;&#x441;&#x445; &#x438;&#x43B;&#x438; &#x43F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F;&#x438;&#x43B;&#x438; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x438; &#x43F;&#x440;&#x435;&#x43A;&#x43E; &#x421;&#x421;&#x41B;.","ba-videorecorder.access-forbidden":"&#x41F;&#x440;&#x438;&#x441;&#x442;&#x443;&#x43F; &#x43A;&#x430;&#x43C;&#x435;&#x440;&#x43E;&#x43C; &#x458;&#x435; &#x437;&#x430;&#x431;&#x440;&#x430;&#x45A;&#x435;&#x43D;&#x43E;. &#x426;&#x43B;&#x438;&#x446;&#x43A; &#x442;&#x43E; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;.","ba-videorecorder.pick-covershot":"&#x418;&#x437;&#x430;&#x431;&#x435;&#x440;&#x438;&#x442;&#x435; &#x446;&#x43E;&#x432;&#x435;&#x440;&#x441;&#x445;&#x43E;&#x442;.","ba-videorecorder.uploading":"&#x443;&#x43F;&#x43B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433;","ba-videorecorder.uploading-failed":"&#x423;&#x43F;&#x43B;&#x43E;&#x430;&#x434;&#x438;&#x43D;&#x433; &#x444;&#x430;&#x438;&#x43B;&#x435;&#x434; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.verifying":"&#x432;&#x435;&#x440;&#x438;&#x444;&#x438;&#x43A;&#x430;&#x446;&#x438;&#x458;&#x443;","ba-videorecorder.verifying-failed":"&#x41F;&#x440;&#x43E;&#x432;&#x435;&#x440;&#x430; &#x43D;&#x438;&#x458;&#x435; &#x443;&#x441;&#x43F;&#x435;&#x43B;&#x430; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videorecorder.rerecord-confirm":"&#x414;&#x430; &#x43B;&#x438; &#x437;&#x430;&#x438;&#x441;&#x442;&#x430; &#x436;&#x435;&#x43B;&#x438;&#x442;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x438;&#x442;&#x435; &#x441;&#x432;&#x43E;&#x458; &#x432;&#x438;&#x434;&#x435;&#x43E;?","ba-videorecorder.video_file_too_large":"&#x412;&#x430;&#x448; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x434;&#x430;&#x442;&#x43E;&#x442;&#x435;&#x43A;&#x430; &#x458;&#x435; &#x43F;&#x440;&#x435;&#x432;&#x435;&#x43B;&#x438;&#x43A;&#x430; (%s) - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E; &#x441;&#x430; &#x43C;&#x430;&#x45A;&#x43E;&#x43C; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x444;&#x430;&#x458;&#x43B;.","ba-videorecorder.unsupported_video_type":"&#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E; &#x412;&#x430;&#x441; &#x434;&#x430; &#x443;&#x43F;&#x43B;&#x43E;&#x430;&#x434;: %&#x441; - &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x43F;&#x43E;&#x43A;&#x443;&#x448;&#x430; &#x43F;&#x43E;&#x43D;&#x43E;&#x432;&#x43E;.","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x418;&#x437;&#x43B;&#x430;&#x437; &#x438;&#x437; &#x446;&#x435;&#x43B;&#x43E;&#x433; &#x435;&#x43A;&#x440;&#x430;&#x43D;&#x430;","ba-videoplayer-share.share":"&#x41F;&#x43E;&#x434;&#x435;&#x43B;&#x438; &#x432;&#x438;&#x434;&#x435;&#x43E;","ba-videorecorder-chooser.record-screen":"&#x421;&#x43D;&#x438;&#x43C;&#x430;&#x43A; &#x435;&#x43A;&#x440;&#x430;&#x43D;&#x430;","ba-videoplayer-controlbar.pause-video-disabled":"&#x41F;&#x430;&#x443;&#x437;&#x430; &#x43D;&#x438;&#x458;&#x435; &#x43F;&#x43E;&#x434;&#x440;&#x436;&#x430;&#x43D;&#x430;","ba-videorecorder-chooser.record-audio":"&#x421;&#x43D;&#x438;&#x43C;&#x438;&#x442;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videorecorder-controlbar.stop-available-after":"&#x41C;&#x438;&#x43D;&#x438;&#x43C;&#x430;&#x43B;&#x43D;&#x43E; &#x432;&#x440;&#x435;&#x43C;&#x435; &#x441;&#x43D;&#x438;&#x43C;&#x430;&#x45A;&#x430; &#x458;&#x435; %&#x434; &#x441;&#x435;&#x43A;&#x443;&#x43D;&#x434;&#x438;","ba-videorecorder-controlbar.cancel":"&#x41F;&#x43E;&#x43D;&#x438;&#x448;&#x442;&#x438;&#x442;&#x438;, &#x43E;&#x442;&#x43A;&#x430;&#x437;&#x430;&#x442;&#x438;","ba-videorecorder-controlbar.cancel-tooltip":"&#x41A;&#x43B;&#x438;&#x43A;&#x43D;&#x438;&#x442;&#x435; &#x43E;&#x432;&#x434;&#x435; &#x434;&#x430; &#x431;&#x438;&#x441;&#x442;&#x435; &#x43E;&#x442;&#x43A;&#x430;&#x437;&#x430;&#x43B;&#x438;.","ba-videorecorder.cancel-confirm":"&#x414;&#x430; &#x43B;&#x438; &#x437;&#x430;&#x438;&#x441;&#x442;&#x430; &#x436;&#x435;&#x43B;&#x438;&#x442;&#x435; &#x434;&#x430; &#x43E;&#x442;&#x43A;&#x430;&#x436;&#x435;&#x442;&#x435; &#x432;&#x438;&#x434;&#x435;&#x43E; &#x43E;&#x442;&#x43F;&#x440;&#x435;&#x43C;&#x430;&#x45A;&#x435;?","ba-videoplayer-adslot.elapsed-time":"&#x415;&#x43B;&#x430;&#x441;&#x43F;&#x435;&#x434; &#x442;&#x438;&#x43C;&#x435;","ba-videoplayer-adslot.volume-button":"&#x41F;&#x43E;&#x434;&#x435;&#x441;&#x438;&#x442;&#x435; &#x458;&#x430;&#x447;&#x438;&#x43D;&#x443; &#x437;&#x432;&#x443;&#x43A;&#x430;","ba-videoplayer-adslot.volume-mute":"&#x418;&#x441;&#x43A;&#x459;&#x443;&#x447;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-adslot.volume-unmute":"&#x423;&#x43A;&#x459;&#x443;&#x447;&#x438; &#x437;&#x432;&#x443;&#x43A;","ba-videoplayer-adslot.ad-will-end-after":"&#x41E;&#x433;&#x43B;&#x430;&#x441; &#x45B;&#x435; &#x441;&#x435; &#x437;&#x430;&#x432;&#x440;&#x448;&#x438;&#x442;&#x438; &#x43D;&#x430;&#x43A;&#x43E;&#x43D; %&#x441;","ba-videoplayer-adslot.can-skip-after":"&#x41F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438; &#x43F;&#x43E;&#x441;&#x43B;&#x435; %&#x434;","ba-videoplayer-adslot.skip-ad":"&#x41F;&#x440;&#x435;&#x441;&#x43A;&#x43E;&#x447;&#x438;&#x442;&#x435; &#x43E;&#x433;&#x43B;&#x430;&#x441;","ba-videorecorder.software-required":"&#x41C;&#x43E;&#x43B;&#x438;&#x43C;&#x43E; &#x434;&#x430; &#x43A;&#x43B;&#x438;&#x43A;&#x43D;&#x435;&#x442;&#x435; &#x438;&#x441;&#x43F;&#x43E;&#x434; &#x434;&#x430; &#x431;&#x438;&#x441;&#x442;&#x435; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x43B;&#x438; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x438;&#x440;&#x430;&#x43B;&#x438; &#x441;&#x43B;&#x435;&#x434;&#x435;&#x45B;&#x435; &#x437;&#x430;&#x445;&#x442;&#x435;&#x432;&#x435; &#x43A;&#x430;&#x43A;&#x43E; &#x431;&#x438;&#x441;&#x442;&#x435; &#x43D;&#x430;&#x441;&#x442;&#x430;&#x432;&#x438;&#x43B;&#x438;.","ba-videorecorder.software-waiting":"&#x427;&#x435;&#x43A;&#x430; &#x441;&#x435; &#x437;&#x430;&#x445;&#x442;&#x435;&#x432; &#x43A;&#x43E;&#x458;&#x438; &#x442;&#x440;&#x435;&#x431;&#x430; &#x438;&#x43D;&#x441;&#x442;&#x430;&#x43B;&#x438;&#x440;&#x430;&#x442;&#x438; / &#x430;&#x43A;&#x442;&#x438;&#x432;&#x438;&#x440;&#x430;&#x442;&#x438;. &#x41C;&#x43E;&#x436;&#x434;&#x430; &#x45B;&#x435;&#x442;&#x435; &#x43C;&#x43E;&#x440;&#x430;&#x442;&#x438; &#x43E;&#x441;&#x432;&#x435;&#x436;&#x438;&#x442;&#x438; &#x441;&#x442;&#x440;&#x430;&#x43D;&#x438;&#x446;&#x443; &#x43D;&#x430;&#x43A;&#x43E;&#x43D; &#x437;&#x430;&#x432;&#x440;&#x448;&#x435;&#x442;&#x43A;&#x430;."},"language:sv":{"ba-videoplayer-playbutton.tooltip":"Klicka f&#xF6;r att spela upp video.","ba-videoplayer-playbutton.rerecord":"G&#xF6;ra om","ba-videoplayer-playbutton.submit-video":"bekr&#xE4;fta video","ba-videoplayer-loader.tooltip":"Laddar video ...","ba-videoplayer-controlbar.change-resolution":"&#xE4;ndra uppl&#xF6;sning","ba-videoplayer-controlbar.video-progress":"video framsteg","ba-videoplayer-controlbar.rerecord-video":"G&#xF6;r video?","ba-videoplayer-controlbar.submit-video":"bekr&#xE4;fta video","ba-videoplayer-controlbar.play-video":"Spela video","ba-videoplayer-controlbar.pause-video":"pause video","ba-videoplayer-controlbar.elapsed-time":"f&#xF6;rfluten tid","ba-videoplayer-controlbar.total-time":"Totala l&#xE4;ngden av video","ba-videoplayer-controlbar.fullscreen-video":"Ange fullscreen","ba-videoplayer-controlbar.volume-button":"inst&#xE4;llda volymen","ba-videoplayer-controlbar.volume-mute":"st&#xE4;nga av ljudet","ba-videoplayer-controlbar.volume-unmute":"s&#xE4;tta p&#xE5; ljudet","ba-videoplayer.video-error":"Ett fel har intr&#xE4;ffat. V&#xE4;nligen f&#xF6;rs&#xF6;k igen senare. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder-chooser.record-video":"Spela din video","ba-videorecorder-chooser.upload-video":"Ladda upp video","ba-videorecorder-controlbar.settings":"inst&#xE4;llningar","ba-videorecorder-controlbar.camerahealthy":"Belysning &#xE4;r bra","ba-videorecorder-controlbar.cameraunhealthy":"Belysning &#xE4;r inte optimal","ba-videorecorder-controlbar.microphonehealthy":"Ljudet &#xE4;r bra","ba-videorecorder-controlbar.microphoneunhealthy":"Det g&#xE5;r inte att plocka upp n&#xE5;got ljud","ba-videorecorder-controlbar.record":"Spela in","ba-videorecorder-controlbar.record-tooltip":"Klicka h&#xE4;r f&#xF6;r att spela in.","ba-videorecorder-controlbar.rerecord":"G&#xF6;ra om","ba-videorecorder-controlbar.rerecord-tooltip":"Klicka h&#xE4;r f&#xF6;r att g&#xF6;ra om.","ba-videorecorder-controlbar.upload-covershot":"Ladda upp","ba-videorecorder-controlbar.upload-covershot-tooltip":"Klicka h&#xE4;r f&#xF6;r att ladda upp anpassade t&#xE4;cka skott","ba-videorecorder-controlbar.stop":"Sluta","ba-videorecorder-controlbar.stop-tooltip":"Klicka h&#xE4;r f&#xF6;r att stanna.","ba-videorecorder-controlbar.skip":"Hoppa","ba-videorecorder-controlbar.skip-tooltip":"Klicka h&#xE4;r f&#xF6;r att hoppa.","ba-videorecorder.recorder-error":"Ett fel har intr&#xE4;ffat. V&#xE4;nligen f&#xF6;rs&#xF6;k igen senare. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.attach-error":"Vi kunde inte komma &#xE5;t kameragr&#xE4;nssnittet. Beroende p&#xE5; vilken enhet och webbl&#xE4;sare, kan du beh&#xF6;va installera Flash eller &#xF6;ppna sidan via SSL.","ba-videorecorder.access-forbidden":"&#xC5;tkomst till kameran var f&#xF6;rbjudet. Klicka f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.pick-covershot":"V&#xE4;lj en covershot.","ba-videorecorder.uploading":"uppladdning","ba-videorecorder.uploading-failed":"Uppladdning misslyckades - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.verifying":"verifiera","ba-videorecorder.verifying-failed":"Verifiera misslyckades - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videorecorder.rerecord-confirm":"Vill du verkligen vill g&#xF6;ra om din video?","ba-videorecorder.video_file_too_large":"Videofilen &#xE4;r f&#xF6;r stor (%s) - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen med en mindre videofil.","ba-videorecorder.unsupported_video_type":"Ladda upp: %s - klicka h&#xE4;r f&#xF6;r att f&#xF6;rs&#xF6;ka igen.","ba-videoplayer-controlbar.exit-fullscreen-video":"Avsluta fullsk&#xE4;rmen","ba-videoplayer-share.share":"Dela video","ba-videorecorder-chooser.record-screen":"Inspelningssk&#xE4;rm","ba-videoplayer-controlbar.pause-video-disabled":"Paus st&#xF6;ds inte","ba-videorecorder-chooser.record-audio":"Spela in ljud","ba-videorecorder-controlbar.stop-available-after":"Minsta inspelningstid &#xE4;r %d sekunder","ba-videorecorder-controlbar.cancel":"Annullera","ba-videorecorder-controlbar.cancel-tooltip":"Klicka h&#xE4;r f&#xF6;r att avbryta.","ba-videorecorder.cancel-confirm":"Vill du verkligen avbryta din videouppladdning?","ba-videoplayer-adslot.elapsed-time":"Elasped tid","ba-videoplayer-adslot.volume-button":"Ange volym","ba-videoplayer-adslot.volume-mute":"St&#xE4;ng ljudet","ba-videoplayer-adslot.volume-unmute":"Sl&#xE5; av ljudet","ba-videoplayer-adslot.ad-will-end-after":"Annonsen slutar efter %s","ba-videoplayer-adslot.can-skip-after":"Hoppa &#xF6;ver efter %d","ba-videoplayer-adslot.skip-ad":"Hoppa &#xF6;ver annonsen","ba-videorecorder.software-required":"V&#xE4;nligen klicka nedan f&#xF6;r att installera / aktivera f&#xF6;ljande krav f&#xF6;r att forts&#xE4;tta.","ba-videorecorder.software-waiting":"V&#xE4;ntar p&#xE5; att kraven ska installeras / aktiveras. Det kan h&#xE4;nda att du beh&#xF6;ver uppdatera sidan efter slutf&#xF6;randet."},"language:tl":{"ba-videoplayer-playbutton.tooltip":"I-click upang i-play ang video.","ba-videoplayer-playbutton.rerecord":"I-redo","ba-videoplayer-playbutton.submit-video":"Kumpirmahin ang video","ba-videoplayer-loader.tooltip":"Nilo-load ang video ...","ba-videoplayer-controlbar.change-resolution":"Baguhin ang resolution","ba-videoplayer-controlbar.video-progress":"pag-usad Video","ba-videoplayer-controlbar.rerecord-video":"Gawing muli ang video?","ba-videoplayer-controlbar.submit-video":"Kumpirmahin ang video","ba-videoplayer-controlbar.play-video":"I-Play ang video","ba-videoplayer-controlbar.pause-video":"I-pause ang video","ba-videoplayer-controlbar.elapsed-time":"Elasped oras","ba-videoplayer-controlbar.total-time":"Kabuuang haba ng video","ba-videoplayer-controlbar.fullscreen-video":"Ipasok fullscreen","ba-videoplayer-controlbar.volume-button":"Itakda ang lakas ng tunog","ba-videoplayer-controlbar.volume-mute":"I-mute ang tunog","ba-videoplayer-controlbar.volume-unmute":"I-unmute ang tunog","ba-videoplayer.video-error":"May naganap na error. Mangyaring subukan muli sa ibang pagkakataon. I-click upang subukang muli.","ba-videorecorder-chooser.record-video":"Kumuha ng video","ba-videorecorder-chooser.upload-video":"Mag-upload ng Video","ba-videorecorder-controlbar.settings":"Mga Setting","ba-videorecorder-controlbar.camerahealthy":"Pag-iilaw ay mabuti","ba-videorecorder-controlbar.cameraunhealthy":"Pag-iilaw ay hindi optimal","ba-videorecorder-controlbar.microphonehealthy":"Sound ay mabuti","ba-videorecorder-controlbar.microphoneunhealthy":"Hindi kunin ang anumang tunog","ba-videorecorder-controlbar.record":"Rekord","ba-videorecorder-controlbar.record-tooltip":"Mag-click dito upang i-record.","ba-videorecorder-controlbar.rerecord":"I-redo","ba-videorecorder-controlbar.rerecord-tooltip":"Mag-click dito upang gawing muli.","ba-videorecorder-controlbar.upload-covershot":"Upload","ba-videorecorder-controlbar.upload-covershot-tooltip":"Mag-click dito upang mag-upload ng mga pasadyang pabalat shot","ba-videorecorder-controlbar.stop":"Itigil","ba-videorecorder-controlbar.stop-tooltip":"Mag-click dito upang itigil.","ba-videorecorder-controlbar.skip":"Laktawan","ba-videorecorder-controlbar.skip-tooltip":"Mag-click dito upang laktawan.","ba-videorecorder.recorder-error":"May naganap na error. Mangyaring subukan muli sa ibang pagkakataon. I-click upang subukang muli.","ba-videorecorder.attach-error":"Hindi namin mai-access ang interface ng camera. Depende sa device at browser, maaaring kailangan mong i-install ng Flash o ma-access ang pahina sa pamamagitan ng SSL.","ba-videorecorder.access-forbidden":"Access sa camera ay ipinagbabawal. I-click upang subukang muli.","ba-videorecorder.pick-covershot":"Pumili ng isang covershot.","ba-videorecorder.uploading":"Pag-upload","ba-videorecorder.uploading-failed":"Ina-upload ang mali - i-click dito upang subukang muli.","ba-videorecorder.verifying":"Bine-verify","ba-videorecorder.verifying-failed":"Ang pag-verify nabigo - i-click dito upang subukang muli.","ba-videorecorder.rerecord-confirm":"Nais mo ba talagang nais na gawing muli ang iyong video?","ba-videorecorder.video_file_too_large":"Ang iyong video file ay masyadong malaki (%s) - i-click dito upang subukang muli gamit ang mas maliit na file na video.","ba-videorecorder.unsupported_video_type":"Mangyaring i-upload: %s - i-click dito upang subukang muli.","ba-videoplayer-controlbar.exit-fullscreen-video":"Lumabas sa fullscreen","ba-videoplayer-share.share":"Ibahagi ang video","ba-videorecorder-chooser.record-screen":"Mag-record ng Screen","ba-videoplayer-controlbar.pause-video-disabled":"I-pause ang hindi suportado","ba-videorecorder-chooser.record-audio":"Mag-record Audio","ba-videorecorder-controlbar.stop-available-after":"Ang minimum na oras ng pag-record ay %d segundo","ba-videorecorder-controlbar.cancel":"Kanselahin","ba-videorecorder-controlbar.cancel-tooltip":"Mag-click dito upang kanselahin.","ba-videorecorder.cancel-confirm":"Nais mo bang kanselahin ang iyong pag-upload ng video?","ba-videoplayer-adslot.elapsed-time":"Tiyak na oras","ba-videoplayer-adslot.volume-button":"Itakda ang lakas ng tunog","ba-videoplayer-adslot.volume-mute":"I-mute ang tunog","ba-videoplayer-adslot.volume-unmute":"I-unmute ang tunog","ba-videoplayer-adslot.ad-will-end-after":"Magwawakas ang ad matapos ang %s","ba-videoplayer-adslot.can-skip-after":"Laktawan pagkatapos %d","ba-videoplayer-adslot.skip-ad":"Laktawan ang ad","ba-videorecorder.software-required":"Mangyaring mag-click sa ibaba upang i-install / i-activate ang mga sumusunod na kinakailangan upang magpatuloy.","ba-videorecorder.software-waiting":"Naghihintay ng mga kinakailangan na mai-install / isinaaktibo. Maaaring kailanganin mong i-refresh ang pahina pagkatapos makumpleto."},"language:tr":{"ba-videoplayer-playbutton.tooltip":"video oynatmak i&#xE7;in t&#x131;klay&#x131;n&#x131;z.","ba-videoplayer-playbutton.rerecord":"yeniden yapmak","ba-videoplayer-playbutton.submit-video":"videoyu onayla","ba-videoplayer-loader.tooltip":"Video y&#xFC;kleniyor ...","ba-videoplayer-controlbar.change-resolution":"De&#x11F;i&#x15F;im &#xE7;&#xF6;z&#xFC;n&#xFC;rl&#xFC;&#x11F;&#xFC;","ba-videoplayer-controlbar.video-progress":"Video ilerleme","ba-videoplayer-controlbar.rerecord-video":"Videoyu Redo?","ba-videoplayer-controlbar.submit-video":"videoyu onayla","ba-videoplayer-controlbar.play-video":"Video oynatmak","ba-videoplayer-controlbar.pause-video":"Pause Video","ba-videoplayer-controlbar.elapsed-time":"Ge&#xE7;en s&#xFC;re","ba-videoplayer-controlbar.total-time":"videonun toplam uzunlu&#x11F;u","ba-videoplayer-controlbar.fullscreen-video":"Tam ekran yap","ba-videoplayer-controlbar.volume-button":"Set hacmi","ba-videoplayer-controlbar.volume-mute":"sesi","ba-videoplayer-controlbar.volume-unmute":"sesi a&#xE7;","ba-videoplayer.video-error":"Bir hata, l&#xFC;tfen tekrar deneyiniz olu&#x15F;tu. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder-chooser.record-video":"Ki&#x15F;isel Video kay&#x131;t","ba-videorecorder-chooser.upload-video":"video","ba-videorecorder-controlbar.settings":"Ayarlar","ba-videorecorder-controlbar.camerahealthy":"Ayd&#x131;nlatma iyidir","ba-videorecorder-controlbar.cameraunhealthy":"Ayd&#x131;nlatma optimum de&#x11F;il","ba-videorecorder-controlbar.microphonehealthy":"Ses iyidir","ba-videorecorder-controlbar.microphoneunhealthy":"herhangi bir ses pick up olamaz","ba-videorecorder-controlbar.record":"Kay&#x131;t","ba-videorecorder-controlbar.record-tooltip":"kaydetmek i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.rerecord":"yeniden yapmak","ba-videorecorder-controlbar.rerecord-tooltip":"yinelemek i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.upload-covershot":"y&#xFC;kleme","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#xF6;zel kapak &#xE7;ekimi y&#xFC;klemek i&#xE7;in buraya t&#x131;klay&#x131;n","ba-videorecorder-controlbar.stop":"Dur","ba-videorecorder-controlbar.stop-tooltip":"durdurmak i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder-controlbar.skip":"atlamak","ba-videorecorder-controlbar.skip-tooltip":"atlamak i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder.recorder-error":"Bir hata, l&#xFC;tfen tekrar deneyiniz olu&#x15F;tu. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder.attach-error":"Biz kamera aray&#xFC;z&#xFC; eri&#x15F;emedi. cihaz ve taray&#x131;c&#x131;ya ba&#x11F;l&#x131; olarak, Flash y&#xFC;klemek veya SSL ile sayfaya eri&#x15F;mek i&#xE7;in gerekebilir.","ba-videorecorder.access-forbidden":"Kameraya eri&#x15F;im yasakland&#x131;. Tekrar denemek i&#xE7;in t&#x131;klay&#x131;n.","ba-videorecorder.pick-covershot":"Bir covershot se&#xE7;in.","ba-videorecorder.uploading":"Y&#xFC;kleme","ba-videorecorder.uploading-failed":"Y&#xFC;kleme ba&#x15F;ar&#x131;s&#x131;z - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.verifying":"Do&#x11F;rulama","ba-videorecorder.verifying-failed":"Ba&#x15F;ar&#x131;s&#x131;z kullan&#x131;ld&#x131;&#x11F;&#x131;n&#x131; do&#x11F;rulamak - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.rerecord-confirm":"E&#x11F;er ger&#xE7;ekten video yinelemek istiyor musunuz?","ba-videorecorder.video_file_too_large":"Videonuz dosyas&#x131; &#xE7;ok b&#xFC;y&#xFC;k (%s) - k&#xFC;&#xE7;&#xFC;k bir video dosyas&#x131; ile tekrar denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videorecorder.unsupported_video_type":"y&#xFC;kleyin: %s - yeniden denemek i&#xE7;in buray&#x131; t&#x131;klay&#x131;n.","ba-videoplayer-controlbar.exit-fullscreen-video":"Tam ekrandan &#xE7;&#x131;k","ba-videoplayer-share.share":"Video payla&#x15F;","ba-videorecorder-chooser.record-screen":"Kay&#x131;t Ekran&#x131;","ba-videoplayer-controlbar.pause-video-disabled":"Duraklat desteklenmiyor","ba-videorecorder-chooser.record-audio":"Ses kayd&#x131;","ba-videorecorder-controlbar.stop-available-after":"Minimum kay&#x131;t s&#xFC;resi %d saniye","ba-videorecorder-controlbar.cancel":"&#x130;ptal etmek","ba-videorecorder-controlbar.cancel-tooltip":"&#x130;ptal etmek i&#xE7;in buraya t&#x131;klay&#x131;n.","ba-videorecorder.cancel-confirm":"Video y&#xFC;klemenizi ger&#xE7;ekten iptal etmek istiyor musunuz?","ba-videoplayer-adslot.elapsed-time":"Kazan&#x131;lan zaman","ba-videoplayer-adslot.volume-button":"Sesi ayarla","ba-videoplayer-adslot.volume-mute":"Sesi kapat","ba-videoplayer-adslot.volume-unmute":"Sesi a&#xE7;ma","ba-videoplayer-adslot.ad-will-end-after":"Reklam, %s sonra sona erecek","ba-videoplayer-adslot.can-skip-after":" %D sonra atla","ba-videoplayer-adslot.skip-ad":"Reklam&#x131; ge&#xE7;","ba-videorecorder.software-required":"Devam etmek i&#xE7;in a&#x15F;a&#x11F;&#x131;daki gereksinimleri y&#xFC;klemek / etkinle&#x15F;tirmek i&#xE7;in l&#xFC;tfen a&#x15F;a&#x11F;&#x131;ya t&#x131;klay&#x131;n.","ba-videorecorder.software-waiting":"Gereksinimlerin kurulmas&#x131; / etkinle&#x15F;tirilmesi i&#xE7;in bekleniyor. Tamamland&#x131;ktan sonra sayfay&#x131; yenilemeniz gerekebilir."},"language:zh-cn":{"ba-videoplayer-playbutton.tooltip":"&#x70B9;&#x51FB;&#x64AD;&#x653E;","ba-videoplayer-playbutton.rerecord":"&#x91CD;&#x8BD5;","ba-videoplayer-playbutton.submit-video":"&#x786E;&#x5B9A;","ba-videoplayer-loader.tooltip":"&#x8BFB;&#x53D6;&#x4E2D;...","ba-videoplayer-controlbar.change-resolution":"&#x53D8;&#x66F4;&#x5206;&#x8FA8;&#x7387;","ba-videoplayer-controlbar.video-progress":"&#x8FDB;&#x5EA6;","ba-videoplayer-controlbar.rerecord-video":"&#x91CD;&#x8BD5;?","ba-videoplayer-controlbar.submit-video":"&#x786E;&#x8BA4;","ba-videoplayer-controlbar.play-video":"&#x64AD;&#x653E;","ba-videoplayer-controlbar.pause-video":"&#x6682;&#x505C;","ba-videoplayer-controlbar.elapsed-time":"&#x7ECF;&#x8FC7;&#x65F6;&#x95F4;","ba-videoplayer-controlbar.total-time":"&#x603B;&#x957F;&#x5EA6;","ba-videoplayer-controlbar.fullscreen-video":"&#x8FDB;&#x5165;&#x5168;&#x5C4F;","ba-videoplayer-controlbar.volume-button":"&#x8C03;&#x6574;&#x97F3;&#x91CF;","ba-videoplayer-controlbar.volume-mute":"&#x9759;&#x97F3;","ba-videoplayer-controlbar.volume-unmute":"&#x89E3;&#x9664;&#x9759;&#x97F3;","ba-videoplayer.video-error":"&#x9519;&#x8BEF;&#x53D1;&#x751F;&#xFF0C;&#x8BF7;&#x7A0D;&#x540E;&#x518D;&#x8BD5;(&#x70B9;&#x6211;)","ba-videorecorder-chooser.record-video":"&#x5F55;&#x5236;&#x5F71;&#x7247;","ba-videorecorder-chooser.upload-video":"&#x4E0A;&#x4F20;&#x5F71;&#x7247;","ba-videorecorder-controlbar.settings":"&#x8BBE;&#x7F6E;","ba-videorecorder-controlbar.camerahealthy":"&#x5149;&#x7EBF;&#x826F;&#x597D;","ba-videorecorder-controlbar.cameraunhealthy":"&#x5149;&#x6E90;&#x4E0D;&#x4F73;","ba-videorecorder-controlbar.microphonehealthy":"&#x6536;&#x97F3;&#x826F;&#x597D;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x6536;&#x97F3;&#x4E0D;&#x826F;","ba-videorecorder-controlbar.record":"&#x5F55;&#x5F71;","ba-videorecorder-controlbar.record-tooltip":"&#x70B9;&#x6211;&#x5F55;&#x5F71;","ba-videorecorder-controlbar.rerecord":"&#x91CD;&#x8BD5;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x70B9;&#x6211;&#x91CD;&#x8BD5;","ba-videorecorder-controlbar.upload-covershot":"&#x4E0A;&#x4F20;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x70B9;&#x6211;&#x4E0A;&#x4F20;&#x81EA;&#x8BA2;&#x7684;&#x5C01;&#x9762;","ba-videorecorder-controlbar.stop":"&#x505C;&#x6B62;","ba-videorecorder-controlbar.stop-tooltip":"&#x70B9;&#x6211;&#x505C;&#x6B62;","ba-videorecorder-controlbar.skip":"&#x7565;&#x8FC7;","ba-videorecorder-controlbar.skip-tooltip":"&#x70B9;&#x6211;&#x7565;&#x8FC7;","ba-videorecorder.recorder-error":"&#x9519;&#x8BEF;&#x53D1;&#x751F;&#xFF0C;&#x8BF7;&#x7A0D;&#x540E;&#x518D;&#x8BD5;(&#x70B9;&#x6211;)","ba-videorecorder.attach-error":"&#x65E0;&#x6CD5;&#x5B58;&#x53D6;&#x6444;&#x50CF;&#x5934;&#xFF0C;&#x53EF;&#x80FD;&#x662F;&#x6D4F;&#x89C8;&#x5668;&#x6216;&#x662F;&#x8BBE;&#x5907;&#x7684;&#x9650;&#x5236;&#xFF0C;&#x8BF7;&#x5C1D;&#x8BD5;&#x5B89;&#x88C5; Flash &#x5916;&#x6302;&#x7A0B;&#x5E8F;&#x6216;&#x900F;&#x8FC7;&#x5B89;&#x5168;&#x8FDE;&#x7EBF;&#x6765;&#x4F7F;&#x7528;&#x3002;","ba-videorecorder.access-forbidden":"&#x65E0;&#x6CD5;&#x5B58;&#x53D6;&#x6444;&#x50CF;&#x5934;&#xFF0C;&#x8BF7;&#x70B9;&#x6211;&#x91CD;&#x8BD5;&#x3002;","ba-videorecorder.pick-covershot":"&#x8BF7;&#x6311;&#x9009;&#x4E00;&#x5F20;&#x5C01;&#x9762;","ba-videorecorder.uploading":"&#x4E0A;&#x4F20;&#x4E2D;","ba-videorecorder.uploading-failed":"&#x4E0A;&#x4F20;&#x5931;&#x8D25;&#xFF0C;&#x8BF7;&#x70B9;&#x6211;&#x91CD;&#x8BD5;","ba-videorecorder.verifying":"&#x9A8C;&#x8BC1;&#x4E2D;","ba-videorecorder.verifying-failed":"&#x9A8C;&#x8BC1;&#x5931;&#x8D25;&#xFF0C;&#x8BF7;&#x70B9;&#x6211;&#x91CD;&#x8BD5;","ba-videorecorder.rerecord-confirm":"&#x786E;&#x5B9A;&#x8981;&#x91CD;&#x65B0;&#x5F55;&#x5236;&#x60A8;&#x7684;&#x5F71;&#x7247;?","ba-videorecorder.video_file_too_large":"&#x60A8;&#x7684;&#x5F71;&#x7247;&#x8FC7;&#x5927; (%s) &#x8BF7;&#x70B9;&#x6211;&#x91CD;&#x65B0;&#x9009;&#x62E9;&#x5C0F;&#x4E00;&#x70B9;&#x5F71;&#x7247;&#x518D;&#x8BD5;&#x4E00;&#x6B21;&#x3002;","ba-videorecorder.unsupported_video_type":"&#x8BF7;&#x4F7F;&#x7528;&#x5F71;&#x7247;&#x683C;&#x5F0F;: %s - &#x70B9;&#x6211;&#x91CD;&#x8BD5;","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x7ED3;&#x675F;&#x5168;&#x5C4F;&#x64AD;&#x653E;","ba-videoplayer-share.share":"&#x5206;&#x4EAB;","ba-videoplayer-controlbar.pause-video-disabled":"&#x65E0;&#x6CD5;&#x6682;&#x505C;","ba-videorecorder-chooser.record-audio":"&#x5F55;&#x97F3;","ba-videorecorder-chooser.record-screen":"&#x8BB0;&#x5F55;&#x5C4F;&#x5E55;","ba-videorecorder-controlbar.stop-available-after":"&#x6700;&#x77ED;&#x8BB0;&#x5F55;&#x65F6;&#x95F4;&#x662F;&#xFF05;d&#x79D2;","ba-videorecorder-controlbar.cancel":"&#x53D6;&#x6D88;","ba-videorecorder-controlbar.cancel-tooltip":"&#x70B9;&#x51FB;&#x8FD9;&#x91CC;&#x53D6;&#x6D88;&#x3002;","ba-videorecorder.cancel-confirm":"&#x4F60;&#x771F;&#x7684;&#x60F3;&#x53D6;&#x6D88;&#x4F60;&#x7684;&#x89C6;&#x9891;&#x4E0A;&#x4F20;&#xFF1F;","ba-videoplayer-adslot.elapsed-time":"&#x5443;&#x65F6;&#x95F4;","ba-videoplayer-adslot.volume-button":"&#x8BBE;&#x7F6E;&#x97F3;&#x91CF;","ba-videoplayer-adslot.volume-mute":"&#x9759;&#x97F3;","ba-videoplayer-adslot.volume-unmute":"&#x53D6;&#x6D88;&#x9759;&#x97F3;","ba-videoplayer-adslot.ad-will-end-after":"&#x5E7F;&#x544A;&#x5C06;&#x5728;&#xFF05;s&#x4E4B;&#x540E;&#x7ED3;&#x675F;","ba-videoplayer-adslot.can-skip-after":"&#x5728;&#xFF05;d&#x4E4B;&#x540E;&#x8DF3;&#x8FC7;","ba-videoplayer-adslot.skip-ad":"&#x8DF3;&#x8FC7;&#x5E7F;&#x544A;","ba-videorecorder.software-required":"&#x8BF7;&#x70B9;&#x51FB;&#x4E0B;&#x9762;&#x7684;&#x5B89;&#x88C5;/&#x6FC0;&#x6D3B;&#x4EE5;&#x4E0B;&#x8981;&#x6C42;&#x624D;&#x80FD;&#x7EE7;&#x7EED;&#x3002;","ba-videorecorder.software-waiting":"&#x7B49;&#x5F85;&#x8981;&#x6C42;&#x5B89;&#x88C5;/&#x6FC0;&#x6D3B;&#x3002;&#x5B8C;&#x6210;&#x540E;&#x53EF;&#x80FD;&#x9700;&#x8981;&#x5237;&#x65B0;&#x9875;&#x9762;&#x3002;"},"language:zh-tw":{"ba-videoplayer-playbutton.tooltip":"&#x9EDE;&#x9078;&#x64AD;&#x653E;","ba-videoplayer-playbutton.rerecord":"&#x91CD;&#x8A66;","ba-videoplayer-playbutton.submit-video":"&#x78BA;&#x8A8D;","ba-videoplayer-loader.tooltip":"&#x8B80;&#x53D6;&#x4E2D;...","ba-videoplayer-controlbar.change-resolution":"&#x8B8A;&#x66F4;&#x89E3;&#x6790;&#x5EA6;","ba-videoplayer-controlbar.video-progress":"&#x9032;&#x5EA6;","ba-videoplayer-controlbar.rerecord-video":"&#x91CD;&#x8A66;?","ba-videoplayer-controlbar.submit-video":"&#x78BA;&#x8A8D;","ba-videoplayer-controlbar.play-video":"&#x64AD;&#x653E;","ba-videoplayer-controlbar.pause-video":"&#x66AB;&#x505C;","ba-videoplayer-controlbar.elapsed-time":"&#x7D93;&#x904E;&#x6642;&#x9593;","ba-videoplayer-controlbar.total-time":"&#x7E3D;&#x9577;&#x5EA6;","ba-videoplayer-controlbar.fullscreen-video":"&#x9032;&#x5165;&#x5168;&#x87A2;&#x5E55;","ba-videoplayer-controlbar.volume-button":"&#x8ABF;&#x6574;&#x97F3;&#x91CF;","ba-videoplayer-controlbar.volume-mute":"&#x975C;&#x97F3;","ba-videoplayer-controlbar.volume-unmute":"&#x89E3;&#x9664;&#x975C;&#x97F3;","ba-videoplayer.video-error":"&#x932F;&#x8AA4;&#x767C;&#x751F;&#xFF0C;&#x8ACB;&#x7A0D;&#x5F8C;&#x518D;&#x8A66;(&#x9EDE;&#x6211;)","ba-videorecorder-chooser.record-video":"&#x9304;&#x88FD;&#x5F71;&#x7247;","ba-videorecorder-chooser.upload-video":"&#x4E0A;&#x50B3;&#x5F71;&#x7247;","ba-videorecorder-controlbar.settings":"&#x8A2D;&#x5B9A;&#x503C;","ba-videorecorder-controlbar.camerahealthy":"&#x5149;&#x7DDA;&#x826F;&#x597D;","ba-videorecorder-controlbar.cameraunhealthy":"&#x5149;&#x6E90;&#x4E0D;&#x4F73;","ba-videorecorder-controlbar.microphonehealthy":"&#x6536;&#x97F3;&#x826F;&#x597D;","ba-videorecorder-controlbar.microphoneunhealthy":"&#x6536;&#x97F3;&#x4E0D;&#x826F;","ba-videorecorder-controlbar.record":"&#x9304;&#x5F71;","ba-videorecorder-controlbar.record-tooltip":"&#x9EDE;&#x6211;&#x9304;&#x5F71;","ba-videorecorder-controlbar.rerecord":"&#x91CD;&#x8A66;","ba-videorecorder-controlbar.rerecord-tooltip":"&#x9EDE;&#x6211;&#x91CD;&#x8A66;","ba-videorecorder-controlbar.upload-covershot":"&#x4E0A;&#x50B3;","ba-videorecorder-controlbar.upload-covershot-tooltip":"&#x9EDE;&#x6211;&#x4E0A;&#x50B3;&#x81EA;&#x8A02;&#x7684;&#x5C01;&#x9762;","ba-videorecorder-controlbar.stop":"&#x505C;&#x6B62;","ba-videorecorder-controlbar.stop-tooltip":"&#x9EDE;&#x6211;&#x505C;&#x6B62;","ba-videorecorder-controlbar.skip":"&#x7565;&#x904E;","ba-videorecorder-controlbar.skip-tooltip":"&#x9EDE;&#x6211;&#x7565;&#x904E;","ba-videorecorder.recorder-error":"&#x932F;&#x8AA4;&#x767C;&#x751F;&#xFF0C;&#x8ACB;&#x7A0D;&#x5F8C;&#x518D;&#x8A66;(&#x9EDE;&#x6211;)","ba-videorecorder.attach-error":"&#x7121;&#x6CD5;&#x5B58;&#x53D6;&#x651D;&#x5F71;&#x6A5F;&#xFF0C;&#x53EF;&#x80FD;&#x662F;&#x700F;&#x89BD;&#x5668;&#x6216;&#x662F;&#x88DD;&#x7F6E;&#x7684;&#x9650;&#x5236;&#xFF0C;&#x8ACB;&#x5617;&#x8A66;&#x5B89;&#x88DD; Flash &#x5916;&#x639B;&#x7A0B;&#x5F0F;&#x6216;&#x900F;&#x904E;&#x5B89;&#x5168;&#x9023;&#x7DDA;&#x4F86;&#x4F7F;&#x7528;&#x3002;","ba-videorecorder.access-forbidden":"&#x7121;&#x6CD5;&#x5B58;&#x53D6;&#x651D;&#x5F71;&#x6A5F;&#xFF0C;&#x8ACB;&#x9EDE;&#x6211;&#x91CD;&#x8A66;&#x3002;","ba-videorecorder.pick-covershot":"&#x8ACB;&#x6311;&#x9078;&#x4E00;&#x5F35;&#x5C01;&#x9762;","ba-videorecorder.uploading":"&#x4E0A;&#x50B3;&#x4E2D;","ba-videorecorder.uploading-failed":"&#x4E0A;&#x50B3;&#x5931;&#x6557;&#xFF0C;&#x8ACB;&#x9EDE;&#x6211;&#x91CD;&#x8A66;","ba-videorecorder.verifying":"&#x9A57;&#x8B49;&#x4E2D;","ba-videorecorder.verifying-failed":"&#x9A57;&#x8B49;&#x5931;&#x6557;&#xFF0C;&#x8ACB;&#x9EDE;&#x6211;&#x91CD;&#x8A66;","ba-videorecorder.rerecord-confirm":"&#x78BA;&#x5B9A;&#x8981;&#x91CD;&#x65B0;&#x9304;&#x88FD;&#x60A8;&#x7684;&#x5F71;&#x7247;?","ba-videorecorder.video_file_too_large":"&#x60A8;&#x7684;&#x5F71;&#x7247;&#x904E;&#x5927; (%s) &#x8ACB;&#x9EDE;&#x6211;&#x91CD;&#x65B0;&#x9078;&#x64C7;&#x5C0F;&#x4E00;&#x9EDE;&#x5F71;&#x7247;&#x518D;&#x8A66;&#x4E00;&#x6B21;&#x3002;","ba-videorecorder.unsupported_video_type":"&#x8ACB;&#x4F7F;&#x7528;&#x5F71;&#x7247;&#x683C;&#x5F0F;: %s - &#x9EDE;&#x6211;&#x91CD;&#x8A66;","ba-videoplayer-controlbar.exit-fullscreen-video":"&#x7D50;&#x675F;&#x5168;&#x87A2;&#x5E55;","ba-videoplayer-share.share":"&#x5206;&#x4EAB;","ba-videoplayer-controlbar.pause-video-disabled":"&#x7121;&#x6CD5;&#x66AB;&#x505C;","ba-videorecorder-chooser.record-audio":"&#x9304;&#x97F3;","ba-videorecorder-chooser.record-screen":"&#x8A18;&#x9304;&#x5C4F;&#x5E55;","ba-videorecorder-controlbar.stop-available-after":"&#x6700;&#x77ED;&#x8A18;&#x9304;&#x6642;&#x9593;&#x662F;&#xFF05;d&#x79D2;","ba-videorecorder-controlbar.cancel":"&#x53D6;&#x6D88;","ba-videorecorder-controlbar.cancel-tooltip":"&#x9EDE;&#x64CA;&#x9019;&#x88E1;&#x53D6;&#x6D88;&#x3002;","ba-videorecorder.cancel-confirm":"&#x4F60;&#x771F;&#x7684;&#x60F3;&#x53D6;&#x6D88;&#x4F60;&#x7684;&#x8996;&#x983B;&#x4E0A;&#x50B3;&#xFF1F;","ba-videoplayer-adslot.elapsed-time":"&#x5443;&#x6642;&#x9593;","ba-videoplayer-adslot.volume-button":"&#x8A2D;&#x7F6E;&#x97F3;&#x91CF;","ba-videoplayer-adslot.volume-mute":"&#x975C;&#x97F3;","ba-videoplayer-adslot.volume-unmute":"&#x53D6;&#x6D88;&#x975C;&#x97F3;","ba-videoplayer-adslot.ad-will-end-after":"&#x5EE3;&#x544A;&#x5C07;&#x5728;&#xFF05;s&#x4E4B;&#x5F8C;&#x7D50;&#x675F;","ba-videoplayer-adslot.can-skip-after":"&#x5728;&#xFF05;d&#x4E4B;&#x5F8C;&#x8DF3;&#x904E;","ba-videoplayer-adslot.skip-ad":"&#x8DF3;&#x904E;&#x5EE3;&#x544A;","ba-videorecorder.software-required":"&#x8ACB;&#x9EDE;&#x64CA;&#x4E0B;&#x9762;&#x7684;&#x5B89;&#x88DD;/&#x6FC0;&#x6D3B;&#x4EE5;&#x4E0B;&#x8981;&#x6C42;&#x624D;&#x80FD;&#x7E7C;&#x7E8C;&#x3002;","ba-videorecorder.software-waiting":"&#x7B49;&#x5F85;&#x8981;&#x6C42;&#x5B89;&#x88DD;/&#x6FC0;&#x6D3B;&#x3002;&#x5B8C;&#x6210;&#x5F8C;&#x53EF;&#x80FD;&#x9700;&#x8981;&#x5237;&#x65B0;&#x9801;&#x9762;&#x3002;"}};
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
    return {};
});

Scoped.define("module:Ads.AdSenseVideoAdProvider", [
        "module:Ads.AbstractVideoAdProvider",
        "module:Ads.AdSensePrerollAd"
    ],
    function(AbstractVideoAdProvider, AdSensePrerollAd, scoped) {
        return AbstractVideoAdProvider.extend({
            scoped: scoped
        }, {

            _newPrerollAd: function(options) {
                return new AdSensePrerollAd(this, options);
            }

        });
    });


Scoped.define("module:Ads.AdSensePrerollAd", [
    "module:Ads.AbstractPrerollAd"
], function(AbstractVideoPrerollAd, scoped) {
    return AbstractVideoPrerollAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this, provider, options);
                this._adDisplayContainer = new google.ima.AdDisplayContainer(this._options.adElement, this._options.videoElement);
                // Must be done as the result of a user action on mobile
                this._adDisplayContainer.initialize();
                //Re-use this AdsLoader instance for the entire lifecycle of your page.
                this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);

                var self = this;
                this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function() {
                    self._adError();
                }, false);
                this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function() {
                    self._adLoaded.apply(self, arguments);
                }, false);

                this._adsRequest = new google.ima.AdsRequest();
                this._adsRequest.adTagUrl = this._provider.options().adTagUrl;
            },

            _executeAd: function(options) {
                // Specify the linear and nonlinear slot sizes. This helps the SDK to
                // select the correct creative if multiple are returned.
                this._adsRequest.linearAdSlotWidth = options.width;
                this._adsRequest.linearAdSlotHeight = options.height;
                // adsRequest.nonLinearAdSlotWidth = 640;
                // adsRequest.nonLinearAdSlotHeight = 150;

                this._adsLoader.requestAds(this._adsRequest);
            },

            _adError: function() {
                if (this._adsManager)
                    this._adsManager.destroy();
                this._adFinished();
            },

            _adLoaded: function(adsManagerLoadedEvent) {
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
                this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function() {
                    self._adError();
                }, false);

                //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
                this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function() {
                    self._adFinished();
                });

                //this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {});
                this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, function() {
                    self._adSkipped();
                });
            }

        };
    });
});
Scoped.define("module:Ads.AbstractVideoAdProvider", ["base:Class"], function(
    Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(options) {
                inherited.constructor.call(this);
                this._options = options;
            },

            options: function() {
                return this._options;
            },

            _newPrerollAd: function(options) {},

            newPrerollAd: function(options) {
                return this._newPrerollAd(options);
            },

            register: function(name) {
                this.cls.registry[name] = this;
            }

        };
    }, {

        registry: {}

    });
});


Scoped.define("module:Ads.AbstractPrerollAd", ["base:Class", "base:Events.EventsMixin"], function(Class, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this);
                this._provider = provider;
                this._options = options;
            },

            executeAd: function(options) {
                this._options.adElement.style.display = "";
                this._executeAd(options);
            },

            _adFinished: function() {
                this._options.adElement.style.display = "none";
                this.trigger("finished");
            },

            _adSkipped: function() {
                this._options.adElement.style.display = "none";
                this.trigger("adskipped");
            }

        };
    }]);
});
/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.Ad", ["base:Class", "base:Objs", "base:Events.EventsMixin"], function(Class, Objs, EventsMixin, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.sequence = null;
                this.system = null;
                this.title = null;
                this.description = null;
                this.advertiser = null;
                this.pricing = null;
                this.survey = null;
                this.errorURLTemplates = [];
                this.impressionURLTemplates = [];
                this.creatives = [];
                this.extensions = [];

                this.trackingEvents = {};
                this.availableTrackingEvents = ['creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'rewind', 'skip', 'closeLinear', 'close', 'mute', 'unmute', 'pause', 'resume', 'playerExpand', 'playerCollapse', 'acceptInvitationLinear', 'timeSpentViewing', 'otherAdInteraction', 'progress', 'acceptInvitation', 'adExpand', 'adCollapse', 'minimize', 'overlayViewDuration', 'fullscreen', 'exitFullscreen', 'clickthrough'];

                Objs.iter(this.availableTrackingEvents, function(_event) {
                    this.trackingEvents[_event] = null;
                }, this);

            }
        };
    }], {
        isNumeric: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        trackAd: function(URLTemplates, variables) {
            var URL, URLs, i, j, len, results;
            URLs = this.resolveURLTemplates(URLTemplates, variables);
            results = [];
            for (j = 0, len = URLs.length; j < len; j++) {
                URL = URLs[j];
                if (typeof window !== "undefined" && window !== null) {
                    i = new Image();
                    results.push(i.src = URL);
                } else {

                }
            }
            return results;
        },

        resolveURLTemplates: function(URLTemplates, variables) {
            var URLTemplate, URLs, j, key, len, macro1, macro2, resolveURL, value;
            if (!variables) {
                variables = {};
            }
            URLs = [];
            if (variables.ASSETURI) {
                variables.ASSETURI = this.encodeURIComponentRFC3986(variables.ASSETURI);
            }
            if (variables.CONTENTPLAYHEAD) {
                variables.CONTENTPLAYHEAD = this.encodeURIComponentRFC3986(variables.CONTENTPLAYHEAD);
            }
            if ((variables.ERRORCODE) && !/^[0-9]{3}$/.test(variables.ERRORCODE)) {
                variables.ERRORCODE = 900;
            }
            variables.CACHEBUSTING = this.leftpad(Math.round(Math.random() * 1.0e+8).toString());
            variables.TIMESTAMP = this.encodeURIComponentRFC3986((new Date()).toISOString());
            variables.RANDOM = variables.random = variables.CACHEBUSTING;
            for (j = 0, len = URLTemplates.length; j < len; j++) {
                URLTemplate = URLTemplates[j];
                resolveURL = URLTemplate;
                if (!resolveURL) {
                    continue;
                }
                for (key in variables) {
                    value = variables[key];
                    macro1 = "[" + key + "]";
                    macro2 = "%%" + key + "%%";
                    resolveURL = resolveURL.replace(macro1, value);
                    resolveURL = resolveURL.replace(macro2, value);
                }
                URLs.push(resolveURL);
            }
            return URLs;
        },

        leftpad: function(str) {
            if (str.length < 8) {
                return ((function() {
                    var j, ref, results;
                    results = [];
                    for (j = 0, ref = 8 - str.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
                        results.push('0');
                    }
                    return results;
                })()).join('') + str;
            } else {
                return str;
            }
        },

        encodeURIComponentRFC3986: function(str) {
            return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        },

        storage: (function() {
            var data, isDisabled, storage, storageError;
            try {
                storage = typeof window !== "undefined" && window !== null ? window.localStorage || window.sessionStorage : null;
            } catch (error) {
                storageError = error;
                storage = null;
            }
            isDisabled = function(store) {
                var e, testValue;
                try {
                    testValue = '__VAST__';
                    store.setItem(testValue, testValue);
                    if (store.getItem(testValue) !== testValue) {
                        return true;
                    }
                } catch (error) {
                    e = error;
                    return true;
                }
                return false;
            };
            if ((storage === null) || isDisabled(storage)) {
                data = {};
                storage = {
                    length: 0,
                    getItem: function(key) {
                        return data[key];
                    },
                    setItem: function(key, value) {
                        data[key] = value;
                        this.length = Object.keys(data).length;
                    },
                    removeItem: function(key) {
                        delete data[key];
                        this.length = Object.keys(data).length;
                    },
                    clear: function() {
                        data = {};
                        this.length = 0;
                    }
                };
            }
            return storage;
        })()
    });
});
Scoped.define("module:Ads.VAST.Response", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                this.ads = [];
                this.errorURLTemplates = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CompanionAd", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.width = 0;
                this.height = 0;
                this.type = null;
                this.staticResource = null;
                this.htmlRecource = null;
                this.iframeResource = null;
                this.altText = null;
                this.companionClickThroughURLTemplate = null;
                this.companionClickTrackingURLTemplates = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.Creative", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(creativeAttributes) {
                inherited.constructor.call(this);

                if (creativeAttributes === null) {
                    creativeAttributes = {};
                }

                this.id = creativeAttributes.id || null;
                this.adId = creativeAttributes.adId || null;
                this.sequence = creativeAttributes.sequence || null;
                this.apiFramework = creativeAttributes.apiFramework || null;

            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.type = "linear";
                this.duration = 0;
                this.skipDelay = null;
                this.mediaFiles = [];
                this.videoClickThroughURLTemplate = null;
                this.videoClickTrackingURLTemplates = [];
                this.videoCustomClickURLTemplates = [];
                this.adParameters = null;
                this.icons = [];
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeNonLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.type = "nonlinear";
                this.variations = [];

            }
        };
    });
});

Scoped.define("module:Ads.VAST.AdExtension", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.attributes = {};
                this.children = [];
            }
        };
    });
});


Scoped.define("module:Ads.VAST.AdExtensionChild", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.name = null;
                this.value = null;
                this.attributes = {};
            }
        };
    });
});


Scoped.define("module:Ads.VAST.Icon", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.program = null;
                this.height = 0;
                this.width = 0;
                this.xPosition = 0;
                this.yPosition = 0;
                this.apiFramework = null;
                this.offset = null;
                this.duration = 0;
                this.type = null;
                this.staticResource = null;
                this.htmlResource = null;
                this.iframeResource = null;
                this.iconClickThroughURLTemplate = null;
                this.iconClickTrackingURLTemplates = [];
                this.iconViewTrackingURLTemplate = null;
            }
        };
    });
});

Scoped.define("module:Ads.VAST.MediaFile", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(inherited) {
                this.id = null;
                this.fileURL = null;
                this.deliveryType = "progressive";
                this.mimeType = null;
                this.codec = null;
                this.bitrate = 0;
                this.minBitrate = 0;
                this.maxBitrate = 0;
                this.width = 0;
                this.height = 0;
                this.apiFramework = null;
                this.scalable = null;
                this.maintainAspectRatio = null;
            }
        };
    });
});

Scoped.define("module:Ads.VAST.CreativeCompanion", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(inherited) {
                inherited.constructor.call(this);
                this.type = "companion";
                this.variations = [];

            }
        };
    });
});

Scoped.define("module:Ads.VAST.NonLinear", ["module:Ads.VAST.Ad"], function(VASTAd, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function() {
                inherited.constructor.call(this);
                this.id = null;
                this.width = 0;
                this.height = 0;
                this.expandedWidth = 0;
                this.expandedHeight = 0;
                this.scalable = true;
                this.maintainAspectRatio = true;
                this.minSuggestedDuration = 0;
                this.apiFramework = "static";
                this.type = null;
                this.staticResource = null;
                this.htmlResource = null;
                this.iframeResource = null;
                this.nonlinearClickThroughURLTemplate = null;
                this.nonlinearClickTrackingURLTemplates = [];
                this.adParameters = null;
            }
        };
    });
});
/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.Client", [
    "module:Ads.VAST.Ad", "module:Ads.VAST.Parser", "base:Objs"
], function(VASTAd, VASTParser, Objs, scoped) {
    return VASTAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(parameters) {
                inherited.constructor.call(this);
                var defineProperty;
                this.cappingFreeLunch = 0;
                this.cappingMinimumTimeInterval = 60 * 1000; // don't allow ad request before 1 minute
                this.lastSuccessfullAd = +new Date();
                this.options = {
                    withCredentials: false,
                    timeout: 1000
                };

                defineProperty = Object.defineProperty;

                Objs.iter(['lastSuccessfullAd', 'totalCalls', 'totalCallsTimeout'], function(property) {
                    defineProperty(this, property, {
                        get: function() {
                            return VASTAd.storage.getItem(property);
                        },
                        set: function(value) {
                            return VASTAd.storage.setItem(property, value);
                        },
                        configurable: false,
                        enumerable: true
                    });
                }, this);

                if (this.lastSuccessfullAd === null)
                    this.lastSuccessfullAd = 0;

                if (this.totalCalls === null)
                    this.totalCalls = 0;

                if (this.totalCallsTimeout === null)
                    this.totalCallsTimeout = 0;

            },

            getAd: function(url, opts, cb) {
                var now, options, timeSinceLastCall;
                now = +new Date();

                if (!cb)
                    if (typeof opts === 'function')
                        cb = opts;
                options = {};

                options = Objs.extend(this.options, opts);

                var parser = new VASTParser();

                if (this.totalCallsTimeout < now) {
                    this.totalCalls = 1;
                    this.totalCallsTimeout = now + (60 * 60 * 1000);
                } else {
                    this.totalCalls++;
                }

                if (this.cappingFreeLunch >= this.totalCalls) {
                    cb(new Error("VAST call canceled - FreeLunch capping not reached yet " + this.totalCalls), null);
                    return;
                }

                timeSinceLastCall = now - this.lastSuccessfullAd;
                if (timeSinceLastCall < 0) {
                    this.lastSuccessfullAd = 0;
                } else if (now - this.lastSuccessfullAd < this.cappingMinimumTimeInterval) {
                    cb(new Error("VAST call cancelled - (" + this.cappingMinimumTimeInterval + ")ms minimum interval reached"), null);
                    return;
                }

                return parser.parse(url, options, (function(_this) {
                    return function(err, response) {
                        if (err)
                            cb(err, null);
                        else {
                            return cb(null, response);
                        }
                    };
                })(this));
            }
        };
    });
});
/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.Parser", [
        "module:Ads.VAST.Ad",
        "base:Ajax.Support",
        "module:Ads.VAST.Response",
        "module:Ads.VAST.CreativeLinear",
        "module:Ads.VAST.MediaFile",
        "module:Ads.VAST.CreativeCompanion",
        "module:Ads.VAST.CreativeNonLinear",
        "module:Ads.VAST.CompanionAd",
        "module:Ads.VAST.AdExtension",
        "module:Ads.VAST.AdExtensionChild",
        "module:Ads.VAST.NonLinear"
    ],
    function(VASTAd, AjaxSupport, VASTResponse, VASTCreativeLinear, VASTMediaFile, VASTCreativeCompanion, VASTCreativeNonLinear, VASTCompanionAd, VASTAdExtension, VASTAdExtensionChild, VASTNonLinear, scoped) {
        return VASTAd.extend({
            scoped: scoped
        }, function(inherited) {
            return {
                constructor: function() {
                    inherited.constructor.call(this);
                    this.URLTemplateFilters = [];
                },

                _indexOf: function(item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                },

                addURLTemplateFilter: function(func) {
                    if (typeof func === 'function') {
                        URLTemplateFilters.push(func);
                    }
                },

                removeURLTemplateFilter: function() {
                    return URLTemplateFilters.pop();
                },

                countURLTemplateFilters: function() {
                    return URLTemplateFilters.length;
                },

                clearUrlTemplateFilters: function() {
                    URLTemplateFilters = [];
                    return URLTemplateFilters;
                },

                parse: function(url, options, cb) {
                    if (!cb) {
                        if (typeof options === 'function') {
                            cb = options;
                        }
                        options = {};
                    }
                    return this._parse(url, null, options, function(err, response) {
                        return cb(err, response);
                    });
                },

                track: function(templates, errorCode) {
                    return VASTAd.trackAd(templates, errorCode);
                },

                _parse: function(url, parentURLs, options, cb) {
                    var filter, i, len;

                    if (!cb) {
                        if (typeof options === 'function') {
                            cb = options;
                        }
                        options = {};
                    }

                    for (i = 0, len = this.URLTemplateFilters.length; i < len; i++) {
                        filter = URLTemplateFilters[i];
                        url = filter(url);
                    }

                    if (parentURLs === null) {
                        parentURLs = [];
                    }
                    parentURLs.push(url);

                    return AjaxSupport.execute({
                        uri: url,
                        contentType: "xml",
                        decodeType: "xml"
                    }).error(function(err) {
                        cb(err, null);
                    }).success(function(xml) {
                        return this.parseXmlDocument(url, parentURLs, options, xml, cb);
                    }, this);
                },

                __indexOf: [].indexOf || function(item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                },

                parseXmlDocument: function(url, parentURLs, options, xml, cb) {
                    var ad, complete, i, j, len, len1, loopIndex, node, ref, ref1, response, _self;
                    _self = this;
                    response = new VASTResponse();
                    if (!(((xml !== null ? xml.documentElement : void 0) !== null) && xml.documentElement.nodeName === "VAST")) {
                        return cb(new Error('Invalid VAST XMLDocument'));
                    }

                    ref = xml.documentElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        node = ref[i];
                        if (node.nodeName === 'Error') {
                            response.errorURLTemplates.push(this.parseNodeText(node));
                        }
                    }

                    ref1 = xml.documentElement.childNodes;
                    for (j = 0, len1 = ref1.length; j < len1; j++) {
                        node = ref1[j];
                        if (node.nodeName === 'Ad') {
                            ad = this.parseAdElement(node);
                            if (ad !== null) {
                                response.ads.push(ad);
                            } else {
                                this.track(response.errorURLTemplates, {
                                    ERRORCODE: 101,
                                    ERRORMESSAGE: 'VAST schema validation error.'
                                });
                            }
                        }
                    }

                    complete = function(error, errorAlreadyRaised) {
                        var k, len2, noCreatives, ref2;
                        if (error === null) {
                            error = null;
                        }
                        if (errorAlreadyRaised === null) {
                            errorAlreadyRaised = false;
                        }
                        if (!response) {
                            return;
                        }
                        noCreatives = true;
                        ref2 = response.ads;
                        for (k = 0, len2 = ref2.length; k < len2; k++) {
                            ad = ref2[k];
                            if (ad.nextWrapperURL) {
                                return;
                            }
                            if (ad.creatives.length > 0) {
                                noCreatives = false;
                            }
                        }
                        if (noCreatives) {
                            if (!errorAlreadyRaised) {
                                _self.track(response.errorURLTemplates, {
                                    ERRORCODE: 303,
                                    ERRORMESSAGE: 'No VAST response after one or more Wrappers (No creatives)'
                                });
                            }
                        }
                        if (response.ads.length === 0) {
                            response = null;
                        }
                        return cb(error, response);
                    };

                    loopIndex = response.ads.length;
                    while (loopIndex--) {
                        ad = response.ads[loopIndex];
                        if (!ad.nextWrapperURL) {
                            continue;
                        }
                        this._handleComplete.call(this, ad, url, response, parentURLs, options, complete);
                    }
                    return complete();
                },


                _handleComplete: function(ad, url, response, parentURLs, options, complete) {
                    var _ref2;
                    if (parentURLs.length > (options.wrapperLimit ? options.wrapperLimit : 9) || (_ref2 = ad.nextWrapperURL, this.__indexOf.call(parentURLs, _ref2) >= 0)) {
                        this.track(ad.errorURLTemplates, {
                            ERRORCODE: 302,
                            ERRORMESSAGE: 'Wrapper limit reached, as defined by the video player. Too many Wrapper responses have been received with no InLine response.'
                        });
                        response.ads.splice(response.ads.indexOf(ad), 1);
                        complete(new Error("Wrapper limit reached, as defined by the video player"));
                        return;
                    }

                    if (url) {
                        ad.nextWrapperURL = this.resolveVastAdTagURI(ad.nextWrapperURL, url);
                    }

                    return this._parse(ad.nextWrapperURL, parentURLs, options, function(err, wrappedResponse) {
                        var _errorAlreadyRaised, _index, _k, _len2, _ref3, _wrappedAd;
                        _errorAlreadyRaised = false;
                        if (err) {
                            this.track(ad.errorURLTemplates, {
                                ERRORCODE: 301,
                                ERRORMESSAGE: 'Timeout of VAST URI provided in Wrapper element, or of VAST URI provided in a subsequent Wrapper element. (URI was either unavailable or reached a timeout as defined by the video player.)'
                            });
                            response.ads.splice(response.ads.indexOf(ad), 1);
                            _errorAlreadyRaised = true;
                        } else if (!wrappedResponse) {
                            this.track(ad.errorURLTemplates, {
                                ERRORCODE: 303,
                                ERRORMESSAGE: 'No VAST response after one or more Wrappers'
                            });
                            response.ads.splice(response.ads.indexOf(ad), 1);
                            _errorAlreadyRaised = true;
                        } else {
                            response.errorURLTemplates = response.errorURLTemplates.concat(wrappedResponse.errorURLTemplates);
                            _index = response.ads.indexOf(ad);
                            response.ads.splice(_index, 1);
                            _ref3 = wrappedResponse.ads;
                            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                                _wrappedAd = _ref3[_k];
                                this.mergeWrapperAdData(_wrappedAd, ad);
                                response.ads.splice(++_index, 0, _wrappedAd);
                            }
                        }
                        delete ad.nextWrapperURL;
                        return complete(err, _errorAlreadyRaised);
                    });
                },

                resolveVastAdTagURI: function(vastAdTagUrl, originalUrl) {
                    var baseURL, protocol;
                    if (vastAdTagUrl.indexOf('//') === 0) {
                        protocol = location.protocol;
                        return "" + protocol + vastAdTagUrl;
                    }
                    if (vastAdTagUrl.indexOf('://') === -1) {
                        baseURL = originalUrl.slice(0, originalUrl.lastIndexOf('/'));
                        return baseURL + "/" + vastAdTagUrl;
                    }
                    return vastAdTagUrl;
                },

                mergeWrapperAdData: function(wrappedAd, ad) {
                    var base, creative, eventName, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, results, urls;
                    wrappedAd.errorURLTemplates = ad.errorURLTemplates.concat(wrappedAd.errorURLTemplates);
                    wrappedAd.impressionURLTemplates = ad.impressionURLTemplates.concat(wrappedAd.impressionURLTemplates);
                    wrappedAd.extensions = ad.extensions.concat(wrappedAd.extensions);
                    ref = wrappedAd.creatives;
                    for (i = 0, len = ref.length; i < len; i++) {
                        creative = ref[i];
                        if (((ref1 = ad.trackingEvents) !== null ? ref1[creative.type] : void 0) !== null) {
                            ref2 = ad.trackingEvents[creative.type];
                            for (eventName in ref2) {
                                urls = ref2[eventName];
                                if (creative.trackingEvents[eventName]) {
                                    base[eventName] = creative.trackingEvents[eventName];
                                } else {
                                    base[eventName] = [];
                                }
                                creative.trackingEvents[eventName] = creative.trackingEvents[eventName].concat(urls);
                            }
                        }
                    }
                    if ((ref3 = ad.videoClickTrackingURLTemplates) !== null ? ref3.length : void 0) {
                        ref4 = wrappedAd.creatives;
                        for (j = 0, len1 = ref4.length; j < len1; j++) {
                            creative = ref4[j];
                            if (creative.type === 'linear') {
                                creative.videoClickTrackingURLTemplates = creative.videoClickTrackingURLTemplates.concat(ad.videoClickTrackingURLTemplates);
                            }
                        }
                    }
                    if ((ref5 = ad.videoCustomClickURLTemplates) ? ref5.length : void 0) {
                        ref6 = wrappedAd.creatives;
                        for (k = 0, len2 = ref6.length; k < len2; k++) {
                            creative = ref6[k];
                            if (creative.type === 'linear') {
                                creative.videoCustomClickURLTemplates = creative.videoCustomClickURLTemplates.concat(ad.videoCustomClickURLTemplates);
                            }
                        }
                    }
                    if (ad.videoClickThroughURLTemplate) {
                        ref7 = wrappedAd.creatives;
                        results = [];
                        for (l = 0, len3 = ref7.length; l < len3; l++) {
                            creative = ref7[l];
                            if (creative.type === 'linear' && (creative.videoClickThroughURLTemplate === null)) {
                                results.push(creative.videoClickThroughURLTemplate = ad.videoClickThroughURLTemplate);
                            } else {
                                results.push(void 0);
                            }
                        }
                        return results;
                    }
                },

                childByName: function(node, name) {
                    var child, i, len, ref;
                    ref = node.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        child = ref[i];
                        if (child.nodeName === name) {
                            return child;
                        }
                    }
                },

                childsByName: function(node, name) {
                    var child, childs, i, len, ref;
                    childs = [];
                    ref = node.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        child = ref[i];
                        if (child.nodeName === name) {
                            childs.push(child);
                        }
                    }
                    return childs;
                },

                parseAdElement: function(adElement) {
                    var adTypeElement, i, len, ref, ref1;
                    ref = adElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        adTypeElement = ref[i];
                        if ((ref1 = adTypeElement.nodeName) !== "Wrapper" && ref1 !== "InLine") {
                            continue;
                        }
                        this.copyNodeAttribute("id", adElement, adTypeElement);
                        this.copyNodeAttribute("sequence", adElement, adTypeElement);
                        if (adTypeElement.nodeName === "Wrapper") {
                            return this.parseWrapperElement(adTypeElement);
                        } else if (adTypeElement.nodeName === "InLine") {
                            return this.parseInLineElement(adTypeElement);
                        }
                    }
                },

                parseWrapperElement: function(wrapperElement) {
                    var ad, base, base1, eventName, i, item, j, k, l, len, len1, len2, len3, name1, ref, ref1, ref2, ref3, ref4, url, urls, wrapperCreativeElement, wrapperURLElement;
                    ad = this.parseInLineElement(wrapperElement);
                    wrapperURLElement = this.childByName(wrapperElement, "VASTAdTagURI");
                    if (wrapperURLElement) {
                        ad.nextWrapperURL = this.parseNodeText(wrapperURLElement);
                    } else {
                        wrapperURLElement = this.childByName(wrapperElement, "VASTAdTagURL");
                        if (wrapperURLElement) {
                            ad.nextWrapperURL = this.parseNodeText(this.childByName(wrapperURLElement, "URL"));
                        }
                    }
                    ref = ad.creatives;
                    for (i = 0, len = ref.length; i < len; i++) {
                        wrapperCreativeElement = ref[i];
                        if ((ref1 = wrapperCreativeElement.type) === 'linear' || ref1 === 'nonlinear') {
                            if (wrapperCreativeElement.trackingEvents) {
                                ad.trackingEvents = ad.trackingEvents ? ad.trackingEvents : {};
                                name1 = wrapperCreativeElement.type;
                                base[name1] = ad.trackingEvents[name1] ? ad.trackingEvents[name1] : {};
                                ref2 = wrapperCreativeElement.trackingEvents;
                                for (eventName in ref2) {
                                    urls = ref2[eventName];
                                    if (urls !== null) {
                                        base1[eventName] = ad.trackingEvents[wrapperCreativeElement.type][eventName] ? ad.trackingEvents[wrapperCreativeElement.type][eventName] : [];
                                        for (j = 0, len1 = urls.length; j < len1; j++) {
                                            url = urls[j];
                                            ad.trackingEvents[wrapperCreativeElement.type][eventName].push(url);
                                        }
                                    }
                                }
                            }
                            if (wrapperCreativeElement.videoClickTrackingURLTemplates) {
                                ad.videoClickTrackingURLTemplates = ad.videoClickTrackingURLTemplates || [];
                                ref3 = wrapperCreativeElement.videoClickTrackingURLTemplates;
                                for (k = 0, len2 = ref3.length; k < len2; k++) {
                                    item = ref3[k];
                                    ad.videoClickTrackingURLTemplates.push(item);
                                }
                            }
                            if (wrapperCreativeElement.videoClickThroughURLTemplate) {
                                ad.videoClickThroughURLTemplate = wrapperCreativeElement.videoClickThroughURLTemplate;
                            }
                            if (wrapperCreativeElement.videoCustomClickURLTemplates) {
                                ad.videoCustomClickURLTemplates = ad.videoCustomClickURLTemplates || [];
                                ref4 = wrapperCreativeElement.videoCustomClickURLTemplates;
                                for (l = 0, len3 = ref4.length; l < len3; l++) {
                                    item = ref4[l];
                                    ad.videoCustomClickURLTemplates.push(item);
                                }
                            }
                        }
                    }
                    if (ad.nextWrapperURL) {
                        return ad;
                    }
                },

                parseInLineElement: function(inLineElement) {
                    var ad, creative, creativeAttributes, creativeElement, creativeTypeElement, i, j, k, len, len1, len2, node, ref, ref1, ref2;
                    ad = new VASTAd();
                    ad.id = inLineElement.getAttribute("id") || null;
                    ad.sequence = inLineElement.getAttribute("sequence") || null;
                    ref = inLineElement.childNodes;
                    for (i = 0, len = ref.length; i < len; i++) {
                        node = ref[i];
                        switch (node.nodeName) {
                            case "Error":
                                ad.errorURLTemplates.push(this.parseNodeText(node));
                                break;
                            case "Impression":
                                ad.impressionURLTemplates.push(this.parseNodeText(node));
                                break;
                            case "Creatives":
                                ref1 = this.childsByName(node, "Creative");
                                for (j = 0, len1 = ref1.length; j < len1; j++) {
                                    creativeElement = ref1[j];
                                    creativeAttributes = {
                                        id: creativeElement.getAttribute('id') || null,
                                        adId: this.parseCreativeAdIdAttribute(creativeElement),
                                        sequence: creativeElement.getAttribute('sequence') || null,
                                        apiFramework: creativeElement.getAttribute('apiFramework') || null
                                    };
                                    ref2 = creativeElement.childNodes;
                                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                                        creativeTypeElement = ref2[k];
                                        switch (creativeTypeElement.nodeName) {
                                            case "Linear":
                                                creative = this.parseCreativeLinearElement(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                                break;
                                            case "NonLinearAds":
                                                creative = this.parseNonLinear(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                                break;
                                            case "CompanionAds":
                                                creative = this.parseCompanionAd(creativeTypeElement, creativeAttributes);
                                                if (creative) {
                                                    ad.creatives.push(creative);
                                                }
                                        }
                                    }
                                }
                                break;
                            case "Extensions":
                                this.parseExtension(ad.extensions, this.childsByName(node, "Extension"));
                                break;
                            case "AdSystem":
                                ad.system = {
                                    value: this.parseNodeText(node),
                                    version: node.getAttribute("version") || null
                                };
                                break;
                            case "AdTitle":
                                ad.title = this.parseNodeText(node);
                                break;
                            case "Description":
                                ad.description = this.parseNodeText(node);
                                break;
                            case "Advertiser":
                                ad.advertiser = this.parseNodeText(node);
                                break;
                            case "Pricing":
                                ad.pricing = {
                                    value: this.parseNodeText(node),
                                    model: node.getAttribute("model") || null,
                                    currency: node.getAttribute("currency") || null
                                };
                                break;
                            case "Survey":
                                ad.survey = this.parseNodeText(node);
                        }
                    }
                    return ad;
                },

                parseExtension: function(collection, extensions) {
                    var childNode, ext, extChild, extChildNodeAttr, extNode, extNodeAttr, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2, results, txt;
                    results = [];
                    for (i = 0, len = extensions.length; i < len; i++) {
                        extNode = extensions[i];
                        ext = new VASTAdExtension();
                        if (extNode.attributes) {
                            ref = extNode.attributes;
                            for (j = 0, len1 = ref.length; j < len1; j++) {
                                extNodeAttr = ref[j];
                                ext.attributes[extNodeAttr.nodeName] = extNodeAttr.nodeValue;
                            }
                        }
                        ref1 = extNode.childNodes;
                        for (k = 0, len2 = ref1.length; k < len2; k++) {
                            childNode = ref1[k];
                            txt = this.parseNodeText(childNode);
                            if (childNode.nodeName !== '#comment' && txt !== '') {
                                extChild = new VASTAdExtensionChild();
                                extChild.name = childNode.nodeName;
                                extChild.value = txt;
                                if (childNode.attributes) {
                                    ref2 = childNode.attributes;
                                    for (l = 0, len3 = ref2.length; l < len3; l++) {
                                        extChildNodeAttr = ref2[l];
                                        extChild.attributes[extChildNodeAttr.nodeName] = extChildNodeAttr.nodeValue;
                                    }
                                }
                                ext.children.push(extChild);
                            }
                        }
                        results.push(collection.push(ext));
                    }
                    return results;
                },

                parseCreativeLinearElement: function(creativeElement, creativeAttributes) {
                    var adParamsElement, base, clickTrackingElement, creative, customClickElement, eventName, htmlElement, i, icon, iconClickTrackingElement, iconClicksElement, iconElement, iconsElement, iframeElement, j, k, l, len, len1, len10, len2, len3, len4, len5, len6, len7, len8, len9, m, maintainAspectRatio, mediaFile, mediaFileElement, mediaFilesElement, n, o, offset, p, percent, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, scalable, skipOffset, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate, videoClicksElement;
                    creative = new VASTCreativeLinear(creativeAttributes);
                    creative.duration = this.parseDuration(this.parseNodeText(this.childByName(creativeElement, "Duration")));
                    if (creative.duration === -1 && creativeElement.parentNode.parentNode.parentNode.nodeName !== 'Wrapper') {
                        return null;
                    }
                    skipOffset = creativeElement.getAttribute("skipoffset");
                    if (skipOffset === null) {
                        creative.skipDelay = null;
                    } else if (skipOffset.charAt(skipOffset.length - 1) === "%") {
                        percent = parseInt(skipOffset, 10);
                        creative.skipDelay = creative.duration * (percent / 100);
                    } else {
                        creative.skipDelay = this.parseDuration(skipOffset);
                    }
                    videoClicksElement = this.childByName(creativeElement, "VideoClicks");
                    if (videoClicksElement) {
                        creative.videoClickThroughURLTemplate = this.parseNodeText(this.childByName(videoClicksElement, "ClickThrough"));
                        ref = this.childsByName(videoClicksElement, "ClickTracking");
                        for (i = 0, len = ref.length; i < len; i++) {
                            clickTrackingElement = ref[i];
                            creative.videoClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        ref1 = this.childsByName(videoClicksElement, "CustomClick");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            customClickElement = ref1[j];
                            creative.videoCustomClickURLTemplates.push(this.parseNodeText(customClickElement));
                        }
                    }
                    adParamsElement = this.childByName(creativeElement, "AdParameters");
                    if (adParamsElement) {
                        creative.adParameters = this.parseNodeText(adParamsElement);
                    }
                    ref2 = this.childsByName(creativeElement, "TrackingEvents");
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                        trackingEventsElement = ref2[k];
                        ref3 = this.childsByName(trackingEventsElement, "Tracking");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            trackingElement = ref3[l];
                            eventName = trackingElement.getAttribute("event");
                            trackingURLTemplate = this.parseNodeText(trackingElement);
                            if (eventName && trackingURLTemplate) {
                                if (eventName === "progress") {
                                    offset = trackingElement.getAttribute("offset");
                                    if (!offset) {
                                        continue;
                                    }
                                    if (offset.charAt(offset.length - 1) === '%') {
                                        eventName = "progress-" + offset;
                                    } else {
                                        eventName = "progress-" + (Math.round(this.parseDuration(offset)));
                                    }
                                }
                                if ((base = creative.trackingEvents)[eventName] === null) {
                                    base[eventName] = [];
                                }

                                if (creative.trackingEvents[eventName]) {
                                    creative.trackingEvents[eventName].push(trackingURLTemplate);
                                }

                            }
                        }
                    }
                    ref4 = this.childsByName(creativeElement, "MediaFiles");
                    for (m = 0, len4 = ref4.length; m < len4; m++) {
                        mediaFilesElement = ref4[m];
                        ref5 = this.childsByName(mediaFilesElement, "MediaFile");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            mediaFileElement = ref5[n];
                            mediaFile = new VASTMediaFile();
                            mediaFile.id = mediaFileElement.getAttribute("id");
                            mediaFile.fileURL = this.parseNodeText(mediaFileElement);
                            mediaFile.deliveryType = mediaFileElement.getAttribute("delivery");
                            mediaFile.codec = mediaFileElement.getAttribute("codec");
                            mediaFile.mimeType = mediaFileElement.getAttribute("type");
                            mediaFile.apiFramework = mediaFileElement.getAttribute("apiFramework");
                            mediaFile.bitrate = parseInt(mediaFileElement.getAttribute("bitrate") || 0, 10);
                            mediaFile.minBitrate = parseInt(mediaFileElement.getAttribute("minBitrate") || 0, 10);
                            mediaFile.maxBitrate = parseInt(mediaFileElement.getAttribute("maxBitrate") || 0, 10);
                            mediaFile.width = parseInt(mediaFileElement.getAttribute("width") || 0, 10);
                            mediaFile.height = parseInt(mediaFileElement.getAttribute("height") || 0, 10);
                            scalable = mediaFileElement.getAttribute("scalable");
                            if (scalable && typeof scalable === "string") {
                                scalable = scalable.toLowerCase();
                                if (scalable === "true") {
                                    mediaFile.scalable = true;
                                } else if (scalable === "false") {
                                    mediaFile.scalable = false;
                                }
                            }
                            maintainAspectRatio = mediaFileElement.getAttribute("maintainAspectRatio");
                            if (maintainAspectRatio && typeof maintainAspectRatio === "string") {
                                maintainAspectRatio = maintainAspectRatio.toLowerCase();
                                if (maintainAspectRatio === "true") {
                                    mediaFile.maintainAspectRatio = true;
                                } else if (maintainAspectRatio === "false") {
                                    mediaFile.maintainAspectRatio = false;
                                }
                            }
                            creative.mediaFiles.push(mediaFile);
                        }
                    }
                    iconsElement = this.childByName(creativeElement, "Icons");
                    if (iconsElement) {
                        ref6 = this.childsByName(iconsElement, "Icon");
                        for (o = 0, len6 = ref6.length; o < len6; o++) {
                            iconElement = ref6[o];
                            icon = new VASTIcon();
                            icon.program = iconElement.getAttribute("program");
                            icon.height = parseInt(iconElement.getAttribute("height") || 0, 10);
                            icon.width = parseInt(iconElement.getAttribute("width") || 0, 10);
                            icon.xPosition = this.parseXPosition(iconElement.getAttribute("xPosition"));
                            icon.yPosition = this.parseYPosition(iconElement.getAttribute("yPosition"));
                            icon.apiFramework = iconElement.getAttribute("apiFramework");
                            icon.offset = this.parseDuration(iconElement.getAttribute("offset"));
                            icon.duration = this.parseDuration(iconElement.getAttribute("duration"));
                            ref7 = this.childsByName(iconElement, "HTMLResource");
                            for (p = 0, len7 = ref7.length; p < len7; p++) {
                                htmlElement = ref7[p];
                                icon.type = htmlElement.getAttribute("creativeType") || 'text/html';
                                icon.htmlResource = this.parseNodeText(htmlElement);
                            }
                            ref8 = this.childsByName(iconElement, "IFrameResource");
                            for (q = 0, len8 = ref8.length; q < len8; q++) {
                                iframeElement = ref8[q];
                                icon.type = iframeElement.getAttribute("creativeType") || 0;
                                icon.iframeResource = this.parseNodeText(iframeElement);
                            }
                            ref9 = this.childsByName(iconElement, "StaticResource");
                            for (r = 0, len9 = ref9.length; r < len9; r++) {
                                staticElement = ref9[r];
                                icon.type = staticElement.getAttribute("creativeType") || 0;
                                icon.staticResource = this.parseNodeText(staticElement);
                            }
                            iconClicksElement = this.childByName(iconElement, "IconClicks");
                            if (iconClicksElement) {
                                icon.iconClickThroughURLTemplate = this.parseNodeText(this.childByName(iconClicksElement, "IconClickThrough"));
                                ref10 = this.childsByName(iconClicksElement, "IconClickTracking");
                                for (s = 0, len10 = ref10.length; s < len10; s++) {
                                    iconClickTrackingElement = ref10[s];
                                    icon.iconClickTrackingURLTemplates.push(this.parseNodeText(iconClickTrackingElement));
                                }
                            }
                            icon.iconViewTrackingURLTemplate = this.parseNodeText(this.childByName(iconElement, "IconViewTracking"));
                            creative.icons.push(icon);
                        }
                    }
                    return creative;
                },

                parseNonLinear: function(creativeElement, creativeAttributes) {
                    var adParamsElement, base, clickTrackingElement, creative, eventName, htmlElement, i, iframeElement, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, nonlinearAd, nonlinearResource, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate;
                    creative = new VASTCreativeNonLinear(creativeAttributes);
                    ref = this.childsByName(creativeElement, "TrackingEvents");
                    for (i = 0, len = ref.length; i < len; i++) {
                        trackingEventsElement = ref[i];
                        ref1 = this.childsByName(trackingEventsElement, "Tracking");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            trackingElement = ref1[j];
                            eventName = trackingElement.getAttribute("event");
                            trackingURLTemplate = this.parseNodeText(trackingElement);
                            if (eventName && trackingURLTemplate) {
                                if ((base = creative.trackingEvents)[eventName] === null) {
                                    base[eventName] = [];
                                }

                                if (creative.trackingEvents[eventName] && trackingURLTemplate !== null) {
                                    creative.trackingEvents[eventName].push(trackingURLTemplate);
                                }
                            }
                        }
                    }
                    ref2 = this.childsByName(creativeElement, "NonLinear");
                    for (k = 0, len2 = ref2.length; k < len2; k++) {
                        nonlinearResource = ref2[k];
                        nonlinearAd = new VASTNonLinear();
                        nonlinearAd.id = nonlinearResource.getAttribute("id") || null;
                        nonlinearAd.width = nonlinearResource.getAttribute("width");
                        nonlinearAd.height = nonlinearResource.getAttribute("height");
                        nonlinearAd.expandedWidth = nonlinearResource.getAttribute("expandedWidth");
                        nonlinearAd.expandedHeight = nonlinearResource.getAttribute("expandedHeight");
                        nonlinearAd.scalable = this.parseBoolean(nonlinearResource.getAttribute("scalable"));
                        nonlinearAd.maintainAspectRatio = this.parseBoolean(nonlinearResource.getAttribute("maintainAspectRatio"));
                        nonlinearAd.minSuggestedDuration = this.parseDuration(nonlinearResource.getAttribute("minSuggestedDuration"));
                        nonlinearAd.apiFramework = nonlinearResource.getAttribute("apiFramework");
                        ref3 = this.childsByName(nonlinearResource, "HTMLResource");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            htmlElement = ref3[l];
                            nonlinearAd.type = htmlElement.getAttribute("creativeType") || 'text/html';
                            nonlinearAd.htmlResource = this.parseNodeText(htmlElement);
                        }
                        ref4 = this.childsByName(nonlinearResource, "IFrameResource");
                        for (m = 0, len4 = ref4.length; m < len4; m++) {
                            iframeElement = ref4[m];
                            nonlinearAd.type = iframeElement.getAttribute("creativeType") || 0;
                            nonlinearAd.iframeResource = this.parseNodeText(iframeElement);
                        }
                        ref5 = this.childsByName(nonlinearResource, "StaticResource");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            staticElement = ref5[n];
                            nonlinearAd.type = staticElement.getAttribute("creativeType") || 0;
                            nonlinearAd.staticResource = this.parseNodeText(staticElement);
                        }
                        adParamsElement = this.childByName(nonlinearResource, "AdParameters");
                        if (adParamsElement) {
                            nonlinearAd.adParameters = this.parseNodeText(adParamsElement);
                        }
                        nonlinearAd.nonlinearClickThroughURLTemplate = this.parseNodeText(this.childByName(nonlinearResource, "NonLinearClickThrough"));
                        ref6 = this.childsByName(nonlinearResource, "NonLinearClickTracking");
                        for (o = 0, len6 = ref6.length; o < len6; o++) {
                            clickTrackingElement = ref6[o];
                            nonlinearAd.nonlinearClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        creative.variations.push(nonlinearAd);
                    }
                    return creative;
                },

                parseCompanionAd: function(creativeElement, creativeAttributes) {
                    var base, child, clickTrackingElement, companionAd, companionResource, creative, eventName, htmlElement, i, iframeElement, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, staticElement, trackingElement, trackingEventsElement, trackingURLTemplate;
                    creative = new VASTCreativeCompanion(creativeAttributes);
                    ref = this.childsByName(creativeElement, "Companion");
                    for (i = 0, len = ref.length; i < len; i++) {
                        companionResource = ref[i];
                        companionAd = new VASTCompanionAd();
                        companionAd.id = companionResource.getAttribute("id") || null;
                        companionAd.width = companionResource.getAttribute("width");
                        companionAd.height = companionResource.getAttribute("height");
                        companionAd.companionClickTrackingURLTemplates = [];
                        ref1 = this.childsByName(companionResource, "HTMLResource");
                        for (j = 0, len1 = ref1.length; j < len1; j++) {
                            htmlElement = ref1[j];
                            companionAd.type = htmlElement.getAttribute("creativeType") || 'text/html';
                            companionAd.htmlResource = this.parseNodeText(htmlElement);
                        }
                        ref2 = this.childsByName(companionResource, "IFrameResource");
                        for (k = 0, len2 = ref2.length; k < len2; k++) {
                            iframeElement = ref2[k];
                            companionAd.type = iframeElement.getAttribute("creativeType") || 0;
                            companionAd.iframeResource = this.parseNodeText(iframeElement);
                        }
                        ref3 = this.childsByName(companionResource, "StaticResource");
                        for (l = 0, len3 = ref3.length; l < len3; l++) {
                            staticElement = ref3[l];
                            companionAd.type = staticElement.getAttribute("creativeType") || 0;
                            ref4 = this.childsByName(companionResource, "AltText");
                            for (m = 0, len4 = ref4.length; m < len4; m++) {
                                child = ref4[m];
                                companionAd.altText = this.parseNodeText(child);
                            }
                            companionAd.staticResource = this.parseNodeText(staticElement);
                        }
                        ref5 = this.childsByName(companionResource, "TrackingEvents");
                        for (n = 0, len5 = ref5.length; n < len5; n++) {
                            trackingEventsElement = ref5[n];
                            ref6 = this.childsByName(trackingEventsElement, "Tracking");
                            for (o = 0, len6 = ref6.length; o < len6; o++) {
                                trackingElement = ref6[o];
                                eventName = trackingElement.getAttribute("event");
                                trackingURLTemplate = this.parseNodeText(trackingElement);
                                if (eventName && trackingURLTemplate) {
                                    if ((base = companionAd.trackingEvents)[eventName] === null) {
                                        base[eventName] = [];
                                    }
                                    companionAd.trackingEvents[eventName].push(trackingURLTemplate);
                                }
                            }
                        }
                        ref7 = this.childsByName(companionResource, "CompanionClickTracking");
                        for (p = 0, len7 = ref7.length; p < len7; p++) {
                            clickTrackingElement = ref7[p];
                            companionAd.companionClickTrackingURLTemplates.push(this.parseNodeText(clickTrackingElement));
                        }
                        companionAd.companionClickThroughURLTemplate = this.parseNodeText(this.childByName(companionResource, "CompanionClickThrough"));
                        companionAd.companionClickTrackingURLTemplate = this.parseNodeText(this.childByName(companionResource, "CompanionClickTracking"));
                        creative.variations.push(companionAd);
                    }
                    return creative;
                },

                parseDuration: function(durationString) {
                    var durationComponents, hours, minutes, seconds, secondsAndMS;
                    if (!(durationString)) {
                        return -1;
                    }
                    if (VASTAd.isNumeric(durationString)) {
                        return parseInt(durationString, 10);
                    }
                    durationComponents = durationString.split(":");
                    if (durationComponents.length !== 3) {
                        return -1;
                    }
                    secondsAndMS = durationComponents[2].split(".");
                    seconds = parseInt(secondsAndMS[0], 10);
                    if (secondsAndMS.length === 2) {
                        seconds += parseFloat("0." + secondsAndMS[1]);
                    }
                    minutes = parseInt(durationComponents[1] * 60, 10);
                    hours = parseInt(durationComponents[0] * 60 * 60, 10);
                    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || minutes > 60 * 60 || seconds > 60) {
                        return -1;
                    }
                    return hours + minutes + seconds;
                },

                parseXPosition: function(xPosition) {
                    if (xPosition === "left" || xPosition === "right") {
                        return xPosition;
                    }
                    return parseInt(xPosition || 0, 10);
                },

                parseYPosition: function(yPosition) {
                    if (yPosition === "top" || yPosition === "bottom") {
                        return yPosition;
                    }
                    return parseInt(yPosition || 0, 10);
                },

                parseBoolean: function(booleanString) {
                    return booleanString === 'true' || booleanString === 'TRUE' || booleanString === '1';
                },

                parseNodeText: function(node) {
                    return node && (node.textContent || node.text || '').trim();
                },

                copyNodeAttribute: function(attributeName, nodeSource, nodeDestination) {
                    var attributeValue;
                    attributeValue = nodeSource.getAttribute(attributeName);
                    if (attributeValue) {
                        return nodeDestination.setAttribute(attributeName, attributeValue);
                    }
                },

                parseCreativeAdIdAttribute: function(creativeElement) {
                    return creativeElement.getAttribute('AdID') || creativeElement.getAttribute('adID') || creativeElement.getAttribute('adId') || null;
                }
            };
        });
    });
Scoped.define("module:Ads.VastVideoAdProvider", [
        "module:Ads.AbstractVideoAdProvider",
        "module:Ads.VastPrerollAd"
    ],
    function(AbstractVideoAdProvider, VastPrerollAd, scoped) {
        return AbstractVideoAdProvider.extend({
            scoped: scoped
        }, {

            _newPrerollAd: function(options) {
                return new VastPrerollAd(this, options);
            }

        });
    });


Scoped.define("module:Ads.VastPrerollAd", [
    "module:Ads.AbstractPrerollAd",
    "module:Ads.VAST.VAST"
], function(AbstractVideoPrerollAd, VAST, scoped) {
    return AbstractVideoPrerollAd.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(provider, options) {
                inherited.constructor.call(this, provider, options);
                this._vast = new VAST(this._provider.options(), {});
                this._vast.once("adresponseerror", function(err) {
                    // some error actions, no respond from ad server
                }, this);
            },

            _executeAd: function(options) {
                this._adplayer = new BetaJS.MediaComponents.VideoPlayer.Dynamics.Adplayer({
                    element: this._options.adElement,
                    attrs: {
                        css: this._options.dynamic.get("css")
                    }
                });
                this._adplayer._vast = this._vast;
                this._adplayer._preroll = this;
                this._adplayer.activate();
            },

            _adFinished: function() {
                this._options.adElement.style.display = "none";
                this.trigger("finished");
            },

            _adSkipped: function() {
                this._options.adElement.style.display = "none";
                this.trigger("adskipped");
            }

        };
    });
});
/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.Tracker", [
        "module:Ads.VAST.Ad",
        "module:Ads.VAST.CreativeLinear",
        "module:Ads.VAST.NonLinear",
        "module:Ads.VAST.CompanionAd",
        "module:Ads.VAST.Client",
        "base:Events.ListenMixin"
    ],
    function(VASTAd, VASTCreativeLinear, VASTNonLinear, VASTCompanionAd, VASTClient, ListenMixin, scoped) {
        return VASTAd.extend({
            scoped: scoped
        }, [ListenMixin, function(inherited) {
            return {
                constructor: function(ad, creative, variation) {
                    inherited.constructor.call(this, ad, creative, variation);
                    var eventName, events, trackingEvents;
                    this.ad = ad;
                    this.creative = creative;
                    this.variation = variation || null;
                    this.muted = false;
                    this.impressed = false;
                    this.skipable = false;
                    this.skipDelayDefault = -1;

                    this.emitAlwaysEvents = ['creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'rewind', 'skip', 'closeLinear', 'close'];
                    trackingEvents = creative ? creative.trackingEvents : {};

                    for (eventName in trackingEvents) {
                        events = trackingEvents[eventName];
                        if (events)
                            this.trackingEvents[eventName] = events.slice(0);
                    }

                    if (creative instanceof VASTCreativeLinear) {
                        this.setAdDuration(this.creative.duration);
                        this.skipDelay = creative.skipDelay;
                        this.linear = true;
                        this.clickThroughURLTemplate = creative.videoClickThroughURLTemplate;
                        this.clickTrackingURLTemplate = creative.videoClickTrackingURLTemplate;
                    } else {
                        this.skipDelay = -1;
                        this.linear = false;
                        if (this.variation) {
                            if (this.variation instanceof VASTNonLinear) {
                                this.clickThroughURLTemplate = this.variation.nonlinearClickThroughURLTemplate;
                                this.clickTrackingURLTemplates = this.variation.nonlinearClickTrackingURLTemplates;
                            } else if (this.variation instanceof VASTCompanionAd) {
                                this.clickThroughURLTemplate = this.variation.companionClickThroughURLTemplate;
                                this.clickTrackingURLTemplates = this.variation.companionClickTrackingURLTemplates;
                            }
                        }
                    }

                    this.on('adstart', function() {
                        VASTClient.lastSuccessfullAd = +new Date();
                    });


                },

                setAdDuration: function(duration) {
                    this.assetDuration = duration;
                    this.quartiles = {
                        'firstQuartile': Math.round(25 * this.assetDuration) / 100,
                        'midpoint': Math.round(50 * this.assetDuration) / 100,
                        'thirdQuartile': Math.round(75 * this.assetDuration) / 100
                    };
                    return this.quartiles;
                },

                setAdProgress: function(progress) {
                    var eventName, events, i, len, percent, quartile, ref, skipDelay, time;
                    skipDelay = this.skipDelay === null ? this.skipDelayDefault : this.skipDelay;
                    if (skipDelay !== -1 && !this.skipable) {
                        if (skipDelay > progress) {
                            this.trigger('adskip-countdown', skipDelay - progress);
                        } else {
                            this.skipable = true;
                            this.trigger('adskip-countdown', 0);
                        }
                    }
                    if (this.linear && this.assetDuration > 0) {
                        events = [];
                        if (progress > 0) {
                            events.push("start");
                            percent = Math.round(progress / this.assetDuration * 100);
                            events.push("progress-" + percent + "%");
                            events.push("progress-" + (Math.round(progress)));
                            ref = this.quartiles;
                            for (quartile in ref) {
                                time = ref[quartile];
                                if ((time <= progress && progress <= (time + 1))) {
                                    events.push(quartile);
                                }
                            }
                        }
                        for (i = 0, len = events.length; i < len; i++) {
                            eventName = events[i];
                            if (eventName !== null)
                                this.track(eventName, true);
                        }
                        if (progress < this.progress) {
                            this.track("rewind");
                        }
                    }
                    this.progress = progress;
                    return progress;
                },

                setAdMuted: function(muted) {
                    if (this.muted !== muted) {
                        this.track(muted ? "mute" : "unmute");
                    }
                    this.muted = muted;
                    return muted;
                },

                setAdPaused: function(paused) {
                    if (this.paused !== paused) {
                        this.track(paused ? "pause" : "resume");
                    }
                    this.paused = paused;
                    return paused;
                },

                setAdFullscreen: function(fullscreen) {
                    if (this.fullscreen !== fullscreen) {
                        this.track(fullscreen ? "fullscreen" : "exitFullscreen");
                    }
                    this.fullscreen = fullscreen;
                    return fullscreen;
                },

                setAdExpand: function(expanded) {
                    if (this.expanded !== expanded) {
                        this.track(expanded ? "expand" : "collapse");
                    }
                    this.expanded = expanded;
                    return expanded;
                },

                setAdSkipDelay: function(duration) {
                    if (typeof duration === 'number') {
                        this.skipDelay = duration;
                        return duration;
                    }
                },

                loadAd: function() {
                    if (!this.impressed) {
                        this.impressed = true;
                        this.trackAdURLs(this.ad.impressionURLTemplates);
                        return this.track("creativeView");
                    }
                },

                errorAdWithCode: function(errorCode) {
                    return this.trackAdURLs(this.ad.errorURLTemplates, {
                        ERRORCODE: errorCode
                    });
                },

                errorAdWithCodeAndMessage: function(errorCode, errorMessage) {
                    return this.trackAdURLs(this.ad.errorURLTemplates, {
                        ERRORCODE: errorCode,
                        ERRORMESSAGE: errorMessage
                    });
                },

                completeAd: function() {
                    return this.track("complete");
                },

                closeAd: function() {
                    return this.track(this.linear ? "closeLinear" : "close");
                },

                stopAd: function() {},

                skipAd: function() {
                    this.track("skip");
                    this.trackingEvents = [];
                    return this.trackingEvents;
                },

                clickAd: function() {
                    var clickThroughURL, ref, variables;
                    if ((ref = this.clickTrackingURLTemplates) !== null ? ref.length : void 0) {
                        this.trackAdURLs(this.clickTrackingURLTemplates);
                    }
                    if (this.clickThroughURLTemplate !== null) {
                        if (this.linear) {
                            variables = {
                                CONTENTPLAYHEAD: this.adProgressFormated()
                            };
                        }
                        clickThroughURL = VASTAd.resolveURLTemplates([this.clickThroughURLTemplate], variables)[0];
                        return this.trigger("clickthrough", clickThroughURL);
                    }
                },

                track: function(eventName, once) {
                    var idx, trackingURLTemplates;
                    if (!once) {
                        once = false;
                    }
                    if (eventName === 'closeLinear' && ((!this.trackingEvents[eventName]) && (this.trackingEvents.close))) {
                        eventName = 'close';
                    }
                    trackingURLTemplates = this.trackingEvents[eventName];
                    idx = this.emitAlwaysEvents.indexOf(eventName);
                    if (trackingURLTemplates) {
                        this.trigger(eventName, '');
                        this.trackAdURLs(trackingURLTemplates);
                    } else if (idx !== -1) {
                        this.trigger(eventName, '');
                    }
                    if (once === true) {
                        delete this.trackingEvents[eventName];
                        delete this.trackingEvents[eventName];
                        if (idx > -1) {
                            this.emitAlwaysEvents.splice(idx, 1);
                        }
                    }
                },

                trackAdURLs: function(URLTemplates, variables) {
                    var _ref;
                    if (!variables) {
                        variables = {};
                    }
                    if (this.linear) {
                        if (((_ref = this.creative.mediaFiles[0]) !== null ? _ref.fileURL : void 0) !== null) {
                            variables.ASSETURI = this.creative.mediaFiles[0].fileURL;
                        }
                        variables.CONTENTPLAYHEAD = this.adProgressFormated();
                    }
                    return VASTAd.trackAd(URLTemplates, variables);
                },

                adProgressFormated: function() {
                    var h, m, ms, s, seconds;
                    seconds = parseInt(this.progress, 10);
                    h = seconds / (60 * 60);
                    if (h.length < 2) {
                        h = "0" + h;
                    }
                    m = seconds / 60 % 60;
                    if (m.length < 2) {
                        m = "0" + m;
                    }
                    s = seconds % 60;
                    if (s.length < 2) {
                        s = "0" + m;
                    }
                    ms = parseInt((this.progress - seconds) * 100, 10);
                    return h + ":" + m + ":" + s + "." + ms;
                }
            };
        }]);
    });
/**
 * This software may include modified and unmodified portions of:
 *
 * VAST Client
 *
 * Copyright (c) 2013 Olivier Poitrey <rs@dailymotion.com>
 *
 * Repository: https://github.com/dailymotion/vast-client-js
 *
 * MIT License: https://github.com/dailymotion/vast-client-js/blob/master/LICENSE
 *
 */

Scoped.define("module:Ads.VAST.VAST", [
        "base:Class",
        "module:Ads.VAST.Client",
        "module:Ads.VAST.Tracker",
        "module:Ads.VAST.Ad",
        "base:Objs",
        "base:Promise",
        "base:Events.EventsMixin",
        "base:Types"
    ],
    function(Class, VASTClient, VASTTracker, VASTAd, Objs, Promise, EventsMixin, Types, scoped) {
        return Class.extend({
            scoped: scoped
        }, [EventsMixin, function(inherited) {
            return {
                constructor: function(options, requestOptions) {
                    inherited.constructor.call(this);
                    options = Types.is_array(options) ? options : [options];
                    var vastClient, _promise, _self;
                    this.vastServerResponses = [];
                    this.timeout = 5000;
                    this.adPodTimeout = 100;
                    this.companion = undefined;
                    this.sources = [];
                    this.companion = {};

                    _self = this;
                    _promise = Promise.create();

                    vastClient = this.auto_destroy(new VASTClient(options));

                    Objs.iter(options, function(vast) {
                        if (vast.adServer) {
                            if (vast.skipAfter) {
                                _self.skipAdAfter = vast.skipAfter;
                            }
                            vastClient.getAd(vast.adServer, requestOptions, function(err, response) {
                                if (err) {
                                    var _errorMessage = 'Error occurred during loading provided link. ' + err;
                                    _promise.asyncError({
                                        message: _errorMessage
                                    });
                                } else {
                                    _self.vastServerResponses.push(response);
                                    _promise.asyncSuccess(_self.vastServerResponses);
                                }
                            });
                        } else {
                            _promise.asyncError({
                                message: 'Video Ad options are not correct, asServer are required'
                            });
                        }
                    }, this);

                    _promise.success(function(responses) {
                        this.executeAd(responses[0]);
                    }, this);

                    _promise.error(function(error) {
                        this.trigger("adresponseerror", error);
                    }, this);
                },

                executeAd: function(response) {
                    var _ad, _adIds, _crIds, _creative, _foundCreative, _foundCompanion, _self;
                    _self = this;
                    if (response)
                        for (_adIds = 0; _adIds < response.ads.length; _adIds++) {
                            _ad = response.ads[_adIds];
                            for (_crIds = 0; _crIds < _ad.creatives.length; _crIds++) {
                                _creative = _ad.creatives[_crIds];
                                _foundCreative = false;
                                _foundCompanion = false;

                                if (_creative.type === 'linear' && !_foundCreative) {
                                    if (_creative.skipDelay > 0)
                                        this.skipAdAfter = _creative.skipDelay;

                                    if (_creative.mediaFiles.length) {

                                        this.sources = this.createSourceObjects(_creative.mediaFiles);

                                        if (!this.sources.length) {
                                            _self.trigger("adcanceled");
                                            return;
                                        }

                                        this.vastTracker = new VASTTracker(_ad, _creative);
                                        _foundCreative = true;
                                    }
                                }

                                if (_creative.type === 'companion' && !_foundCompanion) {
                                    this.companion = _creative;
                                    _foundCompanion = true;
                                }
                            }
                            if (this.vastTracker) {
                                this.persistentTrigger("vastready");
                                break;
                            } else {
                                VASTAd.trackAd(_ad.errorURLTemplates, {
                                    ERRORCODE: 403
                                });
                            }
                        }

                    if (!this.vastTracker) {
                        this.persistentTrigger("adcanceled");
                    }
                },

                createSourceObjects: function(mediaFiles) {
                    var _sources, _mediaFile, _source;
                    _sources = [];
                    for (var i = 0, j = mediaFiles.length; i < j; i++) {
                        _mediaFile = mediaFiles[i];
                        _source = {
                            type: _mediaFile.mimeType,
                            src: _mediaFile.fileURL
                        };

                        if (this._canPlaySource(_source)) {
                            _sources[i] = ({
                                type: _mediaFile.mimeType,
                                src: _mediaFile.fileURL,
                                width: _mediaFile.width,
                                height: _mediaFile.height
                            });
                        }
                    }

                    return _sources;
                },

                _canPlaySource: function(source) {
                    var _ext, _mimeType, _allowedMimeTypes;
                    _allowedMimeTypes = [
                        "application/vnd.apple.mpegurl",
                        "video/3gpp",
                        "video/mp4",
                        "video/mpeg",
                        "video/ogg",
                        "video/quicktime",
                        "video/webm",
                        "video/x-m4v",
                        "video/ms-asf",
                        "video/x-ms-wmv",
                        "video/x-msvideo"
                    ];

                    if (source.type) {
                        _mimeType = source.type;
                    } else if (source.src) {
                        _ext = this._ext(source.src);
                        _mimeType = 'video/' + _ext;
                    } else {
                        return false;
                    }

                    return Objs.contains_value(_allowedMimeTypes, _mimeType);
                },

                _ext: function(url) {
                    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."));
                }

            };
        }]);
    }
);
Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "browser:Info"
], function(LocaleTable, Info) {

    var strings = new LocaleTable();
    strings.setWeakLocale(Info.language());

    return {

        strings: strings,

        playerthemes: {},

        recorderthemes: {}

    };
});
Scoped.define("module:VideoPlayer.Dynamics.Adplayer", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Timers",
    "browser:Dom",
    "media:Player.VideoPlayerWrapper",
    "module:Assets"
], function(Class, TimeFormat, Timers, Dom, VideoPlayerWrapper, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<video class=\"{{css}}-video\" data-video=\"video\"></video>\n<div class=\"{{css}}-ad-dashboard\">\n    <div class=\"{{css}}-ad-click-tracker\" ba-click=\"{{ad_clicked()}}\"></div>\n    <div class=\"{{css}}-skipbutton-container\" ba-click=\"{{skip_linear_ad()}}\"  ba-show=\"{{skipbuttonvisible}}\">\n        <p class=\"{{css}}-skipbutton\">{{lefttillskip > 0 ? string('can-skip-after').replace('%d', lefttillskip) : string('skip-ad')}}</p>\n    </div>\n\n    <div class=\"{{css}}-companion-ad-container\" ba-show=\"{{companionadvisible}}\">\n        <div class=\"{{css}}-close-companion-ad\" ba-click=\"{{skip_companion_ad()}}\">X</div>\n        <img class=\"{{css}}-companion-ad\" src=\"\"/>\n    </div>\n\n    <div class=\"{{css}}-ad-controlbar\">\n\n        <div class=\"{{css}}-ad-time-container\">\n            <div class=\"{{css}}-ad-time-value\" title=\"{{string('elapsed-time')}}\">{{string('ad-will-end-after').replace('%s', formatTime(adduration))}}</div>\n        </div>\n\n        <div class=\"{{css}}-ad-volumebar\">\n            <div data-selector=\"button-volume-bar\" class=\"{{css}}-ad-volumebar-inner\"\n                 onmousedown=\"{{startUpdateAdVolume(domEvent)}}\"\n                 onmouseup=\"{{stopUpdateAdVolume(domEvent)}}\"\n                 onmouseleave=\"{{stopUpdateAdVolume(domEvent)}}\"\n                 onmousemove=\"{{progressUpdateAdVolume(domEvent)}}\">\n                <div class=\"{{css}}-ad-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(advolume * 100)) + '%'}}}\">\n                    <div class=\"{{css}}-ad-volumebar-button\" title=\"{{string('volume-button')}}\"></div>\n                </div>\n            </div>\n        </div>\n\n        <div data-selector=\"button-icon-volume\" class=\"{{css}}-ad-rightbutton-container\" ba-click=\"{{toggle_ad_volume()}}\" title=\"{{string(advolume > 0 ? 'volume-mute' : 'volume-unmute')}}\">\n            <div class=\"{{css}}-ad-button-inner\">\n                <i class=\"{{css + '-icon-volume-' + (advolume >= 0.5 ? 'up' : (advolume > 0 ? 'down' : 'off')) }}\"></i>\n            </div>\n        </div>\n\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-adplayer",
                    "lefttillskip": -1,
                    "adduration": 0,
                    "duration": 0,
                    "advolume": 1.0,
                    "adplaying": false,
                    "companionadvisible": false,
                    "skipbuttonvisible": false,
                    "canskip": false,
                    "adskiped": false,
                    "disablepause": false
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdateAdVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateAdVolume", true);
                        this.call("progressUpdateAdVolume", event);
                    },

                    progressUpdateAdVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateAdVolume"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("advolume", (clientX - offset.left) / (dimensions.width || 1));
                        this.trigger("advolume", this.get("advolume"));
                    },

                    stopUpdateAdVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },

                    play_ad: function() {
                        this.trigger("playad");
                    },

                    pause_ad: function() {
                        this.trigger("pausead");
                        this._pauseLinearAd();
                    },

                    toggle_ad_volume: function() {
                        if (this.get("advolume") > 0) {
                            this.__oldVolume = this.get("advolume");
                            this.set("advolume", 0);
                        } else
                            this.set("advolume", this.__oldVolume || 1);
                        this.trigger("advolume", this.get("advolume"));
                    },

                    skip_linear_ad: function() {
                        if (!this.get("canskip") && this._vast)
                            return;
                        this.set("adskiped", true);
                        this._vast.trigger("resumeplayer");
                    },

                    skip_companion_ad: function() {},

                    ad_clicked: function() {
                        if (this._vast.vastTracker) {
                            this._vast.vastTracker.clickAd();
                        }
                    }
                },

                create: function() {
                    this._vast.once("vastready", function() {
                        this._adBehaviour();
                    }, this);
                    this._vast.once("adcanceled", function() {
                        this._preroll._adSkipped();
                    }, this);
                },

                _adBehaviour: function() {
                    var _adElementHolder, _source, _duration, _volume;

                    _adElementHolder = this.activeElement().querySelector("video");
                    _duration = this._vast.vastTracker.assetDuration;
                    _source = this._vast.sources[0];

                    if (this._vast.skipAdAfter && this._vast.skipAdAfter > 0) {
                        this.set("skipbuttonvisible", true);
                        this.set("lefttillskip", this._vast.skipAdAfter);
                    }

                    this._attachLinearAd(_adElementHolder, _source, _duration);

                    this._vast.on("resumeplayer", function() {

                        this._stopLinearAd();

                        this._timer.weakDestroy();

                        if (this.get("adskiped")) {
                            this._vast.vastTracker.skipAd();
                            this._preroll._adSkipped();
                        } else {
                            this._vast.vastTracker.completeAd();
                            this._preroll._adFinished();
                        }

                    }, this);

                    this.on("pausead", function() {
                        if (!this._timer || !this.__adPlayer)
                            return;
                        this._timer.stop();
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                    });

                    this.on("playad", function() {
                        if (!this._timer || !this.__adPlayer)
                            return;
                        this._timer.start();
                        this.__adPlayer.play();
                        this.set("adplaying", true);
                    });

                    this.on("advolume", function() {
                        if (!this.__adPlayer)
                            return;
                        _volume = Math.min(1.0, this.get("advolume"));
                        this.__adPlayer.setVolume(_volume);
                        this.__adPlayer.setMuted(_volume <= 0.0);
                    });
                },

                _attachLinearAd: function(element, source, duration) {
                    VideoPlayerWrapper.create({
                        element: element,
                        source: source.src,
                        type: source.type
                    }).error(function(err) {
                        // trigger error related to loading video content
                        this._vast.trigger("resumeplayer");
                    }, this).success(function(instance) {
                        this.__adPlayer = instance;
                        duration = isNaN(duration) ? this.get("maxadduration") : duration;
                        this.set("adduration", duration);


                        this._playLinearAd();
                        this._timer = new Timers.Timer({
                            context: this,
                            fire: this._timerFire,
                            delay: 1000,
                            start: true
                        });
                    }, this);
                },

                _timerFire: function() {
                    var _timeLeft, _leftTillSkip;
                    _timeLeft = this.get("adduration");
                    _leftTillSkip = this.get("lefttillskip") || -1;

                    this.set("adduration", --_timeLeft);

                    if (_leftTillSkip >= 0) {
                        this.set("skipbuttonvisible", true);
                        this.set("lefttillskip", --_leftTillSkip);

                        if (_leftTillSkip === 0)
                            this.set("canskip", true);
                    }

                    this._vast.vastTracker.setAdProgress(_timeLeft);

                    if (this.get("adduration") === 0) {
                        this._vast.trigger("resumeplayer");
                    }
                },

                _playLinearAd: function() {
                    this.__adPlayer.play();
                    this.set("adplaying", true);
                    this._vast.trigger("adplaying");
                },

                _pauseLinearAd: function() {
                    if (!this.get("adplaying")) {
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                        this._vast.vastTracker.setAdPaused(true);
                        this._vast.trigger("adpaused");
                        this._vast.once("playad", function() {
                            this._vast.vastTracker.setAdPaused(false);
                        }, this);
                    }
                },

                _stopLinearAd: function() {
                    if (this.__adPlayer && this.get("adplaying")) {
                        this.__adPlayer.pause();
                        this.set("adplaying", false);
                    }
                },

                skip_ad: function() {
                    if (this.__adPlayer)
                        this.trigger("resumeplayer");
                }
            };
        })
        .register("ba-videoplayer-adslot")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "ad_clicked()": function (obj) { with (obj) { return ad_clicked(); } }, "skip_linear_ad()": function (obj) { with (obj) { return skip_linear_ad(); } }, "skipbuttonvisible": function (obj) { with (obj) { return skipbuttonvisible; } }, "lefttillskip > 0 ? string('can-skip-after').replace('%d', lefttillskip) : string('skip-ad')": function (obj) { with (obj) { return lefttillskip > 0 ? string('can-skip-after').replace('%d', lefttillskip) : string('skip-ad'); } }, "companionadvisible": function (obj) { with (obj) { return companionadvisible; } }, "skip_companion_ad()": function (obj) { with (obj) { return skip_companion_ad(); } }, "string('elapsed-time')": function (obj) { with (obj) { return string('elapsed-time'); } }, "string('ad-will-end-after').replace('%s', formatTime(adduration))": function (obj) { with (obj) { return string('ad-will-end-after').replace('%s', formatTime(adduration)); } }, "startUpdateAdVolume(domEvent)": function (obj) { with (obj) { return startUpdateAdVolume(domEvent); } }, "stopUpdateAdVolume(domEvent)": function (obj) { with (obj) { return stopUpdateAdVolume(domEvent); } }, "progressUpdateAdVolume(domEvent)": function (obj) { with (obj) { return progressUpdateAdVolume(domEvent); } }, "{width: Math.min(100, Math.round(advolume * 100)) + '%'}": function (obj) { with (obj) { return {width: Math.min(100, Math.round(advolume * 100)) + '%'}; } }, "string('volume-button')": function (obj) { with (obj) { return string('volume-button'); } }, "toggle_ad_volume()": function (obj) { with (obj) { return toggle_ad_volume(); } }, "string(advolume > 0 ? 'volume-mute' : 'volume-unmute')": function (obj) { with (obj) { return string(advolume > 0 ? 'volume-mute' : 'volume-unmute'); } }, "css + '-icon-volume-' + (advolume >= 0.5 ? 'up' : (advolume > 0 ? 'down' : 'off'))": function (obj) { with (obj) { return css + '-icon-volume-' + (advolume >= 0.5 ? 'up' : (advolume > 0 ? 'down' : 'off')); } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "elapsed-time": "Elasped time",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound",
            "ad-will-end-after": "Ad will end after %s",
            "can-skip-after": "Skip after %d",
            "skip-ad": "Skip ad"
        });
});
Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "base:TimeFormat",
    "base:Comparators",
    "browser:Dom",
    "module:Assets",
    "browser:Info",
    "media:Player.Support"
], [
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function(Class, TimeFormat, Comparators, Dom, Assets, Info, PlayerSupport, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-dashboard {{activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''}}\">\n\t<div data-selector=\"progress-bar-inner\" class=\"{{css}}-progressbar {{activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')}} {{disableseeking ? css + '-disabled' : ''}}\"\n\t     onmousedown=\"{{startUpdatePosition(domEvent)}}\"\n\t     onmouseup=\"{{stopUpdatePosition(domEvent)}}\"\n\t     onmouseleave=\"{{stopUpdatePosition(domEvent)}}\"\n\t     onmousemove=\"{{progressUpdatePosition(domEvent)}}\">\n\t\t<div class=\"{{css}}-progressbar-cache\" ba-styles=\"{{{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}}}\"></div>\n\t\t<div class=\"{{css}}-progressbar-position\" ba-styles=\"{{{width: Math.round(duration ? position / duration * 100 : 0) + '%'}}}\" title=\"{{string('video-progress')}}\">\n\t\t\t<div class=\"{{css}}-progressbar-button\"></div>\n\t\t</div>\n\t</div>\n\t<div class=\"{{css}}-backbar\"></div>\n\t<div class=\"{{css}}-controlbar\">\n        <div data-selector=\"submit-video-button\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{submittable}}\"  ba-click=\"{{submit()}}\">\n            <div class=\"{{css}}-button-inner\">\n                {{string('submit-video')}}\n            </div>\n        </div>\n        <div data-selector=\"button-icon-ccw\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{rerecordable}}\"  ba-click=\"{{rerecord()}}\" title=\"{{string('rerecord-video')}}\">\n            <div class=\"{{css}}-button-inner\">\n                <i class=\"{{css}}-icon-ccw\"></i>\n            </div>\n        </div>\n\t\t<div data-selector=\"button-icon-play\" class=\"{{css}}-leftbutton-container\" ba-if=\"{{!playing}}\" ba-click=\"{{play()}}\" title=\"{{string('play-video')}}\">\n\t\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t\t<i class=\"{{css}}-icon-play\"></i>\n\t\t\t</div>\n\t\t</div>\n\t\t<div data-selector=\"button-icon-pause\" class=\"{{css}}-leftbutton-container {{disablepause ? css + '-disabled' : ''}}\"\n\t\t\t ba-if=\"{{playing}}\" ba-click=\"{{pause()}}\" title=\"{{disablepause ? string('pause-video-disabled') : string('pause-video')}}\">\n            <div class=\"{{css}}-button-inner\">\n                <i class=\"{{css}}-icon-pause\"></i>\n            </div>\n\t\t</div>\n\t\t<div class=\"{{css}}-time-container\">\n\t\t\t<div class=\"{{css}}-time-value\" title=\"{{string('elapsed-time')}}\">{{formatTime(position)}}</div>\n\t\t\t<div class=\"{{css}}-time-sep\">/</div>\n\t\t\t<div class=\"{{css}}-time-value\" title=\"{{string('total-time')}}\">{{formatTime(duration || position)}}</div>\n\t\t</div>\n\n\t\t<div data-selector=\"video-title-block\" class=\"{{css}}-video-title-container\" ba-if=\"{{title}}\">\n\t\t\t<p class=\"{{css}}-video-title\">\n\t\t\t\t{{title}}\n\t\t\t</p>\n\t\t</div>\n\n\t\t<div data-selector=\"button-icon-resize-full\" class=\"{{css}}-rightbutton-container\"\n\t\t\t ba-if=\"{{fullscreen}}\" ba-click=\"{{toggle_fullscreen()}}\" title=\"{{ fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video') }}\">\n\t\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t\t<i class=\"{{css}}-icon-resize-{{fullscreened ? 'small' : 'full'}}\"></i>\n\t\t\t</div>\n\t\t</div>\n\n        <div data-selector=\"button-airplay\" class=\"{{css}}-rightbutton-container\" ba-show=\"{{airplaybuttonvisible}}\" ba-click=\"{{show_airplay_devices()}}\">\n            <div class=\"{{css}}-airplay-container\">\n                <svg width=\"16px\" height=\"11px\" viewBox=\"0 0 16 11\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                    <!-- Generator: Sketch 3.3.2 (12043) - http://www.bohemiancoding.com/sketch -->\n                    <title>Airplay</title>\n                    <desc>Airplay icon.</desc>\n                    <defs></defs>\n                    <g stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n                        <path d=\"M4,11 L12,11 L8,7 L4,11 Z M14.5454545,0 L1.45454545,0 C0.654545455,0 0,0.5625 0,1.25 L0,8.75 C0,9.4375 0.654545455,10 1.45454545,10 L4.36363636,10 L4.36363636,8.75 L1.45454545,8.75 L1.45454545,1.25 L14.5454545,1.25 L14.5454545,8.75 L11.6363636,8.75 L11.6363636,10 L14.5454545,10 C15.3454545,10 16,9.4375 16,8.75 L16,1.25 C16,0.5625 15.3454545,0 14.5454545,0 L14.5454545,0 Z\" sketch:type=\"MSShapeGroup\"></path>\n                    </g>\n                </svg>\n            </div>\n        </div>\n\n        <div data-selector=\"button-chromecast\" class=\"{{css}}-rightbutton-container {{css}}-cast-button-container\" ba-show=\"{{castbuttonvisble}}\">\n            <button class=\"{{css}}-gcast-button\" is=\"google-cast-button\"></button>\n        </div>\n\n        <div data-selector=\"button-stream-label\" class=\"{{css}}-rightbutton-container\" ba-if=\"{{streams.length > 1 && currentstream}}\" ba-click=\"{{toggle_stream()}}\" title=\"{{string('change-resolution')}}\">\n\t\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t\t<span class=\"{{css}}-button-text\">{{currentstream_label}}</span>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"{{css}}-volumebar\">\n\t\t\t<div data-selector=\"button-volume-bar\" class=\"{{css}}-volumebar-inner\"\n\t\t\t     onmousedown=\"{{startUpdateVolume(domEvent)}}\"\n                 onmouseup=\"{{stopUpdateVolume(domEvent)}}\"\n                 onmouseleave=\"{{stopUpdateVolume(domEvent)}}\"\n                 onmousemove=\"{{progressUpdateVolume(domEvent)}}\">\n\t\t\t\t<div class=\"{{css}}-volumebar-position\" ba-styles=\"{{{width: Math.min(100, Math.round(volume * 100)) + '%'}}}\">\n\t\t\t\t    <div class=\"{{css}}-volumebar-button\" title=\"{{string('volume-button')}}\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div data-selector=\"button-icon-volume\" class=\"{{css}}-rightbutton-container\" ba-click=\"{{toggle_volume()}}\" title=\"{{string(volume > 0 ? 'volume-mute' : 'volume-unmute')}}\">\n\t\t\t<div class=\"{{css}}-button-inner\">\n\t\t\t\t<i class=\"{{css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')) }}\"></i>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n",

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
                    "fullscreened": false,
                    "activitydelta": 0,
                    "title": ""
                },

                computed: {
                    "currentstream_label:currentstream": function() {
                        var cs = this.get("currentstream");
                        return cs ? (cs.label ? cs.label : PlayerSupport.resolutionToLabel(cs.width, cs.height)) : "";
                    }
                },

                functions: {

                    formatTime: function(time) {
                        time = Math.max(time || 0, 1);
                        return TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, time * 1000);
                    },

                    startUpdatePosition: function(event) {
                        if (this.get("disableseeking")) return;
                        event[0].preventDefault();
                        this.set("_updatePosition", true);
                        this.call("progressUpdatePosition", event);
                    },

                    progressUpdatePosition: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updatePosition"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("position", this.get("duration") * (clientX - offset.left) / (dimensions.width || 1));

                        var player = this.__parent.player;
                        if (player._broadcastingState.googleCastConnected) {
                            player.trigger('google-cast-seeking', this.get("position"));
                            return;
                        }

                        this.trigger("position", this.get("position"));
                    },

                    stopUpdatePosition: function(event) {
                        event[0].preventDefault();
                        this.set("_updatePosition", false);
                    },

                    startUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", true);
                        this.call("progressUpdateVolume", event);
                    },

                    progressUpdateVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateVolume"))
                            return;
                        var clientX = ev.clientX;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("volume", (clientX - offset.left) / (dimensions.width || 1));
                        this.trigger("volume", this.get("volume"));
                    },

                    stopUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },

                    startVerticallyUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", true);
                        this.call("progressVerticallyUpdateVolume", event);
                    },

                    progressVerticallyUpdateVolume: function(event) {
                        var ev = event[0];
                        ev.preventDefault();
                        if (!this.get("_updateVolume"))
                            return;
                        var pageY = ev.pageY;
                        var target = ev.currentTarget;
                        var offset = Dom.elementOffset(target);
                        var dimensions = Dom.elementDimensions(target);
                        this.set("volume", 1 - (pageY - offset.top) / dimensions.height);
                        this.trigger("volume", this.get("volume"));
                    },

                    stopVerticallyUpdateVolume: function(event) {
                        event[0].preventDefault();
                        this.set("_updateVolume", false);
                    },


                    play: function() {
                        this.trigger("play");
                    },

                    pause: function() {
                        this.trigger("pause");
                    },

                    toggle_volume: function() {
                        if (this.get("volume") > 0) {
                            this.__oldVolume = this.get("volume");
                            this.set("volume", 0);
                        } else
                            this.set("volume", this.__oldVolume || 1);
                        this.trigger("volume", this.get("volume"));
                    },

                    toggle_fullscreen: function() {
                        this.trigger("fullscreen");
                    },

                    rerecord: function() {
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                        this.trigger("submit");
                    },

                    toggle_stream: function() {
                        var streams = this.get("streams");
                        var current = streams.length - 1;
                        streams.forEach(function(stream, i) {
                            if (Comparators.deepEqual(stream, this.get("currentstream")))
                                current = i;
                        }, this);
                        this.set("currentstream", streams[(current + 1) % streams.length]);
                    },

                    show_airplay_devices: function() {
                        var dynamic = this.__parent;
                        if (dynamic.player._broadcastingState.airplayConnected) {
                            dynamic._broadcasting.lookForAirplayDevices(dynamic.player._element);
                        }
                    }

                },

                create: function() {
                    this.set("ismobile", Info.isMobile());
                }

            };
        })
        .register("ba-videoplayer-controlbar")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''": function (obj) { with (obj) { return activitydelta > 5000 && hideoninactivity ? (css + '-dashboard-hidden') : ''; } }, "activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small')": function (obj) { with (obj) { return activitydelta < 2500 || ismobile ? '' : (css + '-progressbar-small'); } }, "disableseeking ? css + '-disabled' : ''": function (obj) { with (obj) { return disableseeking ? css + '-disabled' : ''; } }, "startUpdatePosition(domEvent)": function (obj) { with (obj) { return startUpdatePosition(domEvent); } }, "stopUpdatePosition(domEvent)": function (obj) { with (obj) { return stopUpdatePosition(domEvent); } }, "progressUpdatePosition(domEvent)": function (obj) { with (obj) { return progressUpdatePosition(domEvent); } }, "{width: Math.round(duration ? cached / duration * 100 : 0) + '%'}": function (obj) { with (obj) { return {width: Math.round(duration ? cached / duration * 100 : 0) + '%'}; } }, "{width: Math.round(duration ? position / duration * 100 : 0) + '%'}": function (obj) { with (obj) { return {width: Math.round(duration ? position / duration * 100 : 0) + '%'}; } }, "string('video-progress')": function (obj) { with (obj) { return string('video-progress'); } }, "submittable": function (obj) { with (obj) { return submittable; } }, "submit()": function (obj) { with (obj) { return submit(); } }, "string('submit-video')": function (obj) { with (obj) { return string('submit-video'); } }, "rerecordable": function (obj) { with (obj) { return rerecordable; } }, "rerecord()": function (obj) { with (obj) { return rerecord(); } }, "string('rerecord-video')": function (obj) { with (obj) { return string('rerecord-video'); } }, "!playing": function (obj) { with (obj) { return !playing; } }, "play()": function (obj) { with (obj) { return play(); } }, "string('play-video')": function (obj) { with (obj) { return string('play-video'); } }, "disablepause ? css + '-disabled' : ''": function (obj) { with (obj) { return disablepause ? css + '-disabled' : ''; } }, "playing": function (obj) { with (obj) { return playing; } }, "pause()": function (obj) { with (obj) { return pause(); } }, "disablepause ? string('pause-video-disabled') : string('pause-video')": function (obj) { with (obj) { return disablepause ? string('pause-video-disabled') : string('pause-video'); } }, "string('elapsed-time')": function (obj) { with (obj) { return string('elapsed-time'); } }, "formatTime(position)": function (obj) { with (obj) { return formatTime(position); } }, "string('total-time')": function (obj) { with (obj) { return string('total-time'); } }, "formatTime(duration || position)": function (obj) { with (obj) { return formatTime(duration || position); } }, "title": function (obj) { with (obj) { return title; } }, "fullscreen": function (obj) { with (obj) { return fullscreen; } }, "toggle_fullscreen()": function (obj) { with (obj) { return toggle_fullscreen(); } }, "fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video')": function (obj) { with (obj) { return fullscreened ? string('exit-fullscreen-video') : string('fullscreen-video'); } }, "fullscreened ? 'small' : 'full'": function (obj) { with (obj) { return fullscreened ? 'small' : 'full'; } }, "airplaybuttonvisible": function (obj) { with (obj) { return airplaybuttonvisible; } }, "show_airplay_devices()": function (obj) { with (obj) { return show_airplay_devices(); } }, "castbuttonvisble": function (obj) { with (obj) { return castbuttonvisble; } }, "streams.length > 1 && currentstream": function (obj) { with (obj) { return streams.length > 1 && currentstream; } }, "toggle_stream()": function (obj) { with (obj) { return toggle_stream(); } }, "string('change-resolution')": function (obj) { with (obj) { return string('change-resolution'); } }, "currentstream_label": function (obj) { with (obj) { return currentstream_label; } }, "startUpdateVolume(domEvent)": function (obj) { with (obj) { return startUpdateVolume(domEvent); } }, "stopUpdateVolume(domEvent)": function (obj) { with (obj) { return stopUpdateVolume(domEvent); } }, "progressUpdateVolume(domEvent)": function (obj) { with (obj) { return progressUpdateVolume(domEvent); } }, "{width: Math.min(100, Math.round(volume * 100)) + '%'}": function (obj) { with (obj) { return {width: Math.min(100, Math.round(volume * 100)) + '%'}; } }, "string('volume-button')": function (obj) { with (obj) { return string('volume-button'); } }, "toggle_volume()": function (obj) { with (obj) { return toggle_volume(); } }, "string(volume > 0 ? 'volume-mute' : 'volume-unmute')": function (obj) { with (obj) { return string(volume > 0 ? 'volume-mute' : 'volume-unmute'); } }, "css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off'))": function (obj) { with (obj) { return css + '-icon-volume-' + (volume >= 0.5 ? 'up' : (volume > 0 ? 'down' : 'off')); } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "video-progress": "Progress",
            "rerecord-video": "Redo?",
            "submit-video": "Confirm",
            "play-video": "Play",
            "pause-video": "Pause",
            "pause-video-disabled": "Pause not supported",
            "elapsed-time": "Elasped time",
            "total-time": "Total length of",
            "fullscreen-video": "Enter fullscreen",
            "volume-button": "Set volume",
            "volume-mute": "Mute sound",
            "volume-unmute": "Unmute sound",
            "change-resolution": "Change resolution",
            "exit-fullscreen-video": "Exit fullscreen"
        });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-loader-container\">\n    <div data-selector=\"loader-block\" class=\"{{css}}-loader-loader\" title=\"{{string('tooltip')}}\">\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-videoplayer"
                }

            };
        })
        .register("ba-videoplayer-loader")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "string('tooltip')": function (obj) { with (obj) { return string('tooltip'); } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Loading..."
        });
});
Scoped.define("module:VideoPlayer.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-message-container\" ba-click=\"{{click()}}\">\n    <div data-selector=\"message-block\" class='{{css}}-message-message'>\n        {{message}}\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-videoplayer",
                    "message": ''
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    }

                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "click()": function (obj) { with (obj) { return click(); } }, "message": function (obj) { with (obj) { return message; } }/**/ })
        .register("ba-videoplayer-message");
});
Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div data-selector=\"play-button\" class=\"{{css}}-playbutton-container\" ba-click=\"{{play()}}\" title=\"{{string('tooltip')}}\">\n\t<div class=\"{{css}}-playbutton-button\"></div>\n</div>\n\n<div class=\"{{css}}-rerecord-bar\" ba-if=\"{{rerecordable || submittable}}\">\n\t<div class=\"{{css}}-rerecord-backbar\"></div>\n\t<div class=\"{{css}}-rerecord-frontbar\">\n        <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{submittable}}\">\n            <div data-selector=\"player-submit-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{submit()}}\">\n                {{string('submit-video')}}\n            </div>\n        </div>\n        <div class=\"{{css}}-rerecord-button-container\" ba-if=\"{{rerecordable}}\">\n        \t<div data-selector=\"player-rerecord-button\" class=\"{{css}}-rerecord-button\" onclick=\"{{rerecord()}}\">\n        \t\t{{string('rerecord')}}\n        \t</div>\n        </div>\n\t</div>\n</div>\n",

                attrs: {
                    "css": "ba-videoplayer",
                    "rerecordable": false,
                    "submittable": false
                },

                functions: {

                    play: function() {
                        this.trigger("play");
                    },

                    submit: function() {
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                        this.trigger("submit");
                    },

                    rerecord: function() {
                        this.trigger("rerecord");
                    }

                }

            };
        })
        .register("ba-videoplayer-playbutton")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "play()": function (obj) { with (obj) { return play(); } }, "string('tooltip')": function (obj) { with (obj) { return string('tooltip'); } }, "rerecordable || submittable": function (obj) { with (obj) { return rerecordable || submittable; } }, "submittable": function (obj) { with (obj) { return submittable; } }, "submit()": function (obj) { with (obj) { return submit(); } }, "string('submit-video')": function (obj) { with (obj) { return string('submit-video'); } }, "rerecordable": function (obj) { with (obj) { return rerecordable; } }, "rerecord()": function (obj) { with (obj) { return rerecord(); } }, "string('rerecord')": function (obj) { with (obj) { return string('rerecord'); } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "tooltip": "Click to play.",
            "rerecord": "Redo",
            "submit-video": "Confirm video"
        });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
    "media:Player.VideoPlayerWrapper",
    "media:Player.Broadcasting",
    "base:Types",
    "base:Objs",
    "base:Strings",
    "base:Time",
    "base:Timers",
    "base:States.Host",
    "base:Classes.ClassRegistry",
    "module:VideoPlayer.Dynamics.PlayerStates.Initial",
    "module:VideoPlayer.Dynamics.PlayerStates",
    "module:Ads.AbstractVideoAdProvider",
    "browser:Events"
], [
    "module:VideoPlayer.Dynamics.Playbutton",
    "module:VideoPlayer.Dynamics.Message",
    "module:VideoPlayer.Dynamics.Loader",
    "module:VideoPlayer.Dynamics.Share",
    "module:VideoPlayer.Dynamics.Controlbar",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.TogglePartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial"
], function(Class, Assets, Info, Dom, VideoPlayerWrapper, Broadcasting, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, InitialState, PlayerStates, AdProvider, DomEvents, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<div itemscope itemtype=\"http://schema.org/VideoObject\"\n    class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}} {{css}}-{{ fullscreened ? 'fullscreen' : 'normal' }}-view {{css}}-{{ firefox ? 'firefox' : 'common'}}-browser\n    {{css}}-{{themecolor}}-color\"\n    ba-on:mousemove=\"{{user_activity()}}\"\n    ba-on:mousedown=\"{{user_activity(true)}}\"\n    ba-on:touchstart=\"{{user_activity(true)}}\"\n\tba-styles=\"{{widthHeightStyles}}\"\n>\n    <video class=\"{{css}}-video\" data-video=\"video\" ba-toggle:playsinline=\"{{!playfullscreenonmobile}}\"></video>\n    <div class=\"{{css}}-overlay\">\n\t\t<div class=\"{{css}}-player-toggle-overlay\" ba-on:click=\"{{toggle_player()}}\"></div>\n\t    <ba-{{dyncontrolbar}}\n\t\t    ba-css=\"{{csscontrolbar || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplcontrolbar}}\"\n\t\t    ba-show=\"{{controlbar_active}}\"\n\t\t    ba-playing=\"{{playing}}\"\n\t\t\tba-playwhenvisible=\"{{playwhenvisible}}\"\n            ba-airplay=\"{{airplay}}\"\n\t\t\tba-airplaybuttonvisible=\"{{airplaybuttonvisible}}\"\n            ba-chromecast=\"{{chromecast}}\"\n            ba-castbuttonvisble=\"{{castbuttonvisble}}\"\n\t\t    ba-event:rerecord=\"rerecord\"\n\t\t    ba-event:submit=\"submit\"\n\t\t    ba-event:play=\"play\"\n\t\t    ba-event:pause=\"pause\"\n\t\t    ba-event:position=\"seek\"\n\t\t    ba-event:volume=\"set_volume\"\n\t\t    ba-event:fullscreen=\"toggle_fullscreen\"\n\t\t    ba-volume=\"{{volume}}\"\n\t\t    ba-duration=\"{{duration}}\"\n\t\t    ba-cached=\"{{buffered}}\"\n\t\t    ba-title=\"{{title}}\"\n\t\t    ba-position=\"{{position}}\"\n\t\t    ba-activitydelta=\"{{activity_delta}}\"\n\t\t    ba-hideoninactivity=\"{{hideoninactivity}}\"\n\t\t    ba-rerecordable=\"{{rerecordable}}\"\n\t\t    ba-submittable=\"{{submittable}}\"\n\t\t    ba-streams=\"{{streams}}\"\n\t\t    ba-currentstream=\"{{=currentstream}}\"\n\t\t    ba-fullscreen=\"{{fullscreensupport && !nofullscreen}}\"\n            ba-fullscreened=\"{{fullscreened}}\"\n            ba-source=\"{{source}}\"\n\t\t\tba-disablepause=\"{{disablepause}}\"\n\t\t\tba-disableseeking=\"{{disableseeking}}\"\n\t\t></ba-{{dyncontrolbar}}>\n\t\t\n\t\t<ba-{{dynplaybutton}}\n\t\t    ba-css=\"{{cssplaybutton || css}}\"\n\t\t\tba-theme-color=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplplaybutton}}\"\n\t\t    ba-show=\"{{playbutton_active}}\"\n\t\t    ba-rerecordable=\"{{rerecordable}}\"\n\t\t    ba-submittable=\"{{submittable}}\"\n\t\t    ba-event:play=\"playbutton_click\"\n\t\t    ba-event:rerecord=\"rerecord\"\n\t\t    ba-event:submit=\"submit\"\n\t\t></ba-{{dynplaybutton}}>\n\t\t\n\t\t<ba-{{dynloader}}\n\t\t    ba-css=\"{{cssloader || css}}\"\n\t\t\tba-theme-color=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplloader}}\"\n\t\t\tba-playwhenvisible=\"{{playwhenvisible}}\"\n\t\t    ba-show=\"{{loader_active}}\"\n\t\t></ba-{{dynloader}}>\n\n\t\t<ba-{{dynshare}}\n\t\t\tba-css=\"{{cssshare || css}}\"\n\t\t\tba-theme-color=\"{{themecolor}}\"\n\t\t\tba-template=\"{{tmplshare}}\"\n        \tba-show=\"{{sharevideourl && sharevideo.length > 0}}\"\n\t\t\tba-url=\"{{sharevideourl}}\"\n\t\t\tba-shares=\"{{sharevideo}}\"\n\t\t></ba-{{dynshare}}>\n\t\t\n\t\t<ba-{{dynmessage}}\n\t\t    ba-css=\"{{cssmessage || css}}\"\n\t\t\tba-theme-color=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplmessage}}\"\n\t\t    ba-show=\"{{message_active}}\"\n\t\t    ba-message=\"{{message}}\"\n\t\t    ba-event:click=\"message_click\"\n\t\t></ba-{{dynmessage}}>\n\n\t\t<ba-{{dyntopmessage}}\n\t\t    ba-css=\"{{csstopmessage || css}}\"\n\t\t\tba-theme-color=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmpltopmessage}}\"\n\t\t    ba-show=\"{{topmessage}}\"\n\t\t    ba-topmessage=\"{{topmessage}}\"\n\t\t></ba-{{dyntopmessage}}>\n\t\t\n\t\t<meta itemprop=\"caption\" content=\"{{title}}\" />\n\t\t<meta itemprop=\"thumbnailUrl\" content=\"{{poster}}\"/>\n\t\t<meta itemprop=\"contentUrl\" content=\"{{source}}\"/>\n    </div>\n\t<div class=\"{{css}}-overlay\" data-video=\"ad\" style=\"display:none\"></div>\n</div>\n",

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
                    "themecolor": "",
                    /* Dynamics */
                    "dynplaybutton": "videoplayer-playbutton",
                    "dynloader": "videoplayer-loader",
                    "dynmessage": "videoplayer-message",
                    "dyntopmessage": "videoplayer-topmessage",
                    "dyncontrolbar": "videoplayer-controlbar",
                    "dynshare": "videoplayer-share",
                    /* Templates */
                    "tmplplaybutton": "",
                    "tmplloader": "",
                    "tmplmessage": "",
                    "tmplshare": "",
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
                    "title": "",
                    "initialseek": null,
                    "fullscreened": false,
                    "sharevideo": [],
                    "sharevideourl": "",
                    "visibilityfraction": 0.8,

                    /* Configuration */
                    "forceflash": false,
                    "noflash": false,
                    "reloadonplay": false,
                    "playonclick": true,
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
                    "playfullscreenonmobile": false,
                    "ready": true,
                    "stretch": false,
                    "volumeafterinteraction": false,
                    "hideoninactivity": true,
                    "skipinitial": false,
                    "topmessage": "",
                    "totalduration": null,
                    "playwhenvisible": false,
                    "playedonce": false,
                    "manuallypaused": false,
                    "disablepause": false,
                    "disableseeking": false,
                    "airplay": false,
                    "airplaybuttonvisible": false,
                    "airplaydevicesavailable": false,
                    "chromecast": false,
                    "castbuttonvisble": false,

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
                    "volume": "float",
                    "initialseek": "float",
                    "fullscreened": "boolean",
                    "sharevideo": "array",
                    "sharevideourl": "string",
                    "playfullscreenonmobile": "boolean",
                    "themecolor": "string",
                    "totalduration": "float",
                    "playwhenvisible": "boolean",
                    "playedonce": "boolean",
                    "manuallypaused": "boolean",
                    "disablepause": "boolean",
                    "disableseeking": "boolean",
                    "playonclick": "boolean",
                    "airplay": "boolean",
                    "airplaybuttonvisible": "boolean",
                    "chromecast": "boolean",
                    "castbuttonvisble": "boolean"
                },

                extendables: ["states"],

                computed: {
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
                        return result;
                    },
                    "buffering:buffered,position,last_position_change_delta,playing": function() {
                        return this.get("playing") && this.get("buffered") < this.get("position") && this.get("last_position_change_delta") > 1000;
                    }
                },

                remove_on_destroy: true,

                create: function() {
                    if (Info.isMobile() && (this.get("autoplay") || this.get("playwhenvisible"))) {
                        this.set("volume", 0.0);
                        this.set("volumeafterinteraction", true);
                        if (!(Info.isiOS() && Info.iOSversion().major >= 10)) {
                            this.set("autoplay", false);
                            this.set("loop", false);
                        }
                    }

                    if (this.get("theme") in Assets.playerthemes) {
                        Objs.iter(Assets.playerthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }

                    if (!this.get("themecolor"))
                        this.set("themecolor", "default");

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
                    this.set("firefox", Info.isFirefox());
                    this.set("duration", this.get("totalduration") || 0.0);
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

                    this.on("change:stretch", function() {
                        this._updateStretch();
                    }, this);
                    this.host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.playerStates())
                    });
                    this.host.dynamic = this;
                    this.host.initialize(InitialState);

                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 100,
                        start: true
                    });
                },

                state: function() {
                    return this.host.state();
                },

                videoAttached: function() {
                    return !!this.player;
                },

                videoLoaded: function() {
                    return this.videoAttached() && this.player.loaded();
                },

                videoError: function() {
                    return this.__error;
                },

                _error: function(error_type, error_code) {
                    this.__error = {
                        error_type: error_type,
                        error_code: error_code
                    };
                    this.trigger("error:" + error_type, error_code);
                    this.trigger("error", error_type, error_code);
                },

                _clearError: function() {
                    this.__error = null;
                },

                _detachVideo: function() {
                    this.set("playing", false);
                    if (this.player)
                        this.player.weakDestroy();
                    if (this._prerollAd)
                        this._prerollAd.weakDestroy();
                    this.player = null;
                },

                _attachVideo: function() {
                    if (this.videoAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.__attachRequested = false;
                    var video = this.activeElement().querySelector("[data-video='video']");
                    this._clearError();
                    VideoPlayerWrapper.create(Objs.extend(this._getSources(), {
                        element: video,
                        forceflash: !!this.get("forceflash"),
                        noflash: !!this.get("noflash"),
                        preload: !!this.get("preload"),
                        loop: !!this.get("loop"),
                        reloadonplay: this.get('playlist') ? true : !!this.get("reloadonplay")
                    })).error(function(e) {
                        if (this.destroyed())
                            return;
                        this._error("attach", e);
                    }, this).success(function(instance) {
                        if (this.destroyed())
                            return;
                        if (this._adProvider && this.get("preroll")) {
                            this._prerollAd = this._adProvider.newPrerollAd({
                                videoElement: this.activeElement().querySelector("[data-video='video']"),
                                adElement: this.activeElement().querySelector("[data-video='ad']"),
                                dynamic: this
                            });
                        }
                        this.player = instance;

                        if (this.get("chromecast") || this.get("aiplay")) {
                            if (!this.get("skipinitial")) this.set("skipinitial", true);
                            this._broadcasting = new Broadcasting({
                                player: instance,
                                commonOptions: {
                                    title: this.get("title"),
                                    poster: this.player._element.poster,
                                    currentPosition: this.get("position")
                                },
                                castOptions: {
                                    canControlVolume: true,
                                    canPause: !this.get("disablepause"),
                                    canSeek: !this.get("disableseeking"),
                                    displayName: this.get("title"),
                                    //displayStatus: "Please wait connecting",
                                    duration: this.get("duration"),
                                    imageUrl: this.player._element.poster,
                                    isConnected: this.player._broadcastingState.googleCastConnected,
                                    isMuted: false,
                                    isPaused: !this.get("playing")
                                },
                                airplayOptions: {}
                            });
                            if (Info.isChrome() && this.get("chromecast")) {
                                this._broadcasting.attachGoggleCast();
                                this.player.on("cast-available", function(isCastDeviceAvailable) {
                                    this.set("castbuttonvisble", isCastDeviceAvailable);
                                }, this);
                                this.player.on("cast-loaded", function(castRemotePlayer, castRemotePlayerController) {
                                    //castRemotePlayer.currentMediaDuration = this.player;

                                    // If player already start to play
                                    if (this.get("position") > 0) {
                                        this._broadcasting.options.currentPosition = this.get("position");
                                    }

                                    //If local player playing stop it before
                                    if (this.get('playing')) this.stop();

                                    // Intial play button state
                                    if (!castRemotePlayer.isPaused) this.set('playing', true);

                                }, this);

                                this.player.on("cast-playpause", function(castPaused) {
                                    this.set("playing", !castPaused);
                                }, this);

                                this.player.on("cast-time-changed", function(currentTime, totalMediaDuration) {
                                    var position = Math.round(currentTime / totalMediaDuration * 100);
                                    this.set("buffered", totalMediaDuration);
                                    this.set("cahched", totalMediaDuration);
                                    this.set("duration", totalMediaDuration || 0.0);
                                    this.set("position", currentTime);
                                }, this);

                                this.player.on("proceed-when-ending-googlecast", function(position) {
                                    this.player._broadcastingState.googleCastConnected = false;
                                    this.set('playing', false);
                                }, this);

                            }
                            if (Info.isSafari() && Info.safariVersion() >= 9 && window.WebKitPlaybackTargetAvailabilityEvent && this.get("airplay")) {
                                this.set("airplaybuttonvisible", true);
                                this._broadcasting.attachAirplayEvent.call(this, video);
                            }
                        }

                        if (this.get("playwhenvisible")) {
                            var _self;
                            _self = this;
                            this.set("skipinitial", true);
                            if (Dom.isElementVisible(video, this.get("visibilityfraction"))) {
                                this.player.play();
                            }

                            this._visiblityScrollEvent = this.auto_destroy(new DomEvents());
                            this._visiblityScrollEvent.on(document, "scroll", function() {
                                if (!_self.get('playedonce') && !_self.get("manuallypaused")) {
                                    if (Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                                        _self.player.play();
                                    } else if (_self.get("playing")) {
                                        _self.player.pause();
                                    }
                                } else if (_self.get("playing") && !Dom.isElementVisible(video, _self.get("visibilityfraction"))) {
                                    _self.player.pause();
                                }
                            });
                        }
                        this.player.on("fullscreen-change", function(inFullscreen) {
                            this.set("fullscreened", inFullscreen);
                        }, this);
                        this.player.on("postererror", function() {
                            this._error("poster");
                        }, this);
                        this.player.on("playing", function() {
                            this.set("playing", true);
                            this.trigger("playing");
                        }, this);
                        this.player.on("error", function(e) {
                            this._error("video", e);
                        }, this);
                        if (this.player.error())
                            this.player.trigger("error", this.player.error());
                        this.player.on("paused", function() {
                            this.set("playing", false);
                            this.trigger("paused");
                        }, this);
                        this.player.on("ended", function() {
                            this.set("playing", false);
                            this.set('playedonce', true);
                            this.trigger("ended");
                        }, this);
                        this.trigger("attached", instance);
                        this.player.once("loaded", function() {
                            var volume = Math.min(1.0, this.get("volume"));
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0.0);
                            this.trigger("loaded");
                            if (this.get("totalduration") || this.player.duration() < Infinity)
                                this.set("duration", this.get("totalduration") || this.player.duration());
                            this.set("fullscreensupport", this.player.supportsFullscreen());
                            this._updateStretch();
                            if (this.get("initialseek"))
                                this.player.setPosition(this.get("initialseek"));
                        }, this);
                        if (this.player.loaded())
                            this.player.trigger("loaded");
                        this._updateStretch();
                    }, this);
                },

                _getSources: function() {
                    var filter = this.get("currentstream") ? this.get("currentstream").filter : this.get("sourcefilter");
                    var poster = this.get("poster");
                    var source = this.get("source");
                    var sources = filter ? Objs.filter(this.get("sources"), function(source) {
                        return Objs.subset_of(filter, source);
                    }, this) : this.get("sources");
                    Objs.iter(sources, function(s) {
                        if (s.poster)
                            poster = s.poster;
                    });
                    return {
                        poster: poster,
                        source: source,
                        sources: sources
                    };
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachVideo();
                },

                /* In the feature if require to use promise player, Supports >Chrome50, >FireFox53
                _playWithPromise: function(dyn) {
                    var _player, _promise, _autoplayAllowed;
                    _player = dyn.player;
                    _autoplayAllowed = true;
                    if (_player._element)
                        _promise = _player._element.play();
                    else
                        _player.play();

                    if (_promise !== 'undefined' && !Info.isInternetExplorer()) {
                        _promise["catch"](function(err) {
                            // here can add some interaction like inform user to change settings in chrome://flags disable-gesture-requirement-for-media-playback
                            if (err.name === 'NotAllowedError')
                                _autoplayAllowed = false;
                            // Will try to run play anyway
                            _player.play();
                        });
                        _promise.then(function() {
                            if(_autoplayAllowed) {
                                // Inform user with UI that device is not allowed to play without interaction
                            }
                        });
                    } else if (!dyn.get("playing")) {
                        _player.play();
                    }
                }, */

                reattachVideo: function() {
                    this.set("reloadonplay", true);
                    this._detachVideo();
                    this._attachVideo();
                },

                object_functions: ["play", "rerecord", "pause", "stop", "seek", "set_volume"],

                functions: {

                    user_activity: function(strong) {
                        this.set("last_activity", Time.now());
                        this.set("activity_delta", 0);
                        if (strong && this.get("volumeafterinteraction")) {
                            this.set_volume(1.0);
                        }
                    },

                    message_click: function() {
                        this.trigger("message:click");
                    },

                    playbutton_click: function() {
                        this.host.state().play();
                    },

                    play: function() {
                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("play-google-cast");
                            return;
                        }
                        this.host.state().play();
                    },

                    rerecord: function() {
                        if (!this.get("rerecordable"))
                            return;
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        if (!this.get("submittable"))
                            return;
                        this.trigger("submit");
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                    },

                    pause: function() {

                        if (this.get('disablepause')) return;

                        if (this.get("playing")) {
                            if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                                this._broadcasting.player.trigger("pause-google-cast");
                                return;
                            }
                            this.player.pause();
                        }

                        if (this.get("playwhenvisible"))
                            this.set("manuallypaused", true);
                    },

                    stop: function() {
                        if (!this.videoLoaded())
                            return;
                        if (this.get("playing"))
                            this.player.pause();
                        this.player.setPosition(0);
                        this.trigger("stopped");
                    },

                    seek: function(position) {
                        if (this.get('disableseeking')) return;
                        if (this.videoLoaded())
                            this.player.setPosition(position);
                        this.trigger("seek", position);
                    },

                    set_volume: function(volume) {
                        volume = Math.min(1.0, volume);

                        if (this.player && this.player._broadcastingState && this.player._broadcastingState.googleCastConnected) {
                            this._broadcasting.player.trigger("change-google-cast-volume", volume);
                        }

                        this.set("volume", volume);
                        if (this.videoLoaded()) {
                            this.player.setVolume(volume);
                            this.player.setMuted(volume <= 0);
                        }
                    },

                    toggle_fullscreen: function() {
                        if (this.get("fullscreened"))
                            this.player.exitFullscreen();
                        else
                            this.player.enterFullscreen();
                        this.set("fullscreened", !this.get("fullscreened"));
                    },

                    toggle_player: function() {
                        if (!this.get("playonclick"))
                            return;
                        if (this.get('playing') && !this.get("disablepause")) {
                            if (!this.get("volumeafterinteraction"))
                                this.pause();
                            else
                                this.set("volumeafterinteraction", false);

                            if (this.get("playwhenvisible"))
                                this.set("manuallypaused", true);
                        } else
                            this.play();
                    }

                },

                destroy: function() {
                    this._timer.destroy();
                    this.host.destroy();
                    this._detachVideo();
                    inherited.destroy.call(this);
                },

                _timerFire: function() {
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
                            var pld = this.player.duration();
                            if (0.0 < pld && pld < Infinity)
                                this.set("duration", this.player.duration());
                            else
                                this.set("duration", this.get("totalduration") || new_position);
                            this.set("fullscreened", this.player.isFullscreen());
                        }
                    } catch (e) {}
                    try {
                        this._updateStretch();
                    } catch (e) {}
                    try {
                        this._updateCSSSize();
                    } catch (e) {}
                },

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                videoHeight: function() {
                    return this.videoAttached() ? this.player.videoHeight() : NaN;
                },

                videoWidth: function() {
                    return this.videoAttached() ? this.player.videoWidth() : NaN;
                },

                aspectRatio: function() {
                    return this.videoWidth() / this.videoHeight();
                },

                parentWidth: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).width;
                },

                parentHeight: function() {
                    return Dom.elementDimensions(this.activeElement().parentElement).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                _updateStretch: function() {
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
                            Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
                        if (newStretch)
                            Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
                    }
                    this.__currentStretch = newStretch;
                }

            };
        }, {

            playerStates: function() {
                return [PlayerStates];
            }

        }).register("ba-videoplayer")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "csssize": function (obj) { with (obj) { return csssize; } }, "iecss": function (obj) { with (obj) { return iecss; } }, "ie8 ? 'ie8' : 'noie8'": function (obj) { with (obj) { return ie8 ? 'ie8' : 'noie8'; } }, "csstheme": function (obj) { with (obj) { return csstheme; } }, "fullscreened ? 'fullscreen' : 'normal'": function (obj) { with (obj) { return fullscreened ? 'fullscreen' : 'normal'; } }, "firefox ? 'firefox' : 'common'": function (obj) { with (obj) { return firefox ? 'firefox' : 'common'; } }, "themecolor": function (obj) { with (obj) { return themecolor; } }, "user_activity()": function (obj) { with (obj) { return user_activity(); } }, "user_activity(true)": function (obj) { with (obj) { return user_activity(true); } }, "widthHeightStyles": function (obj) { with (obj) { return widthHeightStyles; } }, "!playfullscreenonmobile": function (obj) { with (obj) { return !playfullscreenonmobile; } }, "toggle_player()": function (obj) { with (obj) { return toggle_player(); } }, "dyncontrolbar": function (obj) { with (obj) { return dyncontrolbar; } }, "csscontrolbar || css": function (obj) { with (obj) { return csscontrolbar || css; } }, "tmplcontrolbar": function (obj) { with (obj) { return tmplcontrolbar; } }, "controlbar_active": function (obj) { with (obj) { return controlbar_active; } }, "playing": function (obj) { with (obj) { return playing; } }, "playwhenvisible": function (obj) { with (obj) { return playwhenvisible; } }, "airplay": function (obj) { with (obj) { return airplay; } }, "airplaybuttonvisible": function (obj) { with (obj) { return airplaybuttonvisible; } }, "chromecast": function (obj) { with (obj) { return chromecast; } }, "castbuttonvisble": function (obj) { with (obj) { return castbuttonvisble; } }, "volume": function (obj) { with (obj) { return volume; } }, "duration": function (obj) { with (obj) { return duration; } }, "buffered": function (obj) { with (obj) { return buffered; } }, "title": function (obj) { with (obj) { return title; } }, "position": function (obj) { with (obj) { return position; } }, "activity_delta": function (obj) { with (obj) { return activity_delta; } }, "hideoninactivity": function (obj) { with (obj) { return hideoninactivity; } }, "rerecordable": function (obj) { with (obj) { return rerecordable; } }, "submittable": function (obj) { with (obj) { return submittable; } }, "streams": function (obj) { with (obj) { return streams; } }, "currentstream": function (obj) { with (obj) { return currentstream; } }, "fullscreensupport && !nofullscreen": function (obj) { with (obj) { return fullscreensupport && !nofullscreen; } }, "fullscreened": function (obj) { with (obj) { return fullscreened; } }, "source": function (obj) { with (obj) { return source; } }, "disablepause": function (obj) { with (obj) { return disablepause; } }, "disableseeking": function (obj) { with (obj) { return disableseeking; } }, "dynplaybutton": function (obj) { with (obj) { return dynplaybutton; } }, "cssplaybutton || css": function (obj) { with (obj) { return cssplaybutton || css; } }, "tmplplaybutton": function (obj) { with (obj) { return tmplplaybutton; } }, "playbutton_active": function (obj) { with (obj) { return playbutton_active; } }, "dynloader": function (obj) { with (obj) { return dynloader; } }, "cssloader || css": function (obj) { with (obj) { return cssloader || css; } }, "tmplloader": function (obj) { with (obj) { return tmplloader; } }, "loader_active": function (obj) { with (obj) { return loader_active; } }, "dynshare": function (obj) { with (obj) { return dynshare; } }, "cssshare || css": function (obj) { with (obj) { return cssshare || css; } }, "tmplshare": function (obj) { with (obj) { return tmplshare; } }, "sharevideourl && sharevideo.length > 0": function (obj) { with (obj) { return sharevideourl && sharevideo.length > 0; } }, "sharevideourl": function (obj) { with (obj) { return sharevideourl; } }, "sharevideo": function (obj) { with (obj) { return sharevideo; } }, "dynmessage": function (obj) { with (obj) { return dynmessage; } }, "cssmessage || css": function (obj) { with (obj) { return cssmessage || css; } }, "tmplmessage": function (obj) { with (obj) { return tmplmessage; } }, "message_active": function (obj) { with (obj) { return message_active; } }, "message": function (obj) { with (obj) { return message; } }, "dyntopmessage": function (obj) { with (obj) { return dyntopmessage; } }, "csstopmessage || css": function (obj) { with (obj) { return csstopmessage || css; } }, "tmpltopmessage": function (obj) { with (obj) { return tmpltopmessage; } }, "topmessage": function (obj) { with (obj) { return topmessage; } }, "poster": function (obj) { with (obj) { return poster; } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "video-error": "An error occurred, please try again later. Click to retry."
        });
});
Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function(State, ListenMixin, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, [ListenMixin, {

        dynamics: [],

        _start: function() {
            this.dyn = this.host.dynamic;
            Objs.iter(Objs.extend({
                "loader": false,
                "message": false,
                "playbutton": false,
                "controlbar": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this._started();
        },

        _started: function() {},

        play: function() {
            this.dyn.set("autoplay", true);
        }

    }]);
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.FatalError", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],
        _locals: ["message"],

        _started: function() {
            this.dyn.set("message", this._message || this.dyn.string("video-error"));
        }

    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Initial", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            if (this.dyn.get("ready"))
                this.next("LoadPlayer");
            else {
                this.listenOn(this.dyn, "change:ready", function() {
                    this.next("LoadPlayer");
                });
            }
        }
    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadPlayer", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:attach", function() {
                this.next("LoadError");
            }, this);
            this.listenOn(this.dyn, "error:poster", function() {
                if (!this.dyn.get("states").poster_error.ignore)
                    this.next("PosterError");
            }, this);
            this.listenOn(this.dyn, "attached", function() {
                this.next("PosterReady");
            }, this);
            this.dyn.reattachVideo();
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadError", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadPlayer");
            }, this);
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PosterReady", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["playbutton"],

        _started: function() {
            this.listenOn(this.dyn, "error:poster", function() {
                if (!this.dyn.get("states").poster_error.ignore)
                    this.next("PosterError");
            }, this);
            if (this.dyn.get("autoplay") || this.dyn.get("skipinitial"))
                this.play();
        },

        play: function() {
            this.next("Preroll");
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.Preroll", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: [],

        _started: function() {
            if (this.dyn._prerollAd) {
                this.dyn._prerollAd.once("finished", function() {
                    this.next("LoadVideo");
                }, this);
                this.dyn._prerollAd.once("adskipped", function() {
                    this.next("LoadVideo");
                }, this);
                // TODO: video height and width return NaN before ad start even when ba-width/ba-height are provided
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
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next(this.dyn.get("states").poster_error.click_play ? "LoadVideo" : "LoadPlayer");
            }, this);
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.LoadVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State",
    "base:Timers.Timer"
], function(State, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.listenOn(this.dyn, "error:video", function() {
                this.next("ErrorVideo");
            }, this);
            this.listenOn(this.dyn, "playing", function() {
                if (this.destroyed() || this.dyn.destroyed())
                    return;
                if (this.dyn.get("autoseek"))
                    this.dyn.execute("seek", this.dyn.get("autoseek"));
                this.next("PlayVideo");
            }, this);
            if (this.dyn.get("skipinitial") && !this.dyn.get("autoplay"))
                this.next("PlayVideo");
            else {
                var counter = 10;
                this.auto_destroy(new Timer({
                    context: this,
                    fire: function() {
                        if (!this.destroyed() && !this.dyn.destroyed() && this.dyn.player)
                            this.dyn.player.play();
                        counter--;
                        if (counter === 0)
                            this.next("PlayVideo");
                    },
                    delay: 200,
                    immediate: true
                }));
            }
        }

    });
});



Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.ErrorVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("message", this.dyn.string("video-error"));
            this.listenOn(this.dyn, "message:click", function() {
                this.next("LoadVideo");
            }, this);
        }

    });
});




Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.PlayVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["controlbar"],

        _started: function() {
            this.dyn.set("autoplay", false);
            this.listenOn(this.dyn, "change:currentstream", function() {
                this.dyn.set("autoplay", true);
                this.dyn.set("autoseek", this.dyn.player.position());
                this.dyn.reattachVideo();
                this.next("LoadPlayer");
            }, this);
            this.listenOn(this.dyn, "ended", function() {
                this.dyn.set("autoseek", null);
                this.next("NextVideo");
            }, this);
            this.listenOn(this.dyn, "change:buffering", function() {
                this.dyn.set("loader_active", this.dyn.get("buffering"));
            }, this);
            this.listenOn(this.dyn, "error:video", function() {
                this.next("ErrorVideo");
            }, this);
        },

        play: function() {
            if (!this.dyn.get("playing"))
                this.dyn.player.play();
        }

    });
});


Scoped.define("module:VideoPlayer.Dynamics.PlayerStates.NextVideo", [
    "module:VideoPlayer.Dynamics.PlayerStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
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
                    this.dyn.trigger("playlist-next", pl0);
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
Scoped.define("module:VideoPlayer.Dynamics.Share", [
    "dynamics:Dynamic",
    "module:Assets"
], function(Class, Assets, scoped) {

    var SHARES = {
        facebook: 'https://facebook.com/sharer/sharer.php?u=',
        twitter: 'https://twitter.com/home?status=',
        gplus: 'https://plus.google.com/share?url='
    };

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<div class=\"{{css}}-share-action-container\">\n    <div class=\"{{css}}-toggle-share-container\">\n        <div class=\"{{css}}-button-inner\" onclick=\"{{toggleShare()}}\">\n            <i class=\"{{css}}-icon-share\"></i>\n        </div>\n    </div>\n    <div class=\"{{css}}-social-buttons-container\">\n        <ul class=\"{{css}}-socials-list\" ba-repeat=\"{{share :: shares}}\">\n            <li class=\"{{css}}-single-social\">\n                <div class=\"{{css}}-button-inner\">\n                    <i class=\"{{css}}-icon-{{share}}\" onclick=\"{{shareMedia(share)}}\"></i>\n                </div>\n            </li>\n        </ul>\n    </div>\n</div>\n",

                attrs: {
                    css: "ba-videoplayer",
                    url: "",
                    shares: []
                },

                functions: {

                    shareMedia: function(share) {
                        window.open(SHARES[share] + this.get("url"), 'pop', 'width=600 height=400');
                    },

                    toggleShare: function() {
                        /*
                        var container = this.activeElement().querySelector().firstElementChild;
                        container.style.right = container.style.right ? "" : "-45px";
                        */
                    }

                }
            };
        }).register("ba-videoplayer-share")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "toggleShare()": function (obj) { with (obj) { return toggleShare(); } }, "shares": function (obj) { with (obj) { return shares; } }, "share": function (obj) { with (obj) { return share; } }, "shareMedia(share)": function (obj) { with (obj) { return shareMedia(share); } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "share": "Share media"
        });
});
Scoped.define("module:VideoPlayer.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-topmessage-container\">\n    <div class='{{css}}-topmessage-background'>\n    </div>\n    <div data-selector=\"topmessage-message-block\" class='{{css}}-topmessage-message'>\n        {{topmessage}}\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-videoplayer",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "topmessage": function (obj) { with (obj) { return topmessage; } }/**/ })
        .register("ba-videoplayer-topmessage");
});
Scoped.define("module:VideoRecorder.Dynamics.Chooser", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.IfPartial"
], function(Class, Assets, Info, scoped) {

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-chooser-container\">\n\t<div class=\"{{css}}-chooser-button-container\">\n\t\t<div ba-repeat=\"{{action :: actions}}\">\n\t\t\t<div class=\"{{css}}-chooser-button-{{action.index}}\"\n\t\t\t     ba-click=\"{{click_action(action)}}\">\n\t\t\t\t<input ba-if=\"{{action.select && action.capture}}\"\n\t\t\t\t\t   type=\"file\"\n\t\t\t\t\t   class=\"{{css}}-chooser-file\"\n\t\t\t\t\t   onchange=\"{{select_file_action(action, domEvent)}}\"\n\t\t\t\t\t   accept=\"{{action.accept}}\"\n\t\t\t\t\t   capture />\n\t\t\t\t<input ba-if=\"{{action.select && !action.capture}}\"\n\t\t\t\t\t   type=\"file\"\n\t\t\t\t\t   class=\"{{css}}-chooser-file\"\n\t\t\t\t\t   onchange=\"{{select_file_action(action, domEvent)}}\"\n\t\t\t\t\t   accept=\"{{action.accept}}\"\n\t\t\t\t\t   />\n\t\t\t\t<i class=\"{{css}}-icon-{{action.icon}}\"\n\t\t\t\t   ba-if=\"{{action.icon}}\"></i>\n\t\t\t\t<span>\n\t\t\t\t\t{{action.label}}\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "allowrecord": true,
                    "allowupload": true,
                    "allowscreen": false,

                    "primaryrecord": true,

                    "allowcustomupload": true,
                    "allowedextensions": null,
                    "onlyaudio": false

                },

                types: {
                    "allowedextensions": "array"
                },

                collections: ["actions"],

                create: function() {
                    var custom_accept_string = "";
                    if (this.get("allowedextensions") && this.get("allowedextensions").length > 0) {
                        var browser_support = Info.isEdge() || Info.isChrome() || Info.isOpera() || (Info.isFirefox() && Info.firefoxVersion() >= 42) || (Info.isInternetExplorer() && Info.internetExplorerVersion() >= 10);
                        if (browser_support)
                            custom_accept_string = "." + this.get("allowedextensions").join(",.");
                    } else if (!this.get("allowcustomupload")) {
                        custom_accept_string = "video/*,video/mp4";
                    }
                    var order = [];
                    if (this.get("primaryrecord")) {
                        if (this.get("allowrecord"))
                            order.push("record");
                        if (this.get("allowscreen"))
                            order.push("screen");
                        if (this.get("allowupload"))
                            order.push("upload");
                    } else {
                        if (this.get("allowscreen"))
                            order.push("screen");
                        if (this.get("allowupload"))
                            order.push("upload");
                        if (this.get("allowrecord"))
                            order.push("record");
                    }
                    var actions = this.get("actions");
                    order.forEach(function(act, index) {
                        switch (act) {
                            case "record":
                                actions.add({
                                    type: "record",
                                    index: index,
                                    icon: !this.get("onlyaudio") ? 'videocam' : 'volume-up',
                                    label: this.string(this.get("onlyaudio") ? "record-audio" : "record-video"),
                                    select: Info.isMobile() && !(Info.isAndroid() && Info.isCordova()),
                                    capture: true,
                                    accept: "video/*,video/mp4;capture=camcorder"
                                });
                                break;
                            case "upload":
                                actions.add({
                                    type: "upload",
                                    index: index,
                                    icon: "upload",
                                    label: this.string("upload-video"),
                                    select: !(Info.isiOS() && Info.isCordova()),
                                    accept: Info.isMobile() && !(Info.isAndroid() && Info.isCordova()) ? "video/*,video/mp4" : custom_accept_string
                                });
                                break;
                            case "screen":
                                actions.add({
                                    type: "screen",
                                    index: index,
                                    icon: "television",
                                    label: this.string("record-screen")
                                });
                                break;
                        }
                    }, this);
                },

                functions: {

                    click_action: function(action) {
                        if (action.get("select"))
                            return;
                        if (action.get("type") === "screen") {
                            this.trigger("record-screen");
                            return;
                        }
                        if (Info.isMobile() && Info.isCordova()) {
                            var self = this;
                            if (Info.isAndroid()) {
                                navigator.device.capture.captureVideo(function(mediaFiles) {
                                    self.trigger("upload", mediaFiles[0]);
                                }, function(error) {}, {
                                    limit: 1,
                                    duration: this.get("timelimit")
                                });
                            } else if (Info.isiOS()) {
                                navigator.camera.getPicture(function(url) {
                                    self.trigger("upload", {
                                        localURL: url,
                                        fullPath: url
                                    });
                                }, function(error) {}, {
                                    destinationType: Camera.DestinationType.FILE_URI,
                                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                    mediaType: Camera.MediaType.VIDEO
                                });
                            }
                        } else
                            this.trigger("record");
                    },

                    select_file_action: function(action, domEvent) {
                        if (!action.get("select"))
                            return;
                        this.trigger("upload", domEvent[0].target);
                    }

                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "actions": function (obj) { with (obj) { return actions; } }, "action.index": function (obj) { with (obj) { return action.index; } }, "click_action(action)": function (obj) { with (obj) { return click_action(action); } }, "action.select && action.capture": function (obj) { with (obj) { return action.select && action.capture; } }, "select_file_action(action, domEvent)": function (obj) { with (obj) { return select_file_action(action, domEvent); } }, "action.accept": function (obj) { with (obj) { return action.accept; } }, "action.select && !action.capture": function (obj) { with (obj) { return action.select && !action.capture; } }, "action.icon": function (obj) { with (obj) { return action.icon; } }, "action.label": function (obj) { with (obj) { return action.label; } }/**/ })
        .register("ba-videorecorder-chooser")
        .attachStringTable(Assets.strings)
        .addStrings({
            "record-video": "Record Video",
            "record-audio": "Record Audio",
            "record-screen": "Record Screen",
            "upload-video": "Upload Video"
        });
});
Scoped.define("module:VideoRecorder.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Assets",
    "base:Timers.Timer"
], [
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.RepeatPartial"
], function(Class, Assets, Timer, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<div class=\"{{css}}-dashboard\">\n\t<div class=\"{{css}}-backbar\"></div>\n\t<div data-selector=\"recorder-settings\" class=\"{{css}}-settings\" ba-show=\"{{settingsvisible && settingsopen}}\">\n\t\t<div class=\"{{css}}-settings-backbar\"></div>\n\t\t<div data-selector=\"settings-list-front\" class=\"{{css}}-settings-front\">\n\t\t\t<ul data-selector=\"camera-settings\" ba-repeat=\"{{camera :: cameras}}\" ba-show=\"{{!novideo && !allowscreen}}\">\n\t\t\t\t<li>\n\t\t\t\t\t<input type='radio' name='camera' value=\"{{selectedcamera == camera.id}}\" onclick=\"{{selectCamera(camera.id)}}\" />\n\t\t\t\t\t<span></span>\n\t\t\t\t\t<label onclick=\"{{selectCamera(camera.id)}}\">\n\t\t\t\t\t\t{{camera.label}}\n\t\t\t\t\t</label>\n\t\t\t\t </li>\n\t\t\t</ul>\n\t\t\t<hr ba-show=\"{{(!noaudio && !novideo) || !allowscreen}}\"/>\n\t\t\t<ul data-selector=\"microphone-settings\" ba-repeat=\"{{microphone :: microphones}}\" ba-show=\"{{!noaudio && !allowscreen}}\">\n\t\t\t\t<li onclick=\"{{selectMicrophone(microphone.id)}}\">\n\t\t\t\t\t<input type='radio' name='microphone' value=\"{{selectedmicrophone == microphone.id}}\" />\n\t\t\t\t\t<span></span>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t{{microphone.label}}\n\t\t\t\t\t</label>\n\t\t\t\t </li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\t<div data-selector=\"controlbar\" class=\"{{css}}-controlbar\">\n        <div class=\"{{css}}-leftbutton-container\" ba-show=\"{{settingsvisible}}\">\n            <div data-selector=\"record-button-icon-cog\" class=\"{{css}}-button-inner {{css}}-button-{{settingsopen ? 'selected' : 'unselected'}}\"\n                 onclick=\"{{settingsopen=!settingsopen}}\"\n                 onmouseenter=\"{{hover(string('settings'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n                <i class=\"{{css}}-icon-cog\"></i>\n            </div>\n        </div>\n        <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible && !novideo && !allowscreen}}\">\n            <div data-selector=\"record-button-icon-videocam\" class=\"{{css}}-icon-inner\"\n                 onmouseenter=\"{{hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n                <i class=\"{{css}}-icon-videocam {{css}}-icon-state-{{camerahealthy ? 'good' : 'bad' }}\"></i>\n            </div>\n        </div>\n        <div class=\"{{css}}-lefticon-container\" ba-show=\"{{settingsvisible && !noaudio && !allowscreen}}\">\n            <div data-selector=\"record-button-icon-mic\" class=\"{{css}}-icon-inner\"\n                 onmouseenter=\"{{hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n                <i class=\"{{css}}-icon-mic {{css}}-icon-state-{{microphonehealthy ? 'good' : 'bad' }}\"></i>\n            </div>\n        </div>\n        <div class=\"{{css}}-lefticon-container\" ba-show=\"{{stopvisible && recordingindication}}\">\n            <div data-selector=\"recording-indicator\" class=\"{{css}}-recording-indication\">\n            </div>\n        </div>\n        <div class=\"{{css}}-label-container\" ba-show=\"{{controlbarlabel}}\">\n        \t<div data-selector=\"record-label-block\" class=\"{{css}}-label-label\">\n        \t\t{{controlbarlabel}}\n        \t</div>\n        </div>\n        <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{recordvisible}}\">\n        \t<div data-selector=\"record-primary-button\" class=\"{{css}}-button-primary\"\n                 onclick=\"{{record()}}\"\n                 onmouseenter=\"{{hover(string('record-tooltip'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n        \t\t{{string('record')}}\n        \t</div>\n        </div>\n        <div class=\"{{css}}-rightbutton-container\" ba-if=\"{{uploadcovershotvisible}}\">\n        \t<div data-selector=\"covershot-primary-button\" class=\"{{css}}-button-primary\"\n                 onmouseenter=\"{{hover(string('upload-covershot-tooltip'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n                 <input type=\"file\"\n\t\t\t\t       class=\"{{css}}-chooser-file\"\n\t\t\t\t       style=\"height:100\"\n\t\t\t\t       onchange=\"{{uploadCovershot(domEvent)}}\"\n\t\t\t\t       accept=\"{{covershot_accept_string}}\" />\n                 <span>\n        \t\t\t{{string('upload-covershot')}}\n        \t\t</span>\n        \t</div>\n        </div>\n        <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{rerecordvisible}}\">\n        \t<div data-selector=\"rerecord-primary-button\" class=\"{{css}}-button-primary\"\n                 onclick=\"{{rerecord()}}\"\n                 onmouseenter=\"{{hover(string('rerecord-tooltip'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n        \t\t{{string('rerecord')}}\n        \t</div>\n        </div>\n\t\t<div class=\"{{css}}-rightbutton-container\" ba-show=\"{{cancelvisible}}\">\n\t\t\t<div data-selector=\"cancel-primary-button\" class=\"{{css}}-button-primary\"\n\t\t\t\t onclick=\"{{cancel()}}\"\n\t\t\t\t onmouseenter=\"{{hover(string('cancel-tooltip'))}}\"\n\t\t\t\t onmouseleave=\"{{unhover()}}\">\n\t\t\t\t{{string('cancel')}}\n\t\t\t</div>\n\t\t</div>\n        <div class=\"{{css}}-rightbutton-container\" ba-show=\"{{stopvisible}}\">\n        \t<div data-selector=\"stop-primary-button\" class=\"{{css}}-button-primary {{mintimeindicator ? css + '-disabled': ''}}\"\n\t\t\t\t title=\"{{mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip')}}\"\n                 onclick=\"{{stop()}}\"\n                 onmouseenter=\"{{hover( mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n        \t\t{{string('stop')}}\n        \t</div>\n        </div>\n        <div class=\"{{css}}-centerbutton-container\" ba-show=\"{{skipvisible}}\">\n        \t<div data-selector=\"skip-primary-button\" class=\"{{css}}-button-primary\"\n                 onclick=\"{{skip()}}\"\n                 onmouseenter=\"{{hover(string('skip-tooltip'))}}\"\n                 onmouseleave=\"{{unhover()}}\">\n        \t\t{{string('skip')}}\n        \t</div>\n        </div>\n\t</div>\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "hovermessage": "",
                    "recordingindication": true,
                    "covershot_accept_string": "image/*,image/png,image/jpg,image/jpeg"
                },

                create: function() {
                    this.auto_destroy(new Timer({
                        context: this,
                        fire: function() {
                            this.set("recordingindication", !this.get("recordingindication"));
                        },
                        delay: 500
                    }));
                },

                functions: {
                    selectCamera: function(cameraId) {
                        this.trigger("select-camera", cameraId);
                    },
                    selectMicrophone: function(microphoneId) {
                        this.trigger("select-microphone", microphoneId);
                    },
                    hover: function(text) {
                        this.set("hovermessage", text);
                    },
                    unhover: function() {
                        this.set("hovermessage", "");
                    },
                    record: function() {
                        this.trigger("invoke-record");
                    },
                    rerecord: function() {
                        this.trigger("invoke-rerecord");
                    },
                    stop: function() {
                        this.trigger("invoke-stop");
                    },
                    skip: function() {
                        this.trigger("invoke-skip");
                    },
                    cancel: function() {
                        this.trigger("invoke-cancel");
                    },
                    uploadCovershot: function(domEvent) {
                        this.trigger("upload-covershot", domEvent[0].target);
                    }
                }

            };
        })
        .register("ba-videorecorder-controlbar")
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "settingsvisible && settingsopen": function (obj) { with (obj) { return settingsvisible && settingsopen; } }, "cameras": function (obj) { with (obj) { return cameras; } }, "!novideo && !allowscreen": function (obj) { with (obj) { return !novideo && !allowscreen; } }, "selectedcamera == camera.id": function (obj) { with (obj) { return selectedcamera == camera.id; } }, "selectCamera(camera.id)": function (obj) { with (obj) { return selectCamera(camera.id); } }, "camera.label": function (obj) { with (obj) { return camera.label; } }, "(!noaudio && !novideo) || !allowscreen": function (obj) { with (obj) { return (!noaudio && !novideo) || !allowscreen; } }, "microphones": function (obj) { with (obj) { return microphones; } }, "!noaudio && !allowscreen": function (obj) { with (obj) { return !noaudio && !allowscreen; } }, "selectMicrophone(microphone.id)": function (obj) { with (obj) { return selectMicrophone(microphone.id); } }, "selectedmicrophone == microphone.id": function (obj) { with (obj) { return selectedmicrophone == microphone.id; } }, "microphone.label": function (obj) { with (obj) { return microphone.label; } }, "settingsvisible": function (obj) { with (obj) { return settingsvisible; } }, "settingsopen ? 'selected' : 'unselected'": function (obj) { with (obj) { return settingsopen ? 'selected' : 'unselected'; } }, "settingsopen=!settingsopen": function (obj) { with (obj) { return settingsopen=!settingsopen; } }, "hover(string('settings'))": function (obj) { with (obj) { return hover(string('settings')); } }, "unhover()": function (obj) { with (obj) { return unhover(); } }, "settingsvisible && !novideo && !allowscreen": function (obj) { with (obj) { return settingsvisible && !novideo && !allowscreen; } }, "hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy'))": function (obj) { with (obj) { return hover(string(camerahealthy ? 'camerahealthy' : 'cameraunhealthy')); } }, "camerahealthy ? 'good' : 'bad'": function (obj) { with (obj) { return camerahealthy ? 'good' : 'bad'; } }, "settingsvisible && !noaudio && !allowscreen": function (obj) { with (obj) { return settingsvisible && !noaudio && !allowscreen; } }, "hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy'))": function (obj) { with (obj) { return hover(string(microphonehealthy ? 'microphonehealthy' : 'microphoneunhealthy')); } }, "microphonehealthy ? 'good' : 'bad'": function (obj) { with (obj) { return microphonehealthy ? 'good' : 'bad'; } }, "stopvisible && recordingindication": function (obj) { with (obj) { return stopvisible && recordingindication; } }, "controlbarlabel": function (obj) { with (obj) { return controlbarlabel; } }, "recordvisible": function (obj) { with (obj) { return recordvisible; } }, "record()": function (obj) { with (obj) { return record(); } }, "hover(string('record-tooltip'))": function (obj) { with (obj) { return hover(string('record-tooltip')); } }, "string('record')": function (obj) { with (obj) { return string('record'); } }, "uploadcovershotvisible": function (obj) { with (obj) { return uploadcovershotvisible; } }, "hover(string('upload-covershot-tooltip'))": function (obj) { with (obj) { return hover(string('upload-covershot-tooltip')); } }, "uploadCovershot(domEvent)": function (obj) { with (obj) { return uploadCovershot(domEvent); } }, "covershot_accept_string": function (obj) { with (obj) { return covershot_accept_string; } }, "string('upload-covershot')": function (obj) { with (obj) { return string('upload-covershot'); } }, "rerecordvisible": function (obj) { with (obj) { return rerecordvisible; } }, "rerecord()": function (obj) { with (obj) { return rerecord(); } }, "hover(string('rerecord-tooltip'))": function (obj) { with (obj) { return hover(string('rerecord-tooltip')); } }, "string('rerecord')": function (obj) { with (obj) { return string('rerecord'); } }, "cancelvisible": function (obj) { with (obj) { return cancelvisible; } }, "cancel()": function (obj) { with (obj) { return cancel(); } }, "hover(string('cancel-tooltip'))": function (obj) { with (obj) { return hover(string('cancel-tooltip')); } }, "string('cancel')": function (obj) { with (obj) { return string('cancel'); } }, "stopvisible": function (obj) { with (obj) { return stopvisible; } }, "mintimeindicator ? css + '-disabled': ''": function (obj) { with (obj) { return mintimeindicator ? css + '-disabled': ''; } }, "mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip')": function (obj) { with (obj) { return mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip'); } }, "stop()": function (obj) { with (obj) { return stop(); } }, "hover( mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip'))": function (obj) { with (obj) { return hover( mintimeindicator ? string('stop-available-after').replace('%d', timeminlimit) : string('stop-tooltip')); } }, "string('stop')": function (obj) { with (obj) { return string('stop'); } }, "skipvisible": function (obj) { with (obj) { return skipvisible; } }, "skip()": function (obj) { with (obj) { return skip(); } }, "hover(string('skip-tooltip'))": function (obj) { with (obj) { return hover(string('skip-tooltip')); } }, "string('skip')": function (obj) { with (obj) { return string('skip'); } }/**/ })
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
            "upload-covershot": "Upload Cover",
            "upload-covershot-tooltip": "Click here to upload custom cover shot",
            "stop": "Stop",
            "stop-tooltip": "Click here to stop.",
            "skip": "Skip",
            "skip-tooltip": "Click here to skip.",
            "stop-available-after": "Minimum recording time is %d seconds",
            "cancel": "Cancel",
            "cancel-tooltip": "Click here to cancel."
        });
});
Scoped.define("module:VideoRecorder.Dynamics.Faceoutline", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<svg viewBox=\"0 0 301 171\" style=\"width:100%; height:100%\">\n    <g>\n        <path fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-miterlimit=\"10\" stroke-dasharray=\"3.0228,3.0228\" d=\"M198.5,79.831c0,40.542-22.752,78.579-47.5,78.579c-24.749,0-47.5-38.036-47.5-78.579c0-40.543,17.028-68.24,47.5-68.24C185.057,11.591,198.5,39.288,198.5,79.831z\"></path>\n    </g>\n</svg>"

            };
        })
        .registerFunctions({ /**//**/ })
        .register("ba-recorderfaceoutline");
});
Scoped.define("module:VideoRecorder.Dynamics.Imagegallery", [
    "dynamics:Dynamic",
    "base:Collections.Collection",
    "base:Properties.Properties",
    "base:Timers.Timer",
    "browser:Dom",
    "browser:Info"
], [
    "dynamics:Partials.StylesPartial"
], function(Class, Collection, Properties, Timer, Dom, Info, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<div data-selector=\"slider-left-button\" class=\"{{css}}-imagegallery-leftbutton\">\n\t<div data-selector=\"slider-left-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{left()}}\">\n\t\t<i class=\"{{css}}-icon-left-open\"></i>\n\t</div>\n</div>\n\n<div data-selector=\"images-imagegallery-container\" ba-repeat=\"{{image::images}}\" class=\"{{css}}-imagegallery-container\" data-gallery-container>\n     <div class=\"{{css}}-imagegallery-image\"\n          ba-styles=\"{{{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}}}\"\n          onclick=\"{{select(image)}}\">\n\t\t <div class=\"{{css}}-imagegallery-image-compat\" ba-show=\"{{ie10below}}\"></div>\n     </div>\n</div>\n\n<div data-selector=\"slider-right-button\" class=\"{{css}}-imagegallery-rightbutton\">\n\t<div data-selector=\"slider-right-inner-button\" class=\"{{css}}-imagegallery-button-inner\" onclick=\"{{right()}}\">\n\t\t<i class=\"{{css}}-icon-right-open\"></i>\n\t</div>\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "imagecount": 3,
                    "imagenativewidth": 0,
                    "imagenativeheight": 0,
                    "containerwidth": 0,
                    "containerheight": 0,
                    "containeroffset": 0,
                    "deltafrac": 1 / 8
                },

                computed: {
                    "imagewidth:imagecount,containerwidth,deltafrac": function() {
                        if (this.get("imagecount") <= 0)
                            return 0.0;
                        return this.get("containerwidth") * (1 - this.get("deltafrac")) / this.get("imagecount");
                    },
                    "imagedelta:imagecount,containerwidth,deltafrac": function() {
                        if (this.get("imagecount") <= 1)
                            return 0.0;
                        return this.get("containerwidth") * (this.get("deltafrac")) / (this.get("imagecount") - 1);
                    },
                    "imageheight:imagewidth,imagenativewidth,imagenativeheight": function() {
                        return this.get("imagenativeheight") * this.get("imagewidth") / this.get("imagenativewidth");
                    }
                },

                create: function() {
                    this.set("ie10below", Info.isInternetExplorer() && Info.internetExplorerVersion() <= 10);
                    var images = this.auto_destroy(new Collection());
                    this.set("images", images);
                    this.snapshotindex = 0;
                    this._updateImageCount();
                    this.on("change:imagecount", this._updateImageCount, this);
                    this.on("change:imagewidth change:imageheight change:imagedelta", this._recomputeImageBoxes, this);
                    this.auto_destroy(new Timer({
                        context: this,
                        delay: 1000,
                        fire: function() {
                            this.updateContainerSize();
                        }
                    }));
                },

                destroy: function() {
                    this.get("images").iterate(function(image) {
                        if (image.snapshotDisplay && this.parent().recorder)
                            this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
                    }, this);
                    inherited.destroy.call(this);
                },

                _updateImageCount: function() {
                    var images = this.get("images");
                    var n = this.get("imagecount");
                    while (images.count() < n) {
                        var image = new Properties({
                            index: images.count()
                        });
                        this._recomputeImageBox(image);
                        images.add(image);
                    }
                    while (images.count() > n)
                        images.remove(images.getByIndex(images.count() - 1));
                },

                _recomputeImageBoxes: function() {
                    this.get("images").iterate(function(image) {
                        this._recomputeImageBox(image);
                    }, this);
                },

                _recomputeImageBox: function(image) {
                    if (!this.parent().recorder)
                        return;
                    var i = image.get("index");
                    var iw = this.get("imagewidth");
                    var ih = this.get("imageheight");
                    var id = this.get("imagedelta");
                    var h = this.get("containerheight");
                    image.set("left", 1 + Math.round(i * (iw + id)));
                    image.set("top", 1 + Math.round((h - ih) / 2));
                    image.set("width", 1 + Math.round(iw));
                    image.set("height", 1 + Math.round(ih));
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

                updateContainerSize: function() {
                    var container = this.activeElement().querySelector("[data-gallery-container]");
                    var offset = Dom.elementOffset(container);
                    var videoOffset = Dom.elementOffset(this.parent().recorder._element);
                    var left = offset.left - videoOffset.left;
                    var dimensions = Dom.elementDimensions(container);
                    this.set("containeroffset", left);
                    this.set("containerheight", dimensions.height);
                    this.set("containerwidth", dimensions.width);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.apply(this, arguments);
                    this.updateContainerSize();
                },

                loadImageSnapshot: function(image, snapshotindex) {
                    if (image.snapshotDisplay) {
                        this.parent().recorder.removeSnapshotDisplay(image.snapshotDisplay);
                        image.snapshotDisplay = null;
                    }
                    var snapshots = this.parent().snapshots;
                    image.snapshot = snapshots[((snapshotindex % snapshots.length) + snapshots.length) % snapshots.length];
                    image.snapshotDisplay = this.parent().recorder.createSnapshotDisplay(
                        this.activeElement(),
                        image.snapshot,
                        image.get("left") + this.get("containeroffset"),
                        image.get("top"),
                        image.get("width"),
                        image.get("height")
                    );
                },

                loadSnapshots: function() {
                    this.get("images").iterate(function(image) {
                        this.loadImageSnapshot(image, this.snapshotindex + image.get("index"));
                    }, this);
                },

                nextSnapshots: function() {
                    this.snapshotindex += this.get("imagecount");
                    this.loadSnapshots();
                },

                prevSnapshots: function() {
                    this.snapshotindex -= this.get("imagecount");
                    this.loadSnapshots();
                },

                functions: {
                    left: function() {
                        this.prevSnapshots();
                    },
                    right: function() {
                        this.nextSnapshots();
                    },
                    select: function(image) {
                        this.trigger("image-selected", image.snapshot);
                    }
                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "left()": function (obj) { with (obj) { return left(); } }, "images": function (obj) { with (obj) { return images; } }, "{left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}": function (obj) { with (obj) { return {left: image.left + 'px', top: image.top + 'px', width: image.width + 'px', height: image.height + 'px'}; } }, "select(image)": function (obj) { with (obj) { return select(image); } }, "ie10below": function (obj) { with (obj) { return ie10below; } }, "right()": function (obj) { with (obj) { return right(); } }/**/ })
        .register("ba-videorecorder-imagegallery");
});
Scoped.define("module:VideoRecorder.Dynamics.Loader", [
    "dynamics:Dynamic",
    "module:Assets"
], [
    "dynamics:Partials.ShowPartial"
], function(Class, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-loader-container\">\n    <div data-selector=\"recorder-loader-block\" class=\"{{css}}-loader-loader\" title=\"{{tooltip || ''}}\">\n    </div>\n</div>\n<div data-selector=\"recorder-loader-label-container\" class=\"{{css}}-loader-label\" ba-show=\"{{label}}\">\n\t{{label}}\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "tooltip": "",
                    "label": "",
                    "message": "",
                    "hovermessage": ""
                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "tooltip || ''": function (obj) { with (obj) { return tooltip || ''; } }, "label": function (obj) { with (obj) { return label; } }/**/ })
        .register("ba-videorecorder-loader")
        .attachStringTable(Assets.strings)
        .addStrings({});
});
Scoped.define("module:VideoRecorder.Dynamics.Message", [
    "dynamics:Dynamic"
], [
    "dynamics:Partials.ClickPartial"
], function(Class, Templates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div data-selector=\"recorder-message-container\" class=\"{{css}}-message-container\" ba-click=\"{{click()}}\">\n    <div data-selector=\"recorder-message-block\" class='{{css}}-message-message'>\n        <p>\n            {{message || \"\"}}\n        </p>\n        <ul ba-if=\"{{links && links.length > 0}}\" ba-repeat=\"{{link :: links}}\">\n            <li>\n                <a href=\"javascript:;\" ba-click=\"{{linkClick(link)}}\">\n                    {{link.title}}\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "message": '',
                    "links": null
                },

                functions: {

                    click: function() {
                        this.trigger("click");
                    },

                    linkClick: function(link) {
                        this.trigger("link", link);
                    }

                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "click()": function (obj) { with (obj) { return click(); } }, "message || \"\"": function (obj) { with (obj) { return message || ""; } }, "links && links.length > 0": function (obj) { with (obj) { return links && links.length > 0; } }, "links": function (obj) { with (obj) { return links; } }, "linkClick(link)": function (obj) { with (obj) { return linkClick(link); } }, "link.title": function (obj) { with (obj) { return link.title; } }/**/ })
        .register("ba-videorecorder-message");
});
Scoped.define("module:VideoRecorder.Dynamics.Recorder", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info",
    "browser:Dom",
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
    "module:VideoRecorder.Dynamics.Faceoutline",
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.EventPartial",
    "dynamics:Partials.OnPartial",
    "dynamics:Partials.DataPartial",
    "dynamics:Partials.AttrsPartial",
    "dynamics:Partials.StylesPartial",
    "dynamics:Partials.TemplatePartial"
], function(Class, Assets, Info, Dom, MultiUploader, FileUploader, VideoRecorderWrapper, Types, Objs, Strings, Time, Timers, Host, ClassRegistry, Collection, Promise, InitialState, RecorderStates, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div data-selector=\"recorder-container\" ba-show=\"{{!player_active}}\"\n     class=\"{{css}}-container {{css}}-size-{{csssize}} {{iecss}}-{{ie8 ? 'ie8' : 'noie8'}} {{csstheme}}\n     \t{{css}}-{{ fullscreened ? 'fullscreen' : 'normal' }}-view {{css}}-{{ firefox ? 'firefox' : 'common'}}-browser\n    \t{{css}}-{{themecolor}}-color\"\n     ba-styles=\"{{widthHeightStyles}}\"\n>\n\n    <video data-selector=\"recorder-status\" class=\"{{css}}-video {{css}}-{{hasrecorder ? 'hasrecorder' : 'norecorder'}}\" data-video=\"video\"></video>\n\t<ba-recorderfaceoutline class=\"{{css}}-overlay\" ba-if=\"{{faceoutline && hasrecorder}}\">\n\t</ba-recorderfaceoutline>\n    <div data-selector=\"recorder-overlay\" class='{{css}}-overlay' ba-show=\"{{!hideoverlay}}\" data-overlay=\"overlay\">\n\t\t<ba-{{dynloader}}\n\t\t    ba-css=\"{{cssloader || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplloader}}\"\n\t\t    ba-show=\"{{loader_active}}\"\n\t\t    ba-tooltip=\"{{loadertooltip}}\"\n\t\t\tba-hovermessage=\"{{=hovermessage}}\"\n\t\t    ba-label=\"{{loaderlabel}}\"\n\t\t></ba-{{dynloader}}>\n\n\t\t<ba-{{dynmessage}}\n\t\t    ba-css=\"{{cssmessage || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplmessage}}\"\n\t\t    ba-show=\"{{message_active}}\"\n\t\t    ba-message=\"{{message}}\"\n\t\t\tba-links=\"{{message_links}}\"\n\t\t    ba-event:click=\"message_click\"\n\t\t\tba-event:link=\"message_link_click\"\n\t\t></ba-{{dynmessage}}>\n\n\t\t<ba-{{dyntopmessage}}\n\t\t    ba-css=\"{{csstopmessage || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmpltopmessage}}\"\n\t\t    ba-show=\"{{topmessage_active && (topmessage || hovermessage)}}\"\n\t\t    ba-topmessage=\"{{hovermessage || topmessage}}\"\n\t\t></ba-{{dyntopmessage}}>\n\n\t\t<ba-{{dynchooser}}\n\t\t\tba-onlyaudio=\"{{onlyaudio}}\"\n\t\t    ba-css=\"{{csschooser || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplchooser}}\"\n\t\t\tba-allowscreen=\"{{allowscreen}}\"\n\t\t    ba-if=\"{{chooser_active && !is_initial_state}}\"\n\t\t    ba-allowrecord=\"{{allowrecord}}\"\n\t\t    ba-allowupload=\"{{allowupload}}\"\n\t\t    ba-allowcustomupload=\"{{allowcustomupload}}\"\n\t\t    ba-allowedextensions=\"{{allowedextensions}}\"\n\t\t    ba-primaryrecord=\"{{primaryrecord}}\"\n\t\t    ba-timelimit=\"{{timelimit}}\"\n\t\t    ba-event:record=\"record_video\"\n\t\t\tba-event:record-screen=\"record_screen\"\n\t\t    ba-event:upload=\"upload_video\"\n\t\t></ba-{{dynchooser}}>\n\n\t\t<ba-{{dynimagegallery}}\n\t\t    ba-css=\"{{cssimagegallery || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplimagegallery}}\"\n\t\t    ba-if=\"{{imagegallery_active}}\"\n\t\t    ba-imagecount=\"{{gallerysnapshots}}\"\n\t\t    ba-imagenativewidth=\"{{nativeRecordingWidth}}\"\n\t\t    ba-imagenativeheight=\"{{nativeRecordingHeight}}\"\n\t\t    ba-event:image-selected=\"select_image\"\n\t\t></ba-{{dynimagegallery}}>\n\n\t\t<ba-{{dyncontrolbar}}\n\t\t    ba-css=\"{{csscontrolbar || css}}\"\n\t\t\tba-themecolor=\"{{themecolor}}\"\n\t\t    ba-template=\"{{tmplcontrolbar}}\"\n\t\t    ba-show=\"{{controlbar_active}}\"\n\t\t    ba-cameras=\"{{cameras}}\"\n\t\t    ba-microphones=\"{{microphones}}\"\n\t\t    ba-noaudio=\"{{noaudio}}\"\n\t\t\tba-novideo=\"{{onlyaudio}}\"\n\t\t\tba-allowscreen=\"{{record_media==='screen'}}\"\n\t\t    ba-selectedcamera=\"{{selectedcamera || 0}}\"\n\t\t    ba-selectedmicrophone=\"{{selectedmicrophone || 0}}\"\n\t\t    ba-camerahealthy=\"{{camerahealthy}}\"\n\t\t    ba-microphonehealthy=\"{{microphonehealthy}}\"\n\t\t    ba-hovermessage=\"{{=hovermessage}}\"\n\t\t    ba-settingsvisible=\"{{settingsvisible}}\"\n\t\t    ba-recordvisible=\"{{recordvisible}}\"\n\t\t\tba-cancelvisible=\"{{allowcancel && cancancel}}\"\n\t\t    ba-uploadcovershotvisible=\"{{uploadcovershotvisible}}\"\n\t\t    ba-rerecordvisible=\"{{rerecordvisible}}\"\n\t\t    ba-stopvisible=\"{{stopvisible}}\"\n\t\t    ba-skipvisible=\"{{skipvisible}}\"\n\t\t    ba-controlbarlabel=\"{{controlbarlabel}}\"\n\t\t\tba-mintimeindicator=\"{{mintimeindicator}}\"\n\t\t\tba-timeminlimit=\"{{timeminlimit}}\"\n\t\t    ba-event:select-camera=\"select_camera\"\n\t\t    ba-event:select-microphone=\"select_microphone\"\n\t\t    ba-event:invoke-record=\"record\"\n\t\t    ba-event:invoke-rerecord=\"rerecord\"\n\t\t    ba-event:invoke-stop=\"stop\"\n\t\t    ba-event:invoke-skip=\"invoke_skip\"\n\t\t    ba-event:upload-covershot=\"upload_covershot\"\n\t\t></ba-{{dyncontrolbar}}>\n    </div>\n</div>\n\n<div data-selector=\"recorder-player\" ba-if=\"{{player_active}}\" ba-styles=\"{{widthHeightStyles}}\">\n\t<span ba-show=\"{{ie8}}\">&nbsp;</span>\n\t<ba-{{dynvideoplayer}}\n\t    ba-theme=\"{{theme || 'default'}}\"\n        ba-themecolor=\"{{themecolor}}\"\n        ba-source=\"{{playbacksource}}\"\n        ba-poster=\"{{playbackposter}}\"\n        ba-hideoninactivity=\"{{false}}\"\n        ba-forceflash=\"{{forceflash}}\"\n        ba-noflash=\"{{noflash}}\"\n        ba-stretch=\"{{stretch}}\"\n\t\tba-onlyaudio=\"{{onlyaudio}}\"\n        ba-attrs=\"{{playerattrs}}\"\n        ba-data:id=\"player\"\n        ba-width=\"{{width}}\"\n        ba-height=\"{{height}}\"\n        ba-totalduration=\"{{duration / 1000}}\"\n        ba-rerecordable=\"{{rerecordable && (recordings === null || recordings > 0)}}\"\n        ba-submittable=\"{{manualsubmit && verified}}\"\n        ba-reloadonplay=\"{{true}}\"\n        ba-autoplay=\"{{autoplay}}\"\n        ba-nofullscreen=\"{{nofullscreen}}\"\n        ba-topmessage=\"{{playertopmessage}}\"\n\t\tba-event:loaded=\"ready_to_play\"\n        ba-event:rerecord=\"rerecord\"\n        ba-event:playing=\"playing\"\n        ba-event:paused=\"paused\"\n        ba-event:ended=\"ended\"\n        ba-event:submit=\"manual_submit\"\n\t>\n\t</ba-{{dynvideoplayer}}>\n</div>\n",

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
                    "allowscreen": false,
                    "nofullscreen": false,
                    "recordingwidth": undefined,
                    "recordingheight": undefined,
                    "countdown": 3,
                    "snapshotmax": 15,
                    "framerate": null,
                    "audiobitrate": null,
                    "videobitrate": null,
                    "snapshottype": "jpg",
                    "picksnapshots": true,
                    "playbacksource": "",
                    "screen": {},
                    "playbackposter": "",
                    "recordermode": true,
                    "skipinitial": false,
                    "skipinitialonrerecord": false,
                    "timelimit": null,
                    "timeminlimit": null,
                    "rtmpstreamtype": "mp4",
                    "rtmpmicrophonecodec": "speex",
                    "webrtcstreaming": false,
                    "microphone-volume": 1.0,
                    "flip-camera": false,
                    "early-rerecord": false,
                    "custom-covershots": false,
                    "manualsubmit": false,
                    "allowedextensions": null,
                    "filesizelimit": null,
                    "faceoutline": false,

                    /* Configuration */
                    "forceflash": false,
                    "simulate": false,
                    "noflash": false,
                    "onlyaudio": false,
                    "noaudio": false,
                    "flashincognitosupport": false,
                    "localplayback": false,
                    "uploadoptions": {},
                    "playerattrs": {},
                    "shortMessage": true,

                    /* Options */
                    "rerecordable": true,
                    "allowcancel": false,
                    "recordings": null,
                    "ready": true,
                    "stretch": false

                },

                computed: {
                    "nativeRecordingWidth:recordingwidth,record_media": function() {
                        return this.get("recordingwidth") || (this.get("record_media") !== "screen" ? 640 : (window.innerWidth || document.body.clientWidth));
                    },
                    "nativeRecordingHeight:recordingheight,record_media": function() {
                        return this.get("recordingheight") || (this.get("record_media") !== "screen" ? 480 : (window.innerHeight || document.body.clientHeight));
                    },
                    "widthHeightStyles:width,height": function() {
                        var result = {};
                        var width = this.get("width");
                        var height = this.get("height");
                        if (width)
                            result.width = width + ((width + '').match(/^\d+$/g) ? 'px' : '');
                        if (height)
                            result.height = height + ((height + '').match(/^\d+$/g) ? 'px' : '');
                        return result;
                    }
                },

                scopes: {
                    player: ">[id='player']"
                },

                types: {
                    "allowscreen": "boolean",
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
                    "skipinitialonrerecord": "boolean",
                    "picksnapshots": "boolean",
                    "localplayback": "boolean",
                    "noaudio": "boolean",
                    "skipinitial": "boolean",
                    "webrtcstreaming": "boolean",
                    "microphone-volume": "float",
                    "audiobitrate": "int",
                    "videobitrate": "int",
                    "flip-camera": "boolean",
                    "faceoutline": "boolean",
                    "early-rerecord": "boolean",
                    "custom-covershots": "boolean",
                    "manualsubmit": "boolean",
                    "simulate": "boolean",
                    "allowedextensions": "array",
                    "onlyaudio": "boolean",
                    "allowcancel": "boolean"
                },

                extendables: ["states"],

                remove_on_destroy: true,

                create: function() {

                    if (this.get("theme") in Assets.recorderthemes) {
                        Objs.iter(Assets.recorderthemes[this.get("theme")], function(value, key) {
                            if (!this.isArgumentAttr(key))
                                this.set(key, value);
                        }, this);
                    }
                    this.set("ie8", Info.isInternetExplorer() && Info.internetExplorerVersion() < 9);
                    this.set("hideoverlay", false);

                    if (Info.isMobile()) {
                        this.set("skipinitial", false);
                        this.set("skipinitialonrerecord", false);
                        this.set("allowscreen", false);
                    }

                    this.__attachRequested = false;
                    this.__activated = false;
                    this._bound = false;
                    this.__recording = false;
                    this.__error = null;
                    this.__currentStretch = null;

                    this.on("change:stretch", function() {
                        this._updateStretch();
                    }, this);
                    this.host = new Host({
                        stateRegistry: new ClassRegistry(this.cls.recorderStates())
                    });
                    this.host.dynamic = this;
                    this.host.initialize(InitialState);

                    this._timer = new Timers.Timer({
                        context: this,
                        fire: this._timerFire,
                        delay: 250,
                        start: true
                    });

                    this.__cameraResponsive = true;
                    this.__cameraSignal = true;

                    if (this.get("onlyaudio")) {
                        this.set("picksnapshots", false);
                        this.set("allowupload", false);
                    }

                },

                state: function() {
                    return this.host.state();
                },

                recorderAttached: function() {
                    return !!this.recorder;
                },

                videoError: function() {
                    return this.__error;
                },

                _error: function(error_type, error_code) {
                    this.__error = {
                        error_type: error_type,
                        error_code: error_code
                    };
                    this.trigger("error:" + error_type, error_code);
                    this.trigger("error", error_type, error_code);
                },

                _clearError: function() {
                    this.__error = null;
                },

                _detachRecorder: function() {
                    if (this.recorder)
                        this.recorder.weakDestroy();
                    this.recorder = null;
                    this.set("hasrecorder", false);
                },

                _attachRecorder: function() {
                    if (this.recorderAttached())
                        return;
                    if (!this.__activated) {
                        this.__attachRequested = true;
                        return;
                    }
                    this.set("hasrecorder", true);
                    this.snapshots = [];
                    this.__attachRequested = false;
                    var video = this.activeElement().querySelector("[data-video='video']");
                    this._clearError();
                    this.recorder = VideoRecorderWrapper.create({
                        element: video,
                        simulate: this.get("simulate"),
                        forceflash: this.get("forceflash"),
                        noflash: this.get("noflash"),
                        recordVideo: !this.get("onlyaudio"),
                        recordAudio: !this.get("noaudio"),
                        recordingWidth: this.get("nativeRecordingWidth"),
                        recordingHeight: this.get("nativeRecordingHeight"),
                        audioBitrate: this.get("audiobitrate"),
                        videoBitrate: this.get("videobitrate"),
                        flashFullSecurityDialog: !this.get("flashincognitosupport"),
                        rtmpStreamType: this.get("rtmpstreamtype"),
                        rtmpMicrophoneCodec: this.get("rtmpmicrophonecodec"),
                        webrtcStreaming: !!this.get("webrtcstreaming"),
                        screen: this.get("allowscreen") && this.get("record_media") === "screen" ? this.get("screen") : null,
                        framerate: this.get("framerate"),
                        flip: this.get("flip-camera")
                    });
                    if (this.recorder)
                        this.trigger("attached");
                    else
                        this._error("attach");
                },

                _softwareDependencies: function() {
                    if (!this.recorderAttached() || !this.recorder)
                        return Promise.error("No recorder attached.");
                    return this.recorder.softwareDependencies();
                },

                _bindMedia: function() {
                    if (this._bound || !this.recorderAttached() || !this.recorder)
                        return;
                    this.recorder.ready.success(function() {
                        this.recorder.on("require_display", function() {
                            this.set("hideoverlay", true);
                        }, this);
                        this.recorder.bindMedia().error(function(e) {
                            this.trigger("access_forbidden", e);
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this._error("bind", e);
                        }, this).success(function() {
                            this.trigger("access_granted");
                            this.recorder.setVolumeGain(this.get("microphone-volume"));
                            this.set("hideoverlay", false);
                            this.off("require_display", null, this);
                            this.recorder.enumerateDevices().success(function(devices) {
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

                isFlash: function() {
                    return this.recorder && this.recorder.isFlash();
                },

                _initializeUploader: function() {
                    if (this._dataUploader)
                        this._dataUploader.weakDestroy();
                    this._dataUploader = new MultiUploader();
                },

                _unbindMedia: function() {
                    if (!this._bound)
                        return;
                    this.recorder.unbindMedia();
                    this._bound = false;
                },

                _uploadCovershot: function(image) {
                    if (this.get("simulate"))
                        return;
                    this.__lastCovershotUpload = image;
                    var uploader = this.recorder.createSnapshotUploader(image, this.get("snapshottype"), this.get("uploadoptions").image);
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _uploadCovershotFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    this.__lastCovershotUpload = file;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").image));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _uploadVideoFile: function(file) {
                    if (this.get("simulate"))
                        return;
                    var uploader = FileUploader.create(Objs.extend({
                        source: file
                    }, this.get("uploadoptions").video));
                    uploader.upload();
                    this._dataUploader.addUploader(uploader);
                },

                _prepareRecording: function() {
                    return Promise.create(true);
                },

                _startRecording: function() {
                    if (this.__recording)
                        return Promise.error(true);
                    if (!this.get("noaudio"))
                        this.recorder.testSoundLevel(false);
                    this.set("devicetesting", false);
                    return this.recorder.startRecord({
                        rtmp: this.get("uploadoptions").rtmp,
                        video: this.get("uploadoptions").video,
                        audio: this.get("uploadoptions").audio,
                        webrtcStreaming: this.get("uploadoptions").webrtcStreaming
                    }).success(function() {
                        this.__recording = true;
                        this.__recording_start_time = Time.now();
                    }, this);
                },

                _stopRecording: function() {
                    if (!this.__recording)
                        return Promise.error(true);
                    return this.recorder.stopRecord({
                        rtmp: this.get("uploadoptions").rtmp,
                        video: this.get("uploadoptions").video,
                        audio: this.get("uploadoptions").audio,
                        webrtcStreaming: this.get("uploadoptions").webrtcStreaming
                    }).success(function(uploader) {
                        this.__recording = false;
                        uploader.upload();
                        this._dataUploader.addUploader(uploader);
                    }, this);
                },

                _verifyRecording: function() {
                    return Promise.create(true);
                },

                _afterActivate: function(element) {
                    inherited._afterActivate.call(this, element);
                    this.__activated = true;
                    if (this.__attachRequested)
                        this._attachRecorder();
                },

                _showBackgroundSnapshot: function() {
                    if (this.get("onlyaudio"))
                        return;
                    this._hideBackgroundSnapshot();
                    this.__backgroundSnapshot = this.recorder.createSnapshot(this.get("snapshottype"));
                    var el = this.activeElement().querySelector("[data-video]");
                    var dimensions = Dom.elementDimensions(el);
                    this.__backgroundSnapshotDisplay = this.recorder.createSnapshotDisplay(el, this.__backgroundSnapshot, 0, 0, dimensions.width, dimensions.height);
                },

                _hideBackgroundSnapshot: function() {
                    if (this.get("onlyaudio"))
                        return;
                    if (this.__backgroundSnapshotDisplay)
                        this.recorder.removeSnapshotDisplay(this.__backgroundSnapshotDisplay);
                    delete this.__backgroundSnapshotDisplay;
                    if (this.__backgroundSnapshot)
                        this.recorder.removeSnapshot(this.__backgroundSnapshot);
                    delete this.__backgroundSnapshot;
                },

                object_functions: ["record", "rerecord", "stop", "play", "pause", "reset"],

                functions: {

                    cancel: function() {
                        if (confirm(this.stringUnicode("cancel-confirm")))
                            this.execute("reset");
                    },

                    record: function() {
                        this.host.state().record();
                    },

                    record_video: function() {
                        this.host.state().selectRecord();
                    },

                    record_screen: function() {
                        this.host.state().selectRecordScreen();
                    },

                    upload_video: function(file) {
                        this.host.state().selectUpload(file);
                    },

                    upload_covershot: function(file) {
                        this.host.state().uploadCovershot(file);
                    },

                    select_camera: function(camera_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                video: camera_id
                            });
                            this.set("selectedcamera", camera_id);
                        }
                    },

                    select_microphone: function(microphone_id) {
                        if (this.recorder) {
                            this.recorder.setCurrentDevices({
                                audio: microphone_id
                            });
                            this.recorder.testSoundLevel(true);
                            this.set("selectedmicrophone", microphone_id);
                        }
                        this.set("microphonehealthy", false);
                    },

                    invoke_skip: function() {
                        this.trigger("invoke-skip");
                    },

                    select_image: function(image) {
                        this.trigger("select-image", image);
                    },

                    rerecord: function() {
                        if (confirm(this.stringUnicode("rerecord-confirm")))
                            this.host.state().rerecord();
                    },

                    stop: function() {
                        this.host.state().stop();
                    },

                    play: function() {
                        this.host.state().play();
                    },

                    pause: function() {
                        this.host.state().pause();
                    },

                    message_click: function() {
                        this.trigger("message-click");
                    },

                    message_link_click: function(link) {
                        this.trigger("message-link-click", link);
                    },

                    playing: function() {
                        this.trigger("playing");
                    },

                    paused: function() {
                        this.trigger("paused");
                    },

                    ended: function() {
                        this.trigger("ended");
                    },

                    reset: function() {
                        this._stopRecording().callback(function() {
                            this._unbindMedia();
                            this._hideBackgroundSnapshot();
                            this._detachRecorder();
                            this.host.state().next("Initial");
                        }, this);
                    },

                    manual_submit: function() {
                        this.set("rerecordable", false);
                        this.set("manualsubmit", false);
                        this.trigger("manually_submitted");
                    },

                    ready_to_play: function() {
                        this.trigger("ready_to_play");
                    }

                },

                destroy: function() {
                    this._timer.destroy();
                    this.host.destroy();
                    this._detachRecorder();
                    inherited.destroy.call(this);
                },

                deltaCoefficient: function() {
                    return this.recorderAttached() ? this.recorder.deltaCoefficient() : null;
                },

                blankLevel: function() {
                    return this.recorderAttached() ? this.recorder.blankLevel() : null;
                },

                lightLevel: function() {
                    return this.recorderAttached() ? this.recorder.lightLevel() : null;
                },

                soundLevel: function() {
                    return this.recorderAttached() ? this.recorder.soundLevel() : null;
                },

                _timerFire: function() {
                    if (this.destroyed())
                        return;
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

                    if (!this.get("onlyaudio")) {
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

                _updateCSSSize: function() {
                    var width = Dom.elementDimensions(this.activeElement()).width;
                    this.set("csssize", width > 400 ? "normal" : (width > 300 ? "medium" : "small"));
                },

                videoHeight: function() {
                    return this.recorderAttached() ? this.recorder.cameraHeight() : NaN;
                },

                videoWidth: function() {
                    return this.recorderAttached() ? this.recorder.cameraWidth() : NaN;
                },

                aspectRatio: function() {
                    return this.videoWidth() / this.videoHeight();
                },

                parentWidth: function() {
                    return this.get("width") || Dom.elementDimensions(this.activeElement()).width;
                },

                parentHeight: function() {
                    return this.get("height") || Dom.elementDimensions(this.activeElement()).height;
                },

                parentAspectRatio: function() {
                    return this.parentWidth() / this.parentHeight();
                },

                averageFrameRate: function() {
                    return this.recorderAttached() ? this.recorder.averageFrameRate() : null;
                },

                _updateStretch: function() {
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
                            Dom.elementRemoveClass(this.activeElement(), this.get("css") + "-stretch-" + this.__currentStretch);
                        if (newStretch)
                            Dom.elementAddClass(this.activeElement(), this.get("css") + "-stretch-" + newStretch);
                    }
                    this.__currentStretch = newStretch;
                }

            };
        }, {

            recorderStates: function() {
                return [RecorderStates];
            }

        })
        .register("ba-videorecorder")
        .registerFunctions({ /**/"!player_active": function (obj) { with (obj) { return !player_active; } }, "css": function (obj) { with (obj) { return css; } }, "csssize": function (obj) { with (obj) { return csssize; } }, "iecss": function (obj) { with (obj) { return iecss; } }, "ie8 ? 'ie8' : 'noie8'": function (obj) { with (obj) { return ie8 ? 'ie8' : 'noie8'; } }, "csstheme": function (obj) { with (obj) { return csstheme; } }, "fullscreened ? 'fullscreen' : 'normal'": function (obj) { with (obj) { return fullscreened ? 'fullscreen' : 'normal'; } }, "firefox ? 'firefox' : 'common'": function (obj) { with (obj) { return firefox ? 'firefox' : 'common'; } }, "themecolor": function (obj) { with (obj) { return themecolor; } }, "widthHeightStyles": function (obj) { with (obj) { return widthHeightStyles; } }, "hasrecorder ? 'hasrecorder' : 'norecorder'": function (obj) { with (obj) { return hasrecorder ? 'hasrecorder' : 'norecorder'; } }, "faceoutline && hasrecorder": function (obj) { with (obj) { return faceoutline && hasrecorder; } }, "!hideoverlay": function (obj) { with (obj) { return !hideoverlay; } }, "dynloader": function (obj) { with (obj) { return dynloader; } }, "cssloader || css": function (obj) { with (obj) { return cssloader || css; } }, "tmplloader": function (obj) { with (obj) { return tmplloader; } }, "loader_active": function (obj) { with (obj) { return loader_active; } }, "loadertooltip": function (obj) { with (obj) { return loadertooltip; } }, "hovermessage": function (obj) { with (obj) { return hovermessage; } }, "loaderlabel": function (obj) { with (obj) { return loaderlabel; } }, "dynmessage": function (obj) { with (obj) { return dynmessage; } }, "cssmessage || css": function (obj) { with (obj) { return cssmessage || css; } }, "tmplmessage": function (obj) { with (obj) { return tmplmessage; } }, "message_active": function (obj) { with (obj) { return message_active; } }, "message": function (obj) { with (obj) { return message; } }, "message_links": function (obj) { with (obj) { return message_links; } }, "dyntopmessage": function (obj) { with (obj) { return dyntopmessage; } }, "csstopmessage || css": function (obj) { with (obj) { return csstopmessage || css; } }, "tmpltopmessage": function (obj) { with (obj) { return tmpltopmessage; } }, "topmessage_active && (topmessage || hovermessage)": function (obj) { with (obj) { return topmessage_active && (topmessage || hovermessage); } }, "hovermessage || topmessage": function (obj) { with (obj) { return hovermessage || topmessage; } }, "dynchooser": function (obj) { with (obj) { return dynchooser; } }, "onlyaudio": function (obj) { with (obj) { return onlyaudio; } }, "csschooser || css": function (obj) { with (obj) { return csschooser || css; } }, "tmplchooser": function (obj) { with (obj) { return tmplchooser; } }, "allowscreen": function (obj) { with (obj) { return allowscreen; } }, "chooser_active && !is_initial_state": function (obj) { with (obj) { return chooser_active && !is_initial_state; } }, "allowrecord": function (obj) { with (obj) { return allowrecord; } }, "allowupload": function (obj) { with (obj) { return allowupload; } }, "allowcustomupload": function (obj) { with (obj) { return allowcustomupload; } }, "allowedextensions": function (obj) { with (obj) { return allowedextensions; } }, "primaryrecord": function (obj) { with (obj) { return primaryrecord; } }, "timelimit": function (obj) { with (obj) { return timelimit; } }, "dynimagegallery": function (obj) { with (obj) { return dynimagegallery; } }, "cssimagegallery || css": function (obj) { with (obj) { return cssimagegallery || css; } }, "tmplimagegallery": function (obj) { with (obj) { return tmplimagegallery; } }, "imagegallery_active": function (obj) { with (obj) { return imagegallery_active; } }, "gallerysnapshots": function (obj) { with (obj) { return gallerysnapshots; } }, "nativeRecordingWidth": function (obj) { with (obj) { return nativeRecordingWidth; } }, "nativeRecordingHeight": function (obj) { with (obj) { return nativeRecordingHeight; } }, "dyncontrolbar": function (obj) { with (obj) { return dyncontrolbar; } }, "csscontrolbar || css": function (obj) { with (obj) { return csscontrolbar || css; } }, "tmplcontrolbar": function (obj) { with (obj) { return tmplcontrolbar; } }, "controlbar_active": function (obj) { with (obj) { return controlbar_active; } }, "cameras": function (obj) { with (obj) { return cameras; } }, "microphones": function (obj) { with (obj) { return microphones; } }, "noaudio": function (obj) { with (obj) { return noaudio; } }, "record_media==='screen'": function (obj) { with (obj) { return record_media==='screen'; } }, "selectedcamera || 0": function (obj) { with (obj) { return selectedcamera || 0; } }, "selectedmicrophone || 0": function (obj) { with (obj) { return selectedmicrophone || 0; } }, "camerahealthy": function (obj) { with (obj) { return camerahealthy; } }, "microphonehealthy": function (obj) { with (obj) { return microphonehealthy; } }, "settingsvisible": function (obj) { with (obj) { return settingsvisible; } }, "recordvisible": function (obj) { with (obj) { return recordvisible; } }, "allowcancel && cancancel": function (obj) { with (obj) { return allowcancel && cancancel; } }, "uploadcovershotvisible": function (obj) { with (obj) { return uploadcovershotvisible; } }, "rerecordvisible": function (obj) { with (obj) { return rerecordvisible; } }, "stopvisible": function (obj) { with (obj) { return stopvisible; } }, "skipvisible": function (obj) { with (obj) { return skipvisible; } }, "controlbarlabel": function (obj) { with (obj) { return controlbarlabel; } }, "mintimeindicator": function (obj) { with (obj) { return mintimeindicator; } }, "timeminlimit": function (obj) { with (obj) { return timeminlimit; } }, "player_active": function (obj) { with (obj) { return player_active; } }, "ie8": function (obj) { with (obj) { return ie8; } }, "dynvideoplayer": function (obj) { with (obj) { return dynvideoplayer; } }, "theme || 'default'": function (obj) { with (obj) { return theme || 'default'; } }, "playbacksource": function (obj) { with (obj) { return playbacksource; } }, "playbackposter": function (obj) { with (obj) { return playbackposter; } }, "false": function (obj) { with (obj) { return false; } }, "forceflash": function (obj) { with (obj) { return forceflash; } }, "noflash": function (obj) { with (obj) { return noflash; } }, "stretch": function (obj) { with (obj) { return stretch; } }, "playerattrs": function (obj) { with (obj) { return playerattrs; } }, "width": function (obj) { with (obj) { return width; } }, "height": function (obj) { with (obj) { return height; } }, "duration / 1000": function (obj) { with (obj) { return duration / 1000; } }, "rerecordable && (recordings === null || recordings > 0)": function (obj) { with (obj) { return rerecordable && (recordings === null || recordings > 0); } }, "manualsubmit && verified": function (obj) { with (obj) { return manualsubmit && verified; } }, "true": function (obj) { with (obj) { return true; } }, "autoplay": function (obj) { with (obj) { return autoplay; } }, "nofullscreen": function (obj) { with (obj) { return nofullscreen; } }, "playertopmessage": function (obj) { with (obj) { return playertopmessage; } }/**/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "recorder-error": "An error occurred, please try again later. Click to retry.",
            "attach-error": "We could not access the media interface. Depending on the device and browser, you might need to install Flash or access the page via SSL.",
            "software-required": "Please click below to install / activate the following requirements in order to proceed.",
            "software-waiting": "Waiting for the requirements to be installed / activated. You might need to refresh the page after completion.",
            "access-forbidden": "Access to the media was forbidden. Click to retry.",
            "pick-covershot": "Pick a covershot.",
            "uploading": "Uploading",
            "uploading-failed": "Uploading failed - click here to retry.",
            "verifying": "Verifying",
            "verifying-failed": "Verifying failed - click here to retry.",
            "rerecord-confirm": "Do you really want to redo your video?",
            "cancel-confirm": "Do you really want to cancel your video upload?",
            "video_file_too_large": "Your video file is too large (%s) - click here to try again with a smaller video file.",
            "unsupported_video_type": "Please upload: %s - click here to retry."
        });
});
Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.State", [
    "base:States.State",
    "base:Events.ListenMixin",
    "base:Objs"
], function(State, ListenMixin, Objs, scoped) {
    return State.extend({
        scoped: scoped
    }, [ListenMixin, {

        dynamics: [],

        _start: function() {
            this.dyn = this.host.dynamic;
            Objs.iter(Objs.extend({
                "message": false,
                "chooser": false,
                "topmessage": false,
                "controlbar": false,
                "loader": false,
                "imagegallery": false
            }, Objs.objectify(this.dynamics)), function(value, key) {
                this.dyn.set(key + "_active", value);
            }, this);
            this.dyn.set("playertopmessage", "");
            this.dyn.set("message_links", null);
            this.dyn._accessing_camera = false;
            this._started();
        },

        _started: function() {},

        record: function() {
            this.dyn.set("autorecord", true);
        },

        stop: function() {
            this.dyn.scopes.player.execute('stop');
        },

        play: function() {
            this.dyn.scopes.player.execute('play');
        },

        pause: function() {
            this.dyn.scopes.player.execute('pause');
        },

        rerecord: function() {},

        selectRecord: function() {},

        selectRecordScreen: function() {},

        selectUpload: function(file) {},

        uploadCovershot: function(file) {}

    }]);
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.FatalError", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "browser:Info",
    "base:Timers.Timer"
], function(State, Info, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],
        _locals: ["message", "retry"],

        _started: function() {
            this.dyn.set("message", this._message || this.dyn.string("recorder-error"));
            this.dyn.set("shortMessage", this.dyn.get("message").length < 30);
            this.listenOn(this.dyn, "message-click", function() {
                if (this._retry)
                    this.next(this._retry);
            });
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Initial", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        _started: function() {
            this.dyn.set("is_initial_state", true);
            this.dyn.set("verified", false);
            this.dyn.set("playbacksource", null);
            this.dyn.set("playbackposter", null);
            this.dyn.set("player_active", false);
            this.dyn._initializeUploader();
            if (!this.dyn.get("recordermode")) {
                if (!this.dyn.get("video")) {
                    console.warn("recordermode:false requires an existing video to be present and provided.");
                    this.dyn.set("recordermode", true);
                } else
                    this.next("Player");
            } else if (this.dyn.get("autorecord") || this.dyn.get("skipinitial"))
                this.eventualNext("RequiredSoftwareCheck");
            else
                this.next("Chooser");
        },

        _end: function() {
            this.dyn.set("is_initial_state", false);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Player", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        rerecord: function() {
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        _started: function() {
            this.dyn.set("player_active", true);
        },

        _end: function() {
            this.dyn.set("player_active", false);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Chooser", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Strings",
    "browser:Info"
], function(State, Strings, Info, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["chooser"],

        record: function() {
            this.dyn.set("autorecord", true);
            this.selectRecord();
        },

        selectRecordScreen: function() {
            this.dyn.set("record_media", "screen");
            this.next("RequiredSoftwareCheck");
        },

        selectRecord: function() {
            this.dyn.set("record_media", "camera");
            this.next("RequiredSoftwareCheck");
        },

        selectUpload: function(file) {
            if (!(Info.isMobile() && Info.isAndroid() && Info.isCordova())) {
                if (this.dyn.get("allowedextensions")) {
                    var filename = (file.files[0].name || "").toLowerCase();
                    var found = false;
                    this.dyn.get("allowedextensions").forEach(function(extension) {
                        if (Strings.ends_with(filename, "." + extension.toLowerCase()))
                            found = true;
                    }, this);
                    if (!found) {
                        this.next("FatalError", {
                            message: this.dyn.string("unsupported_video_type").replace("%s", this.dyn.get("allowedextensions").join(" / ")),
                            retry: "Chooser"
                        });
                        return;
                    }
                }
                if (this.dyn.get("filesizelimit") && file.files && file.files.length > 0 && file.files[0].size && file.files[0].size > this.dyn.get("filesizelimit")) {
                    var fact = "KB";
                    var size = Math.round(file.files[0].size / 1000);
                    var limit = Math.round(this.dyn.get("filesizelimit") / 1000);
                    if (size > 999) {
                        fact = "MB";
                        size = Math.round(size / 1000);
                        limit = Math.round(limit / 1000);
                    }
                    this.next("FatalError", {
                        message: this.dyn.string("video_file_too_large").replace("%s", size + fact + " / " + limit + fact),
                        retry: "Chooser"
                    });
                    return;
                }
            }
            this._uploadFile(file);
        },

        _uploadFile: function(file) {
            this.dyn.set("creation-type", Info.isMobile() ? "mobile" : "upload");
            this.dyn._prepareRecording().success(function() {
                this.dyn.trigger("upload_selected", file);
                this.dyn._uploadVideoFile(file);
                this.next("Uploading");
            }, this).error(function(s) {
                this.next("FatalError", {
                    message: s,
                    retry: "Chooser"
                });
            }, this);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RequiredSoftwareCheck", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "error", function(s) {
                this.next("FatalError", {
                    message: this.dyn.string("attach-error"),
                    retry: "Initial"
                });
            }, this);
            this.dyn._attachRecorder();
            if (this.dyn) {
                this.dyn.on("message-link-click", function(link) {
                    link.execute();
                    this.next("RequiredSoftwareWait");
                }, this);
                this.dyn._softwareDependencies().error(function(dependencies) {
                    this.dyn.set("message_links", dependencies);
                    this.dyn.set("loader_active", false);
                    this.dyn.set("message_active", true);
                    this.dyn.set("message", this.dyn.string("software-required"));
                }, this).success(function() {
                    this.next("CameraAccess");
                }, this);
            }
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RequiredSoftwareWait", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Promise",
    "browser:Dom"
], function(State, Promise, Dom, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["message"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.dyn.set("message", this.dyn.string("software-waiting"));
            Promise.resilience(function() {
                if (Dom.isTabHidden())
                    return Promise.error("Not ready");
                return this.dyn._softwareDependencies();
            }, this, 120, [], 1000).success(function() {
                this.next("CameraAccess");
            }, this).error(function() {
                this.next("RequiredSoftwareCheck");
            }, this);
            this.dyn.on("message-click", function() {
                this.next("RequiredSoftwareCheck");
            }, this);
        }

    });
});



Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraAccess", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Timers.Timer"
], function(State, Timer, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],

        _started: function() {
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("loaderlabel", "");
            this.listenOn(this.dyn, "bound", function() {
                this.dyn.set("creation-type", this.dyn.isFlash() ? "flash" : "webrtc");
                if (this.dyn.get("onlyaudio") || this.dyn.get("record_media") === "screen") {
                    this.next("CameraHasAccess");
                    return;
                }
                var timer = this.auto_destroy(new Timer({
                    start: true,
                    delay: 100,
                    context: this,
                    fire: function() {
                        if (this.dyn.blankLevel() >= 0.01 && this.dyn.deltaCoefficient() >= 0.01) {
                            timer.stop();
                            this.next("CameraHasAccess");
                        }
                    }
                }));
            }, this);
            this.listenOn(this.dyn, "error", function(s) {
                this.next("FatalError", {
                    message: this.dyn.string("attach-error"),
                    retry: "Initial"
                });
            }, this);
            this.listenOn(this.dyn, "access_forbidden", function() {
                this.next("FatalError", {
                    message: this.dyn.string("access-forbidden"),
                    retry: "Initial"
                });
            }, this);
            this.dyn._bindMedia();
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CameraHasAccess", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["topmessage", "controlbar"],

        _started: function() {
            this._preparePromise = null;
            if (this.dyn.get("countdown") > 0 && this.dyn.recorder && this.dyn.recorder.recordDelay(this.dyn.get("uploadoptions")) > this.dyn.get("countdown") * 1000)
                this._preparePromise = this.dyn._prepareRecording();
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn.set("settingsvisible", true);
            this.dyn.set("recordvisible", true);
            this.dyn.set("rerecordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", false);
            this.dyn.set("controlbarlabel", "");
            if (this.dyn.get("autorecord"))
                this.next("RecordPrepare", {
                    preparePromise: this._preparePromise
                });
        },

        record: function() {
            if (!this.dyn.get("autorecord"))
                this.next("RecordPrepare", {
                    preparePromise: this._preparePromise
                });
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.RecordPrepare", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Timers.Timer",
    "base:Time"
], function(State, Timer, Time, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader"],
        _locals: ["preparePromise"],

        _started: function() {
            this.dyn.set("message", "");
            this.dyn.set("loaderlabel", "");
            var startedRecording = false;
            this.dyn._accessing_camera = true;
            this._preparePromise = this._preparePromise || this.dyn._prepareRecording();
            var countdown = this.dyn.get("countdown") ? this.dyn.get("countdown") * 1000 : 0;
            var delay = this.dyn.recorder.recordDelay(this.dyn.get("uploadoptions")) || 0;
            if (countdown) {
                var displayDenominator = 1000;
                var silentTime = 0;
                var startTime = Time.now();
                var endTime = startTime + Math.max(delay, countdown);
                if (delay > countdown) {
                    silentTime = Math.min(500, delay - countdown);
                    displayDenominator = (delay - silentTime) / countdown * 1000;
                } else
                    this.dyn.set("loaderlabel", this.dyn.get("countdown"));
                var timer = new Timer({
                    context: this,
                    delay: 50,
                    fire: function() {
                        var now = Time.now();
                        var time_left = Math.max(0, endTime - now);
                        if (now > silentTime + startTime) {
                            this.dyn.set("loaderlabel", "" + Math.ceil((time_left - silentTime) / displayDenominator));
                            this.dyn.trigger("countdown", Math.round((time_left - silentTime) / displayDenominator * 1000));
                        }
                        if (endTime <= now) {
                            this.dyn.set("loaderlabel", "");
                            timer.stop();
                        }
                        if ((time_left <= delay) && !startedRecording) {
                            startedRecording = true;
                            this._startRecording();
                        }
                    }
                });
                this.auto_destroy(timer);
            } else
                this._startRecording();
        },

        record: function() {
            this._startRecording();
        },

        _startRecording: function() {
            this._preparePromise.success(function() {
                this.dyn._startRecording().success(function() {
                    this.next("Recording");
                }, this).error(function(s) {
                    this.next("FatalError", {
                        message: s,
                        retry: "RequiredSoftwareCheck"
                    });
                }, this);
            }, this).error(function(s) {
                this.next("FatalError", {
                    message: s,
                    retry: "RequiredSoftwareCheck"
                });
            }, this);
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Recording", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Timers.Timer",
    "base:Time",
    "base:TimeFormat",
    "base:Async"
], function(State, Timer, Time, TimeFormat, Async, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["topmessage", "controlbar"],

        _started: function() {
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
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

        _timerFire: function() {
            var limit = this.dyn.get("timelimit");
            var current = Time.now();
            var display = Math.max(0, limit ? (this._startTime + limit * 1000 - current) : (current - this._startTime));
            this.dyn.trigger("recording_progress", current - this._startTime);
            this.dyn.set("controlbarlabel", TimeFormat.format(TimeFormat.ELAPSED_MINUTES_SECONDS, display));

            if (this.dyn.get("timeminlimit"))
                this.dyn.set("mintimeindicator", (Time.now() - this._startTime) / 1000 <= this.dyn.get("timeminlimit"));

            if (limit && this._startTime + limit * 1000 <= current) {
                this._timer.stop();
                this.stop();
            }
        },

        stop: function() {
            var minlimit = this.dyn.get("timeminlimit");
            if (minlimit) {
                var delta = (Time.now() - this._startTime) / 1000;
                if (delta < minlimit) {
                    var limit = this.dyn.get("timelimit");
                    if (!limit || limit > delta)
                        return;
                }
            }
            if (this._stopping)
                return;
            this.dyn.set("loader_active", true);
            this.dyn.set("controlbar_active", false);
            this.dyn.set("topmessage_active", false);
            this.dyn.set("message_active", true);
            this.dyn.set("message", "");
            this._stopping = true;
            Async.eventually(function() {
                this.dyn._stopRecording().success(function() {
                    this._hasStopped();
                    if (this.dyn.get("picksnapshots") && this.dyn.snapshots.length >= this.dyn.get("gallerysnapshots"))
                        this.next("CovershotSelection");
                    else
                        this.next("Uploading");
                }, this).error(function(s) {
                    this.next("FatalError", {
                        message: s,
                        retry: "RequiredSoftwareCheck"
                    });
                }, this);
            }, this);
        },

        _hasStopped: function() {
            this.dyn.set("duration", Time.now() - this._startTime);
            this.dyn._showBackgroundSnapshot();
            this.dyn._unbindMedia();
            this.dyn.trigger("recording_stopped");
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.CovershotSelection", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["imagegallery", "topmessage", "controlbar"],

        _started: function() {
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("skipvisible", true);
            this.dyn.set("controlbarlabel", "");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            this.dyn.set("uploadcovershotvisible", this.dyn.get("custom-covershots"));
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", this.dyn.string('pick-covershot'));
            var imagegallery = this.dyn.scope(">[tagname='ba-videorecorder-imagegallery']").materialize(true);
            imagegallery.loadSnapshots();
            imagegallery.updateContainerSize();
            this.listenOn(this.dyn, "invoke-skip", function() {
                this._nextUploading(true);
            }, this);
            this.listenOn(this.dyn, "select-image", function(image) {
                this.dyn._uploadCovershot(image);
                this._nextUploading(false);
            }, this);
        },

        rerecord: function() {
            this.dyn._hideBackgroundSnapshot();
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        uploadCovershot: function(file) {
            this.dyn._uploadCovershotFile(file);
            this._nextUploading(false);
        },

        _nextUploading: function(skippedCovershot) {
            this.next("Uploading");
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Uploading", [
    "module:VideoRecorder.Dynamics.RecorderStates.State",
    "base:Time",
    "base:Async"
], function(State, Time, Async, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader", "message"],

        _started: function() {
            this.dyn.set("cancancel", true);
            this.dyn.set("skipinitial", this.dyn.get("skipinitial") || this.dyn.get("skipinitialonrerecord"));
            this.dyn.set("settingsvisible", false);
            this.dyn.set("recordvisible", false);
            this.dyn.set("stopvisible", false);
            this.dyn.set("loadlabel", "");
            this.dyn.set("controlbarlabel", "");
            this.dyn.trigger("uploading");
            this.dyn.set("rerecordvisible", this.dyn.get("early-rerecord"));
            if (this.dyn.get("early-rerecord"))
                this.dyn.set("controlbar_active", true);
            this.dyn.set("hovermessage", "");
            this.dyn.set("topmessage", "");
            this.dyn.set("message", this.dyn.string("uploading"));
            this.dyn.set("playertopmessage", this.dyn.get("message"));
            var uploader = this.dyn._dataUploader;
            this.listenOn(uploader, "success", function() {
                Async.eventually(function() {
                    if (this.destroyed())
                        return;
                    this._finished();
                    this.next("Verifying");
                }, this);
            });
            this.listenOn(uploader, "error", function() {
                this.dyn.set("player_active", false);
                this.next("FatalError", {
                    message: this.dyn.string("uploading-failed"),
                    retry: this.dyn.recorderAttached() ? "Uploading" : "Initial"
                });
            });
            this.listenOn(uploader, "progress", function(uploaded, total) {
                this.dyn.trigger("upload_progress", uploaded, total);
                if (total !== 0 && total > 0 && uploaded >= 0) {
                    var up = Math.min(100, Math.round(uploaded / total * 100));
                    if (!isNaN(up)) {
                        this.dyn.set("message", this.dyn.string("uploading") + ": " + up + "%");
                        this.dyn.set("playertopmessage", this.dyn.get("message"));
                    }
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
            this.dyn.set("start-upload-time", Time.now());
            uploader.reset();
            uploader.upload();
        },

        rerecord: function() {
            this.dyn._hideBackgroundSnapshot();
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        },

        _finished: function() {
            this.dyn.set("cancancel", false);
            this.dyn.trigger("uploaded");
            this.dyn.set("end-upload-time", Time.now());
        }

    });
});


Scoped.define("module:VideoRecorder.Dynamics.RecorderStates.Verifying", [
    "module:VideoRecorder.Dynamics.RecorderStates.State"
], function(State, scoped) {
    return State.extend({
        scoped: scoped
    }, {

        dynamics: ["loader", "message"],

        _started: function() {
            this.dyn.set("loadlabel", "");
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
            this.dyn._verifyRecording().success(function() {
                this.dyn.trigger("verified");
                this.dyn._hideBackgroundSnapshot();
                this.dyn._detachRecorder();
                if (this.dyn.get("recordings"))
                    this.dyn.set("recordings", this.dyn.get("recordings") - 1);
                this.dyn.set("message", "");
                this.dyn.set("playertopmessage", "");
                this.dyn.set("verified", true);
                this.next("Player");
            }, this).error(function() {
                this.dyn.set("player_active", false);
                this.next("FatalError", {
                    message: this.dyn.string("verifying-failed"),
                    retry: this.dyn.recorderAttached() ? "Verifying" : "Initial"
                });
            }, this);
        },

        rerecord: function() {
            this.dyn._hideBackgroundSnapshot();
            this.dyn._detachRecorder();
            this.dyn.trigger("rerecord");
            this.dyn.set("recordermode", true);
            this.next("Initial");
        }

    });
});
Scoped.define("module:VideoRecorder.Dynamics.Topmessage", [
    "dynamics:Dynamic"
], function(Class, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "\n<div class=\"{{css}}-topmessage-container\">\n    <div class='{{css}}-topmessage-background'>\n    </div>\n    <div data-selector=\"recorder-topmessage-block\" class='{{css}}-topmessage-message'>\n        {{topmessage}}\n    </div>\n</div>\n",

                attrs: {
                    "css": "ba-videorecorder",
                    "topmessage": ''
                }

            };
        })
        .registerFunctions({ /**/"css": function (obj) { with (obj) { return css; } }, "topmessage": function (obj) { with (obj) { return topmessage; } }/**/ })
        .register("ba-videorecorder-topmessage");
});
}).call(Scoped);