Scoped.extend("module:Assets.imageviewerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/minimalist-image_viewer_controlbar.html') %>*/ });
    return {
        "minimalist": {
            css: "ba-imageviewer",
            csstheme: "ba-imageviewer-minimalist-theme",
            tmplcontrolbar: "<%= template(dirname + '/minimalist-image_viewer_controlbar.html') %>",
            cssloader: ie8 ? "ba-imageviewer" : "",
            cssmessage: "ba-imageviewer"
        }
    };
});