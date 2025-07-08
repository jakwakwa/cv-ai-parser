// @ts-nocheck
import { test, expect } from '@playwright/test';

// Test files expected at tests/fixtures/
const RESUME_TXT = 'tests/fixtures/sample-resume.txt';
const AVATAR_JPG = 'public/placeholder-user.jpg';

// Viewport widths to test
const BREAKPOINTS = [320, 375, 414, 768] as const;

test.describe('Responsive layout & interactions', () => {
  for (const width of BREAKPOINTS) {
    test(`library view stacks correctly at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/library');
      // Ensure no horizontal scroll
      const bodyScroll = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyScroll).toBeLessThanOrEqual(width);
      // Container should be column at < 768px, row at 768px
      const flexDir = await page.locator('.libraryContainer').evaluate(el => getComputedStyle(el).flexDirection);
      const expected = width < 768 ? 'column' : 'row';
      expect(flexDir).toBe(expected);
    });
  }

  test('drawer menu visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/library');
    await page.getByRole('button', { name: /open mobile menu/i }).click();
    const drawer = page.locator('.drawer');
    await expect(drawer).toBeVisible();
    const box = await drawer.boundingBox();
    expect(box?.y).toBeLessThanOrEqual(0); // anchored to top
  });
});

test.describe('Tailor tool avatar flow', () => {
  test('avatar persists after upload', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tools/tailor');

    // Upload resume
    await page.setInputFiles('#resume-upload', RESUME_TXT);

    // Wait for success dialog
    await page.getByText(/Resume Tailored Successfully/i).waitFor();

    // Upload avatar (the first visible file input inside the dialog)
    const avatarInput = page.locator('input[type="file"]').last();
    await avatarInput.setInputFiles(AVATAR_JPG);

    // View resume
    await page.getByRole('button', { name: /view my resume/i }).click();

    // Confirm avatar visible
    const img = page.locator('#resume-content img').first();
    await expect(img).toBeVisible();

    // Refresh: avatar should still be visible (DB persisted)
    await page.reload();
    await expect(img).toBeVisible();
  });
});

test.describe('Dark theme colour-picker', () => {
  test.use({ colorScheme: 'dark', viewport: { width: 1280, height: 800 } });

  test('dialog uses dark background', async ({ page }) => {
    await page.goto('/tools/tailor');
    await page.getByRole('button', { name: /customize colors/i }).click();
    const dialog = page.locator('.dialogContent');
    const bg = await dialog.evaluate(el => getComputedStyle(el).backgroundColor);
    // Should not be pure white in dark mode
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });
});