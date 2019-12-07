const puppeteer = require('puppeteer');

const num = 100;

function generateImage(index) {
    (async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto('https://thispersondoesnotexist.com/');
        await page.screenshot({path: `../images/${index}.png`});
        await browser.close();
      })();
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

 (
     async () => {
        for (let index = 0; index < num; index++) {
            generateImage(index);
            await delay(4000);
        }
     }
 )()

