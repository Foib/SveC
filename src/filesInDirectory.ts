import path from "path";
import fs from "fs";

export default function filesInDirectory(dir: string, ext: string) {
  const foundFiles: string[] = [];

  if (!fs.existsSync(dir)) {
    return foundFiles;
  }

  let files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    let filename = path.join(dir, files[i]);
    let stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      filesInDirectory(filename, ext);
    } else if (filename.endsWith(ext)) {
      foundFiles.push(filename);
    }
  }

  return foundFiles;
}
