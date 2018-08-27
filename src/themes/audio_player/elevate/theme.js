Scoped.extend("module:Assets.audioplayerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-audio_player_controlbar.html') %>*/ });
    return {
        "elevate": {
            css: "ba-audioplayer",
            csstheme: "ba-player-elevate-theme",
            tmplcontrolbar: "<%= template(dirname + '/elevate-audio_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-audioplayer" : "",
            cssmessage: "ba-audioplayer",
            cssplaybutton: ie8 ? "ba-audioplayer" : ""
        }
    };
});