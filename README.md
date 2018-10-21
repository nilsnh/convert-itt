# ITT to SRT converter

[![Build Status](https://travis-ci.org/nilsnh/converttt.svg?branch=master)](https://travis-ci.org/nilsnh/converttt)

A command line utility that converts [iTunes Timed Text (.itt)](https://www.w3.org/TR/ttml1/) into [SubRip Subtitle files (.srt)](https://matroska.org/technical/specs/subtitles/srt.html).

## Installation

Make sure you have at least [Node.js version 8](https://nodejs.org/en/) installed.

Run `npm install -g converttt` in your terminal to install the tool.

## Usage

Point newly installed Terminal command at one or more files or folders. It will create .srt files next to the .itt files.

To convert a folder call: `converttt some-folder/`.

You can also convert files by calling:

- `converttt *` or
- `converttt ./` or
- `converttt some-subtitle.itt`.

Get help by running: `converttt --help`

## License

This project is licensed under AGPLv3, [see license](LICENSE.txt).
