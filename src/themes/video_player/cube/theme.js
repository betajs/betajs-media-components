Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/cube-video_player_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/video_player_playbutton.html') %>*/ });
    return {
        "cube": {
            css: "ba-videoplayer",
            csstheme: "ba-player-cube-theme",
            cssplayer: "ba-player",
            tmplcontrolbar: "<%= template(dirname + '/cube-video_player_controlbar.html') %>",
            tmplplaybutton: "<%= template(parentdirname + '/_templates/video_player_playbutton.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});