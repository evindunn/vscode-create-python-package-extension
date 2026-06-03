import * as assert from 'assert';
import * as vscode from 'vscode';
import * as extension from '../extension';

function createExecuteCommandStub(
  callback: (command: string, uri?: vscode.Uri) => void
): typeof vscode.commands.executeCommand {
  return <T = unknown>(command: string, ...rest: any[]): Thenable<T> => {
    callback(command, rest[0] as vscode.Uri | undefined);
    return Promise.resolve(undefined as T);
  };
}

suite('Extension Test Suite', () => {
  test('creates a package directory and __init__.py in the selected folder', async () => {
    const createdDirectories: string[] = [];
    const executedCommands: Array<{ command: string; uri: string }> = [];
    const writtenFiles: string[] = [];
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(vscode.Uri.file('/workspace/src'), {
      executeCommand: createExecuteCommandStub((command: string, uri?: vscode.Uri) => {
        executedCommands.push({
          command,
          uri: uri?.fsPath ?? ''
        });
      }),
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
    assert.deepStrictEqual(executedCommands, [{
      command: 'revealInExplorer',
      uri: '/workspace/src/mypackage/__init__.py'
    }]);
    assert.deepStrictEqual(infoMessages, ['Created Python package: mypackage']);
    assert.deepStrictEqual(errorMessages, []);
  });

  test('does nothing when the input is cancelled', async () => {
    let createDirectoryCalled = false;
    let executeCommandCalled = false;
    let writeFileCalled = false;
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(vscode.Uri.file('/workspace/src'), {
      executeCommand: createExecuteCommandStub(() => {
        executeCommandCalled = true;
      }),
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
    assert.strictEqual(executeCommandCalled, false);
    assert.strictEqual(writeFileCalled, false);
    assert.deepStrictEqual(infoMessages, []);
    assert.deepStrictEqual(errorMessages, []);
  });

  test('shows an error when no target folder can be resolved', async () => {
    let createDirectoryCalled = false;
    let executeCommandCalled = false;
    let writeFileCalled = false;
    const infoMessages: string[] = [];
    const errorMessages: string[] = [];

    await extension.createPythonPackage(undefined, {
      executeCommand: createExecuteCommandStub(() => {
        executeCommandCalled = true;
      }),
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
    assert.strictEqual(executeCommandCalled, false);
    assert.strictEqual(writeFileCalled, false);
    assert.deepStrictEqual(infoMessages, []);
    assert.deepStrictEqual(errorMessages, ['No target folder selected.']);
  });
});
