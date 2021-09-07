const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size')

// https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}

async function html2image(url, output) {
  // 打开浏览器
  const browser = await puppeteer.launch();
  // 新建标签页
  const page = await browser.newPage();
  // 跳转指定页面
  await page.goto(url);
  // 设置页面大小，宽度为手机的 750px，高度无所谓
  await page.setViewport({
    width: 750,
    height: 100,
    deviceScaleFactor: 1,
  });

  await autoScroll(page);

  //await page.goto('https://m.baidu.com/'); // 跳转指定页面
  // 等待页面渲染
  // await page.waitForTimeout(9000);

  // 截图
  let filename = `${uuidv4()}.png`;
  let path = `${output}/${filename}`;
  await page.screenshot({
    path,
    fullPage: true,
    captureBeyondViewport: true 
  });

  await browser.close();

  let dimensions = sizeOf(path);

  return {
    filename,
    ...dimensions,
  };
}

// 测试 
// let url = 'https://mp.weixin.qq.com/s/S0kHvkH6nlkILnjovVSEaQ';
// html2image(url, 'public/img');

module.exports = html2image
