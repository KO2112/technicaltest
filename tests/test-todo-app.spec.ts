import { test, expect } from '@playwright/test';

test('Check the page title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Todo List App');
});

test('Check the title of the page (Todo List)', async ({ page }) => {
  await page.goto('/');
  const pageTitle = await page.textContent('h1');
  expect(pageTitle).toBe('Todo List');
});

test('Add a new todo and verify it was added', async ({ page }) => {
  await page.goto('/');
  const newTodo = 'kemal';

  await page.fill('[data-testid="todo-new"]', newTodo);
  await page.press('[data-testid="todo-new"]', 'Enter');

  const todoTexts = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTexts).toContain(newTodo);
});

test('Remove a todo', async ({ page }) => {
  await page.goto('/');
  const newTodo = 'kemal';

  await page.fill('[data-testid="todo-new"]', newTodo);
  await page.press('[data-testid="todo-new"]', 'Enter');

  const todoTextsBeforeRemoval = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTextsBeforeRemoval).toContain(newTodo);

  await page.click('(//button[@data-testid="todo-item-remove"])[3]'); 

  const todoTextsAfterRemoval = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTextsAfterRemoval).not.toContain(newTodo);
});

test('Add a new todo and verify checkbox functionality', async ({ page }) => {
  await page.goto('/');
  const newTodo = 'Kemal';

  await page.fill('[data-testid="todo-new"]', newTodo);
  await page.press('[data-testid="todo-new"]', 'Enter');

  await page.click('(//input[@data-testid="todo-item-complete"])[3]');
  const isChecked = await page.isChecked('(//input[@data-testid="todo-item-complete"])[3]');
  expect(isChecked).toBeTruthy();
});

test('Add a new todo, mark as completed, filter by completed', async ({ page }) => {
  await page.goto('/');
  const newTodo = 'kemal';

  await page.fill('[data-testid="todo-new"]', newTodo);
  await page.press('[data-testid="todo-new"]', 'Enter');

  await page.click('(//input[@data-testid="todo-item-complete"])[3]');
  await page.click('[value="completed"]');

  const todoTexts = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTexts).toContain(newTodo);
});

test('Add a new todo, leave unchecked, filter by active', async ({ page }) => {
  await page.goto('/');
  const newTodo = 'kemal';

  await page.fill('[data-testid="todo-new"]', newTodo);
  await page.press('[data-testid="todo-new"]', 'Enter');

  await page.click('[value="active"]');

  const todoTexts = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTexts).toContain(newTodo);
});

test('Add two todos and verify they appear in "All" filter', async ({ page }) => {
  await page.goto('/');
  const todo1 = 'kemal';
  const todo2 = 'kemal2';

  await page.fill('[data-testid="todo-new"]', todo1);
  await page.press('[data-testid="todo-new"]', 'Enter');

  await page.fill('[data-testid="todo-new"]', todo2);
  await page.press('[data-testid="todo-new"]', 'Enter');

  await page.click('[value="all"]');

  const todoTexts = await page.$$eval('[data-testid="todo-item-text"]', elements => elements.map(el => el.textContent));
  expect(todoTexts).toContain(todo1);
  expect(todoTexts).toContain(todo2);
});
