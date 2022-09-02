<% for (var language in data) { %>
    Scoped.define("module:Assets.Languages.<%= (language.split(":"))[1] %>", ["module:Assets"], function (Assets) {
        Assets.strings.register(<%= JSON.stringify(data[language]) %>, ["<%= language %>"]);
        return {};
    });
<% } %>