import itemScoreHandler from "./itemScoreHandler.js";
// import { score } from "../index.js";
import { gameStartHandler, gameEndHandler } from "./gameHandler.js";
import stageHandler from "./stageHandler.js";

const handlerMapping = {
  2: gameStartHandler,
  3: gameEndHandler,
  11: stageHandler,
  15: itemScoreHandler,
};

const targetMapping = {
  //   2: score,
  //   15: score,
};

export { handlerMapping, targetMapping };
