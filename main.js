const puppeteer = require('puppeteer');

const urls = [
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
    'https://www.delijn.be'
]

urls.forEach(function (url) {
    (async () => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                dumpio: true
            });
            const page = await browser.newPage();

            page.on('response', response => {
                if (response.status() != 200) {
                    console.log('Failed!');
                }
            });

            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 120000
            });

            await browser.close();
        } catch (error) {
            console.log(error);
        }
    })()
});