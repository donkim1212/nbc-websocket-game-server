const userItem = {};

export const initUserItem = (userId) => {
  userItem[userId] = { total: 0, unlocked: [] };
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

export const setUserItemUnlocked = (userId, unlocked) => {
  userItem[userId].unlocked = unlocked;
};

export const addUserItemUnlocked = (userId, itemId) => {
  userItem[userId].unlocked.push(itemId);
};

export const getUserItemUnlocked = (userId) => {
  return userItem[userId]?.unlocked;
};
