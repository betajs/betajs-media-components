export default async function isItemInViewport(page, item) {
    return await page.evaluate((item) => {
        let isVisible = false;

        const element = document.querySelector(item);
        if ( element ) {
            const rect = element.getBoundingClientRect();
            // In some cases height is 1px, but width is not 0
            isVisible = rect.height > 100 && rect.width > 0;
            // if ( rect.top >= 0 && rect.left >= 0 ) {
            //     const vw = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );
            //     const vh = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 );
            //     if ( rect.right <= vw && rect.bottom <= vh ) {
            //         isVisible = true;
            //     }
            // }
        }
        return isVisible;
    }, item );
}
