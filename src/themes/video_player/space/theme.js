Scoped.extend("module:Assets.playerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-video_player_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-video_player_playbutton.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-video_player_message.html') %>*/ });
    return {
        "space": {
            css: "ba-videoplayer-space-theme",
            csstheme: "ba-videoplayer-space-theme",
            tmplcontrolbar: "<%= template(dirname + '/space-video_player_controlbar.html') %>",
            tmplplaybutton: "<%= template(dirname + '/space-video_player_playbutton.html') %>",
            tmplmessage: "<%= template(dirname + '/space-video_player_message.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});