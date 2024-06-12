import { score as gameScore, itemController } from "../index.js";

const gameStartHandler = (payload) => {
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
  itemController.setUnlockedItems(payload.unlockedItems);
  console.log("Unlocked: ", itemController.unlockedItems);
  console.log("Next: ", payload.targetScore);
};

const gameEndHandler = (payload, score) => {
  const { score: finalScore } = payload;
  gameScore.setScore(finalScore);
  gameScore.setHighScore();
};

export { gameStartHandler, gameEndHandler };
