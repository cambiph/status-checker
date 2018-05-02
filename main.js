const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            dumpio: true,
            ignoreHTTPSErrors: true
        });
        const page = await browser.newPage();

        await page.goto('https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant', {
            waitUntil: 'networkidle0'
        });
        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();