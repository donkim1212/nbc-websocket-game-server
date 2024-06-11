const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp, prevScore) => {
  return stages[uuid].push({ id, timestamp, prevScore });
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};
