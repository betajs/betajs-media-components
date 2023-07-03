Scoped.define("module:DatasetProperties", [
    "base:Properties.Properties"
], function(Properties, scoped) {
    return Properties.extend({
        scoped: scoped
    }, function(inherited) {
        return {
            constructor: function(element, obj, materializes) {
                this.element = element;
                inherited.constructor.call(this, obj, materializes);
            },
            _afterSet: function(key, value) {
                this.element.dataset[key] = value;
            }
        };
    });
});