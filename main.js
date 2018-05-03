import puppeteer from "puppeteer";
import appendFileSync from "fs";
import dateFormat from "dateformat";

let urls = [
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant#2',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#dienstregeling',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#omleidingen',
    'https://www.delijn.be/nl/routeplanner',
    'https://www.delijn.be/nl'
]

async function getDate() {
    return dateFormat('dd-mm-yyyy');
}

async function getTime() {
    return dateFormat('HH:MM');
}

async function getRoutePlannerUrl() {
    return  'https://www.delijn.be/nl/routeplanner/resultaten.html?' +
            'from=Station+Antwerpen+Centraal+%5BB%5D' +
            '&startXCoordinaat=153657' +
            '&startYCoordinaat=211918' +
            '&to=Station+Mechelen+%5BB%5D' + 
            '&finishXCoordinaat=158001' +
            '&finishYCoordinaat=189723' +
            '&datum=' +  await getDate() +
            '&departureChoice=1' +
            '&tijd=' + await getTime() +
            '&option-bus=on' +
            '&option-tram=on' +
            '&option-metro=on' +
            '&option-trein=on' +
            '&option-belbus=off';
}

async function addUrlToArray() {
    await urls.push(await getRoutePlannerUrl());
}

async function launchBrowser() {
    return await puppeteer.launch({dumpio: false, headless: true});
}

async function writeToFile(response) {
    appendFileSync('result.csv', new Date().toISOString() + ',' + response.url() + ',' + response.status() + '\n', (err) => {
        if (err) throw err;
    });
}

async function setBrowser(url, browser) {
    let page = await browser.newPage();

    page.on('response', response => {
        if (!response.url().includes('google') && response.status() != 200) {
            writeToFile(response);
        };
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

async function testUrl(url) {
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
}

async function run() {
    await addUrlToArray();
    
    urls.forEach(async (url) => {
        try {
            console.log('Testing ' + url)
            await testUrl(url);
        } catch (err) {
            console.log(err);
        }
    }); 
}

run();
