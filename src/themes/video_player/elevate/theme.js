Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/elevate-video_player_controlbar.html') %>*/ });
    return {
        "elevate": {
            css: "ba-videoplayer-elevate-theme",
            csstheme: "ba-videoplayer-elevate-theme",
            tmplcontrolbar: "<%= template(dirname + '/elevate-video_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});