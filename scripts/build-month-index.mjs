import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const MAX_VALUE = 1_000_000;
const MONTH_FILE = /^([0-9]{4}-(0[1-9]|1[0-2]))\.json$/;

function fail(message) {
  throw new Error(message);
}

function record(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  return value;
}

function exactKeys(value, required, label) {
  record(value, label);
  const allowed = new Set(required);
  for (const key of Object.keys(value)) if (!allowed.has(key)) fail(`${label} has unsupported key: ${key}`);
  for (const key of required) if (!Object.hasOwn(value, key)) fail(`${label} is missing key: ${key}`);
}

function positive(value, label) {
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_VALUE) fail(`${label} must be an integer from 1 to ${MAX_VALUE}`);
}

const ITEM_ID = /^[a-z0-9][a-z0-9_]*$/;
const monthlyTrades = new Set([
  "karu_forest:rocking_chair",
  "oasis:red_hourglass",
  "pera:dragon_fan",
  "calida:hot_spring_diffuser",
]);

const monthDirectory = "months";
const jsonFiles = (await readdir(monthDirectory)).filter((file) => file.toLowerCase().endsWith(".json")).sort();
if (jsonFiles.length > 1200) fail("The system index supports at most 1200 month files");

const months = [];
const seenMonths = new Set();
for (const file of jsonFiles) {
  const match = MONTH_FILE.exec(basename(file));
  if (!match) fail(`${file} must be named YYYY-MM.json`);
  const pack = JSON.parse(await readFile(join(monthDirectory, file), "utf8"));
  exactKeys(pack, ["schemaVersion", "month", "entries"], file);
  if (pack.schemaVersion !== 2 || pack.month !== match[1]) fail(`${file} must be a v2 pack whose month matches its filename`);
  if (!Array.isArray(pack.entries) || pack.entries.length < 1 || pack.entries.length > monthlyTrades.size) fail(`${file} must contain 1-${monthlyTrades.size} trade entries`);
  if (seenMonths.has(pack.month)) fail(`Duplicate month: ${pack.month}`);
  seenMonths.add(pack.month);

  const seenTrades = new Set();
  for (const [entryIndex, entry] of pack.entries.entries()) {
    const label = `${file} entry ${entryIndex + 1}`;
    exactKeys(entry, ["tradePostId", "tradeItemId", "exchangeCount", "requirements", "tradeDetails"], label);
    const tradeKey = `${entry.tradePostId}:${entry.tradeItemId}`;
    if (!monthlyTrades.has(tradeKey) || seenTrades.has(tradeKey)) fail(`${label} has an unsupported or repeated trade item`);
    seenTrades.add(tradeKey);
    positive(entry.exchangeCount, `${label} exchangeCount`);

    exactKeys(entry.tradeDetails, ["nameZhTW", "weight", "materialValue", "slotCount"], `${label} tradeDetails`);
    if (typeof entry.tradeDetails.nameZhTW !== "string" || !entry.tradeDetails.nameZhTW.trim() || entry.tradeDetails.nameZhTW.trim().length > 80) fail(`${label} tradeDetails.nameZhTW must contain 1-80 characters`);
    for (const key of ["weight", "materialValue", "slotCount"]) positive(entry.tradeDetails[key], `${label} tradeDetails.${key}`);

    if (!Array.isArray(entry.requirements) || entry.requirements.length < 1 || entry.requirements.length > 100) fail(`${label} must contain 1-100 material requirements`);
    const seenMaterials = new Set();
    for (const [requirementIndex, requirement] of entry.requirements.entries()) {
      const reqLabel = `${label} requirement ${requirementIndex + 1}`;
      exactKeys(requirement, ["itemId", "quantityPerExchange"], reqLabel);
      if (typeof requirement.itemId !== "string" || !ITEM_ID.test(requirement.itemId) || seenMaterials.has(requirement.itemId)) fail(`${reqLabel} has a malformed or repeated material ID`);
      seenMaterials.add(requirement.itemId);
      positive(requirement.quantityPerExchange, `${reqLabel} quantityPerExchange`);
    }
  }
  months.push(pack);
}

await writeFile("months.json", `${JSON.stringify({ schemaVersion: 1, months }, null, 2)}\n`, "utf8");
console.log(`Generated months.json with ${months.length} month(s).`);
