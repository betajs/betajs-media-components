Scoped.extend("module:Assets.audioplayerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/minimalist-audio_player_controlbar.html') %>*/ });
    return {
        "minimalist": {
            css: "ba-audioplayer",
            csstheme: "ba-player-minimalist-theme",
            tmplcontrolbar: "<%= template(dirname + '/minimalist-audio_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-audioplayer" : "",
            cssmessage: "ba-audioplayer",
            cssplaybutton: ie8 ? "ba-audioplayer" : ""
        }
    };
});