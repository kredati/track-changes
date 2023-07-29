import { readLines } from "https://deno.land/std@0.178.0/io/read_lines.ts"
import { MuxAsyncIterator } from "https://deno.land/std/async/mux_async_iterator.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

const watcher = Deno.watchFs(["./"]);

const events = new MuxAsyncIterator();

events.add(watcher);
events.add(readLines(Deno.stdin));

const quit_phrases = ["close", "quit", "exit", "q"];

console.log("Watching for changes in .md and .xit files.");
console.log("To quit, type 'close', 'quit', 'q', or 'exit'.");

for await (const event of events) {

  if (quit_phrases.includes(event)) Deno.exit();
  if (typeof event === "string") continue;

  const path = event.paths[0];

  const ext = extname(path)

  if (ext === ".md" || ext === ".xit") {
    let now = new Date(Date.now());
    console.log(`Detected change in ${path}. Committing change at ${now.toLocaleString()}`);

    let proc = Deno.run({
      cmd: ["git", "add", path],
      stdout: "null"
    });

    await proc.status();

    proc = Deno.run({
      cmd: ["git", "commit", "-m", `track-changes: Update ${path}`],
      stdout: "null"
    });

    await proc.status();
  }
}
