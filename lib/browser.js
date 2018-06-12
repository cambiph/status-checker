import { launch } from 'puppeteer';
import { isReponseValid, writeToFile, isErrorMessageVisible } from './functions';

export async function setBrowser(url, browser) {
  const page = await browser.newPage();
  page.setMaxListeners(Infinity);

  page.on('response', response => {
    if (isReponseValid && !isErrorMessageVisible) {
      writeToFile(response);
    }
  });

  return page;
}

export async function launchBrowser() {
  return await launch({
    dumpio: false,
    headless: true
  });
}

export async function performGet(page, url) {
  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 120000
  });
}

export async function close(browser) {
  if (browser) {
    await browser.close();
  }
}
