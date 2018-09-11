Scoped.extend("module:Assets.recorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/minimalist-video_recorder_topmessage.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/minimalist-video_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/video_recorder_imagegallery.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/video_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/video_recorder_message.html') %>*/ });
    return {
        "minimalist": {
            css: "ba-videorecorder",
            csstheme: "ba-recorder-theme-minimalist",
            cssrecorder: "ba-recorder",
            cssmessage: "ba-videorecorder",
            cssloader: "ba-videorecorder",
            tmpltopmessage: "<%= template(dirname + '/minimalist-video_recorder_topmessage.html') %>",
            tmplcontrolbar: "<%= template(dirname + '/minimalist-video_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(parentdirname + '/_templates/video_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(parentdirname + '/_templates/video_recorder_chooser.html') %>",
            tmplmessage: "<%= template(parentdirname + '/_templates/video_recorder_message.html') %>"
        }
    };
});