<% icons.forEach(function (icon) { %>
.#{$csscommon}-<%= icon.ident %>:before {
    @include fontello-icon;
    content: '<%= icon.content %>';
}
<% }) %>