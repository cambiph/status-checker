import { launch } from "puppeteer";
import { appendFileSync } from "fs";

const urls = [
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant#2',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#dienstregeling',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#omleidingen',
    'https://www.delijn.be/nl/routeplanner',
    'https://www.delijn.be/nl'
]

async function launchBrowser() {
    
    let browser = await launch({dumpio: false, headless: false});
    return browser;

}

async function setBrowser(url, browsder) {
    
    let page = await browser.newPage();

    page.on('response', response => {
        if (response.url().match('(https:)\D{2}[a-z]*.(delijn)(\S+)') && response.status() != 200) {
            appendFileSync('result.csv', new Date().toISOString() + ',' + response.url() + ',' + response.status() + '\n', (err) => {
                if (err) throw err;
            });
        }
    });

    return page;
}

async function performGet(page, url) {

    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 120000
    });

}

async function closeBrowser(browser) {
    await browser.close();
}

urls.forEach(async (url) => {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await setBrowser(url, browser);
        await performGet(page, url);
        await closeBrowser(browser);
    } catch (error) {
        console.log(error);
        if (browser) {
            await closeBrowser(browser);
        }
    }
}); 