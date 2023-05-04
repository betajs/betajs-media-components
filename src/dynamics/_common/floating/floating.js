Scoped.define("module:Floating", [
    "base:Class",
    "base:Events.EventsMixin",
    "browser:Events"
], function(Class, EventsMixin, DomEvents, scoped) {
    return Class.extend({
        scoped: scoped
    }, [EventsMixin, function(inherited) {

        return {

            template: "<%= template(dirname + '/floating.html') %>",

            /**
             * @param {HTMLElement} element
             * @param {Object} player
             * @param {Object} [options]
             */
            constructor: function(element, player, options) {
                this.element = element;
                inherited.constructor.call(this);
                this.player = player;
                this.options = options || {};
            }
        };
    }]);
});