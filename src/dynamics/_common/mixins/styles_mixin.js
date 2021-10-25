Scoped.define("module:StylesMixin", [
    "base:Objs"
], function(Objs) {
    return {
        _applyStyles: function(element, styles, oldStyles) {
            Objs.iter(oldStyles, function(v, k) {
                if (!(k in styles)) element.style.removeProperty(k);
            });
            Objs.extend(element.style, styles);
        }
    };
});