import * as path from 'path';
import * as vscode from 'vscode';

type CreatePackageDependencies = {
  showErrorMessage: typeof vscode.window.showErrorMessage;
  showInformationMessage: typeof vscode.window.showInformationMessage;
  showInputBox: typeof vscode.window.showInputBox;
  workspaceFolders: typeof vscode.workspace.workspaceFolders;
  createDirectory: typeof vscode.workspace.fs.createDirectory;
  writeFile: typeof vscode.workspace.fs.writeFile;
};

const DEFAULT_DEPENDENCIES: CreatePackageDependencies = {
  showErrorMessage: vscode.window.showErrorMessage,
  showInformationMessage: vscode.window.showInformationMessage,
  showInputBox: vscode.window.showInputBox,
  workspaceFolders: vscode.workspace.workspaceFolders,
  createDirectory: vscode.workspace.fs.createDirectory,
  writeFile: vscode.workspace.fs.writeFile,
};

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'createPythonPackage.createPackage',
    async (resource: vscode.Uri) => {
      await createPythonPackage(resource);
    }
  );

  context.subscriptions.push(disposable);
}

export async function createPythonPackage(
  resource: vscode.Uri | undefined,
  dependencies: CreatePackageDependencies = DEFAULT_DEPENDENCIES
): Promise<void> {
  const packageName = await dependencies.showInputBox({
    prompt: 'Python package name',
    placeHolder: 'mypackage'
  });

  if (!packageName) {
    return;
  }

  const baseDir = resource?.fsPath ?? dependencies.workspaceFolders?.[0]?.uri.fsPath;
  if (!baseDir) {
    dependencies.showErrorMessage('No target folder selected.');
    return;
  }

  const packageDir = path.join(baseDir, packageName);
  const initFile = path.join(packageDir, '__init__.py');

  await dependencies.createDirectory(vscode.Uri.file(packageDir));
  await dependencies.writeFile(vscode.Uri.file(initFile), new Uint8Array());
}

export function deactivate() {}
