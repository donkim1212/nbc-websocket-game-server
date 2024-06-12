class InvalidStageError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "Invalid stage access detected.";
    this.status = "fail";
  }
}

export default InvalidStageError;
