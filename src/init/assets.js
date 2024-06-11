import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, "../../assets");

let gameAssets;

export const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  const [stages, items, itemUnlocks] = await Promise.all([
    readFileAsync("stage.json"),
    readFileAsync("item.json"),
    readFileAsync("item_unlock.json"),
  ]);

  gameAssets = { stages, items, itemUnlocks };
  return gameAssets;
};

export const getGameAssets = () => {
  return gameAssets;
};

export const getItemScore = (itemId) => {
  const index = gameAssets.items.data.findIndex((data) => itemId === data.id);
  if (index === -1) return index;
  return gameAssets.items.data[index].score;
};

export const getStageData = (stageId) => {
  const index = gameAssets.stages.data.findIndex((data) => stageId === data.id);
  if (index === -1) return index;
  return gameAssets.stages.data[index];
};

export const getScoresPerSecond = (stageId) => {
  const index = gameAssets.stages.data.findIndex((data) => stageId === data.id);
  if (index === -1) return index;
  return gameAssets.stages.data[index].scoresPerSecond;
};
