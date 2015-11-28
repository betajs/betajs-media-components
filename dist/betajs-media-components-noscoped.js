/*!
betajs-media-components - v0.0.1 - 2015-11-28
Copyright (c) Oliver Friedmann
MIT Software License.
*/
(function () {

var Scoped = this.subScope();

Scoped.binding("module", "global:BetaJS.MediaComponents");
Scoped.binding("base", "global:BetaJS");

Scoped.binding("jquery", "global:jQuery");

Scoped.define("module:", function () {
	return {
		guid: "7a20804e-be62-4982-91c6-98eb096d2e70",
		version: '4.1448739603912'
	};
});

BetaJS = BetaJS || {};
BetaJS.MediaComponents = BetaJS.MediaComponents || {};
BetaJS.MediaComponents.Templates = BetaJS.MediaComponents.Templates || {};
BetaJS.MediaComponents.Templates.controlbar = ' <div class="{{css}}-dashboard">  <div class="{{css}}-progressbar {{expandedprogress ? \'\' : (css + \'-progressbar-small\')}}"       onmousedown="{{startUpdatePosition(domEvent)}}"       onmouseup="{{stopUpdatePosition(domEvent)}}"       onmouseleave="{{stopUpdatePosition(domEvent)}}"       onmousemove="{{progressUpdatePosition(domEvent)}}">   <div class="{{css}}-progressbar-cache" ba-styles="{{{width: Math.round(cached / duration * 100) + \'%\'}}}"></div>   <div class="{{css}}-progressbar-position" ba-styles="{{{width: Math.round(position / duration * 100) + \'%\'}}}" title="{{string(\'video-progress\')}}">    <div class="{{css}}-progressbar-button"></div>   </div>  </div>  <div class="{{css}}-backbar"></div>  <div class="{{css}}-controlbar">         <div class="{{css}}-leftbutton-container">             <div class="{{css}}-button-inner" ba-click="rerecord()" title="{{string(\'rerecord-video\')}">                 <i class="{{css}}-icon-ccw"></i>             </div>         </div>   <div class="{{css}}-leftbutton-container">    <div class="{{css}}-button-inner" ba-show="{{!pausable}}" ba-click="play()" title="{{string(\'play-video\')}}">     <i class="{{css}}-icon-play"></i>    </div>             <div class="{{css}}-button-inner" ba-show="{{pausable}}" ba-click="pause()" title="{{string(\'pause-video\')}}">                 <i class="{{css}}-icon-pause"></i>             </div>   </div>   <div class="{{css}}-time-container">    <div class="{{css}}-time-value" title="{{string(\'elapsed-time\')}}">{{position_formatted}}</div>    <div class="{{css}}-time-sep">/</div>    <div class="{{css}}-time-value" title="{{string(\'total-time\')}}">{{duration_formatted}}</div>   </div>   <div class="{{css}}-rightbutton-container">    <div class="{{css}}-button-inner" ba-click="toggle_fullscreen()" title="{{string(\'fullscreen-video\')}}">     <i class="{{css}}-icon-resize-full"></i>    </div>   </div>   <div class="{{css}}-volumebar">    <div class="{{css}}-volumebar-inner"         onmousedown="{{startUpdateVolume(domEvent)}}"                  onmouseup="{{stopUpdateVolume(domEvent)}}"                  onmouseleave="{{stopUpdateVolume(domEvent)}}"                  onmousemove="{{progressUpdateVolume(domEvent)}}">     <div class="{{css}}-volumebar-position" ba-styles="{{{width: Math.round(volume * 100) + \'%\'}}}"></div>     <div class="{{css}}-volumebar-button" title="{{string(\'volume-button\')}}"></div>    </div>   </div>   <div class="{{css}}-rightbutton-container">    <div class="{{css}}-button-inner" ba-click="toggle_volume()" title="{{string(volume > 0 ? \'volume-mute\' : \'volume-unmute\')}}">     <i class="{{css + \'-icon-volume-\' + (volume >= 0.5 ? \'up\' : (volume > 0 ? \'down\' : \'off\')) }}"></i>    </div>   </div>  </div> </div> ';

BetaJS.MediaComponents.Templates.loader = ' <div class="{{css}}-loader-container">     <div class="{{css}}-loader-loader" title="{{string(\'tooltip\')}}">     </div> </div>';

BetaJS.MediaComponents.Templates.message = ' <div class="{{css}}-message-container" ba-click="click()">     <div class=\'{{css}}-message-message\'>         {{message}}     </div> </div>';

BetaJS.MediaComponents.Templates.playbutton = ' <div class="{{css}}-playbutton-container">  <div class="{{css}}-playbutton-button" ba-click="play()" title="{{string(\'tooltip\')}}"></div> </div> ';

BetaJS.MediaComponents.Templates.player = ' <div class="{{css}}-container">     <video poster="{{poster}}" src="{{src}}" loop autoplay class="{{css}}-video"></video>     <div class=\'{{css}}-overlay\'>         <ba-videoplayer-controlbar></ba-videoplayer-controlbar>     </div> </div>';

Scoped.require(["module:Assets"], function (Assets) {
	Assets.strings.register({
		"ba-videoplayer-playbutton.tooltip": "Hier clicken um Wiedergabe zu starten.",
		"ba-videoplayer-loader.tooltip": "Video wird geladen...",
    	"ba-videoplayer-controlbar.video-progress": "Videofortschritt",
    	"ba-videoplayer-controlbar.rerecord-video": "Video erneut aufnehmen?",
    	"ba-videoplayer-controlbar.play-video": "Video wiedergeben",
    	"ba-videoplayer-controlbar.pause-video": "Video pausieren",
    	"ba-videoplayer-controlbar.elapsed-time": "Vergangene Zeit",
    	"ba-videoplayer-controlbar.total-time": "L&auml;nge des Videos",
    	"ba-videoplayer-controlbar.fullscreen-video": "Vollbildmodus",
    	"ba-videoplayer-controlbar.volume-button": "Lautst&auml;rke regulieren",
    	"ba-videoplayer-controlbar.volume-mute": "Ton abstellen",
    	"ba-videoplayer-controlbar.volume-unmute": "Ton wieder einstellen"
	}, ["language:de"]);
});


Scoped.define("module:VideoPlayer.Dynamics.Controlbar", [
    "base:Dynamics.Dynamic",
    "base:Time",
    "module:Templates",
    "jquery:",
    "module:Assets"
], function (Class, Time, Templates, $, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.controlbar,
			
			attrs: {
				"css": "ba-videoplayer",
				"duration": 5 * 60 * 1000,
				"position": 3 * 60 * 1000,
				"cached": 4 * 60 * 1000,
				"volume": 0.6,
				"expandedprogress": true,
				"pausable": false
			},
			
			functions: {
				
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
				},
				
				stopUpdateVolume: function (event) {
					event[0].preventDefault();
					this.set("_updateVolume", false);
				},

				play: function () {
					alert("play");
				},
				
				pause: function () {
					alert("pause");
				},
				
				toggle_volume: function () {
					if (this.get("volume") > 0) {
						this.__oldVolume = this.get("volume");
						this.set("volume", 0);
					} else 
						this.set("volume", this.__oldVolume || 1);
				},
				
				toggle_fullscreen: function () {
					alert("toggle fullscreen");
				},
				
				rerecord: function () {
					alert("rerecord");
				}
				
			},
			
			create: function () {
				this.properties().compute("position_formatted", function () {
					return Time.formatTime(this.get("position"), "mm:ss");
				}, ['position']);
				this.properties().compute("duration_formatted", function () {
					return Time.formatTime(this.get("duration"), "mm:ss");
				}, ['duration']);
				var self = this;
				setInterval(function () {
					self.set("expandedprogress", !self.get("expandedprogress"));
					self.set("pausable", !self.get("pausable"));
				}, 2500);
			}
			
		};
	})
	.register("ba-videoplayer-controlbar")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"video-progress": "Video progress",
    	"rerecord-video": "Re-record video?",
    	"play-video": "Play video",
    	"pause-video": "Pause video",
    	"elapsed-time": "Elasped time",
    	"total-time": "Total length of video",
    	"fullscreen-video": "Enter fullscreen",
    	"volume-button": "Set volume",
    	"volume-mute": "Mute sound",
    	"volume-unmute": "Unmute sound"
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Loader", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.loader,
			
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
    "base:Dynamics.Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.message,
			
			attrs: {
				"css": "ba-videoplayer",
				"message": ''
			},
			
			functions: {
				
				click: function () {
					alert("click");
				}
				
			}
			
		};
	}).register("ba-videoplayer-message");
});
Scoped.define("module:VideoPlayer.Dynamics.Playbutton", [
    "base:Dynamics.Dynamic",
    "module:Templates",
    "module:Assets"
], function (Class, Templates, Assets, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.playbutton,
			
			attrs: {
				"css": "ba-videoplayer"
			},
			
			functions: {
				
				play: function () {
					alert("play");
				}
				
			}
			
		};
	})
	.register("ba-videoplayer-playbutton")
    .attachStringTable(Assets.strings)
    .addStrings({
    	"tooltip": "Click to play video."
    });
});
Scoped.define("module:VideoPlayer.Dynamics.Player", [
    "base:Dynamics.Dynamic",
    "module:Templates"
], function (Class, Templates, scoped) {
	return Class.extend({scoped: scoped}, function (inherited) {
		return {
			
			template: Templates.player,
			
			attrs: {
				"css": "ba-videoplayer"
			}
			
		};
	}).register("ba-videoplayer");
});
Scoped.define("module:Assets", [
    "base:Classes.StringTable"
], function (StringTable) {
	return {
		
		strings: new StringTable()
		
	};
});
}).call(Scoped);