# Create Python Package

A small Visual Studio Code extension that adds a `Create Python Package` action to the Explorer context menu.

## Requirements

No additional setup is required beyond Visual Studio Code.

## Usage

1. In the Explorer, right-click the folder where you want the package to be created.
2. Select `Create Python Package`.
3. Enter the package name.

## Extension Settings

This extension does not currently contribute any settings.

## Development

### Run the extension locally

1. Open this project in Visual Studio Code.
2. Run `npm install`.
3. Press `F5` to launch an Extension Development Host window.
4. In the new window, open a workspace folder and test the Explorer context menu command.

### Build

```sh
npm run compile
```

### Watch mode

```sh
npm run watch
```

### Lint

```sh
npm run lint
```

### Test

```sh
npm test
```

The test suite covers:
- creating the package directory and `__init__.py`
- cancelling the input prompt
- handling the case where no target folder is available

## Workflows

- [npm-audit-fix.yml](.github/workflows/npm-audit-fix.yml): Runs weekly on Sunday, applies `npm audit fix`, and commits the dependency changes when any are produced.

## Packaging

To package the extension as a `.vsix`, install `vsce` and run:

```sh
npx vsce package
```

You can then install the generated package with:

```sh
code --install-extension create-python-package-0.0.1.vsix
```

## Known Issues

The extension currently creates a single package directory and a single `__init__.py` file. It does not:
- validate Python package names
- create nested packages from dotted names
- add starter content to `__init__.py`

## Release Notes

### 0.0.1

Initial release with an Explorer context menu command for creating a Python package.
