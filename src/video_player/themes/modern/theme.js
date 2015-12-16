Scoped.extend("module:Assets.themes", ["module:Templates"], function (Templates) {
	return {
		"modern": {
			css: "ba-videoplayer-theme-modern",
			tmplplaybutton: Templates["modern-playbutton"],
			tmplcontrolbar: Templates["modern-controlbar"]
		},
		"modern-green": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-green",
			tmplplaybutton: Templates["modern-playbutton"],
			tmplcontrolbar: Templates["modern-controlbar"]
		},
		"modern-blue": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-blue",
			tmplplaybutton: Templates["modern-playbutton"],
			tmplcontrolbar: Templates["modern-controlbar"]
		}
	};
});