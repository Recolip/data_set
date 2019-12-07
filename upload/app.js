const puppeteer = require('puppeteer');

const num = 100;

function waitForFrame(page) {
    let fulfill;
    const promise = new Promise(x => fulfill = x);
    checkFrame();
    return promise;
  
    function checkFrame() {
      const frame = page.frames()[0];
      if (frame)
        fulfill(frame);
      else
        page.once('frameattached', checkFrame);
    }
  }

function generateImage(path, index) {
    (async () => {
        // const browser = await puppeteer.launch({headless: false});
        // const page = await browser.newPage();
        // await page.goto('https://www.maybelline.com/virtual-try-on-makeup-tools');
        // await delay(20000);
        // const frame = await waitForFrame(page); 
        // // 2. waiting for the frame to contain the necessary selector
        // await frame.waitForSelector('img');
        // var images = await frame.$$eval('.privacy_policy_checkbox', img => {
        //     console.log(img);
        // })
        // console.log(images);

        // await page.screenshot({path: `demo.png`});
        // await browser.close();
        const browser = await puppeteer.launch() 
// in Actor use Apify.launchPuppeteer()

    const page = await browser.newPage()
    await page.setViewport({
        width: 1200,
        height: 1200,
        deviceScaleFactor: 1,
      });
    await page.goto('https://www.maybelline.com/virtual-try-on-makeup-tools');
    await page.waitFor(10000); // we need to wait for Twitter widget to load

    let twitterFrame; // this will be populated later by our identified frame

    for (const frame of page.mainFrame().childFrames()){
        // Here you can use few identifying methods like url(),name(),title()
        if (frame.url().includes('modiface')){
            console.log('Start job: ', index);
            twitterFrame = frame;
            var btn = await twitterFrame.$(".privacy_policy_checkbox");
            await twitterFrame.click('.privacy_policy_checkbox');
            const input = await twitterFrame.$('.tryon_button input')
            await input.uploadFile(path);
            await page.waitFor(10000); 
            await page.click("div[data-area-category='lips']");
            await page.click("div[data-tab='FA7895F9777B44A784F69A040A9085E3']");
            // console.log()
            await page.screenshot({path: `./images/${index}_changed.png`, clip: {
                x: 630,
                y: 400,
                width: 360,
                height: 480
            }});
            console.log('Finished job: ', index);
            // we assign this frame to myFrame to use it later
        }
    }

    await browser.close()
      })();
}


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
var index = process.argv[2];

 generateImage(`../images/${index}.png`, index);
