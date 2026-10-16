import test from 'node:test';
import assert from 'node:assert/strict';

// PLAN-SFC-V1 Task 6 / DESIGN-SFC-V1 "Studio" + PAGE-STUDIO "Atlas redesign copy selection": the approved
// Studio content. Studio keeps the eyebrow, the Q18 software H1, a shortened positioning sentence, both
// introduction actions, the accountability and collaborator copy, four complete principles, location, one
// Founder bridge and the final Contact heading. The separate operating-model list and the supporting
// statement are gone because the accountability, collaborator and location sections carry those facts.

const modules = [
  { locale: 'es', path: '../app/(es)/_content/studio.ts' },
  { locale: 'en', path: '../app/(en)/en/_content/studio.ts' },
];

const approved = {
  es: {
    heading: 'Software a medida con responsabilidad técnica directa.',
    positioning: 'FURLANICH diseña, desarrolla y mejora software a medida para negocios que necesitan resolver procesos concretos.',
    sceneCaption: 'Responsabilidad central, especialidades conectadas.',
    words: ['Responsabilidad', 'Alcance', 'Especialistas', 'Revisión'],
    accountability: 'Samuel Furlanich participa en la definición del problema, las decisiones técnicas y la revisión del trabajo. La responsabilidad tiene un nombre y se mantiene durante el proyecto.',
    collaborator: 'Cuando el alcance requiere otra especialidad, se acuerda la participación de colaboradores y sus responsabilidades. Samuel mantiene la dirección técnica.',
    location: 'Desde Buenos Aires, Argentina, con disponibilidad para proyectos en el país y el exterior. Comunicación en español e inglés.',
    founderBridge: 'Conocé la experiencia y formación de quien dirige el trabajo.',
    // Demonstration-dependent until the coordinated release (Task 16 owns the atomic selection).
    finalCta: 'Explorá las opciones de contacto y la demostración del formulario.',
  },
  en: {
    heading: 'Custom software with direct technical accountability.',
    positioning: 'FURLANICH designs, builds, and improves custom software for businesses with concrete operational needs.',
    sceneCaption: 'Central accountability, connected specialties.',
    words: ['Accountability', 'Scope', 'Specialists', 'Review'],
    accountability: 'Samuel Furlanich is involved in defining the problem, technical decisions and review of the work. One named technical lead remains accountable throughout the project.',
    collaborator: 'When the scope calls for another specialty, collaborator involvement and responsibilities are agreed. Samuel retains technical leadership.',
    location: 'Based in Buenos Aires, Argentina, with availability for work in Argentina and internationally. Communication is available in Spanish and English.',
    founderBridge: 'Explore the experience and background of the person leading the work.',
    finalCta: 'Explore contact options and the form demonstration.',
  },
};

for (const definition of modules) {
  const expected = approved[definition.locale];

  test(`exports one complete Studio content object for ${definition.locale}`, async () => {
    const { studioPageContent: content } = await import(definition.path);

    assert.equal(content.locale, definition.locale);
    assert.equal(content.routeId, 'studio');
    assert.ok(content.intro.eyebrow);
    assert.equal(content.intro.heading, expected.heading);
    assert.equal(content.intro.positioning, expected.positioning);
    assert.equal(content.intro.primaryAction.routeId, 'contact');
    assert.equal(content.intro.secondaryAction.routeId, 'founder');
    assert.equal(typeof content.intro.primaryAction.href, 'undefined');
    assert.equal(typeof content.intro.secondaryAction.href, 'undefined');

    assert.ok(content.accountability.heading);
    assert.deepEqual(content.accountability.paragraphs, [expected.accountability]);
    assert.ok(content.collaboratorModel.heading);
    assert.deepEqual(content.collaboratorModel.paragraphs, [expected.collaborator]);

    assert.ok(content.principles.heading);
    assert.ok(content.principles.introduction);
    assert.equal(content.principles.items.length, 4);
    assert.ok(content.principles.items.every(({ title, description }) => title && description));

    assert.ok(content.location.heading);
    assert.equal(content.location.description, expected.location);
    assert.ok(content.founderBridge.heading);
    assert.equal(content.founderBridge.description, expected.founderBridge);
    assert.equal(content.founderBridge.action.routeId, 'founder');
    assert.equal(typeof content.founderBridge.action.href, 'undefined');
    assert.ok(content.finalCta.heading);
    assert.equal(content.finalCta.description, expected.finalCta);
    assert.equal(content.finalCta.action.routeId, 'contact');
    assert.equal(typeof content.finalCta.action.href, 'undefined');
  });

  test(`${definition.locale} Studio drops the duplicated operating-model presentation`, async () => {
    const { studioPageContent: content } = await import(definition.path);

    assert.equal('operatingModel' in content, false, 'the five-line operating-model list is omitted');
    assert.equal('supportingStatement' in content.intro, false, 'the collaborator section carries the supporting statement');
    for (const key of ['metrics', 'statistics']) assert.equal(key in content, false);
  });

  test(`${definition.locale} Studio carries the approved graph caption and four decorative word bindings`, async () => {
    const { studioPageContent: content } = await import(definition.path);

    assert.equal(content.sceneCaption, expected.sceneCaption);
    // DESIGN-SFC-V1: four decorative words bind to n0, n4, n8, n12, in the Studio/Founder-owned order.
    assert.deepEqual(
      content.wordBindings,
      ['n0', 'n4', 'n8', 'n12'].map((nodeId, index) => ({ nodeId, word: expected.words[index] })),
    );
  });
}
