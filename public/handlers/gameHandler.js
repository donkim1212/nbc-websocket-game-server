import { score as gameScore } from "../index.js";

const gameStartHandler = (payload) => {
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
};

const gameEndHandler = (payload, score) => {
  const { score: finalScore } = payload;
  gameScore.setScore(finalScore);
  gameScore.setHighScore();
};

export { gameStartHandler, gameEndHandler };
