const fs = require("fs");
const path = require("path");
const convert = require("xml-js");

/**
 * Take an array of paths and suss out which are files. Any folders will be
 * inspected for files. But we will only delve one level deep. In the future
 * we might write it more exhaustive.
 */
function findITTFiles(filesOrFolders) {
  const ittFiles = filesOrFolders.filter(fileOrFolder => {
    const stats = fs.statSync(fileOrFolder);
    return stats.isFile();
  });
  const filesInFolders = filesOrFolders
    .filter(fileOrFolder => {
      const stats = fs.statSync(fileOrFolder);
      return stats.isDirectory();
    })
    .reduce(
      (acc, folder) =>
        acc.concat(
          fs
            .readdirSync(folder)
            .map(bareName => path.join(folder, bareName))
            .filter(item => {
              const stats = fs.statSync(item);
              return stats.isFile();
            })
        ),
      []
    );
  return deduplicate(
    ittFiles.concat(filesInFolders).filter(fileName => /\.itt$/.test(fileName))
  );
}

// remove duplicate strings from array, return new array
function deduplicate(array) {
  const deduplicatedMap = array.reduce((acc, item) => {
    acc[item] = true;
    return acc;
  }, {});
  return Object.keys(deduplicatedMap);
}

// rewrite how seconds is expressed to support SRT
const rewriteTimecode = ({ timecode, ittFramesPerSecond }) => {
  const [hours, minutes, seconds, frames] = timecode.split(":");
  const milliseconds = Math.round(
    parseInt(frames, 10) * (1000 / ittFramesPerSecond)
  );
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
};

// get xml contents of .itt file, convert it to json. And save a .srt file
function parseIttXmlIntoCaptionData(xml) {
  const jsonStr = convert.xml2json(xml, { compact: true, spaces: 4 });
  const json = JSON.parse(jsonStr);
  const ittFramesPerSecond = json.tt._attributes["ttp:frameRate"];
  const captions = json.tt.body.div.p
    .map(({ _attributes = {}, span: { _text } = {} }) => {
      const { begin, end, region } = _attributes;
      let text = _text;
      if (Array.isArray(_text)) {
        text = _text
          .join(" ")
          .replace("\n", "")
          .replace(/\s{2,}/, " ");
      }
      return {
        begin: rewriteTimecode({ timecode: begin, ittFramesPerSecond }),
        end: rewriteTimecode({ timecode: end, ittFramesPerSecond }),
        region,
        text
      };
    })
    .filter(({ text }) => !!text)
    .map(caption => {
      caption.text = caption.text.trim();
      return caption;
    });
  return captions;
}

// build srt file according to spec
// source:
function writeSrtFile({ captions, fileName }) {
  const data = captions.reduce((acc, { begin, end, text }, index) => {
    acc += `${index + 1}\n`;
    acc += `${begin} --> ${end}\n`;
    acc += `${text}\n\n`;
    return acc;
  }, "");
  fs.writeFileSync(fileName, data);
}

module.exports = {
  findITTFiles,
  parseIttXmlIntoCaptionData,
  rewriteTimecode,
  writeSrtFile
};
