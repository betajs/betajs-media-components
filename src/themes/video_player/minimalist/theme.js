Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/minimalist-video_player_controlbar.html') %>*/ });
    return {
        "minimalist": {
            css: "ba-videoplayer-minimalist-theme",
            csstheme: "ba-videoplayer-minimalist-theme",
            tmplcontrolbar: "<%= template(dirname + '/minimalist-video_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});