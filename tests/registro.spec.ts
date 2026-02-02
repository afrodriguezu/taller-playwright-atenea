import { test, expect } from '@playwright/test';

test('TC-1 Verificación de elementos visuales en la página de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('input[name=firstName]')).toBeVisible();
  await expect(page.locator('input[name=lastName]')).toBeVisible();
  await expect(page.locator('input[name=email]')).toBeVisible();
  await expect(page.locator('input[name=password]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-2 Verificar que el boton de resgistro esta deshabilitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC-3 Verificar que el boton de registro se habilita al completar el formulario', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name=firstName]').fill('Andres');
  await page.locator('input[name=lastName]').fill('Rodriguez');
  await page.locator('input[name=email]').fill('andres-rodriguez@gemail.com');
  await page.locator('input[name=password]').fill('12345678');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-4 Verificar redireccionamiento a pagina de inicio al hacer click en iniciar sesión', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar registro exitoso con datos validos', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name=firstName]').fill('Andres');
  await page.locator('input[name=lastName]').fill('Rodriguez');
  await page.locator('input[name=email]').fill('andres-rodriguez'+Date.now().toString()+'@eemail.com');
  await page.locator('input[name=password]').fill('12345678');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrase con un correo electrónico ya existente', async ({ page }) => {
  const email = 'andres-rodriguez'+Date.now().toString()+'@eemail.com';
  await page.goto('http://localhost:3000/');
  await page.locator('input[name=firstName]').fill('Andres');
  await page.locator('input[name=lastName]').fill('Rodriguez');
  await page.locator('input[name=email]').fill(email);
  await page.locator('input[name=password]').fill('12345678');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('http://localhost:3000/');
  await page.locator('input[name=firstName]').fill('Andres');
  await page.locator('input[name=lastName]').fill('Rodriguez');
  await page.locator('input[name=email]').fill(email);
  await page.locator('input[name=password]').fill('12345678');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});