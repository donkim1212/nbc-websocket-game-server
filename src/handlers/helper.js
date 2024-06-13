import { CLIENT_VERSION } from "../constants.js";
import { clearGameData } from "../libs/game-state-manager.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";
import { getUsers, removeUserBySocketId, removeUserByUserId } from "../models/user.model.js";
import errorHandler from "./error.handler.js";
import handlerMappings from "./handler-mapping.js";

export const handleDisconnect = async (socket, uuid) => {
  console.log(`User disconnected: ${socket.id}, ${uuid}`);
  if (socket.id) removeUserBySocketId(socket.id);
  else if (uuid) removeUserByUserId(uuid);

  // clearGameData(uuid);
  console.log("Current users: ", getUsers());
};

export const handleConnection = async (socket, uuid) => {
  console.log(`User connected: ${uuid} with socket ID ${socket.id}`);
  console.log("Current users: ", getUsers());

  // createStage(uuid);
  await stageModel.createStage(uuid);

  socket.emit("connection", { uuid });
};

export const handlerEvent = async (io, socket, data) => {
  try {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
      socket.emit("response", { status: "fail", message: "Client version mismatch." });
      return;
    }

    const handler = handlerMappings[data.handlerId];
    if (!handler) {
      socket.emit("response", { status: "fail", message: "Handler not found." });
      return;
    }

    const response = await handler(data.userId, data.payload);
    if (response.payload) response.handlerId = data.handlerId;

    if (response.broadcast) {
      io.emit("response", "broadcast");
      return;
    }

    socket.emit("response", response);
  } catch (err) {
    // Disconnects user on error (which includes when invalid game data detected)
    removeUserByUserId(data.userId);
    clearGameData(data.userId);
    errorHandler(err, socket);
  }
};
