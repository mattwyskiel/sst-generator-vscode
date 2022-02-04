import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { window } from "vscode";
import { downloadTemplate } from "./download-template";
import { runCLICommand } from "./run-cli-command";

export async function generateProject(name: string, cwd: string) {
  // 1. Download the template repository
  const projDir = await downloadTemplate(name, cwd);
  // 2. npm install
  await runCLICommand(projDir, "yarn");
  // 3. change project name
  console.log("Customizing project");
  window.showInformationMessage("Customizing project...");
  const packageJSONString = await readFile(join(projDir, "package.json"), {
    encoding: "utf-8",
  });
  const packageJSON = JSON.parse(packageJSONString);
  packageJSON.name = name;
  await writeFile(
    join(projDir, "package.json"),
    JSON.stringify(packageJSON, null, 2)
  );

  const sstJSONString = await readFile(join(projDir, "sst.json"), {
    encoding: "utf-8",
  });
  const sstJSON = JSON.parse(sstJSONString);
  sstJSON.name = name;
  await writeFile(join(projDir, "sst.json"), JSON.stringify(sstJSON, null, 2));
  // 3. git init && initial commit
}
