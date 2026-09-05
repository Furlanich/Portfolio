import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('promotes the homepage primitives without changing their public markup contract', () => {
  const heading = read('components/commercial/CommercialSectionHeading.tsx');
  const card = read('components/commercial/CommercialContentCard.tsx');

  assert.match(heading, /interface CommercialSectionHeadingProps/);
  assert.match(heading, /headingId: string/);
  assert.match(heading, /heading: string/);
  assert.match(heading, /intro\?: string/);
  assert.match(heading, /export function CommercialSectionHeading/);
  assert.match(heading, /className="max-w-\[68ch\]"/);
  assert.match(heading, /<h2/);
  assert.match(heading, /className="max-w-\[20ch\] text-\[32px\] font-bold leading-\[38px\] tracking-\[-0\.015em\] text-foundation-ink md:text-\[40px\] md:leading-\[48px\]"/);
  assert.match(heading, /className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8"/);

  assert.match(card, /interface CommercialContentCardProps/);
  assert.match(card, /title: string/);
  assert.match(card, /description: string/);
  assert.match(card, /export function CommercialContentCard/);
  assert.match(card, /<article/);
  assert.match(card, /className="rounded-\[16px\] border border-foundation-border bg-foundation-surface p-6 md:p-8"/);
  assert.match(card, /className="text-xl font-bold leading-7 text-foundation-ink"/);
  assert.match(card, /className="mt-3 text-base leading-\[26px\] text-foundation-muted"/);

  const homepageFiles = [
    'HomeAudiences.tsx',
    'HomeFounder.tsx',
    'HomeProcess.tsx',
    'HomeProblems.tsx',
    'HomeProof.tsx',
    'HomeServices.tsx',
  ];

  for (const fileName of homepageFiles) {
    const source = read(path.join('components/homepage', fileName));
    assert.doesNotMatch(source, /HomepageSectionHeading|HomepageContentCard/);
  }

  assert.equal(fs.existsSync(path.join(root, 'components/homepage/HomepageSectionHeading.tsx')), false);
  assert.equal(fs.existsSync(path.join(root, 'components/homepage/HomepageContentCard.tsx')), false);
});
