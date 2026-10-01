import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import seed from "./seed.json";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
let queue: Promise<unknown> = Promise.resolve();

async function writeAll(data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, DB_PATH);
}

async function readAll(): Promise<Record<string, unknown[]>> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await writeAll(seed);
      return structuredClone(seed) as Record<string, unknown[]>;
    }
    throw err;
  }
}

export async function getCollection<T>(name: string): Promise<T[]> {
  const data = await readAll();
  return (data[name] ?? []) as T[];
}

export function updateCollection<T>(
  name: string,
  fn: (items: T[]) => T[] | Promise<T[]>,
): Promise<T[]> {
  const run = queue.then(async () => {
    const data = await readAll();
    const next = await fn((data[name] ?? []) as T[]);
    data[name] = next;
    await writeAll(data);
    return next;
  });
  queue = run.catch(() => {});
  return run;
}