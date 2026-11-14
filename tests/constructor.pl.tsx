import { expect, test } from '@playwright/test';

test('добавляет булку в конструктор', async ({ page }) => {
  await page.routeFromHAR('./tests/fixtures/ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.goto('/');

  const bunCard = page.getByRole('listitem').filter({
    hasText: 'Краторная булка N-200i',
  });

  await expect(bunCard).toBeVisible();
  await bunCard.getByRole('button', { name: 'Добавить' }).click();

  await expect(
    page.getByText('Краторная булка N-200i (верх)', { exact: true })
  ).toBeVisible();
});

test('открывает детали булки и закрывает по крестику', async ({ page }) => {
  await page.routeFromHAR('./tests/fixtures/ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.goto('/');
  await page.getByRole('link', { name: /Краторная булка N-200i/ }).click();

  const closeButton = page.getByRole('button', { name: 'Закрыть' });
  await expect(closeButton).toBeVisible();

  await closeButton.locator('svg').click();
  await expect(closeButton).toBeHidden();
});

test('оформляет заказ', async ({ context, page }) => {
  await page.routeFromHAR('./tests/fixtures/user.har', {
    url: '**/api/auth/user',
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-access-token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.routeFromHAR('./tests/fixtures/orders.har', {
    url: '**/api/orders',
  });

  await page.routeFromHAR('./tests/fixtures/ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.goto('/');

  const bunCard = page.getByRole('listitem').filter({
    hasText: 'Краторная булка N-200i',
  });
  await bunCard.getByRole('button', { name: 'Добавить' }).click();

  const fillingCard = page.getByRole('listitem').filter({
    hasText: 'Говяжий метеорит (отбивная)',
  });
  await fillingCard.getByRole('button', { name: 'Добавить' }).click();

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  const orderNumber = page.getByText('12345', { exact: true });
  await expect(orderNumber).toBeVisible();
  await expect(page.getByText('Выберите булки', { exact: true })).toHaveCount(2);
  await expect(page.getByText('Выберите начинку', { exact: true })).toBeVisible();

  const closeButton = page.getByRole('button', { name: 'Закрыть' });
  await closeButton.locator('svg').click();
  await expect(orderNumber).toBeHidden();
});
