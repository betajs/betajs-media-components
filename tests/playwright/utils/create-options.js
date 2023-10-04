/* eslint-disable */
export default (selectedOptions) => {
    if (!selectedOptions) return '';
    let firstFound = false;
    let result = selectedOptions.map(option => {
        let prepend = null;
        if (!firstFound) {
            prepend = '?'; firstFound = true;
        }
        if (typeof option === 'object') {
            option = Object.entries(option)[0];
            if (option && option[1]) {
                if(typeof Number(option[1]) === 'number' && !isNaN(Number(option[1]))) {
                    option[1] = Number(option[1]);
                } else if (typeof option[1] == 'boolean') {
                    option[1] = Boolean(option[1]);
                } else {
                    option[1] = JSON.stringify(option[1]);
                    try {
                        JSON.parse(option[1]);
                        option[1] = JSON.parse(encodeURI(option[1]));
                    } catch (e) {}
                }
            }
        }
        return (prepend ? '' : '&') + (Array.isArray(option) ? `${option[0]}=${option[1]}` : `${option}=true`);
    });
    return result.join('');
}
