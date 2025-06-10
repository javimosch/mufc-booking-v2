# OpenCode Conventions for mufc-booking-v2

## Commands

### CLI (Root Project - /home/jarancibia/ai/mufc-booking-v2)
- Start CLI: `npm start`
- Start CLI (dev mode): `npm run dev`
- Launch Web UI enabled via CLI: `npm run ui` (or `npm start -- --ui`)
- Show CLI help: `npm start -- --help`
- Start Web Interface directly: `npm run web` (this runs `cd interfaces/webui && npm start`)
- Test: `npm test` (Note: Currently echoes "Error: no test specified" - a test framework like Jest or Mocha needs to be set up).

### WebUI (`/home/jarancibia/ai/mufc-booking-v2/interfaces/webui/`)
- Start server: `npm start` (run from `interfaces/webui/`)
- Start server (dev mode): `npm run dev` (run from `interfaces/webui/`)

## Code Style (General JavaScript)
- **Formatting**: Maintain consistency with existing project files. Strive for clarity and readability.
- **Naming**: Use camelCase for variables and functions (e.g., `fetchData`), and PascalCase for classes (e.g., `DataManager`). Use descriptive, self-documenting names.
- **Imports**: Use CommonJS `require()` syntax.
- **Modularity**: Keep files under 500 lines. Aim for one class per file where appropriate.
- **Error Handling**: Implement `try-catch` blocks for synchronous operations and `.catch()` for Promises. Provide clear error messages.

## Linting & Specific Tests
- No dedicated lint command (e.g., ESLint, Prettier) is specified in `package.json`.
- No specific test runner or command for running single tests is defined. To run individual tests, a testing framework would need to be integrated first.

## Project Structure Overview
- CLI: `src/cli.js` (main), `src/cli/` (modules).
- WebUI: `interfaces/webui/` (Express server in `src/server.js`, public assets in `public/`).
- Utilities: `utils/` (config management, file operations).
- Config file: `.cliui-config.json` in the project root.
- Docs: `docs/architecture.md`, `spec.md`.
