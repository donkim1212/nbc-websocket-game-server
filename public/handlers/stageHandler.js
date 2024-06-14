import Score from "../Score.js";
import ItemController from "../ItemController.js";

let score = null;
let itemController = null;

const stageHandler = (payload) => {
  if (!score) score = Score.getInstance();
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
  if (!itemController) itemController = ItemController.getInstance();
  itemController.unlockItem(payload.unlockedItem);
};

export default stageHandler;
