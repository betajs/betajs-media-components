Scoped.extend("module:Assets", ["module:Assets"], function (Assets) {
    var languages = <%= JSON.stringify(data) %>;
    for (var language in languages)
        Assets.strings.register(languages[language], [language]);
    return {};
});
