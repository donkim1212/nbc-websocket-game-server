import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  scoreRequiredToAdvance = 100;
  scoresPerSecond = 1;
  stageId = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scoresPerSecond;
    // 점수 만족 시 서버에 메세지 전송
    if (this.score >= this.scoreRequiredToAdvance && this.stageChange) {
      this.stageChange = false;
      // console.log("NEXT STAGE EVENT SENT");
      sendEvent(11, { currentStage: this.stageId, score: this.score });
    }
  }

  getItem(itemId) {
    sendEvent(15, { itemId });
    // this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  setScore(score) {
    this.score = +score;
  }

  addScore(scoreToAdd) {
    this.score += +scoreToAdd;
  }

  setNextStage(stageId, targetScore, scoresPerSecond) {
    this.stageId = stageId;
    this.scoreRequiredToAdvance = targetScore;
    this.scoresPerSecond = scoresPerSecond;
    this.stageChange = true;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
