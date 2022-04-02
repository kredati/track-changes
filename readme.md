# track-changes

A teeny-tiny CLI script, written in JS and packaged in Deno, which tracks changes in markdown files, and automatically commits those changes in git.

Inspired by [GitDoc](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.gitdoc). I stared using SublimeText, but wanted the same functionality.

To install, clone the repo. Then, run `deno compile --allow-run --allow-read index.js`. Rename the executable and move/copy it somewhere on your path (e.g., `/usr/local/bin`).

Requires a Deno runtime, as well as a working git installation.

Commits changes, but does not push them; all changes are local until you `git push`.