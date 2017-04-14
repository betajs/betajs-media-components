Scoped.extend("module:Assets.recorderthemes", [], function() {
    return {
        "space": {
            css: "ba-videorecorder-theme-space",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmpltopmessage: "<%= template(dirname + '/space-video_recorder_topmessage.html') %>",
            tmplcontrolbar: "<%= template(dirname + '/space-video_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/space-video_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/space-video_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/space-video_recorder_message.html') %>"
        }
    };
});