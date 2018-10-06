Scoped.define("module:IframeHelper", [
    "dynamics:Dynamic",
    "base:Objs",
    "base:Types",
    "base:Net.Uri"
], function(Dynamic, Objs, Types, Uri, scoped) {
    return Dynamic.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            template: "<%= template(dirname + '/iframe_helper.html') %>",

            getAllowModifiers: function() {
                return [];
            },

            getSrc: function() {
                return "";
            },

            filteredAttrs: function() {
                return Objs.filter(this.properties().getAll(), function(value, key) {
                    return !Types.is_object(value) && !Types.is_array(value);
                }, this);
            },

            functions: {
                computeSrc: function() {
                    return Uri.appendUriParams(this.getSrc(), this.filteredAttrs());
                },

                computeAllow: function() {
                    return this.getAllowModifiers().map(function(modifier) {
                        return modifier + " *";
                    }).join("; ");
                }
            },

            iframe: function() {
                return this.activeElement().querySelector("iframe");
            },

            _afterActivate: function() {
                inherited._afterActivate.apply(this, arguments);
                var iframe = this.iframe();
                this.getAllowModifiers().forEach(function(modifier) {
                    iframe["allow" + modifier] = "allow" + modifier;
                });
            }

        };
    }).registerFunctions({ /*<%= template_function_cache(dirname + '/iframe_helper.html') %>*/ });
});