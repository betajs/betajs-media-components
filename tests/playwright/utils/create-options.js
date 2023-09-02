/* eslint-disable */
import { options } from "../consts";

export default (selectedOptions) => {
    let firstFound = false;
    let result = selectedOptions.map((option, index) => {
        if (options.includes(option)) {
            let prepend = null;
            if (!firstFound) {
                prepend = '?'; firstFound = true;
            }
            if (typeof option === 'object') option = Object.entries(option)[0];
            return (prepend ? '' : '&') + (Array.isArray(option) ? `${option[0]}=${JSON.stringify(option[1])}` : `${option}=1`);
        } else {
            console.log(`Option ${option} not available, please check with available ${options}. Or please add it to the list of available options in the consts.js file.`);
        }
    });
    return result.join('');
}
