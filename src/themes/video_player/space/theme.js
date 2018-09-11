Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-video_player_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-video_player_message.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(parentdirname + '/_templates/video_player_playbutton.html') %>*/ });
    return {
        "space": {
            css: "ba-videoplayer",
            csstheme: "ba-player-space-theme",
            cssplayer: "ba-player",
            tmplcontrolbar: "<%= template(dirname + '/space-video_player_controlbar.html') %>",
            tmplmessage: "<%= template(dirname + '/space-video_player_message.html') %>",
            tmplplaybutton: "<%= template(parentdirname + '/_templates/video_player_playbutton.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});