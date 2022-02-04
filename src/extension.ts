// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { pathExists } from "fs-extra";
import { isEmpty } from "lodash";
import path = require("path");
import * as vscode from "vscode";
import { generateProject } from "./generator/generate";
import { Commands } from "./util/commands";
import { getDefaultWorkspaceFolder } from "./util/vscode-utils";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "sst-generator-vscode" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "sst-generator-vscode.generate",
    async () => {
      // takes inspiration from Microsoft's Java Project Manager
      // https://github.com/microsoft/vscode-java-dependency/blob/4eba6f6516ca144280f0b91d6ada3023cf96f15c/src/controllers/projectController.ts#L134

      // get project location
      const workspaceFolder = getDefaultWorkspaceFolder();
      const location = await vscode.window.showOpenDialog({
        defaultUri: workspaceFolder && workspaceFolder.uri,
        canSelectFiles: false,
        canSelectFolders: true,
        openLabel: "Select the project location",
      });
      if (!location || !location.length) {
        return;
      }
      const basePath = location[0].fsPath;

      const projectName: string | undefined = await vscode.window.showInputBox({
        prompt: "Input a SST project name",
        ignoreFocusOut: true,
        validateInput: async (name: string): Promise<string> => {
          if (name && !name.match(/^[^*~/\\]+$/)) {
            return "Please input a valid project name";
          }
          if (name && (await pathExists(path.join(basePath, name)))) {
            return "A project with this name already exists";
          }
          return "";
        },
      });
      if (!projectName) {
        return;
      }
      try {
        await generateProject(projectName, basePath);
        const openInNewWindow =
          vscode.workspace && !isEmpty(vscode.workspace.workspaceFolders);
        await vscode.commands.executeCommand(
          Commands.VSCODE_OPEN_FOLDER,
          vscode.Uri.file(path.join(basePath, projectName)),
          openInNewWindow
        );
      } catch (error: any) {
        console.error(error);
        vscode.window.showErrorMessage(error.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
