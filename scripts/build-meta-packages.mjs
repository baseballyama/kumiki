#!/usr/bin/env node
// Auto-generate the umbrella packages `@kumiki/components` and
// `@kumiki/recipes`. Each is a thin TS-only re-export of every
// Layer 4 / Layer 5 sibling package, so consumers can do
//
//     pnpm add @kumiki/components
//     import { Root, Trigger } from '@kumiki/components/dialog';
//
// instead of installing each component package separately. Tree-shake
// stays intact because every sub-package is `sideEffects: false` and
// the umbrella only re-exports.
//
// Note on `svelte`: the umbrella package does not declare a `svelte`
// export field. The underlying `@kumiki/component-*` packages do —
// SvelteKit resolves through the umbrella to the real package and
// picks up the Svelte source there. Less ceremony, no svelte-package
// build step needed in the umbrella.
//
// Run via `pnpm gen:meta`. CI runs the same command and fails the build
// if it produces a diff (drift detection — keeps the umbrellas honest).

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/** @typedef {{ slug: string, packageName: string, description: string }} Entry */

/** @returns {Entry[]} */
function collectComponents() {
  const dir = path.join(ROOT, 'packages/components');
  const slugs = fs
    .readdirSync(dir)
    .filter((s) => fs.statSync(path.join(dir, s)).isDirectory())
    .filter((s) => fs.existsSync(path.join(dir, s, 'component/package.json')));
  return slugs.sort().map((slug) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, slug, 'component/package.json'), 'utf8'));
    return { slug, packageName: pkg.name, description: pkg.description ?? '' };
  });
}

/** @returns {Entry[]} */
function collectRecipes() {
  const dir = path.join(ROOT, 'packages/recipes');
  if (!fs.existsSync(dir)) return [];
  const slugs = fs
    .readdirSync(dir)
    .filter((s) => fs.statSync(path.join(dir, s)).isDirectory())
    .filter((s) => fs.existsSync(path.join(dir, s, 'package.json')));
  return slugs.sort().map((slug) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, slug, 'package.json'), 'utf8'));
    // Strip the @kumiki/recipes- prefix so the subpath is just the slug.
    return { slug, packageName: pkg.name, description: pkg.description ?? '' };
  });
}

/** @param {{ name: string, description: string, slugDir: string, status: 'preview' | 'unreleased', entries: Entry[] }} options */
function generateMetaPackage({ name, description, slugDir, status, entries }) {
  const dir = path.join(ROOT, 'packages/meta', slugDir);
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });

  /** @type Record<string, unknown> */
  const exportsMap = {
    '.': {
      types: './dist/index.d.mts',
      import: './dist/index.mjs',
    },
  };
  for (const e of entries) {
    exportsMap[`./${e.slug}`] = {
      types: `./dist/${e.slug}.d.mts`,
      import: `./dist/${e.slug}.mjs`,
    };
  }
  exportsMap['./package.json'] = './package.json';

  /** @type Record<string, string> */
  const dependencies = {};
  for (const e of entries) dependencies[e.packageName] = 'workspace:*';

  const pkg = {
    name,
    version: '0.0.0',
    description,
    license: 'MIT',
    author: 'Yuichiro Yamashita',
    homepage: `https://github.com/baseballyama/kumiki/tree/main/packages/meta/${slugDir}`,
    repository: {
      type: 'git',
      url: 'git+https://github.com/baseballyama/kumiki.git',
      directory: `packages/meta/${slugDir}`,
    },
    bugs: 'https://github.com/baseballyama/kumiki/issues',
    type: 'module',
    sideEffects: false,
    files: ['dist', '!dist/**/*.test.*', 'README.md'],
    exports: exportsMap,
    main: './dist/index.mjs',
    module: './dist/index.mjs',
    types: './dist/index.d.mts',
    peerDependencies: { svelte: 'catalog:' },
    dependencies,
    scripts: {
      build: 'tsdown && publint',
      dev: 'tsdown --watch',
      typecheck: 'tsc --noEmit',
      clean: 'rm -rf dist',
    },
    devDependencies: {
      tsdown: 'catalog:',
      typescript: 'catalog:',
      svelte: 'catalog:',
      publint: 'catalog:',
    },
    publishConfig: {
      access: 'public',
      provenance: true,
      tag: status === 'unreleased' ? 'preview' : 'latest',
    },
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

  // tsconfig.json
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify(
      {
        extends: '../../../tsconfig.json',
        compilerOptions: {
          outDir: './dist',
          rootDir: './src',
          noEmit: false,
        },
        include: ['src/**/*.ts'],
        exclude: ['dist'],
      },
      null,
      2,
    ) + '\n',
  );

  // tsdown.config.ts
  const tsdownEntries = ['src/index.ts', ...entries.map((e) => `src/${e.slug}.ts`)];
  fs.writeFileSync(
    path.join(dir, 'tsdown.config.ts'),
    `import { defineConfig } from 'tsdown';\n\nexport default defineConfig({\n  entry: ${JSON.stringify(tsdownEntries)},\n  format: ['esm'],\n  dts: true,\n  treeshake: true,\n  clean: true,\n  deps: { neverBundle: [/^@kumiki\\//, 'svelte'] },\n});\n`,
  );

  // README.md
  const importLines = entries
    .slice(0, 3)
    .map((e) => `import * as ${pascalCase(e.slug)} from '${name}/${e.slug}';`)
    .join('\n');
  const readme = `# ${name}

${description}

This is an **auto-generated umbrella package**. Do not edit by hand —
\`scripts/build-meta-packages.mjs\` regenerates it from the workspace.
CI fails the build on drift.

## Why

\`${name}\` lets consumers install the entire ${slugDir} surface in one step:

\`\`\`bash
pnpm add ${name}
\`\`\`

vs. installing every individual sibling package one at a time.

## Subpath imports

Each item is exposed under its own subpath. Tree-shake stays intact
because every sub-package is \`sideEffects: false\` — importing one
subpath does not pull the others.

\`\`\`ts
${importLines}
\`\`\`

## Subpaths

${entries.map((e) => `- \`${name}/${e.slug}\` → \`${e.packageName}\``).join('\n')}

## Status

${status === 'unreleased' ? '⚠️ Layer 5 preview — published as `0.x.x-preview` during the v1.0 series. APIs may change.' : 'Stable preview.'}
`;
  fs.writeFileSync(path.join(dir, 'README.md'), readme);

  // src/index.ts — re-export every subpath as a namespace
  const indexLines = [
    '// AUTO-GENERATED by scripts/build-meta-packages.mjs. Do not edit.',
    '',
    ...entries.map((e) => `export * as ${pascalCase(e.slug)} from '${e.packageName}';`),
    '',
  ];
  fs.writeFileSync(path.join(dir, 'src/index.ts'), indexLines.join('\n'));

  // One file per subpath — re-exports the underlying package's barrel.
  for (const e of entries) {
    const lines = [
      '// AUTO-GENERATED by scripts/build-meta-packages.mjs. Do not edit.',
      '',
      `export * from '${e.packageName}';`,
      '',
    ];
    fs.writeFileSync(path.join(dir, 'src', `${e.slug}.ts`), lines.join('\n'));
  }
}

function pascalCase(slug) {
  return slug
    .split(/[-_]/)
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ''))
    .join('');
}

const components = collectComponents();
const recipes = collectRecipes();

generateMetaPackage({
  name: '@kumiki/components',
  description:
    'Umbrella package — every Layer 4 (`@kumiki/component-*`) under one install. Auto-generated.',
  slugDir: 'components',
  status: 'preview',
  entries: components,
});

generateMetaPackage({
  name: '@kumiki/recipes',
  description:
    'Umbrella package — every Layer 5 (`@kumiki/recipes-*`) under one install. Auto-generated; published 0.x.x-preview during the v1.0 series.',
  slugDir: 'recipes',
  status: 'unreleased',
  entries: recipes,
});

console.log(
  `✓ generated @kumiki/components (${components.length} subpaths) + @kumiki/recipes (${recipes.length} subpaths)`,
);
