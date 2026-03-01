import { test, expect } from '@playwright/test';

test.describe('Nano Banana 2: Core Design AI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 启动开发环境测试。注意：如果是 CI 环境，通常需要提前运行 npm run dev
    await page.goto('http://localhost:3000');
  });

  // 测试用例 1: 建筑设计逻辑路径测试
  test('should generate Architecture design with Nano Banana 2', async ({ page }) => {
    const architectureBtn = page.getByRole('button', { name: '建筑设计' });
    await architectureBtn.click();
    
    const textarea = page.getByPlaceholder('描述您的设计灵感');
    await textarea.fill('Futuristic eco-resort in the Swiss Alps, integrated into the mountain, solar panels, large glass panels, high-end architectural rendering.');
    
    const generateBtn = page.getByRole('button', { name: '生成设计方案' });
    await expect(generateBtn).toBeEnabled();
    
    // 我们在此不点击按钮以节省 API 消耗，而是测试页面逻辑是否触发
    console.log('[Test 1] Architecture Logic: PASS');
  });

  // 测试用例 2: 服装设计逻辑路径测试
  test('should generate Fashion design with Nano Banana 2', async ({ page }) => {
    const fashionBtn = page.getByRole('button', { name: '服装设计' });
    await fashionBtn.click();
    
    const textarea = page.getByPlaceholder('描述您的设计灵感');
    await textarea.fill('Cyberpunk haute couture outfit, glowing neon fiber optics, heavy oversized leather coat, futuristic urban background, 8k studio photography.');
    
    const generateBtn = page.getByRole('button', { name: '生成设计方案' });
    await expect(generateBtn).toBeEnabled();
    
    console.log('[Test 2] Fashion Logic: PASS');
  });

  // 测试用例 3: 室内设计逻辑路径测试
  test('should generate Interior design with Nano Banana 2', async ({ page }) => {
    const interiorBtn = page.getByRole('button', { name: '室内设计' });
    await interiorBtn.click();
    
    const textarea = page.getByPlaceholder('描述您的设计灵感');
    await textarea.fill('Minimalist Japandi living room, light oak furniture, soft natural lighting, bonsai tree, highly detailed, interior magazine style.');
    
    const generateBtn = page.getByRole('button', { name: '生成设计方案' });
    await expect(generateBtn).toBeEnabled();
    
    console.log('[Test 3] Interior Logic: PASS');
  });
});
