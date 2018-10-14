import fs from "fs";
import test from "ava";
import { parseIttXmlIntoCaptionData, rewriteTimecode } from "./lib";

test("convert ITT time format to milliseconds", t => {
  const result = rewriteTimecode({
    timecode: "00:00:05:07",
    ittFramesPerSecond: 30
  });
  t.is(result, "00:00:05,233");
});

test("parsing ITT xml into caption data", t => {
  const xml = fs.readFileSync("./lib.test.data.itt", { encoding: "utf-8" });
  const captionData = parseIttXmlIntoCaptionData(xml);
  t.deepEqual(captionData, [
    {
      begin: "00:00:02,233",
      end: "00:00:05,233",
      region: "bottom",
      text: "We breathe bits and bytes"
    },
    {
      begin: "00:00:05,233",
      end: "00:00:08,633",
      region: "bottom",
      text: "We are the fishes in the Internet-water"
    },
    {
      begin: "00:00:08,633",
      end: "00:00:11,33",
      region: "bottom",
      text: "We accept the established"
    }
  ]);
});
