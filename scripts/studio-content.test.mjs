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

    const expectedAccountability = definition.locale === 'es'
      ? 'Samuel Furlanich participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. La responsabilidad tiene un nombre y se mantiene durante el proyecto.'
      : 'Samuel Furlanich is involved in defining the problem, technical decisions and review of the work. One named technical lead remains accountable throughout the project.';
    const expectedCollaboratorModel = definition.locale === 'es'
      ? 'Cuando el alcance requiere otra especialidad, se acuerda la participación de colaboradores y sus responsabilidades. Samuel mantiene la dirección técnica.'
      : 'When the scope calls for another specialty, collaborator involvement and responsibilities are agreed. Samuel retains technical leadership.';
    const expectedLocation = definition.locale === 'es'
      ? 'Desde Buenos Aires, Argentina, con disponibilidad para proyectos en el país y el exterior. Comunicación en español e inglés.'
      : 'Based in Buenos Aires, Argentina, with availability for work in Argentina and internationally. Communication is available in Spanish and English.';
    const expectedFounderBridge = definition.locale === 'es'
      ? 'Conocé la experiencia y formación de quien dirige el trabajo.'
      : 'Explore the experience and background of the person leading the work.';
    const expectedFinalCta = definition.locale === 'es'
      ? 'Explorá las opciones de contacto y la demostración del formulario.'
      : 'Explore contact options and the form demonstration.';

    assert.deepEqual(content.accountability.paragraphs, [expectedAccountability]);
    assert.deepEqual(content.collaboratorModel.paragraphs, [expectedCollaboratorModel]);
    assert.equal(content.location.description, expectedLocation);
    assert.equal(content.founderBridge.description, expectedFounderBridge);
    assert.equal(content.finalCta.description, expectedFinalCta);

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
