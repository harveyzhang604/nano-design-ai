const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  // 获取页面HTML
  const html = await page.content();
  
  // 检查关键元素
  console.log('检查关键元素:');
  console.log('- 包含"图像超分":', html.includes('图像超分'));
  console.log('- 包含"P0":', html.includes('P0'));
  console.log('- 包含"bg-neutral-900":', html.includes('bg-neutral-900'));
  
  // 检查JavaScript错误
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('JS错误:', msg.text());
    }
  });
  
  // 等待一下看是否有动态加载
  await page.waitForTimeout(3000);
  
  const toolCards2 = await page.$$('button');
  console.log('\n所有按钮数量:', toolCards2.length);
  
  await browser.close();
})();
