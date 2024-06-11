import { moveStageHandler } from "./stage.handler.js";
import { gameStart, gameEnd } from "./game.handler.js";
import { itemScoreHandler } from "./item-score.handler.js";

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  15: itemScoreHandler,
};

export default handlerMappings;
