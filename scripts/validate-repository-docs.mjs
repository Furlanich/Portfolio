import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXCLUDED_DIRECTORIES = new Set(['.git', '.next', 'node_modules', 'out']);
const ALLOWED_STATUSES = new Set(['APPROVED', 'PROPOSED', 'OPEN', 'REJECTED']);

function relativePath(rootDir, filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

export async function collectMarkdownFiles(rootDir) {
  const root = path.resolve(rootDir);
  const files = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(entryPath);
      }
    }
  }

  await visit(root);
  return files.sort((left, right) => relativePath(root, left).localeCompare(relativePath(root, right)));
}

function unquote(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function splitInlineList(value) {
  const content = value.trim().slice(1, -1).trim();
  if (!content) return [];
  return content.split(',').map(unquote).filter(Boolean);
}

function parseFrontMatter(source) {
  const text = source.replace(/^\uFEFF/, '');
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) {
    return { values: {}, body: source, present: false, malformed: false };
  }

  const lines = text.split(/\r?\n/);
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingIndex < 0) {
    return { values: {}, body: '', present: true, malformed: true };
  }

  const values = {};
  let currentListKey = null;
  let malformed = false;
  for (const line of lines.slice(1, closingIndex)) {
    if (!line.trim()) continue;
    const listItem = line.match(/^\s+-\s*(.*?)\s*$/);
    if (listItem && currentListKey) {
      values[currentListKey] ??= [];
      if (!Array.isArray(values[currentListKey])) values[currentListKey] = [values[currentListKey]];
      const item = unquote(listItem[1]);
      if (item) values[currentListKey].push(item);
      continue;
    }

    const property = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!property) {
      malformed = true;
      currentListKey = null;
      continue;
    }
    const [, key, rawValue = ''] = property;
    const value = rawValue.trim();
    currentListKey = null;
    if (value.startsWith('[') && value.endsWith(']')) {
      values[key] = splitInlineList(value);
    } else {
      values[key] = unquote(value);
      if (!value) currentListKey = key;
    }
  }

  return {
    values,
    body: lines.slice(closingIndex + 1).join('\n'),
    present: true,
    malformed
  };
}

async function readMarkdownDocument(rootDir, filePath) {
  const source = await readFile(filePath, 'utf8');
  const frontMatter = parseFrontMatter(source);
  return {
    absolutePath: filePath,
    path: relativePath(rootDir, filePath),
    source,
    body: frontMatter.body,
    frontMatter
  };
}

function violation(document, message) {
  return `${document.path}: ${message}`;
}

function validateFrontMatter(documents) {
  const violations = [];
  const seenIds = new Map();

  for (const document of documents) {
    const { values } = document.frontMatter;
    if (document.frontMatter.malformed) {
      violations.push(violation(document, 'malformed front matter'));
    }

    if (Object.hasOwn(values, 'status') && !ALLOWED_STATUSES.has(values.status)) {
      violations.push(violation(document, `invalid status "${values.status || '(empty)'}"`));
    }

    if (Object.hasOwn(values, 'id')) {
      const id = typeof values.id === 'string' ? values.id.trim() : '';
      if (!id) {
        violations.push(violation(document, 'empty document id'));
      } else if (seenIds.has(id)) {
        violations.push(
          violation(document, `duplicate document id "${id}" (also in ${seenIds.get(id)})`)
        );
      } else {
        seenIds.set(id, document.path);
      }
    }
  }

  const ids = new Set(seenIds.keys());
  for (const document of documents) {
    const related = document.frontMatter.values.related;
    if (related === undefined) continue;
    const relatedIds = Array.isArray(related) ? related : [related];
    for (const relatedId of relatedIds.map(String).map((value) => value.trim()).filter(Boolean)) {
      if (!ids.has(relatedId)) {
        violations.push(violation(document, `unresolved related id "${relatedId}"`));
      }
    }
  }

  return violations;
}

function stripMarkdownHeadingText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/!?(\[([^\]]*)\])(?:\([^)]*\))?/g, '$2')
    .replace(/[`*_~]/g, '');
}

export function headingAnchor(text) {
  return stripMarkdownHeadingText(text)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s_-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

function findHeadings(document) {
  const headings = [];
  let fenced = false;
  for (const line of document.body.split(/\r?\n/)) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (match) {
      const text = match[1].trim();
      const anchor = headingAnchor(text);
      if (anchor) headings.push({ text, anchor });
    }
  }
  return headings;
}

function validateHeadings(documents) {
  const violations = [];
  for (const document of documents) {
    const seen = new Set();
    for (const heading of findHeadings(document)) {
      if (seen.has(heading.anchor)) {
        violations.push(violation(document, `duplicate heading "${heading.anchor}"`));
      }
      seen.add(heading.anchor);
    }
  }
  return violations;
}

function isIgnoredLink(target) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target);
}

function maskInlineCode(line) {
  let result = '';
  let delimiter = null;
  let index = 0;
  while (index < line.length) {
    if (line[index] !== '`') {
      result += delimiter ? ' ' : line[index];
      index += 1;
      continue;
    }

    const start = index;
    while (index < line.length && line[index] === '`') index += 1;
    const run = line.slice(start, index);
    if (!delimiter) {
      delimiter = run;
    } else if (run === delimiter) {
      delimiter = null;
    }
    result += ' '.repeat(run.length);
  }
  return result;
}

function findMarkdownLinks(document) {
  const links = [];
  let fenced = false;
  const lines = document.body.split(/\r?\n/);
  for (const line of lines) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const visibleLine = maskInlineCode(line);
    const pattern = /!?\[[^\]]*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+[^)]*)?\)/g;
    let match;
    while ((match = pattern.exec(visibleLine))) {
      if (match[0].startsWith('!')) continue;
      const target = match[1].startsWith('<') ? match[1].slice(1, -1) : match[1];
      links.push(target);
    }
  }
  return links;
}

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolveLinkPath(rootDir, document, rawPath, markdownByPath) {
  const sourcePath = rawPath.startsWith('/')
    ? path.resolve(rootDir, `.${rawPath}`)
    : path.resolve(path.dirname(document.absolutePath), rawPath);
  const candidates = [sourcePath];
  if (!path.extname(sourcePath)) {
    candidates.push(`${sourcePath}.md`, path.join(sourcePath, 'index.md'));
  }
  for (const candidate of candidates) {
    const candidateRelative = relativePath(rootDir, candidate);
    if (markdownByPath.has(candidateRelative)) return markdownByPath.get(candidateRelative);
  }
  return null;
}

function validateLinks(documents, rootDir) {
  const violations = [];
  const markdownByPath = new Map(documents.map((document) => [document.path, document]));
  const anchorsByDocument = new Map(documents.map((document) => [document, new Set(findHeadings(document).map(({ anchor }) => anchor))]));

  for (const document of documents) {
    for (const rawTarget of findMarkdownLinks(document)) {
      if (isIgnoredLink(rawTarget)) continue;
      const target = decode(rawTarget);
      const hashIndex = target.indexOf('#');
      const targetPath = hashIndex < 0 ? target : target.slice(0, hashIndex);
      const queryIndex = targetPath.indexOf('?');
      const rawPath = queryIndex < 0 ? targetPath : targetPath.slice(0, queryIndex);
      const rawAnchor = hashIndex < 0 ? '' : target.slice(hashIndex + 1);
      const targetDocument = rawPath
        ? resolveLinkPath(rootDir, document, rawPath, markdownByPath)
        : document;
      if (!targetDocument) {
        const displayPath = rawPath || document.path;
        violations.push(violation(document, `missing file "${displayPath}"`));
        continue;
      }
      if (hashIndex >= 0) {
        const anchor = headingAnchor(decode(rawAnchor));
        if (!anchor || !anchorsByDocument.get(targetDocument).has(anchor)) {
          violations.push(violation(document, `missing anchor "#${rawAnchor}" in ${targetDocument.path}`));
        }
      }
    }
  }
  return violations;
}

async function findSkillDirectories(rootDir) {
  const skillsRoot = path.join(rootDir, '.agents', 'skills');
  try {
    const entries = await readdir(skillsRoot, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(skillsRoot, entry.name));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function validateSkills(documents, rootDir, skillDirectories) {
  const violations = [];
  const documentsByPath = new Map(documents.map((document) => [document.path, document]));
  for (const directory of skillDirectories) {
    const skillName = path.basename(directory);
    const skillPath = relativePath(rootDir, path.join(directory, 'SKILL.md'));
    const skill = documentsByPath.get(skillPath);
    if (!skill) {
      violations.push(`${skillPath}: missing Skill file`);
      continue;
    }
    const values = skill.frontMatter.values;
    const metadataName = typeof values.name === 'string' ? values.name.trim() : '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillName) || metadataName !== skillName) {
      violations.push(violation(skill, `Skill name must match lowercase-hyphenated directory "${skillName}"`));
    }
    const description = typeof values.description === 'string' ? values.description.trim() : '';
    if (!description || !description.startsWith('Use when')) {
      violations.push(violation(skill, 'Skill description must be non-empty and begin with "Use when"'));
    }
  }
  return violations;
}

export async function validateRepository(rootDir) {
  const resolvedRoot = path.resolve(rootDir);
  const markdownFiles = await collectMarkdownFiles(resolvedRoot);
  const documents = await Promise.all(markdownFiles.map((filePath) => readMarkdownDocument(resolvedRoot, filePath)));
  const skillDirectories = await findSkillDirectories(resolvedRoot);
  return [
    ...validateFrontMatter(documents),
    ...validateHeadings(documents),
    ...validateLinks(documents, resolvedRoot),
    ...validateSkills(documents, resolvedRoot, skillDirectories)
  ].sort();
}

async function main() {
  const rootDir = process.cwd();
  const violations = await validateRepository(rootDir);
  if (violations.length) {
    process.stdout.write(`${violations.join('\n')}\n`);
    process.exitCode = 1;
    return;
  }
  const markdownFiles = await collectMarkdownFiles(rootDir);
  const documents = await Promise.all(markdownFiles.map((filePath) => readMarkdownDocument(rootDir, filePath)));
  const ids = documents.filter((document) => typeof document.frontMatter.values.id === 'string' && document.frontMatter.values.id.trim()).length;
  const skills = (await findSkillDirectories(rootDir)).length;
  process.stdout.write(`Documentation validation passed: ${markdownFiles.length} Markdown files, ${ids} document IDs, ${skills} Skills.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stdout.write(`Documentation validation failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
