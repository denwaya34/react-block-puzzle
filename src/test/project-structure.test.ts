import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Project Structure", () => {
  const directories = [
    "src/components",
    "src/hooks",
    "src/services",
    "src/utils",
    "src/types",
  ];

  directories.forEach((dir) => {
    it(`should have ${dir} directory`, () => {
      const dirPath = path.resolve(process.cwd(), dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it(`should have index.ts in ${dir}`, () => {
      const indexPath = path.resolve(process.cwd(), dir, "index.ts");
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });
});
