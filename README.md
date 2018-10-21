# ITT to SRT converter

A command line utility that converts [iTunes Timed Text (.itt)](https://www.w3.org/TR/ttml1/) into [SubRip Subtitle files (.srt)](https://matroska.org/technical/specs/subtitles/srt.html).

## Installation

Make sure you have at least [Node.js version 8](https://nodejs.org/en/) installed.

Run `npm install -g convert-itt` in your terminal to install the tool.

## Usage

Point newly installed Terminal command at one or more files or folders. It will create .srt files next to the .itt files.

To convert a folder call: `convert-itt some-folder/`.

You can also convert files by calling: 

- `convert-itt *` or 
- `convert-itt ./` or 
- `convert-itt some-subtitle.itt`.

Get help by running: `convert-itt --help`

## License

This project is licensed under AGPLv3, [see license](LICENSE.txt).
