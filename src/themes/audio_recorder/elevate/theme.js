Scoped.extend("module:Assets.audiorecorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_recorder_topmessage.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_recorder_imagegallery.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_recorder_message.html') %>*/ });
    return {
        "elevate": {
            css: "ba-audiorecorder",
            csstheme: "ba-audiorecorder-theme-elevate",
            cssrecorder: "ba-recorder",
            cssmessage: "ba-audiorecorder",
            cssloader: "ba-audiorecorder",
            tmpltopmessage: "<%= template(dirname + '/elevate-audio_recorder_topmessage.html') %>",
            tmplcontrolbar: "<%= template(dirname + '/elevate-audio_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/elevate-audio_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/elevate-audio_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/elevate-audio_recorder_message.html') %>"
        }
    };
});