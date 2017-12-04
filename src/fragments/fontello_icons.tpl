<% icons.forEach(function (icon) { %>
.#{$css}-<%= icon.ident %>:before {
    @include fontello-icon;
    content: '<%= icon.content %>';
}
<% }) %>