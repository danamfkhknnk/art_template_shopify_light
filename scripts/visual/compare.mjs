import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

// Compares screenshots against a reference image when one exists
// (reference/<section?>/<viewport>.png — the design source of truth), or
// falls back to a self-regression baseline (screenshots/<section?>/baseline/)
// when no reference mockup was provided for that viewport.
//
// Usage:
//   npm run ui:compare                # screenshots/ vs reference/ (or baseline/)
//   SECTION=team npm run ui:compare   # screenshots/team/ vs reference/team/ (or baseline/)

const SECTION = process.env.SECTION || null;
const THRESHOLD_PCT = Number(process.env.DIFF_THRESHOLD_PCT ?? 0.5); // AGENTS.md default: 0.5%
const PIXEL_THRESHOLD = Number(process.env.PIXELMATCH_THRESHOLD ?? 0.1); // pixelmatch per-pixel sensitivity

const SHOTS_ROOT = SECTION ? `screenshots/${SECTION}` : 'screenshots';
const REFERENCE_ROOT = SECTION ? `reference/${SECTION}` : 'reference';
const BASELINE_DIR = path.join(SHOTS_ROOT, 'baseline');
const DIFFS_DIR = SECTION ? path.join('diffs', SECTION) : 'diffs';
const REPORT_PATH = SECTION
  ? path.join('visual-report', `${SECTION}-test-result.json`)
  : path.join('visual-report', 'test-result.json');

async function readPng(filePath) {
  return PNG.sync.read(await fs.readFile(filePath));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await fileExists(SHOTS_ROOT))) {
    console.error(`No screenshots found at ${SHOTS_ROOT}. Run npm run ui:screenshot first.`);
    process.exit(1);
  }

  await fs.mkdir(BASELINE_DIR, { recursive: true });
  await fs.mkdir(DIFFS_DIR, { recursive: true });
  await fs.mkdir('visual-report', { recursive: true });

  const entries = await fs.readdir(SHOTS_ROOT, { withFileTypes: true });
  const shots = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
    .map((entry) => entry.name);

  if (shots.length === 0) {
    console.error(`No .png files found directly in ${SHOTS_ROOT}.`);
    process.exit(1);
  }

  const results = {};
  let overallStatus = 'PASS';

  for (const name of shots) {
    const viewport = path.basename(name, '.png');
    const currentPath = path.join(SHOTS_ROOT, name);
    const referencePath = path.join(REFERENCE_ROOT, name);
    const baselinePath = path.join(BASELINE_DIR, name);
    const diffPath = path.join(DIFFS_DIR, `${viewport}-diff.png`);

    let comparePath = null;
    let source = null;

    if (await fileExists(referencePath)) {
      comparePath = referencePath;
      source = 'reference';
    } else if (await fileExists(baselinePath)) {
      comparePath = baselinePath;
      source = 'baseline';
    } else {
      // First run for this viewport: nothing to compare against yet.
      // Save current shot as the self-regression baseline going forward.
      await fs.copyFile(currentPath, baselinePath);
      results[viewport] = { status: 'SKIPPED', reason: 'no reference or baseline; baseline created' };
      console.log(`[SKIPPED] ${viewport}: no reference/baseline found — saved current shot as new baseline.`);
      continue;
    }

    const current = await readPng(currentPath);
    const compare = await readPng(comparePath);

    if (current.width !== compare.width || current.height !== compare.height) {
      results[viewport] = {
        status: 'FAIL',
        reason: `size mismatch: ${source} ${compare.width}x${compare.height} vs current ${current.width}x${current.height}`,
      };
      overallStatus = 'FAIL';
      console.error(`[FAIL] ${viewport}: size mismatch vs ${source} (${compare.width}x${compare.height} vs ${current.width}x${current.height})`);
      continue;
    }

    const { width, height } = current;
    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(compare.data, current.data, diff.data, width, height, {
      threshold: PIXEL_THRESHOLD,
    });

    const diffPercentage = (diffPixels / (width * height)) * 100;
    await fs.writeFile(diffPath, PNG.sync.write(diff));

    const status = diffPercentage < THRESHOLD_PCT ? 'PASS' : 'FAIL';
    if (status === 'FAIL') overallStatus = 'FAIL';

    results[viewport] = {
      status,
      source,
      diffPixels,
      diffPercentage: Number(diffPercentage.toFixed(2)),
    };

    console.log(
      `[${status}] ${viewport} (vs ${source}): ${diffPixels} px diff (${diffPercentage.toFixed(2)}%, threshold ${THRESHOLD_PCT}%) -> ${diffPath}`
    );
  }

  const report = {
    status: overallStatus,
    threshold: THRESHOLD_PCT,
    results,
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${REPORT_PATH}`);
  console.log(`Overall: ${overallStatus}`);

  if (overallStatus === 'FAIL') process.exit(1);
}

main();
