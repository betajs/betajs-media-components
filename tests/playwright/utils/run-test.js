import { chromium } from '@playwright/test';
import { BROWSER_LAUNCH_PATH } from '../consts.js';

export default async (args, func, browserSettings) => {
    browserSettings = browserSettings || {};
    const { page, browserName, browser, context } = args;
    console.log(`Browser executable path: ${browserSettings.executablePath}; headless: ${browserSettings.headless}`);
    if (!browserSettings.executablePath && BROWSER_LAUNCH_PATH && !browserSettings.headless) {
        browserSettings.executablePath = BROWSER_LAUNCH_PATH;
    }
    if (browserName === 'chromium' && browserSettings.executablePath) {
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
