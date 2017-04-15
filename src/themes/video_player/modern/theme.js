Scoped.extend("module:Assets.playerthemes", [
    "browser:Info"
], function(Info) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    var tmplcontrolbar = "<%= template(dirname + '/modern-video_player_controlbar.html') %>";
    return {
        "modern": {
            css: "ba-videoplayer-theme-modern",
            tmplcontrolbar: tmplcontrolbar,
            cssloader: ie8 ? "ba-videoplayer" : "",
            cssmessage: "ba-videoplayer",
            cssplaybutton: ie8 ? "ba-videoplayer" : ""
        }
    };
});