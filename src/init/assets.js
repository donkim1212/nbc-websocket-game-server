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

export const getItemData = (itemId) => {
  const index = gameAssets.items.data.findIndex((data) => itemId === data.id);
  if (index === -1) return null;
  return gameAssets.items.data[index];
};

export const getItemScore = (itemId) => {
  return getItemData(itemId)?.score;
};

export const getStageData = (stageId) => {
  const index = gameAssets.stages.data.findIndex((data) => stageId === data.id);
  if (index === -1) return null;
  return gameAssets.stages.data[index];
};

export const getItemUnlockStage = (itemId) => {
  const itemUnlockIndex = gameAssets.itemUnlocks.data.findIndex((data) => data.item_id === itemId);
  if (itemUnlockIndex === -1) return null;
  const itemUnlockStageId = gameAssets.itemUnlocks.data[itemUnlockIndex].stage_id;
  const index = gameAssets.stages.data.findIndex((data) => data.id === itemUnlockStageId);
  if (index === -1) return null;
  return gameAssets.stages.data[index];
};

export const getItemUnlockStageId = (itemId) => {
  return getItemUnlockStage(itemId).id;
};

export const getUnlockedItemIdByStageId = (stageId) => {
  const itemUnlockIndex = gameAssets.itemUnlocks.data.findIndex(
    (data) => data.stage_id === stageId,
  );
  if (itemUnlockIndex === -1) return null;
  return gameAssets.itemUnlocks.data[itemUnlockIndex].item_id;
};

export const getScoresPerSecond = (stageId) => {
  const index = gameAssets.stages.data.findIndex((data) => stageId === data.id);
  if (index === -1) return null;
  return gameAssets.stages.data[index].scoresPerSecond;
};
