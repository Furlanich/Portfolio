import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerifier } from './export-test-support.mjs';
import { contactRequirements } from './export-requirements/contact.mjs';
function html(r, base = '', extra = '') {
  return '<html><body><main><h1>' + r.heading + '</h1>' + extra + r.channels.map(href => '<a href="' + href + '">Contact</a>').join('') + '<a href="' + base + r.privacy + '">Privacy</a><a href="' + base + r.founder + '">Founder</a></main></body></html>';
}
function messages(file, content, basePath = '') {
  return runVerifier({files:{[file]:content},basePath}).output.split('\n').filter(line=>line.startsWith('- '+file+':') && /Contact/.test(line));
}
for(const [file,r] of Object.entries(contactRequirements)) {
  test(file + ' direct-contact export works at root and /Portfolio',()=>{
    for(const base of ['', '/Portfolio']) assert.deepEqual(messages(file,html(r,base),base),[]);
  });
  test(file + ' rejects a restored form, provider, missing channel or unprefixed legal link',()=>{
    for(const extra of ['<form></form>','<input name="message">','https://formspree.io/f/example','Simulate submission']) assert.ok(messages(file,html(r,'',extra)).length);
    assert.ok(messages(file,html(r).replace(r.channels[0],'#missing')).length);
    assert.ok(messages(file,html(r),'/Portfolio').length);
  });
}
