import { test, expect } from '@playwright/test';

test.describe('Nano Design AI UI', () => {
  test.beforeEach(async ({ page }) => {
    // 假设开发服务器在 3000 端口
    await page.goto('http://localhost:3000');
  });

  test('should display correctly initialized', async ({ page }) => {
    await expect(page.getByText('Nano Design AI')).toBeVisible();
    await expect(page.getByText('开始您的创作')).toBeVisible();
  });

  test('should switch categories', async ({ page }) => {
    const architectureBtn = page.getByRole('button', { name: '建筑设计' });
    await architectureBtn.click();
    // 检查按钮状态 (通过类名判断)
    await expect(architectureBtn).toHaveClass(/border-amber-500/);
  });

  test('should handle prompt input', async ({ page }) => {
    const textarea = page.getByPlaceholder('描述您的设计灵感');
    await textarea.fill('A futuristic glass building');
    await expect(textarea).toHaveValue('A futuristic glass building');
    
    // 生成按钮应该是可点击的
    const generateBtn = page.getByRole('button', { name: '生成设计方案' });
    await expect(generateBtn).toBeEnabled();
  });
});
