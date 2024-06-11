import { score as gameScore } from "../index.js";

const stageHandler = (payload) => {
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
};

export default stageHandler;
