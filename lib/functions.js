import { appendFile } from 'fs';
import { close, launchBrowser, performGet, setBrowser } from './browser';

export async function testUrl(url) {
  let browser;
  let page;
  try {
    browser = await launchBrowser();
    page = await setBrowser(url, browser);
    await performGet(page, url);
    await close(browser);
  } catch (error) {
    console.log(error);
    if (browser || page) {
      await close(browser);
    }
  }
}

export async function writeToFile(response) {
  appendFile(
    'result.csv',
    new Date().toISOString() + ',' + response.url() + ',' + response.status() + '\n',
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

export async function isReponseValid(response) {
  return (
    !response.url().includes('google') && !response.url().includes('doubleclick') && !response.ok()
  );
}

export async function isErrorMessageVisible(page) {
  let errorMessages = await page.$$("p:contains('Sorry technische fout')");
  errorMessages.forEach(e => {
    if (e.offsetHeight > 0) {
      return true;
    }
  });
  return false;
}
