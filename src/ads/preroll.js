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
