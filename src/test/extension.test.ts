import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../extension';

suite('Extension Test Suite', () => {
  test('creates a package directory and __init__.py in the selected folder', async () => {
    const createdDirectories: string[] = [];
    const writtenFiles: string[] = [];
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(vscode.Uri.file('/workspace/src'), {
      showErrorMessage: async (message: string) => {
        errorMessages.push(message);
        return message;
      },
      showInformationMessage: async (message: string) => {
        infoMessages.push(message);
        return message;
      },
      showInputBox: async () => 'mypackage',
      workspaceFolders: undefined,
      createDirectory: async (uri: vscode.Uri) => {
        createdDirectories.push(uri.fsPath);
      },
      writeFile: async (uri: vscode.Uri) => {
        writtenFiles.push(uri.fsPath);
      }
    });

    assert.deepStrictEqual(createdDirectories, ['/workspace/src/mypackage']);
    assert.deepStrictEqual(writtenFiles, ['/workspace/src/mypackage/__init__.py']);
    assert.deepStrictEqual(infoMessages, ['Created Python package: mypackage']);
    assert.deepStrictEqual(errorMessages, []);
  });

  test('does nothing when the input is cancelled', async () => {
    let createDirectoryCalled = false;
    let writeFileCalled = false;
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(vscode.Uri.file('/workspace/src'), {
      showErrorMessage: async (message: string) => {
        errorMessages.push(message);
        return message;
      },
      showInformationMessage: async (message: string) => {
        infoMessages.push(message);
        return message;
      },
      showInputBox: async () => undefined,
      workspaceFolders: undefined,
      createDirectory: async () => {
        createDirectoryCalled = true;
      },
      writeFile: async () => {
        writeFileCalled = true;
      }
    });

    assert.strictEqual(createDirectoryCalled, false);
    assert.strictEqual(writeFileCalled, false);
    assert.deepStrictEqual(infoMessages, []);
    assert.deepStrictEqual(errorMessages, []);
  });

  test('shows an error when no target folder can be resolved', async () => {
    let createDirectoryCalled = false;
    let writeFileCalled = false;
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(undefined, {
      showErrorMessage: async (message: string) => {
        errorMessages.push(message);
        return message;
      },
      showInformationMessage: async (message: string) => {
        infoMessages.push(message);
        return message;
      },
      showInputBox: async () => 'mypackage',
      workspaceFolders: undefined,
      createDirectory: async () => {
        createDirectoryCalled = true;
      },
      writeFile: async () => {
        writeFileCalled = true;
      }
    });

    assert.strictEqual(createDirectoryCalled, false);
    assert.strictEqual(writeFileCalled, false);
    assert.deepStrictEqual(infoMessages, []);
    assert.deepStrictEqual(errorMessages, ['No target folder selected.']);
  });
});
