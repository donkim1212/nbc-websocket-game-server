import { v4 as uuidv4, validate, version } from "uuid";
import { addUser } from "../models/user.model.js";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
  io.on("connection", async (socket) => {
    const clientUserId = socket.handshake.query?.userId;
    const userUUID = uuidValidateV4(clientUserId) ? clientUserId : uuidv4();
    addUser({ userId: userUUID, socketId: socket.id });
    await handleConnection(socket, userUUID);
    socket.on("event", (data) => handlerEvent(io, socket, data));
    socket.on("disconnect", (socket) => handleDisconnect(socket, userUUID));
  });
};

const uuidValidateV4 = function (uuidString) {
  return validate(uuidString) && version(uuidString) === 4;
};

export default registerHandler;
