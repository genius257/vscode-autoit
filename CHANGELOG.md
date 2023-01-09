# Change Log

All notable changes to the "autoit" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fixed issue with RedimExpression throwing an not implemented error
- Fixed issue where some parts of the au3 AST were not accessable, when iterating the tree.
- Fixed au3 hover support within functions (issue #7)
- Fixed issue caused by the au3 `Default` keyword
- Fixed issue where resolving uri from installDir setting did not work
- Fixed issues with au3 document links not using the script resolved IncludeStatements

## [1.1.0] - 2023-01-04

### Added

- Partial AutoIt3 IntelliSense

## [1.0.0] - 2021-10-24

### Added

- AutoIt3 syntax highlighting
- AutoIt2 syntax highlighting
