Scoped.extend("module:Assets.audioplayerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-audio_player_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-audio_player_message.html') %>*/ });
    return {
        "space": {
            css: "ba-audioplayer",
            csstheme: "ba-player-space-theme",
            tmplcontrolbar: "<%= template(dirname + '/space-audio_player_controlbar.html') %>",
            tmplmessage: "<%= template(dirname + '/space-audio_player_message.html') %>",
            cssloader: ie8 ? "ba-audioplayer" : "",
            cssmessage: "ba-audioplayer"
        }
    };
});