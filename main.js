import { writeToFile, addUrlToArray, testUrl, urls } from "./lib";

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