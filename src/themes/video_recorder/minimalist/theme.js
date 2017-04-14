Scoped.extend("module:Assets.recorderthemes", [], function() {
    return {
        "minimalist": {
            css: "ba-videorecorder-theme-minimalist",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmpltopmessage: "<%= template(dirname + '/minimalist-video_recorder_topmessage.html') %>",
            tmplcontrolbar: "<%= template(dirname + '/minimalist-video_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/minimalist-video_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/minimalist-video_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/minimalist-video_recorder_message.html') %>"
        }
    };
});