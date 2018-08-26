Scoped.define("module:AudioRecorder.Dynamics.Chooser", [
    "dynamics:Dynamic",
    "module:Assets",
    "browser:Info"
], [
    "dynamics:Partials.ClickPartial",
    "dynamics:Partials.IfPartial"
], function(Class, Assets, Info, scoped) {

    return Class.extend({
            scoped: scoped
        }, function(inherited) {
            return {

                template: "<%= template(dirname + '/audio_recorder_chooser.html') %>",

                attrs: {
                    "css": "ba-audiorecorder",
                    "cssrecorder": "ba-recorder",
                    "allowrecord": true,
                    "allowupload": true,

                    "primaryrecord": true,
                    "recordviafilecapture": false,

                    "allowcustomupload": true,
                    "allowedextensions": null

                },

                types: {
                    "allowedextensions": "array",
                    "recordviafilecapture": "boolean"
                },

                collections: ["actions"],

                create: function() {
                    var custom_accept_string = "";
                    if (this.get("allowedextensions") && this.get("allowedextensions").length > 0) {
                        var browser_support = Info.isEdge() || Info.isChrome() || Info.isOpera() || (Info.isFirefox() && Info.firefoxVersion() >= 42) || (Info.isInternetExplorer() && Info.internetExplorerVersion() >= 10);
                        if (browser_support)
                            custom_accept_string = "." + this.get("allowedextensions").join(",.");
                    } else if (!this.get("allowcustomupload")) {
                        custom_accept_string = "audio/*,audio/mp3";
                    }

                    var order = [];
                    if (this.get("primaryrecord")) {
                        if (this.get("allowrecord"))
                            order.push("record");
                        if (this.get("allowupload"))
                            order.push("upload");
                    } else {
                        if (this.get("allowupload"))
                            order.push("upload");
                        if (this.get("allowrecord"))
                            order.push("record");
                    }
                    var actions = this.get("actions");
                    order.forEach(function(act, index) {
                        switch (act) {
                            case "record":
                                actions.add({
                                    type: "record",
                                    index: index,
                                    icon: 'volume-up',
                                    label: this.string("record-audio"),
                                    select: Info.isMobile() && !(Info.isAndroid() && Info.isCordova()) && this.get("recordviafilecapture"),
                                    capture: true,
                                    accept: "audio/*,audio/mp3;capture=camcorder"
                                });
                                break;
                            case "upload":
                                actions.add({
                                    type: "upload",
                                    index: index,
                                    icon: "upload",
                                    label: this.string("upload-audio"),
                                    select: !(Info.isiOS() && Info.isCordova()),
                                    accept: Info.isMobile() && !(Info.isAndroid() && Info.isCordova()) ? "audio/*,audio/mp3" : custom_accept_string
                                });
                                break;
                        }
                    }, this);
                },

                functions: {

                    click_action: function(action) {
                        if (action.get("select"))
                            return;
                        if (Info.isMobile() && Info.isCordova()) {
                            var self = this;
                            if (Info.isAndroid()) {
                                navigator.device.capture.captureAudio(function(mediaFiles) {
                                    self.trigger("upload", mediaFiles[0]);
                                }, function(error) {}, {
                                    limit: 1,
                                    duration: this.get("timelimit")
                                });
                            } else if (Info.isiOS()) {
                                navigator.camera.getPicture(function(url) {
                                    self.trigger("upload", {
                                        localURL: url,
                                        fullPath: url
                                    });
                                }, function(error) {}, {
                                    destinationType: Camera.DestinationType.FILE_URI,
                                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                                    mediaType: Camera.MediaType.AUDIO
                                });
                            }
                        } else
                            this.trigger("record");
                    },

                    select_file_action: function(action, domEvent) {
                        if (!action.get("select"))
                            return;
                        this.trigger("upload", domEvent[0].target);
                    }

                }

            };
        })
        .registerFunctions({ /*<%= template_function_cache(dirname + '/audio_recorder_chooser.html') %>*/ })
        .register("ba-audiorecorder-chooser")
        .attachStringTable(Assets.strings)
        .addStrings({
            "record-audio": "Record Audio",
            "upload-audio": "Upload Audio"
        });
});