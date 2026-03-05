const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  // 获取所有功能按钮的文本
  const buttons = await page.$$('button');
  const toolNames = [];
  
  for (const button of buttons) {
    const text = await button.textContent();
    if (text && text.includes('立即体验')) {
      const lines = text.split('\n').filter(l => l.trim() && !l.includes('立即体验') && !l.includes('P0') && !l.includes('P1') && !l.includes('P2'));
      if (lines.length > 0) {
        toolNames.push(lines[0].trim());
      }
    }
  }
  
  console.log('页面上的功能列表:');
  console.log(toolNames.join('\n'));
  console.log(`\n总计: ${toolNames.length} 个功能`);
  
  await browser.close();
})();
