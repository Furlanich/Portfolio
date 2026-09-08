import test from 'node:test';
import assert from 'node:assert/strict';

const modules = [
  { locale: 'es', path: '../app/(es)/_content/studio.ts' },
  { locale: 'en', path: '../app/(en)/en/_content/studio.ts' },
];

for (const definition of modules) {
  test(`exports one complete Studio content object for ${definition.locale}`, async () => {
    const { studioPageContent: content } = await import(definition.path);

    assert.equal(content.locale, definition.locale);
    assert.equal(content.routeId, 'studio');
    assert.ok(content.intro.eyebrow);
    assert.ok(content.intro.heading);
    assert.ok(content.intro.positioning);
    assert.ok(content.intro.supportingStatement);
    assert.equal(content.intro.primaryAction.routeId, 'contact');
    assert.equal(content.intro.secondaryAction.routeId, 'founder');
    assert.equal(typeof content.intro.primaryAction.href, 'undefined');
    assert.equal(typeof content.intro.secondaryAction.href, 'undefined');

    assert.ok(content.operatingModel.label);
    assert.ok(content.operatingModel.items.length > 0);
    assert.equal('metrics' in content.operatingModel, false);
    assert.equal('statistics' in content.operatingModel, false);

    assert.ok(content.accountability.heading);
    assert.ok(content.accountability.paragraphs.length > 0);
    assert.ok(content.collaboratorModel.heading);
    assert.ok(content.collaboratorModel.paragraphs.length > 0);

    assert.ok(content.principles.heading);
    assert.ok(content.principles.introduction);
    assert.equal(content.principles.items.length, 4);
    assert.ok(content.principles.items.every(({ title, description }) => title && description));

    assert.ok(content.location.heading);
    assert.ok(content.location.description);
    assert.ok(content.founderBridge.heading);
    assert.ok(content.founderBridge.description);
    assert.equal(content.founderBridge.action.routeId, 'founder');
    assert.equal(typeof content.founderBridge.action.href, 'undefined');
    assert.ok(content.finalCta.heading);
    assert.ok(content.finalCta.description);
    assert.equal(content.finalCta.action.routeId, 'contact');
    assert.equal(typeof content.finalCta.action.href, 'undefined');
  });
}