import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MAX_HEADER_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 3;

const COMMIT_TYPES = {
  feat: 'Funcionalidad nueva',
  fix: 'Corrección de un bug',
  docs: 'Documentación',
  refactor: 'Mejora sin cambiar lo que hace',
  test: 'Tests nuevos, actualizados o corregidos',
  chore: 'Cambios que no afectan la funcionalidad',
  ci: 'Pipeline o despliegue',
  build: 'Dependencias, empaquetado o build',
  perf: 'Rendimiento',
  style: 'Formato del código',
  revert: 'Revertir un commit anterior',
};

const TYPE_ALIASES = {
  feature: 'feat',
  features: 'feat',
  bugfix: 'fix',
  hotfix: 'fix',
  arreglo: 'fix',
  doc: 'docs',
  tests: 'test',
  testing: 'test',
};

const BRANCH_PREFIXES = new Set(['feature', 'features', 'bugfix', 'hotfix']);
const VALID_SCOPE = /^[a-z0-9][a-z0-9._/-]*$/;
const GIT_GENERATED_MESSAGE = /^(Merge |Revert "|fixup! |squash! |amend! )/;
const EXAMPLES = [
  'feat(movimientos): registrar gasto con categoría',
  'fix(kpis): corregir el ahorro neto cuando no hay ingresos',
];

function parseHeader(header) {
  const shape =
    /^(?<type>[^(:!\s]*)(?<scope>\((?<scopeName>[^)]*)\)?)?(?<breaking>!?)(?<separator>:?\s*)(?<description>.*)$/;
  const {
    type,
    scope = '',
    scopeName = '',
    breaking,
    separator,
    description,
  } = header.match(shape).groups;

  const scopeStart = type.length;
  const breakingStart = scopeStart + scope.length;
  const separatorStart = breakingStart + breaking.length;
  const descriptionStart = separatorStart + separator.length;

  return {
    header,
    type: { text: type, start: 0 },
    scope: {
      text: scopeName,
      start: scopeStart,
      length: scope.length,
      isPresent: scope.length > 0,
      isClosed: scope.endsWith(')'),
    },
    breaking: breaking,
    separator: { text: separator, start: separatorStart },
    description: { text: description, start: descriptionStart },
  };
}

const isCommitType = (word) => Object.hasOwn(COMMIT_TYPES, word);

function resolveIntendedType(typedType) {
  const lowercased = typedType.toLowerCase();
  if (isCommitType(lowercased)) return lowercased;
  return Object.hasOwn(TYPE_ALIASES, lowercased) ? TYPE_ALIASES[lowercased] : null;
}

const toValidScope = (scope) =>
  scope
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-');
const startsWithUppercase = (text) => /^\p{Lu}/u.test(text);
const toLowercaseStart = (text) => text.charAt(0).toLowerCase() + text.slice(1);
const withoutTrailingPeriod = (text) => text.replace(/\.+$/, '');

const HEADER_RULES = [
  {
    isBroken: ({ type }) => resolveIntendedType(type.text) === null,
    message: ({ type }) =>
      type.text
        ? `No dice el tipo ni dónde: "${type.text}" no es un tipo válido.`
        : 'Debe empezar con un tipo (feat, fix, docs…).',
    highlight: ({ type }) => ({ start: 0, length: type.text.length || 1 }),
    stopsValidation: true,
  },
  {
    isBroken: ({ type }) => !isCommitType(type.text),
    message: ({ type }) => {
      const intendedType = resolveIntendedType(type.text);
      const typedLowercase = type.text.toLowerCase();
      if (BRANCH_PREFIXES.has(typedLowercase)) {
        return `"${type.text}" nombra la rama; en el commit se usa "${intendedType}".`;
      }
      if (typedLowercase === intendedType) return `El tipo va en minúscula: "${intendedType}".`;
      return `"${type.text}" no es un tipo válido; usa "${intendedType}".`;
    },
    highlight: ({ type }) => ({ start: 0, length: type.text.length }),
  },
  {
    isBroken: ({ scope }) => !scope.isPresent,
    message: ({ type }) =>
      `Falta el módulo entre paréntesis: ${resolveIntendedType(type.text)}(módulo).`,
    highlight: ({ scope }) => ({ start: scope.start, length: 1 }),
  },
  {
    isBroken: ({ scope }) => scope.isPresent && !scope.isClosed,
    message: () => 'Falta cerrar el paréntesis del módulo.',
    highlight: ({ scope }) => ({ start: scope.start, length: scope.length }),
    stopsValidation: true,
  },
  {
    isBroken: ({ scope }) => scope.isPresent && scope.text === '',
    message: () => 'El módulo entre paréntesis está vacío.',
    highlight: ({ scope }) => ({ start: scope.start, length: 2 }),
  },
  {
    isBroken: ({ scope }) => scope.text !== '' && !VALID_SCOPE.test(scope.text),
    message: ({ scope }) =>
      `El módulo va en minúscula y sin espacios: "${toValidScope(scope.text)}".`,
    highlight: ({ scope }) => ({ start: scope.start + 1, length: scope.text.length }),
  },
  {
    isBroken: ({ scope, separator }) => scope.isPresent && separator.text !== ': ',
    message: ({ separator }) =>
      separator.text.startsWith(':')
        ? 'Después de los dos puntos va un solo espacio.'
        : 'Falta ": " antes de la descripción.',
    highlight: ({ separator }) => ({ start: separator.start, length: 1 }),
  },
  {
    isBroken: ({ description }) => description.text.trim().length < MIN_DESCRIPTION_LENGTH,
    message: () => 'La descripción es muy corta; explica qué cambia.',
    highlight: ({ description }) => ({ start: description.start, length: 1 }),
  },
  {
    isBroken: ({ description }) => startsWithUppercase(description.text),
    message: () => 'La descripción empieza en minúscula.',
    highlight: ({ description }) => ({ start: description.start, length: 1 }),
  },
  {
    isBroken: ({ description }) => description.text.endsWith('.'),
    message: () => 'La descripción no lleva punto final.',
    highlight: ({ description }) => ({
      start: description.start + description.text.length - 1,
      length: 1,
    }),
  },
  {
    isBroken: ({ header }) => header.length > MAX_HEADER_LENGTH,
    message: ({ header }) =>
      `La primera línea tiene ${header.length} caracteres (máximo ${MAX_HEADER_LENGTH}).`,
    highlight: ({ header }) => ({
      start: MAX_HEADER_LENGTH,
      length: header.length - MAX_HEADER_LENGTH,
    }),
  },
];

function suggestHeader(parsed) {
  const intendedType = resolveIntendedType(parsed.type.text);
  const scopeIsUnreadable = parsed.scope.isPresent && !parsed.scope.isClosed;
  if (!intendedType || scopeIsUnreadable) return null;

  const scope = parsed.scope.text ? toValidScope(parsed.scope.text) : 'módulo';
  const cleanDescription = withoutTrailingPeriod(parsed.description.text.trim());
  const description =
    cleanDescription.length >= MIN_DESCRIPTION_LENGTH
      ? toLowercaseStart(cleanDescription)
      : 'descripción';

  return `${intendedType}(${scope})${parsed.breaking}: ${description}`;
}

export function validateHeader(header) {
  if (header === '') return { problems: [{ message: 'El mensaje está vacío.' }], suggestion: null };

  const parsed = parseHeader(header);
  const problems = [];

  for (const rule of HEADER_RULES) {
    if (!rule.isBroken(parsed)) continue;
    problems.push({ message: rule.message(parsed), highlight: rule.highlight(parsed) });
    if (rule.stopsValidation) break;
  }

  return { problems, suggestion: problems.length ? suggestHeader(parsed) : null };
}

const useColors = process.stderr.isTTY && !process.env.NO_COLOR;
const paint = (ansiCode) => (text) => (useColors ? `\x1b[${ansiCode}m${text}\x1b[0m` : text);
const style = {
  red: paint(31),
  green: paint(32),
  yellow: paint(33),
  cyan: paint(36),
  bold: paint(1),
  dim: paint(2),
};

function underlineProblems(problems) {
  const highlights = problems.map((problem) => problem.highlight).filter(Boolean);
  const width = Math.max(0, ...highlights.map(({ start, length }) => start + length));
  const marks = Array(width).fill(' ');
  for (const { start, length } of highlights) marks.fill('^', start, start + length);
  return marks.join('').trimEnd();
}

function typesTable() {
  return Object.entries(COMMIT_TYPES).map(
    ([type, description]) => `    ${style.cyan(type.padEnd(9))}${style.dim(description)}`,
  );
}

function rejectionReport(header, { problems, suggestion }) {
  const parsed = parseHeader(header);
  const typeIsWrong = !isCommitType(parsed.type.text);
  const problemCount = `${problems.length} ${problems.length === 1 ? 'problema' : 'problemas'}`;

  return [
    '',
    `  ${style.red(style.bold('✖ Commit rechazado'))} ${style.dim(`· ${problemCount}`)}`,
    '',
    `    ${style.bold(header)}`,
    `    ${style.red(underlineProblems(problems))}`,
    '',
    ...problems.map(({ message }) => `  ${style.yellow('•')} ${message}`),
    ...(suggestion ? ['', `  ${style.dim('Prueba con:')}`, `    ${style.green(suggestion)}`] : []),
    '',
    `  ${style.dim('─'.repeat(62))}`,
    `  ${style.bold('Formato')}  ${style.cyan('tipo')}(${style.cyan('módulo')}): descripción en minúscula, sin punto final`,
    '',
    ...(typeIsWrong ? [...typesTable(), ''] : []),
    ...EXAMPLES.map((example) => `  ${style.dim('Ej.')} ${example}`),
    '',
    `  ${style.dim('Tu mensaje no se perdió. Para editarlo:')} git commit -e -F .git/COMMIT_EDITMSG`,
    '',
  ].join('\n');
}

function readHeader(messageFile) {
  const meaningfulLines = readFileSync(messageFile, 'utf8')
    .split('\n')
    .filter((line) => !line.startsWith('#') && line.trim() !== '');
  return meaningfulLines[0]?.trimEnd() ?? '';
}

function main([messageFile]) {
  const header = readHeader(messageFile);
  if (GIT_GENERATED_MESSAGE.test(header)) return 0;

  const result = validateHeader(header);
  if (result.problems.length === 0) {
    const { type, scope } = parseHeader(header);
    console.error(
      `${style.green('✔')} ${style.dim('commit válido ·')} ${style.cyan(type.text)}(${scope.text})`,
    );
    return 0;
  }

  console.error(rejectionReport(header, result));
  return 1;
}

const isRunDirectly = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isRunDirectly) process.exitCode = main(process.argv.slice(2));
