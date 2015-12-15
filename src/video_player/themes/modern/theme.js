Scoped.extend("module:Assets.themes", ["module:Templates"], function (Templates) {
	return {
		modern: {
			css: "ba-videoplayer-theme-modern",
			tmplplaybutton: Templates["modern-playbutton"],
			tmplcontrolbar: Templates["modern-controlbar"]
		}
	};
});