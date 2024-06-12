const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const getCurrentStage = (uuid) => {
  if (!getStage(uuid)) return null;
  return stages[uuid][stages[uuid].length - 1];
};

export const setStage = (uuid, id, timestamp, prevScore) => {
  return stages[uuid].push({ id, timestamp, prevScore });
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};

export const removeStage = (uuid) => {
  delete stages[uuid];
};
