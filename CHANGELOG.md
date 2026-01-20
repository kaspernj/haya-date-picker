Changelog

- Removed @kaspernj/api-maker peer dependency after migrating to ya-use-event-emitter.
- Added README with install and usage instructions.
- Added `release:patch` script for version bump, push, and npm publish.
- Forwarded stdio for npm login/publish to prevent hanging prompts.
- Added system testing setup with a web example app and browser specs.
- Fixed optional date picker props handling to avoid runtime errors.
- Skipped library type checks to avoid node_modules errors in CI.
- Added configurable system test host/port for CI environments.
- Added date range support hooks and style overrides for the date picker.
