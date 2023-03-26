# Changelog

All notable changes to "vscode-autoit", display name "AutoIt", will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.5] - 2023-03-27

### Fixed

- Fixed issue with function declaration lookup when using include statement(s) in script. (issue #35)

## [1.2.4] - 2023-03-24

### Fixed

- Fixed issue with declaration lookup not working as expected. (issue #24)

## [1.2.3] - 2023-03-01

### Fixed

- Fixed issue with standard library first includes not working when user-defined libraries are used in extension settings. (issue #27)

## [1.2.2] - 2023-02-24

### Fixed

- Fixed issue with suggestion from includes would stop working seemlingly randomly (issue #22)
- Fixed issue where include statements would fail on new files not existing on disk with: Request textDocument/documentLink failed. (issue #8)

## [1.2.1] - 2023-02-11

### Changed

- Updated autoit3-pegjs to 1.1.0

### Fixed

- Fixed issue with resolving IncludeStatement document links for Standard library files (issue #19)
- Fixed include statement document link position broken if immidialy followed by a single line comment (issue #16)
- Fixed issue where all builtin suggestions types were marked as functions
- Fixed issue with keywords not included in completion suggestions (issue #20)
- Fixed issue function and variables suggestions from included files not shown (issue #18)

## [1.2.0] - 2023-01-20

### Added

- Added hover support for the Exit keyword (issue #10)
- Added icon for AutoIt2 files

### Fixed

- Fixed issue with wrong hover information sometimes shown due to bad position check.
- Fixed issue with hover not working in ElseIf/Else-Statement
- Fixed missing hover information support for built-in function Opt (issue #13)
- Fixed incomplete text on some macro descriptions (issue #12)
- Fixed AST to string showing array access as property access instead (issue #14)
- Fixed issue with IncludeStatement document links using backslash fails to resolve on web and linux (issue #15)

## [1.1.1] - 2023-01-09

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

[Unreleased]: https://github.com/genius257/vscode-autoit/compare/1.2.4...HEAD
[1.2.4]: https://github.com/genius257/vscode-autoit/compare/1.2.3...1.2.4
[1.2.3]: https://github.com/genius257/vscode-autoit/compare/1.2.2...1.2.3
[1.2.2]: https://github.com/genius257/vscode-autoit/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/genius257/vscode-autoit/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/genius257/vscode-autoit/compare/1.1.1...1.2.0
[1.1.1]: https://github.com/genius257/vscode-autoit/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/genius257/vscode-autoit/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/genius257/vscode-autoit/releases/tag/1.0.0
