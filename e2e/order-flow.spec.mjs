/**
 * Test de bout en bout contre le vrai site en production, ciblé sur
 * "Resto Démo" (slug demo-charge) - créé exactement pour ça, sans
 * conséquence sur un vrai restaurant si l'exécution répétée y
 * accumule des commandes de test.
 *
 * Tourne contre www.foodatoi.fr réel, pas un environnement de test
 * séparé (qui n'existe pas encore) - à garder à l'esprit si le site
 * est indisponible au moment de l'exécution en CI.
 */
import { test, expect } from '@playwright/test';

const DEMO_URL = 'https://www.foodatoi.fr/?resto=demo-charge';

test('un client peut parcourir la carte, ajouter un article et passer commande', async ({ page }) => {
  await page.goto(DEMO_URL);

  await expect(
    page.getByRole('heading', { name: /Choisis/i })
  ).toBeVisible({ timeout: 15000 });

  const addButtons = page.locator('[data-add]');
  await expect(addButtons.first()).toBeVisible({ timeout: 10000 });
  await addButtons.first().click();

  await page.getByRole('button', { name: /Ma commande/i }).click();

  await page.getByLabel(/TON NOM/i).fill('Test E2E');
  await page.getByLabel(/TON TÉLÉPHONE/i).fill('0600000000');

  const timeInput = page.locator('input[name="pickupTime"]');
  if (await timeInput.count()) {
    await timeInput.fill('12:00');
  }

  await page.getByRole('button', { name: /Commander|Envoyer/i }).click();

  await expect(
    page.getByText(/FA-\d{6}-[A-Z0-9]{6}/)
  ).toBeVisible({ timeout: 15000 });
});
