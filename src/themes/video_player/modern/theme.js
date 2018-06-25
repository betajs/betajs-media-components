Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/modern-video_player_controlbar.html') %>*/ });
    return {
        "modern": {
            css: "ba-videoplayer",
            csstheme: "ba-videoplayer-theme-modern",
            tmplcontrolbar: "<%= template(dirname + '/modern-video_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : "ba-videoplayer-playbutton-alt"
        }
    };
});