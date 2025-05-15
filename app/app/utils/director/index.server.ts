import fs, { ObjectEncodingOptions } from "fs";
import path from "path";

export default class Director {
  static delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static makeDir(dirPath: string, options?: fs.MakeDirectoryOptions) {
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      fs.mkdirSync(dirPath, options);
    }
  }

  static readDir(
    dirPath: string,
    options:
      | (ObjectEncodingOptions & {
          withFileTypes?: boolean | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null = "utf-8",
  ) {
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) {
      return null;
    }

    return (
      fs
        // @ts-expect-error fs complains about the key `withFileTypes` not being a valid type (expects false somehow)
        .readdirSync(dirPath, options)
    );
  }

  static readFile(filePath: string) {
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) return undefined;

    return fs.readFileSync(filePath, "utf-8");
  }

  static deletePath(pathToDelete: string) {
    console.log(`Deleting ${pathToDelete}`);
    if (fs.existsSync(pathToDelete)) {
      fs.rmSync(pathToDelete, { recursive: true });
    }
  }

  static writeFile(
    filePath: string,
    contents: string,
    options?: fs.WriteFileOptions,
  ) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(filePath, contents, options);
  }

  static copyFile(from: string, to: string, mode?: number) {
    const dirname = path.dirname(to);
    if (!fs.existsSync(dirname)) {
      this.makeDir(dirname, { recursive: true });
    }
    return fs.copyFileSync(from, to, mode);
  }
}
