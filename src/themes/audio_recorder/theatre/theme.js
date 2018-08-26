Scoped.extend("module:Assets.recorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-video_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-video_recorder_imagegallery.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-video_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-video_recorder_message.html') %>*/ });
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