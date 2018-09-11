Scoped.extend("module:Assets.recorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/modern-video_recorder_chooser.html') %>*/ });
    return {
        "modern": {
            css: "ba-videorecorder",
            csstheme: "ba-recorder-theme-modern",
            cssrecorder: "ba-recorder",
            cssloader: "ba-videorecorder",
            tmplchooser: "<%= template(dirname + '/modern-video_recorder_chooser.html') %>"
        }
    };
});