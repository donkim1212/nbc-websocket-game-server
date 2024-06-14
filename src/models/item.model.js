const userItem = {};
// {userId : {total: score, timestamp: Date.now()} }

export const initUserItem = (userId) => {
  userItem[userId] = { total: 0, timestamp: Date.now() };
};

export const addUserItem = (userId, score) => {
  userItem[userId].total += score;
  userItem[userId].timestamp = Date.now();
};

export const getUserItem = (userId) => {
  return userItem[userId];
};

export const addUserItemTotal = (userId, score) => {
  if (!userItem[userId]?.total) initUserItem(userId);
  userItem[userId].total += score;
};

export const setUserItemTotal = (userId, score) => {
  userItem[userId].total = score;
};

export const getUserItemScore = (userId) => {
  return userItem[userId];
};

export const removeUserItemData = (userId) => {
  delete userItem[userId];
};
