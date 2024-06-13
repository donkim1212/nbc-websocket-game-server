const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const findUserBySocketId = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index === -1) return null;
  return users[index];
};

export const removeUserBySocketId = (socketId) => {
  // remove user with given socketId from users
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index === -1) return null;
  return users.splice(index, 1)[0];
};

export const removeUserByUserId = (userId) => {
  const index = users.findIndex((user) => user.userId === userId);
  if (index === -1) return null;
  return users.splice(index, 1)[0];
};

export const getUsers = () => {
  return users;
};
