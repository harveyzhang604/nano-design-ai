const { chromium } = require('playwright');

const allTools = [
  // P0 (5个)
  { name: '图像超分', param: '美化' },
  { name: '背景移除', param: '边缘' },
  { name: '老照片修复', param: '修复' },
  { name: '照片上色', param: '色调' },
  { name: '人像增强', param: '美颜' },
  
  // P1 (8个)
  { name: '图像放大', param: '放大' },
  { name: '草图转图', param: '风格' },
  { name: '风格迁移', param: '艺术' },
  { name: '卡通化', param: '卡通' },
  { name: '年龄变换', param: '变化' },
  { name: '性别转换', param: '转换' },
  { name: '发型设计', param: '发型' },
  { name: '虚拟试妆', param: '妆容' },
  
  // P2 (11个)
  { name: '宠物卡通', param: '卡通' },
  { name: '纹身设计', param: '纹身' },
  { name: '室内设计', param: '设计' },
  { name: '产品摄影', param: '背景' },
  { name: 'AI写真', param: '拍摄' },
  { name: '表情包', param: '表情' },
  { name: '梗图生成', param: '梗图' },
  { name: 'Logo设计', param: 'Logo' },
  { name: '地图生成', param: '地图' },
  { name: '服装模特', param: '服装' },
  { name: '图像合成', param: '合成' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('访问网站...\n');
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  console.log('测试26个功能的参数控制:\n');
  console.log('功能名称'.padEnd(20) + '参数显示  预设选项');
  console.log('='.repeat(50));
  
  let passCount = 0;
  let failCount = 0;
  
  for (const tool of allTools) {
    try {
      // 滚动到元素可见
      await page.evaluate((name) => {
        const button = Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.includes(name));
        if (button) button.scrollIntoView({ block: 'center' });
      }, tool.name);
      
      await page.waitForTimeout(300);
      
      // 点击功能
      await page.click(`button:has-text("${tool.name}")`, { timeout: 5000 });
      await page.waitForTimeout(1000);
      
      // 检查参数
      const hasParam = await page.locator(`text=${tool.param}`).count() > 0;
      const hasPreset = await page.locator('text=预设').count() > 0 || 
                        await page.locator('text=自然').count() > 0 ||
                        await page.locator('text=标准').count() > 0;
      
      const status = hasParam && hasPreset ? '✓' : '✗';
      const paramStatus = hasParam ? '✓' : '✗';
      const presetStatus = hasPreset ? '✓' : '✗';
      
      console.log(`${tool.name.padEnd(20)} ${paramStatus}        ${presetStatus}       ${status}`);
      
      if (hasParam && hasPreset) {
        passCount++;
      } else {
        failCount++;
      }
      
      // 关闭面板
      await page.click('button:has-text("×")', { timeout: 3000 });
      await page.waitForTimeout(500);
      
    } catch (e) {
      console.log(`${tool.name.padEnd(20)} ✗        ✗       ✗ (${e.message.split('\n')[0]})`);
      failCount++;
    }
  }
  
  console.log('='.repeat(50));
  console.log(`\n测试结果: ${passCount}/${allTools.length} 通过, ${failCount} 失败`);
  console.log(`通过率: ${(passCount/allTools.length*100).toFixed(1)}%`);
  
  await browser.close();
})();
