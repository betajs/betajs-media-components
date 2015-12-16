Scoped.extend("module:Assets.themes", ["module:Templates"], function (Templates) {
	return {
		"modern": {
			css: "ba-videoplayer-theme-modern",
			tmplcontrolbar: Templates["modern-controlbar"]
		},
		"modern-green": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-green",
			tmplcontrolbar: Templates["modern-controlbar"]
		},
		"modern-blue": {
			css: "ba-videoplayer-theme-modern",
			csstheme: "ba-videoplayer-theme-modern-blue",
			tmplcontrolbar: Templates["modern-controlbar"]
		}
	};
});