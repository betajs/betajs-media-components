Scoped.extend("module:Assets.recorderthemes", [], function() {
    var tmplchooser = "<%= template(dirname + '/modern-video_recorder_chooser.html') %>";
    return {
        "modern": {
            css: "ba-videorecorder-theme-modern",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmplchooser: tmplchooser
        },
        "modern-green": {
            css: "ba-videorecorder-theme-modern",
            csstheme: "ba-videorecorder-theme-modern-green",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmplchooser: tmplchooser
        },
        "modern-blue": {
            css: "ba-videorecorder-theme-modern",
            csstheme: "ba-videorecorder-theme-modern-blue",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmplchooser: tmplchooser
        }
    };
});