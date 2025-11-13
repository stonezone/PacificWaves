# Changelog

All notable changes to PacificWaves will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-13

### Added
- **Error Boundary System** (Fix #9)
  - Comprehensive error handling with automatic recovery
  - Global error and promise rejection handlers
  - Error logging and statistics
  - Prevents application crashes from propagating to users

- **Input Validation System** (Fix #12)
  - Schema-based validation for all user inputs
  - Type checking and range validation
  - XSS protection through HTML sanitization
  - Detailed validation error messages

- **Browser Feature Detection** (Fix #24)
  - Automatic detection of required browser features
  - Graceful degradation for unsupported browsers
  - Browser version checking with upgrade prompts
  - Minimum version requirements documented

- **Content Security Policy** (Fix #16)
  - Comprehensive CSP headers to mitigate XSS
  - Clickjacking prevention
  - Resource loading restrictions

- **Modular Architecture** (Fix #1 partial)
  - Extracted CONSTS to `src/core/constants.js`
  - Extracted PRNG to `src/core/prng.js`
  - Extracted Utils to `src/utilities/coordinate-utils.js`
  - Created StateManager in `src/core/state-manager.js`

- **State Management** (Fix #3 partial)
  - StateManager class with change notifications
  - Undo/redo capability (Fix #20 partial)
  - Controlled state access patterns

- **Comprehensive Documentation**
  - JSDoc comments for all public APIs
  - Type definitions for better IDE support
  - Usage examples in documentation

### Fixed
- Sprite loading race condition already resolved (Fix #6)
- Coordinate system confusion addressed through clear documentation (Fix #5 partial)

### Security
- XSS sanitization integrated into validation (Fix #17)
- Content Security Policy headers added (Fix #16)
- Input validation prevents malicious data entry (Fix #12)

### Changed
- Migrated to modular ES6 architecture
- Improved code organization and maintainability
- Enhanced error handling throughout application

### Documentation
- Added CHANGELOG.md
- Added package.json with semantic versioning
- Updated README with module structure

### Known Issues
- Memory leaks in event handlers need cleanup (Fix #10 - documented)
- Buffer swap logic needs verification (Fix #7 - documented)

## [0.9.0] - 2025-01-11

### Added
- Initial commit with monolithic architecture
- Core wave propagation simulation
- Storm placement and editing
- Shoaling and refraction effects
- Multiple bathymetry presets
- Measurement sites for O'ahu
- Retro 8-bit aesthetic
- Educational scenarios

### Features
- Interactive storm placement
- Real-time wave propagation simulation
- Geographic coordinate system
- Canvas-based rendering
- Keyboard shortcuts
- Help modal with instructions

---

## Version Numbering Scheme

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

Current version: **1.0.0**
