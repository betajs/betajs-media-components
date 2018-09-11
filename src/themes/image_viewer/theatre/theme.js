Scoped.extend("module:Assets.imageviewerthemes", [
    "browser:Info",
    "dynamics:Parser"
], function(Info, Parser) {
    var ie8 = Info.isInternetExplorer() && Info.internetExplorerVersion() <= 8;
    Parser.registerFunctions({ /*<%= template_function_cache(dirname + '/theatre-image_viewer_controlbar.html') %>*/ });
    return {
        "theatre": {
            css: "ba-imageviewer",
            csstheme: "ba-imageviewer-theatre-theme",
            tmplcontrolbar: "<%= template(dirname + '/theatre-image_viewer_controlbar.html') %>",
            cssloader: ie8 ? "ba-imageviewer" : "",
            cssmessage: "ba-imageviewer"
        }
    };
});