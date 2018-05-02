const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = [
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant#2',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#dienstregeling',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#omleidingen',
    'https://www.delijn.be/nl/routeplanner/',
    'https://www.delijn.be'
]

urls.forEach(function (url) {
    (async () => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                dumpio: false
            });
            const page = await browser.newPage();

            page.on('response', response => {
                if (response.status() != 200) {
                    fs.appendFileSync('result.csv', new Date().toISOString() + ',' + response.url() + ',' + response.status() + '\n' , (err) => {
                        if (err) throw err;
                    });
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