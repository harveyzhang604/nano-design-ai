const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('1. 访问网站...');
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  console.log('2. 查找功能按钮...');
  const buttons = await page.$$('button');
  console.log('   找到按钮数量:', buttons.length);
  
  console.log('\n3. 点击"图像超分"功能...');
  await page.click('button:has-text("图像超分")');
  await page.waitForTimeout(2000);
  
  console.log('4. 检查参数控制面板...');
  const panelVisible = await page.isVisible('text=上传图片');
  console.log('   面板显示:', panelVisible ? '✓' : '✗');
  
  // 检查是否有参数控制相关文字
  const hasPreset = await page.locator('text=预设').count() > 0;
  const hasBeauty = await page.locator('text=美化').count() > 0;
  const hasNatural = await page.locator('text=自然').count() > 0;
  
  console.log('   预设选项:', hasPreset ? '✓' : '✗');
  console.log('   美化相关:', hasBeauty ? '✓' : '✗');
  console.log('   自然选项:', hasNatural ? '✓' : '✗');
  
  // 截图当前状态
  await page.screenshot({ path: '/root/.openclaw/workspace/panel-open.png', fullPage: true });
  console.log('\n5. 截图保存: panel-open.png');
  
  await browser.close();
})();
