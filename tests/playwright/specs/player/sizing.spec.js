import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes,
    AD_TAG_URL
} from "../../consts.js";
import { closeToEqual, heightBasedOnWidth } from '../../utils'
import runTestMethod from '../../utils/run-test';


const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: false, // If headless is true, player will start with user interaction
    devtools: true,
    executablePath: CHROME_CANARY_LOCATION,
}


test.describe('No Ads/No Sidebar/In-article', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        showsidebargallery: false,
        sidebaroptions: {},
        playwhenvisible: true,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`Both Height and Width`, async ({
           page, browserName, browser, context
       }) => {
        const presetWidth = 400;
        const presetHeight = 320;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
            ...defaultPlayerAttributes,
            ...descriptionPlayerAttributes,
            ...{
                width: presetWidth,
                height: presetHeight,
            }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const activeElement = await page.locator('div#player');
            await expect(activeElement).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementDimensions = await activeElement.boundingBox();

            await expect(containerDimensions).not.toBeNull();
            await expect(activeElementDimensions).not.toBeNull();

            await expect(containerDimensions.width).toEqual(activeElementDimensions.width);
            await expect(containerDimensions.height).toEqual(activeElementDimensions.height);

            await expect(containerDimensions.width).toEqual(presetWidth);
            await expect(containerDimensions.height).toEqual(presetHeight);
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test(`Only Height set`, async ({
       page, browserName, browser, context
    }) => {
        const presetHeight = 320;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes,
                ...{
                    height: presetHeight,
                }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const activeElementParent = await page.locator('div#active-player-wrapper');
            await expect(activeElementParent).toBeVisible();

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementParentDimensions = await activeElementParent.boundingBox();

            await expect(containerDimensions.height).toEqual(presetHeight);
            await expect(containerDimensions.width).toEqual(activeElementParentDimensions.width);
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test(`Width only as percentage`, async ({
         page, browserName, browser, context
     }) => {
        const presetWidth = "80%";
        // w/h = ar; h = w/ar; w = ar*h
        const apsectRatio = 1.77;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes,
                ...{
                    width: presetWidth,
                }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const activeElementParent = await page.locator('div#active-player-wrapper');
            await expect(activeElementParent).toBeVisible();

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const activeElement = await page.locator('div#player');
            await expect(activeElement).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementDimensions = await activeElement.boundingBox();
            const activeElementParentDimensions = await activeElementParent.boundingBox();

            await expect(activeElementDimensions.width).toBeLessThan(activeElementParentDimensions.width);
            await expect(
                closeToEqual(activeElementDimensions.width, activeElementParentDimensions.width * 0.8)
            ).toBeTruthy();

            await expect(
                closeToEqual(
                    containerDimensions.height, heightBasedOnWidth(apsectRatio, containerDimensions.width)
                )
            ).toBeTruthy();
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });
});

test.describe('No Ads/With Sidebar/In-article', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        showsidebargallery: true,
        sidebaroptions: {},
        playwhenvisible: true,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`Both Height and Width`, async ({
         page, browserName, browser, context
     }) => {
        const presetWidth = 400;
        const presetHeight = 320;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes,
                ...{
                    width: presetWidth,
                    height: presetHeight,
                }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const activeElement = await page.locator('div#player');
            await expect(activeElement).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementDimensions = await activeElement.boundingBox();

            await expect(containerDimensions).not.toBeNull();
            await expect(activeElementDimensions).not.toBeNull();

            await expect(containerDimensions.width).toEqual(activeElementDimensions.width);
            await expect(containerDimensions.height).toEqual(activeElementDimensions.height);

            await expect(containerDimensions.width).toEqual(presetWidth);
            await expect(containerDimensions.height).toEqual(presetHeight);
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test(`Only Height set`, async ({
                                       page, browserName, browser, context
                                   }) => {
        const presetHeight = 320;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes,
                ...{
                    height: presetHeight,
                }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const activeElementParent = await page.locator('div#active-player-wrapper');
            await expect(activeElementParent).toBeVisible();

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementParentDimensions = await activeElementParent.boundingBox();

            await expect(containerDimensions.height).toEqual(presetHeight);
            await expect(containerDimensions.width).toEqual(activeElementParentDimensions.width);
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test(`Width only as percentage`, async ({
                                                page, browserName, browser, context
                                            }) => {
        const presetWidth = "80%";
        // w/h = ar; h = w/ar; w = ar*h
        const apsectRatio = 1.77;
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes,
                ...{
                    width: presetWidth,
                }}, context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const activeElementParent = await page.locator('div#active-player-wrapper');
            await expect(activeElementParent).toBeVisible();

            const container = await page.getByTestId(`${dataTestId}-container`);
            await expect(container).toBeVisible();

            const activeElement = await page.locator('div#player');
            await expect(activeElement).toBeVisible();

            const containerDimensions = await container.boundingBox();
            const activeElementDimensions = await activeElement.boundingBox();
            const activeElementParentDimensions = await activeElementParent.boundingBox();

            await expect(activeElementDimensions.width).toBeLessThan(activeElementParentDimensions.width);
            await expect(
                closeToEqual(activeElementDimensions.width, activeElementParentDimensions.width * 0.8)
            ).toBeTruthy();
        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });
});
