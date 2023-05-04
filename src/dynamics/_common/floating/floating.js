Scoped.define("module:Floating", [
    "dynamics:Dynamic"
], function(Dynamics, scoped) {
    return Dynamics.extend({
        scoped: scoped
    }, function(inherited) {

        return {

            remove_on_destroy: true,

            attrs: {},

            template: "<%= template(dirname + '/floating.html') %>",

            // constructor: function(data) {inherited.constructor.call(this);},

            create: function() {
                console.log('Now created..', this.get("player"));
            }
        };
    });
});