// Aggregator for the workspace size-limit run.
// Each package owns its own `size-limit` block in its package.json; this file
// pulls them together for the root `pnpm size` invocation when needed.

const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const pkgRoot = join(__dirname, '..', 'packages');
const limits = [];

for (const dir of readdirSync(pkgRoot)) {
  const pkgPath = join(pkgRoot, dir, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!Array.isArray(pkg['size-limit'])) continue;
  for (const entry of pkg['size-limit']) {
    limits.push({
      ...entry,
      name: `${pkg.name}: ${entry.name ?? 'default'}`,
      path: join('packages', dir, entry.path),
    });
  }
}

module.exports = limits;
