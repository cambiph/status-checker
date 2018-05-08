import { appendFile } from "fs";
import dateFormat from "dateformat";
import { launch } from "puppeteer";

export let urls = [
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
    'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant#2',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#dienstregeling',
    'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#omleidingen',
    'https://www.delijn.be/nl/gemeenten/gemeente/mechelen',
    'https://www.delijn.be/nl/gemeenten/gemeente/mechelen#lijnen',
    'https://www.delijn.be/nl/gemeenten/gemeente/mechelen#parking',
    'https://www.delijn.be/nl/routeplanner',
    'https://www.delijn.be/nl',
    'https://www.delijn.be/nl/kusttram/',

]

export async function writeToFile(response) {
    appendFile('result.csv', new Date().toISOString() + ',' + response.url() + ',' + response.status() + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });
}

export async function getDate() {
    return dateFormat('dd-mm-yyyy');
}

export async function getTime() {
    return dateFormat('HH:MM');
}

export async function getRoutePlannerUrl() {
    return 'https://www.delijn.be/nl/routeplanner/resultaten.html?' +
        'from=Station+Antwerpen+Centraal+%5BB%5D' +
        '&startXCoordinaat=153657' +
        '&startYCoordinaat=211918' +
        '&to=Station+Mechelen+%5BB%5D' +
        '&finishXCoordinaat=158001' +
        '&finishYCoordinaat=189723' +
        '&datum=' + await getDate(); +
    '&departureChoice=1' +
    '&tijd=' + await getTime(); +
    '&option-bus=on' +
    '&option-tram=on' +
    '&option-metro=on' +
    '&option-trein=on' +
    '&option-belbus=off';
}

export async function addUrlToArray() {
    await urls.push(await getRoutePlannerUrl());
}

export async function launchBrowser() {
    return await launch({
        dumpio: true,
        headless: false
    });
}

export async function getBody(response) {
    return await response.text()
}

export async function setBrowser(url, browser) {
    let page = await browser.newPage();

    page.on('response', response => {
        getBody(response).then(body => {
            if (body.includes('technische fout') || !response.url().includes('google') && !response.url().includes('doubleclick') && response.status() != 200) {
                writeToFile(response);
            };
        });
    });

    return page;
}

export async function performGet(page, url) {
    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 120000
    });

}

export async function closeBrowser(browser) {
    await browser.close();
}

export async function testUrl(url) {
    let browser;
    try {
        browser = await launchBrowser();
        const page = await setBrowser(url, browser);
        await performGet(page, url);
        debugger;
        await closeBrowser(browser);
    } catch (error) {
        console.log(error);
        if (browser) {
            await closeBrowser(browser);
        }
    }
}