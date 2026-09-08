"use strict";

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

async function main() {
  const [sourceCover, appRoot] = process.argv.slice(2);
  if (!sourceCover || !appRoot) throw new Error("Usage: node render-assets.cjs <cover.png> <app-root>");
  const assetDir = path.join(appRoot, "assets");
  const iconDir = path.join(appRoot, "icons");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(iconDir, { recursive: true });
  fs.copyFileSync(sourceCover, path.join(assetDir, "book-cover-v1.png"));
  const iconSvg = path.join(iconDir, "icon.svg");
  await Promise.all([
    sharp(iconSvg, { density: 256 }).resize(192, 192).png().toFile(path.join(iconDir, "icon-192.png")),
    sharp(iconSvg, { density: 256 }).resize(512, 512).png().toFile(path.join(iconDir, "icon-512.png"))
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
