Scoped.define("module:Assets", [
    "base:Classes.LocaleTable",
    "base:Browser.Info"
], function (LocaleTable, Info) {
	
	var strings = new LocaleTable();
	strings.setWeakLocale(Info.language());
	
	return {
		
		strings: strings,
		
		themes: {}
		
	};
});