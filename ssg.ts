import Bun from "bun";
import { mkdir, rm, cp } from "node:fs/promises";

async function ssg() {
  await rm("./dist", { recursive: true, force: true });
  await mkdir("./dist", { recursive: true });

  await Bun.write(
    Bun.file("./dist/index.html"),
    Bun.file("./build/client/cong.es/index.html")
  )

  await cp("./build/client/assets", "./dist/assets", { recursive: true })
}

if (import.meta.main) {
  await ssg();
}
