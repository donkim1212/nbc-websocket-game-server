import { findUserBySocketId } from "../models/user.model.js";
import { clearGameData } from "../libs/game-state-manager.js";

const errorHandler = async (err, socket) => {
  console.error(err);

  // delete user's game data on error
  clearGameData(findUserBySocketId(socket.id).userId);

  socket.emit("response", { status: "fail", message: err.message });
  socket.emit("response", { status: "fail", message: "You are disconnected from the server." });

  socket.disconnect(true);
};

export default errorHandler;
