import { window, workspace, WorkspaceFolder } from "vscode";

// https://github.com/microsoft/vscode-java-dependency/blob/4eba6f6516ca144280f0b91d6ada3023cf96f15c/src/utility.ts#L11
export function getDefaultWorkspaceFolder(): WorkspaceFolder | undefined {
  if (workspace.workspaceFolders === undefined) {
    return undefined;
  }
  if (workspace.workspaceFolders.length === 1) {
    return workspace.workspaceFolders[0];
  }
  if (window.activeTextEditor) {
    const activeWorkspaceFolder: WorkspaceFolder | undefined =
      workspace.getWorkspaceFolder(window.activeTextEditor.document.uri);
    return activeWorkspaceFolder;
  }
  return undefined;
}
