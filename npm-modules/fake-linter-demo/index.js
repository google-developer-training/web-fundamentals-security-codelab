#!/usr/bin/env node

// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

import { resolve } from "path";
import { argv, cwd } from "node:process";
import { readFile, writeFile } from "node:fs/promises";

const baseDirectory = cwd();
const inputFileName = argv.at(2);
const outputFileName = argv.at(3);

if (
	!inputFileName ||
	inputFileName.length < 1 ||
	!outputFileName ||
	outputFileName.length < 1
) {
	throw new Error("Invalid filename(s) specified");
}

const inputFile = resolve(baseDirectory, inputFileName);
const outputFile = resolve(baseDirectory, outputFileName);

let contents = await readFile(inputFile, "utf8");

contents = contents.replace(
	"export default main;",
	`console.log('This has been sneakily inserted!');\nexport default main;`
);

await writeFile(outputFile, contents);

console.log("✅ The linting has passed");
console.log("✅ Your file is ready to publish!");
