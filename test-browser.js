const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('访问网站...');
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  console.log('页面标题:', await page.title());
  
  // 检查是否有功能卡片
  const toolCards = await page.$$('.group.bg-neutral-900');
  console.log('功能卡片数量:', toolCards.length);
  
  // 点击第一个功能（enhance）
  console.log('\n点击图像超分功能...');
  await page.click('button:has-text("图像超分")');
  await page.waitForTimeout(1000);
  
  // 检查是否显示参数控制
  const hasParams = await page.$('text=参数控制') || await page.$('text=预设') || await page.$('text=美化程度');
  console.log('参数控制显示:', hasParams ? '✓ 是' : '✗ 否');
  
  // 截图
  await page.screenshot({ path: '/tmp/tools-page.png', fullPage: true });
  console.log('\n截图保存到: /tmp/tools-page.png');
  
  await browser.close();
})();
