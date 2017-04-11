Scoped.extend("module:Assets.recorderthemes", [], function() {
    return {
        "theatre": {
            css: "ba-videorecorder-theme-theatre",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmplcontrolbar: "<%= template(dirname + '/theatre-video_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/theatre-video_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/theatre-video_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/theatre-video_recorder_message.html') %>"
        }
    };
});