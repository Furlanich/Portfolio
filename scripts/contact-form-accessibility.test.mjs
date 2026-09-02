import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const componentSource = readFileSync(
  new URL('../components/sections/ContactForm.tsx', import.meta.url),
  'utf8'
);
const compiledComponent = ts.transpileModule(componentSource, {
  compilerOptions: {
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020
  },
  fileName: 'ContactForm.tsx'
}).outputText;

function loadContactForm(errors = {}) {
  const componentModule = { exports: {} };
  const formState = {
    register: (name) => ({ name }),
    handleSubmit: () => () => undefined,
    reset: () => undefined,
    formState: { errors }
  };
  const scopedRequire = (specifier) => {
    if (specifier === 'next-intl') {
      return { useTranslations: () => (key) => key };
    }

    if (specifier === 'react-hook-form') {
      return { useForm: () => formState };
    }

    return require(specifier);
  };

  Function('require', 'module', 'exports', compiledComponent)(
    scopedRequire,
    componentModule,
    componentModule.exports
  );

  return componentModule.exports.ContactForm;
}

function renderContactForm(errors) {
  const ContactForm = loadContactForm(errors);
  return renderToStaticMarkup(
    require('react').createElement(ContactForm)
  );
}

function findOpeningTag(markup, tagName, attribute, value) {
  const tags = markup.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? [];
  const expectedAttribute = new RegExp(`\\b${attribute}="${value}"`);
  const tag = tags.find((candidate) => expectedAttribute.test(candidate));

  assert.ok(tag, `Expected <${tagName}> with ${attribute}="${value}"`);
  return tag;
}

const fields = [
  { name: 'name', control: 'input', label: 'form.name' },
  { name: 'email', control: 'input', label: 'form.email' },
  { name: 'message', control: 'textarea', label: 'form.message' }
];

test('associates every contact-form label with its control', () => {
  const markup = renderContactForm();

  for (const field of fields) {
    const controlId = `contact-${field.name}`;
    const label = findOpeningTag(markup, 'label', 'for', controlId);
    const control = findOpeningTag(markup, field.control, 'name', field.name);

    assert.match(label, new RegExp(`for="${controlId}"`));
    assert.match(control, new RegExp(`id="${controlId}"`));
    assert.match(markup, new RegExp(`${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${field.label}</label>`));
  }
});

test('associates invalid controls with their rendered validation descriptions', () => {
  const errors = Object.fromEntries(
    fields.map(({ name }) => [name, { type: 'required' }])
  );
  const markup = renderContactForm(errors);

  for (const field of fields) {
    const errorId = `contact-${field.name}-error`;
    const control = findOpeningTag(markup, field.control, 'name', field.name);
    const validationMessage = findOpeningTag(markup, 'p', 'id', errorId);

    assert.match(control, new RegExp(`aria-describedby="${errorId}"`));
    assert.match(
      markup,
      new RegExp(
        `${validationMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}form\\.errors\\.${field.name}</p>`
      )
    );
  }
});
