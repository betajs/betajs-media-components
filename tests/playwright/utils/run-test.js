import { chromium } from '@playwright/test';

export default async (args, func, browserSettings) => {
    const { page, browserName, browser, context } = args;
    if (browserName === 'chromium') {
        await (async () => {
            // const browser = await firefox.launch();
            const browser = await chromium.launch(browserSettings);
            const page = await browser.newPage();
            const context = await browser.newContext();
            await func(page, browser, context);
        })();
    } else {
        await func(page, browser, context);
    }
}
