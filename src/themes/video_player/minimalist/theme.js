Scoped.extend("module:Assets.playerthemes", [
    "browser:Info"
], function(Info) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
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