import { getGameAssets, getItemScore } from "../init/assets.js";
import { getStage } from "../models/stage.model.js";

const userItemScores = {};

// Verify item, returns its score
export const itemScoreHandler = (userId, payload) => {
  const { itemId } = payload;
  const currentStage = getStage(userId);
  const gameAssets = getGameAssets();
  // TODO: abuse detection as an async function?

  const unlocksAt = gameAssets.itemUnlocks.data.findIndex((data) => itemId === data.item_id);
  if (unlocksAt === -1) {
    return { status: "fail", message: `Item with itemId ${itemId} doesn't exist` };
  }

  if (currentStage.id > gameAssets.itemUnlocks.data[unlocksAt].stage_id) {
    return { status: "fail", message: "Illegal item detected" };
  }

  const itemScore = getItemScore(itemId);
  if (itemScore === -1) return { status: "fail", message: "The item is non-existent." };

  addUserItemScores(userId, itemScore);
  return { status: "success", message: "Item obtained.", payload: { score: itemScore } };
};

export const addUserItemScores = (userId, score) => {
  if (!userItemScores[userId]?.total) setUserItemScores(userId, score);
  else userItemScores[userId].total += score;
};

export const setUserItemScores = (userId, score) => {
  userItemScores[userId] = { total: score };
};

export const getUserItemScores = (userId) => {
  return userItemScores[userId];
};
