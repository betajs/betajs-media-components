Scoped.define("module:StylesMixin", [
    "base:Objs"
], function(Objs) {
    return {
        _applyStyles: function(element, styles, oldStyles) {
            if (typeof oldStyles !== "undefined") {
                if (Objs.count(oldStyles) === 0 || oldStyles === null) {
                    element.removeAttribute("style");
                } else {
                    Objs.iter(oldStyles, function(v, k) {
                        if (!(k in styles)) element.style.removeProperty(k);
                    });
                }
            }
            return Objs.extend(element.style, styles);
        }
    };
});