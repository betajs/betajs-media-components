Scoped.extend("module:Assets.audioplayerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-audio_player_controlbar.html') %>*/ });
    return {
        "cube": {
            css: "ba-audioplayer",
            csstheme: "ba-player-cube-theme",
            tmplcontrolbar: "<%= template(dirname + '/cube-audio_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-audioplayer" : "",
            cssmessage: "ba-audioplayer",
            cssplaybutton: ie8 ? "ba-audioplayer" : ""
        }
    };
});