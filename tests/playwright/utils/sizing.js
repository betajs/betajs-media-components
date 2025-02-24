const closeToEqual = (a, b) => Math.abs(a - b) < (a * 0.01);

// w/h = ar; h = w/ar; w = ar*h
const heightBasedOnWidth = (ar, w) => {
    return w / ar;
}

const widthBasedOnHeight = (ar, h) => {
    return ar * h;
}

const arEqualBasedOnHeight = (ar, h) => {
    return closeToEqual(ar, widthBasedOnHeight(ar, h) / h);
}

const arEqualBasedOnWidth = (ar, w) => {
    return closeToEqual(ar, w / heightBasedOnWidth(ar, w));
}

export {
    closeToEqual,
    heightBasedOnWidth,
    widthBasedOnHeight,
    arEqualBasedOnHeight,
    arEqualBasedOnWidth
}
