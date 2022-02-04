import download from "download-git-repo";
import { join } from "path";
import { window } from "vscode";

export async function downloadTemplate(
  name: string,
  cwd: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(
      "Running: Download Template from Github: mattwyskiel/mattwyskiel-sst-template"
    );
    window.showInformationMessage(
      "Running: Download Template from Github: mattwyskiel/mattwyskiel-sst-template"
    );
    download(
      "mattwyskiel/mattwyskiel-sst-template",
      join(cwd, name),
      {},
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(join(cwd, name));
        }
      }
    );
  });
}
