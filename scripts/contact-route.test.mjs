import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
test('both Contact routes have no inquiry adapter or mode dependency', async () => {
  for (const path of ['../app/(es)/contacto/page.tsx', '../app/(en)/en/contact/page.tsx']) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(source, /ContactPage/);
    assert.match(source, /from '\.\.\/_content\/contact'/);
    assert.doesNotMatch(source, /INQUIRY_RELEASE|selectContactPageContent|commercialContactContent|use client/);
  }
  const page = await readFile(new URL('../components/contact/ContactPage.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /ContactForm|<form\b|lib\/inquiry|use client/);
  assert.match(page, /getFoundationPageLinkHref/);
});
test('deployment has no Formspree credential or endpoint configuration', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.doesNotMatch(workflow, /FORMSPREE/i);
});
test('every Contact reading surface and control is a label occluder, including the Founder bridge (PLAN-SFC-V1 Task 25)', async () => {
  const page = await readFile(new URL('../components/contact/ContactPage.tsx', import.meta.url), 'utf8');
  const bridge = page.match(/<div[^>]*className=\{styles\.founderBridge\}[^>]*>/);
  assert.ok(bridge, 'the Founder bridge wrapper exists');
  assert.match(bridge[0], /data-connected-reading-mask/, 'a decorative label must never be drawn over the Founder link: the host measures this wrapper as an occluder');
});
