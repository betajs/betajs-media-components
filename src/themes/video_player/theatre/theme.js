Scoped.extend("module:Assets.playerthemes", [
    "browser:Info"
], function(Info) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    return {
        "theatre": {
            css: "ba-videoplayer-theatre-theme",
            csstheme: "ba-videoplayer-theatre-theme",
            tmplcontrolbar: "<%= template(dirname + '/theatre-video_player_controlbar.html') %>",
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});