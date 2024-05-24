const { BetaJS } = require('../init');
const { Objs, Types } = BetaJS;

module.exports = (assert, player, key, value, _attrs) => {
    const currentValue = player.get(key);
    if (!!key &&
        (
            (Types.is_string(key) && !_attrs[key.split('.')[0]])
            || Types.is_defined(currentValue)
        )
    ) {
        if (Types.is_object(value)) {
            Objs.iter(value, (v, k) => {
                deepCheck(assert, player, `${key}.${k}`, v, _attrs[key]);
            });
        } else {
            assert.equal(currentValue, value, `${key} is ${value}`);
        }
        try {
        } catch (e) {
            console.error(`We have some error here: ${e}`);
        }
    }
};
