const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('检查失败的两个功能:\n');
  
  // 测试年龄模拟
  console.log('1. 年龄模拟:');
  const ageBtn = await page.locator('button:has-text("年龄模拟")').first();
  await ageBtn.scrollIntoViewIfNeeded();
  await ageBtn.click();
  await page.waitForTimeout(1500);
  
  const ageText = await page.locator('text=上传图片').count();
  console.log('   面板打开:', ageText > 0 ? '✓' : '✗');
  
  const ageParams = await page.evaluate(() => {
    return document.body.innerText;
  });
  console.log('   包含"变化":', ageParams.includes('变化') ? '✓' : '✗');
  console.log('   包含"预设":', ageParams.includes('预设') ? '✓' : '✗');
  console.log('   包含"年龄":', ageParams.includes('年龄') ? '✓' : '✗');
  console.log('   包含"目标":', ageParams.includes('目标') ? '✓' : '✗');
  
  await page.click('button:has-text("×")');
  await page.waitForTimeout(1000);
  
  // 测试生日贺卡
  console.log('\n2. 生日贺卡:');
  const greetBtn = await page.locator('button:has-text("生日贺卡")').first();
  await greetBtn.scrollIntoViewIfNeeded();
  await greetBtn.click();
  await page.waitForTimeout(1500);
  
  const greetText = await page.locator('text=上传图片').count();
  console.log('   面板打开:', greetText > 0 ? '✓' : '✗');
  
  const greetParams = await page.evaluate(() => {
    return document.body.innerText;
  });
  console.log('   包含"场合":', greetParams.includes('场合') ? '✓' : '✗');
  console.log('   包含"预设":', greetParams.includes('预设') ? '✓' : '✗');
  console.log('   包含"生日":', greetParams.includes('生日') ? '✓' : '✗');
  
  await browser.close();
})();
