import { CLIENT_VERSION } from "../constants.js";
import { clearGameData } from "../libs/game-state-manager.js";
import { createStage } from "../models/stage.model.js";
import { getUsers, removeUserBySocketId, removeUserByUserId } from "../models/user.model.js";
import errorHandler from "./error.handler.js";
import handlerMappings from "./handler-mapping.js";

export const handleDisconnect = (socket, uuid) => {
  console.log(`User disconnected: ${socket.id}, ${uuid}`);
  if (socket.id) removeUserBySocketId(socket.id);
  else if (uuid) removeUserByUserId(uuid);

  clearGameData(uuid);
  console.log("Current users: ", getUsers());
};

export const handleConnection = (socket, uuid) => {
  console.log(`User connected: ${uuid} with socket ID ${socket.id}`);
  console.log("Current users: ", getUsers());

  createStage(uuid);

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

    const response = handler(data.userId, data.payload);
    if (response.payload) response.handlerId = data.handlerId;

    if (response.broadcast) {
      io.emit("response", "broadcast");
      return;
    }

    socket.emit("response", response);
  } catch (err) {
    // TODO: call errorHandler instead
    errorHandler(err, socket);
  }
};
