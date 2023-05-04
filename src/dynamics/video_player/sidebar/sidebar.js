Scoped.define("module:VideoPlayer.Dynamics.Sidebar", [
    "dynamics:Dynamic",
    "module:StylesMixin",
    "browser:Dom",
    "module:Assets"
], function(Class, StylesMixin, DOM, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_sidebar.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "containerstyle": null
                },

                events: {
                    "change:mobileview": function(isMobile) {
                        if (isMobile) document.body.style.paddingTop = '75px';
                    }
                },

                create: function() {
                    // var parent = this.parent();
                    // var parentDimensions = DOM.elementDimensions(parent.activeElement().firstChild);
                    // if (parent.activeElement() && this.activeElement()) {
                    //     this._applyStyles(this.activeElement().firstChild, {
                    //         width: parentDimensions.width + "px",
                    //         height: parentDimensions.height + "px",
                    //     });
                    // }
                }
            };
        }])
        .register("ba-videoplayer-sidebar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/video_player_sidebar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "loading": "Loading..."
        });
});