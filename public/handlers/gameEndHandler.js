import { score as gameScore } from "../index.js";

const gameEndHandler = (payload, score) => {
  const { score: finalScore } = payload;
  gameScore.setScore(finalScore);
  gameScore.setHighScore();
};

export default gameEndHandler;
