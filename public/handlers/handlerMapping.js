import itemScoreHandler from "./itemScoreHandler.js";
// import { score } from "../index.js";
import gameEndHandler from "./gameEndHandler.js";

const handlerMapping = {
  2: gameEndHandler,
  15: itemScoreHandler,
};

const targetMappings = {
  //   2: score,
  //   15: score,
};

export { handlerMapping, targetMappings };
