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