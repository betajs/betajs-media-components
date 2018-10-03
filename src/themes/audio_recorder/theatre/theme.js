Scoped.extend("module:Assets.audiorecorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-audio_recorder_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/audio_recorder_chooser.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/audio_recorder_message.html') %>*/ });
    return {
        "theatre": {
            css: "ba-audiorecorder",
            csstheme: "ba-audiorecorder-theme-theatre",
            cssrecorder: "ba-recorder",
            cssmessage: "ba-audiorecorder",
            cssloader: "ba-audiorecorder",
            tmplcontrolbar: "<%= template(dirname + '/theatre-audio_recorder_controlbar.html') %>",
            tmplchooser: "<%= template(parentdirname + '/_templates/audio_recorder_chooser.html') %>",
            tmplmessage: "<%= template(parentdirname + '/_templates/audio_recorder_message.html') %>"
        }
    };
});