/**
 * @param {[]} locators
 * @return {Promise<*>}
 */
export async function waitForOneOf(locators) {
    const res = await Promise.race([
        ...locators.map(async (locator, index) => {
            let timedOut = false;
            await locator.waitFor({ state: 'visible' }).catch(() => timedOut = true);
            return [ timedOut ? -1 : index, locator ];
        }),
    ]);
    if (res[0] === -1) {
        throw new Error('no locator visible before timeout');
    }
    return res;
}
