const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Let Metro see changes in packages/ (not just apps/mobile), so editing
// @tot/shared-types or @tot/shared-utils triggers a live reload here too —
// same "rebuild-then-restart" gotcha you already know from @tot/ui, except
// Metro can actually watch source directly, no rebuild step required.
config.watchFolders = [monorepoRoot];

// Tell Metro to also resolve modules from the workspace root's node_modules,
// not just apps/mobile's own — this is what lets it find @tot/shared-types
// and @tot/shared-utils through pnpm's workspace symlinks.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Required for pnpm specifically: Metro must be told to actually follow
// symlinks rather than treating them as opaque files, since that's how
// pnpm links workspace packages together.
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
