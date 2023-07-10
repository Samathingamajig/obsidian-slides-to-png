# obsidian-slides-to-png

YouTuber [No Boilerplate](https://www.youtube.com/@NoBoilerplate) uses a plugin for [Obsidian](https://obsidian.md/) called [Advanced Slides](https://github.com/MSzturc/obsidian-advanced-slides) to generate slideshows for his videos with markdown. His process is to "take each slide, printscreen it, and splice it with my audio using [reaper.fm](http://reaper.fm/)". I think the process of printscreening is prone to errors (how do you guarantee the exact size?) and time-consuming. This simple script takes in the url to the slideshow preview (defaults to localhost:3000, the default port of the slides plugin), optional width and height (defaults to 1920 by 1080 pixels), and an optional path to output the slide screenshots in (defaults to `slides` in the working directory).

To install dependencies:

```bash
npm install
```

To run:

```bash
npx tsx index.ts
```

Here are the options:

```
Usage: index [options] [url]

Arguments:
  url                            URL to process (default: "http://localhost:3000")

Options:
  -w, --width <width>            Width of the output (default: 1280)
  -h, --height <height>          Height of the output, -1 defaults to 16 by 9 ratio of width (default: -1)
  -o, --output-dir <output-dir>  Output directory (default: "slides")
  --help                         display help for command
```

To open the Advanced Slides preview and get the url

0. Install Obsidian and the "Advanced Slides" plugin
1. Open the command palette (<kbd>Cmd</kbd><kbd>p</kbd> on Mac) and enter "slides show preview" and select "Advanced Slides: Show Slide Preview"
2. Click the icon that looks like a monitor with bars on it that's labeled "Open in Browser" when hovered
3. Copy that url
