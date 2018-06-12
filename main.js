import { writeToFile, testUrl } from './lib/functions';
import { urls, addUrlToArray } from './lib/url';

async function run() {
  await addUrlToArray();

  urls.forEach(async url => {
    try {
      console.log('Testing ' + url);
      await testUrl(url);
    } catch (err) {
      console.log(err);
    }
  });
}

run();
