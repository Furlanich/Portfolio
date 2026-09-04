import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const activeRoots = ['app', 'components', 'lib', 'locales'];
const legacyLocalizationPattern = /next-intl|NextIntlClientProvider|useTranslations|onLocaleChange|document\.documentElement\.lang|messagesByLocale|getLocalizedString/;
const retiredFiles = [
  'components/layout/LanguageSwitch.tsx',
  'components/layout/Navbar.tsx',
  'components/sections/ContactForm.tsx',
  'components/sections/ContactSection.tsx',
  'components/sections/EducationSection.tsx',
  'components/sections/ExperienceSection.tsx',
  'components/sections/LandingSection.tsx',
  'components/sections/ProjectsSection.tsx',
  'components/sections/SkillsSection.tsx',
  'lib/i18n.ts',
  'locales/en/common.json',
  'locales/es/common.json',
];

async function collectFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    else files.push(path);
  }

  return files;
}

test('active source has no legacy next-intl localization consumers', async () => {
  const files = (
    await Promise.all(activeRoots.map((root) => collectFiles(join(projectRoot, root))))
  ).flat();

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, legacyLocalizationPattern, file);
  }

  const packageJson = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  assert.equal(packageJson.dependencies?.['next-intl'], undefined);
});

test('proven-unused legacy localization files stay retired', async () => {
  for (const file of retiredFiles) {
    await assert.rejects(access(join(projectRoot, file)), { code: 'ENOENT' }, file);
  }
});
