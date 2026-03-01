import { test, expect } from '@playwright/test';

test.describe('Nano Design API', () => {
  test('POST /api/generate should handle validation', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/generate', {
      data: {
        category: 'fashion'
        // Missing prompt
      }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Prompt is required');
  });
});
