Scoped.define("module:Ads.VAST.URLHandler", ["base:Class"], function(Class, scoped) {
    return Class.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            xhr: function() {
                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } else {
                    return false;
                }
            },

            supportedXHR: function() {
                return !!this.xhr();
            },

            getXHR: function(url, options, cb) {
                var xhr;
                if (window.location.protocol === 'https:' && url.indexOf('http://') === 0) {
                    return cb(new Error('XHRURLHandler: Cannot go from HTTPS to HTTP.'));
                }

                try {
                    xhr = this.xhr();
                    xhr.open('GET', url);
                    xhr.timeout = options.timeout || 0;
                    xhr.withCredentials = options.withCredentials || false;
                    xhr.overrideMimeType('application/xml');
                    //xhr.overrideMimeType('application/xml') && xhr.overrideMimeType('text/xml');
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                return cb(null, xhr.responseXML);
                            } else {
                                return cb(new Error("XHRURLHandler: " + xhr.statusText));
                            }
                        }
                    };
                    return xhr.send();
                } catch (error) {
                    return cb(new Error('XHRURLHandler: Unexpected error'));
                }
            },

            xdr: function() {
                if (window.XDomainRequest) {
                    return new XDomainRequest();
                } else
                    return false;
            },

            supportedXDR: function() {
                return !!this.xdr();
            },

            getXDR: function(url, options, cb) {
                var xdr, xmlDocument;
                xmlDocument = (typeof window.ActiveXObject === "function") ? new window.ActiveXObject("Microsoft.XMLDOM") : void 0;
                if (xmlDocument) {
                    xmlDocument.async = false;
                } else {
                    return cb(new Error('FlashURLHandler: Microsoft.XMLDOM format not supported'), null);
                }
                xdr = this.xdr();
                xdr.open('GET', url);
                xdr.timeout = options.timeout || 0;
                xdr.withCredentials = options.withCredentials || false;
                xdr.send();
                xdr.onprogress = function() {};
                xdr.onload = function() {
                    xmlDocument.loadXML(xdr.responseText);
                    return cb(null, xmlDocument);
                };
                return xdr.onload;
            },

            get: function(url, options, cb) {
                var response;
                if (!cb) {
                    if (typeof options === 'function') {
                        cb = options;
                    }
                    options = {};
                }

                if (options.response) {
                    response = options.response;
                    delete options.response;
                    return cb(null, response);
                } else if (this.supportedXHR()) {
                    return this.getXHR(url, options, cb);
                } else if (this.supportedXDR()) {
                    return this.getXDR(url, options, cb);
                } else {
                    return cb(new Error('Current context is not supported by any of the default URLHandlers. Please provide a custom URLHandler'));
                }
            }
        };
    });
});