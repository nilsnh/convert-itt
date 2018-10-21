#! /usr/bin/env node

const fs = require("fs");
const program = require("commander");
const { name, version, description } = require("./package.json");
const {
  findITTFiles,
  parseIttXmlIntoCaptionData,
  writeSrtFile
} = require("./lib");

program
  .version(version)
  .description(description)
  .usage("[file(s) or directory]")
  .parse(process.argv);

const filesOrFolders = process.argv.splice(2);

if (filesOrFolders.length === 0) {
  return console.log("For instructions call converttt --help");
}

const files = findITTFiles(filesOrFolders);
files.forEach(filePath => {
  const xml = fs.readFileSync(filePath, { encoding: "utf-8" });
  const captions = parseIttXmlIntoCaptionData(xml);
  const fileName = filePath.replace(/\.itt$/i, ".srt");
  writeSrtFile({ captions, fileName });
});
