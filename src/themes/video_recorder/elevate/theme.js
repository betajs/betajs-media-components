Scoped.extend("module:Assets.recorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_recorder_topmessage.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_recorder_imagegallery.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_recorder_message.html') %>*/ });
    return {
        "elevate": {
            css: "ba-videorecorder-theme-elevate",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmpltopmessage: "<%= template(dirname + '/elevate-video_recorder_topmessage.html') %>",
            tmplcontrolbar: "<%= template(dirname + '/elevate-video_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/elevate-video_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/elevate-video_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/elevate-video_recorder_message.html') %>"
        }
    };
});