Scoped.extend("module:Assets.audiorecorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-audio_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-audio_recorder_imagegallery.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-audio_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-audio_recorder_message.html') %>*/ });
    return {
        "cube": {
            css: "ba-audiorecorder",
            csstheme: "ba-audiorecorder-theme-cube",
            cssmessage: "ba-audiorecorder-message-theme-cube",
            cssrecorder: "ba-recorder",
            tmplcontrolbar: "<%= template(dirname + '/cube-audio_recorder_controlbar.html') %>",
            tmplimagegallery: "<%= template(dirname + '/cube-audio_recorder_imagegallery.html') %>",
            tmplchooser: "<%= template(dirname + '/cube-audio_recorder_chooser.html') %>",
            tmplmessage: "<%= template(dirname + '/cube-audio_recorder_message.html') %>"
        }
    };
});