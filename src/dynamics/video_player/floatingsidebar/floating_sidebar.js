Scoped.define("module:VideoPlayer.Dynamics.FloatingSidebar", [
    "dynamics:Dynamic",
    "base:Objs",
    "browser:Dom",
    "module:Assets",
    "module:StylesMixin"
], function(Class, Objs, DOM, Assets, StylesMixin, scoped) {
    return Class.extend({
            scoped: scoped
        }, [StylesMixin, function(inherited) {
            return {

                template: "<%= template(dirname + '/floating_sidebar.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "cssadsplayer": "ba-adsplayer",
                    "cssfloatingsidebar": "ba-floating-sidebar",
                    "containerstyle": null,
                    "sidebartitle": null,
                    "bodyelementtouched": false,
                    "bodyelementpadding": 114,
                    "companionadcontent": null,
                    "companionads": []
                },

                create: function() {
                    if (this.get("floatingoptions.showcompanionad")) {
                        this.auto_destroy(this.on("change:companionads", function(companionads) {
                            if (companionads && companionads.length > 0) {
                                var isMobile = this.get("mobileviewport");
                                if (
                                    (this.get("floatingoptions.desktop.companionad") && !isMobile) ||
                                    (this.get("floatingoptions.mobile.companionad") && isMobile)
                                ) {
                                    var dimensions = DOM.elementDimensions(this.activeElement());
                                    var ar, closestIndex, closestAr;
                                    ar = dimensions.width / dimensions.height;
                                    Objs.iter(companionads, function(companion, index) {
                                        var _data = companion.data;
                                        var _ar = _data.width / _data.height;
                                        var _currentDiff = Math.abs(_ar - ar);
                                        if (index === 0 || closestAr > _currentDiff) {
                                            closestAr = _currentDiff;
                                            closestIndex = index;
                                        }
                                        if (companionads.length === index + 1) {
                                            var companionAd = companionads[closestIndex];
                                            this.set("companionadcontent", companionAd.getContent());
                                            var container = this.activeElement().querySelector("." + this.get("cssfloatingsidebar") + '-companion-container');
                                            container.style.height = dimensions.height + "px";
                                            if (container) {
                                                container.innerHTML = this.get("companionadcontent");
                                                var image = container.querySelector('img');
                                                if (image && _ar && dimensions) {
                                                    _ar = companionAd.data.width / companionAd.data.height;
                                                    if (_ar < ar) {
                                                        image.height = dimensions.height;
                                                        image.width = dimensions.height * (_ar <= 1 ? _ar : companionAd.data.width / companionAd.data.height);
                                                    } else {
                                                        image.width = dimensions.width;
                                                        image.height = dimensions.width * (companionAd.data.height / companionAd.data.width);
                                                    }
                                                }
                                            }
                                        }
                                    }, this);
                                }
                            }
                        }, this), this);
                    }
                },

                functions: {
                    pause_ads: function(url) {
                        if (this.get("adsplaying")) {
                            this.trigger("pause_ads");
                        }
                        if (url) this.__redirect(url);
                    },
                    redirect: function(url) {
                        this.__redirect(url);
                    }
                },

                // in mobileview click not redirect to url, so making it manually
                __redirect: function(url) {
                    if (url && url.length > 0 && /^(http|https):\/\//i.test(url) && window) {
                        window.open(url, "_blank");
                    }
                }
            };
        }])
        .register("ba-videoplayer-floating-sidebar")
        .registerFunctions({
            /*<%= template_function_cache(dirname + '/floating_sidebar.html') %>*/
        })
        .attachStringTable(Assets.strings)
        .addStrings({
            "ad-choices": "Ad Choices",
            "learn-more": "Learn More"
        });
});