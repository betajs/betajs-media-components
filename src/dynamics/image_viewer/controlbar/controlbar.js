Scoped.define("module:ImageViewer.Dynamics.Controlbar", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ShowPartial",
    "dynamics:Partials.IfPartial",
    "dynamics:Partials.ClickPartial"
], function(Class, Assets, Info, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/image_viewer_controlbar.html') %>",

                attrs: {
                    "css": "ba-imageviewer",
                    "rerecordable": false,
                    "submittable": false,
                    "fullscreen": true,
                    "fullscreened": false,
                    "activitydelta": 0,
                    "title": ""
                },

                functions: {

                    toggle_fullscreen: function() {
                        this.trigger("fullscreen");
                    },

                    rerecord: function() {
                        this.trigger("rerecord");
                    },

                    submit: function() {
                        this.set("submittable", false);
                        this.set("rerecordable", false);
                        this.trigger("submit");
                    },

                    tab_index_move: function(ev, nextSelector, focusingSelector) {
                        this.trigger("tab_index_move", ev[0], nextSelector, focusingSelector);
                    }
                },

                create: function() {
                    this.set("ismobile", Info.isMobile());
                }
            };
        })
        .register("ba-imageviewer-controlbar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/image_viewer_controlbar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "rerecord-image": "Redo?",
            "submit-image": "Confirm",
            "fullscreen-image": "Enter fullscreen",
            "exit-fullscreen-image": "Exit fullscreen"
        });
});