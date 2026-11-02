const [major, minor] = process.versions.node.split(".").map(Number);
const supported =
  (major === 22 && minor >= 18) ||
  (major === 24 && minor >= 11) ||
  major >= 26;

if (!supported) {
  console.error(
    `Prisma SQLite requires Node.js 22.18+, 24.11+, or 26+. Current version: ${process.version}. Upgrade Node.js, restart the terminal and dev server, then try again.`,
  );
  process.exitCode = 1;
}
