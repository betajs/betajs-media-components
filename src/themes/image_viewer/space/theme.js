Scoped.extend("module:Assets.imageviewerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-image_viewer_controlbar.html') %>*/ });
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/space-image_viewer_message.html') %>*/ });
    return {
        "space": {
            css: "ba-imageviewer",
            csstheme: "ba-imageviewer-space-theme",
            tmplcontrolbar: "<%= template(dirname + '/space-image_viewer_controlbar.html') %>",
            tmplmessage: "<%= template(dirname + '/space-image_viewer_message.html') %>",
            cssloader: ie8 ? "ba-imageviewer" : "",
            cssmessage: "ba-imageviewer"
        }
    };
});