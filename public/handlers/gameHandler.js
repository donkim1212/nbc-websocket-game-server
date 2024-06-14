import Score from "../Score.js";
import ItemController from "../ItemController.js";

let gameScore = null;
let itemController = null;

const gameStartHandler = (payload) => {
  if (!gameScore) gameScore = Score.getInstance();
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
  if (!itemController) itemController = ItemController.getInstance();
  itemController.setUnlockedItems(payload.unlockedItems);
};

const gameEndHandler = (payload) => {
  if (!gameScore) gameScore = Score.getInstance();
  gameScore.setScore(payload.score);
};

export { gameStartHandler, gameEndHandler };
