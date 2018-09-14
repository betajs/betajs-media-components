Scoped.define("module:VideoPlayer.Dynamics.Tracks", [
    "dynamics:Dynamic",
    "base:Async",
    "module:Assets"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.RepeatElementPartial"
], function(Class, Async, Assets, scoped) {
    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/video_player_tracks.html') %>",

                attrs: {
                    "css": "ba-videoplayer",
                    "csscommon": "ba-commoncss",
                    "cssplayer": "ba-player",
                    "trackcuetext": null,
                    "acceptedtracktexts": "text/vtt,application/ttml+xml,type/subtype",
                    "trackselectorhovered": false,
                    "uploadtexttracksvisible": false,
                    "uploadlocales": [],
                    "chosenoption": null
                },

                functions: {
                    select_track: function(track) {
                        this.parent().set("trackselectorhovered", false);
                        this.parent().trigger("switch-track", track);
                    },

                    hover_cc: function(ev, hover) {
                        // Not show CC on hover during settings block is open
                        if (this.parent().get("settingsoptionsvisible")) return;

                        // Don't lose focus on clicking move between sliders
                        // After if element has an focus not close it till next mouseover/mouseleave
                        if (!hover && ev[0].target === document.activeElement) {
                            Async.eventually(function() {
                                ev[0].target.blur();
                            }, this, 500);
                            return;
                        }

                        // Show or hide overlay element on mouse out
                        return this.parent().set("trackselectorhovered", hover);
                    },

                    prevent_un_hover: function(ev) {
                        ev[0].target.blur();
                        var _parentSelector, _parentElement;
                        _parentSelector = "." + this.parent().get('csscommon') + '-options-popup';
                        _parentElement = document.querySelector(_parentSelector);
                        if (_parentElement)
                            _parentElement.focus();
                        return this.parent().set("trackselectorhovered", true);
                    },

                    selected_label_value: function(select) {
                        var _options, _chosen;
                        _options = select[0].target.options;
                        _chosen = _options[_options.selectedIndex];

                        if (_chosen.value) {
                            this.set("chosenoption", {
                                lang: _chosen.value,
                                label: _chosen.text
                            });
                        } else {
                            this.set("chosenoption", null);
                        }
                    },

                    upload_text_track: function(domEvent) {
                        if (this.get('chosenoption'))
                            this.trigger("upload-text-tracks", domEvent[0].target, this.get('chosenoption'));
                        else {
                            console.warn('can not send empty label');
                        }
                    },

                    move_to_option: function(domEvent, classSelector) {
                        this.trigger("move_to_option", domEvent[0].target, classSelector);
                    }
                }
            };
        })
        .register("ba-videoplayer-tracks")
        .registerFunctions({ /*<%= template_function_cache(dirname + '/video_player_tracks.html') %>*/ })
        .attachStringTable(Assets.strings)
        .addStrings({
            "upload-text-tracks": "Upload track text files",
            "select-text-track-language": "Subtitle Language",
            "info-select-locale-first": "First select locale",
            "select-text-track-file": "Click to select file",
            "back": "back"
        });
});