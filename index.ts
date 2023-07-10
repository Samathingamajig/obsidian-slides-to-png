import { chromium, devices } from "playwright";
import { Command } from "commander";
import { z } from "zod";
import path from "node:path";

const program = new Command();

program
  .option("-w, --width <width>", "Width of the output", Number, 1920)
  .option("-h, --height <height>", "Height of the output, -1 defaults to 16 by 9 ratio of width", Number, -1)
  .option("-o, --output-dir <output-dir>", "Output directory", String, "slides")
  .argument("[url]", "URL to process", String, "http://localhost:3000")
  .parse(process.argv);

const argsSchema = z
  .object({
    url: z.string().url(),
    width: z.number().int().positive(),
    height: z.number().int(),
    outputDir: z.string(),
  })
  .transform((data, ctx) => {
    if (data.height === -1) {
      data.height = Math.round((9 / 16) * data.width);
    } else if (data.height <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Height must be positive if specified",
        path: ["height"],
      });
      return z.NEVER;
    }

    return data;
  });

const safeArgs = argsSchema.safeParse({
  ...program.opts(),
  url: program.processedArgs[0],
});

if (!safeArgs.success) {
  console.error("Invalid arguments:", safeArgs.error.issues);
  process.exit(1);
}

const args = safeArgs.data;

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices["Desktop Chrome"],
  viewport: {
    width: args.width,
    height: args.height,
  },
});
const page = await context.newPage();
await page.goto(args.url);

await page.waitForSelector(".slides > :not(.slide-background)");

const totalSlides = (await page.$$(".slides > :not(.slide-background)")).length;
const totalSlidesCharLength = String(totalSlides).length;

for (let slide = 1; slide <= totalSlides; slide++) {
  await page.screenshot({
    path: path.join(args.outputDir, `slide-${String(slide).padStart(totalSlidesCharLength, "0")}.png`),
  });
  await page.keyboard.press("ArrowRight");
}

await page.close();
await browser.close();
