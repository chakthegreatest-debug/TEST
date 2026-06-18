import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imageDir = path.join(root, "assets", "images");

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY is missing. Set it in the terminal, then run this script again.");
  process.exit(1);
}

const jobs = [
  {
    file: "hero-cars.png",
    size: "2048x1152",
    quality: "high",
    prompt: `Use case: ads-marketing
Asset type: full-bleed landing page hero for a premium car selection and parallel import service
Primary request: ultra photorealistic automotive hero image with several modern cars, no visible brand badges, no recognizable manufacturer logos, no readable license plates.
Scene/backdrop: clean contemporary delivery studio and import handover bay, polished dark floor, subtle logistics atmosphere, no text signage.
Subject: three modern unbranded cars: electric crossover, premium sedan, family SUV, positioned as curated selection ready for client handover.
Composition/framing: wide 16:9 horizontal image; cars occupy right and center; left side has calm dark negative space for landing page copy; no UI frames.
Lighting/mood: refined, trustworthy, premium, soft studio panels, realistic reflections, crisp but calm.
Color palette: dark navy, deep purple, graphite, white highlights, very small lime accent light.
Avoid: text, watermark, people, visible logos, recognizable badges, readable plates, floating UI, split-screen layout.`,
  },
  {
    file: "case-china.png",
    size: "1536x1024",
    quality: "medium",
    prompt: `Photorealistic editorial image of a modern imported electric crossover in a clean delivery bay. No visible brand logo, no recognizable manufacturer badge, no readable license plate. Subtle China import context through shipping containers and inspection equipment without text. Premium lighting, 3:2 landscape, dark purple and neutral palette with small lime accent. No people, no watermark.`,
  },
  {
    file: "case-korea.png",
    size: "1536x1024",
    quality: "medium",
    prompt: `Photorealistic image of a modern compact SUV after inspection in a bright automotive service studio. No brand badges or readable plates. Clean Korea import context through port/loading background without text. Premium, trustworthy, restrained colors, 3:2 landscape. No people, no watermark.`,
  },
  {
    file: "case-japan.png",
    size: "1536x1024",
    quality: "medium",
    prompt: `Photorealistic image of a clean hybrid wagon or sedan in a minimal inspection studio. No brand badges, no recognizable manufacturer logos, no readable plates. Subtle Japan auction/import context without text. Bright neutral lighting, 3:2 landscape, trustworthy and calm. No people, no watermark.`,
  },
  {
    file: "case-uae.png",
    size: "1536x1024",
    quality: "medium",
    prompt: `Photorealistic image of a premium SUV in a warm delivery zone with subtle desert-light reflections. No brand badges, no recognizable manufacturer logos, no readable plates. Modern UAE import service atmosphere, 3:2 landscape, refined and trustworthy. No people, no text, no watermark.`,
  },
];

async function generate(job) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt: job.prompt,
      size: job.size,
      quality: job.quality,
      output_format: "png",
      moderation: "auto",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI image generation failed for ${job.file}: ${response.status} ${body}`);
  }

  const result = await response.json();
  const b64 = result?.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error(`OpenAI response for ${job.file} did not include data[0].b64_json`);
  }

  const outPath = path.join(imageDir, job.file);
  await fs.writeFile(outPath, Buffer.from(b64, "base64"));
  console.log(`Saved ${outPath}`);
}

await fs.mkdir(imageDir, { recursive: true });

for (const job of jobs) {
  await generate(job);
}
