import {readLines} from "https://deno.land/std/io/bufio.ts";
import {MuxAsyncIterator} from "https://deno.land/std/async/mux_async_iterator.ts";
import {extname} from "https://deno.land/std/path/mod.ts";

const watcher = Deno.watchFs(["./"]);

const events = new MuxAsyncIterator();

events.add(watcher);
events.add(readLines(Deno.stdin));

const quit_phrases = ["close", "quit", "exit", "q"];

console.log("Watching for changes in .md files.");

for await (const event of events) {
	if (quit_phrases.includes(event)) Deno.exit();
	if (typeof event === "string") continue;
	
	const {kind, paths: [path]} = event;

	if (extname(path) === ".md") {
		let proc = Deno.run({
			cmd: ["git", "add", path]
		});

		await proc.status();

		proc = Deno.run({
			cmd: ["git", "commit", "-m", `track-changes: Update ${path}`]
		});

		await proc.status();

		console.log("");
	}
}
