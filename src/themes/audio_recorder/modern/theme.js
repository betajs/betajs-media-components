Scoped.extend("module:Assets.audiorecorderthemes", [
    "dynamics:Parser"
], function(Parser) {
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/modern-audio_recorder_chooser.html') %>*/ });
    return {
        "modern": {
            css: "ba-audiorecorder",
            csstheme: "ba-audiorecorder-theme-modern",
            cssrecorder: "ba-recorder",
            //            cssmessage: "ba-audiorecorder",
            cssloader: "ba-audiorecorder",
            tmplchooser: "<%= template(dirname + '/modern-audio_recorder_chooser.html') %>"
        }
    };
});