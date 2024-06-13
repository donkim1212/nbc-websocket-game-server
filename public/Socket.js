import { CLIENT_VERSION } from "./Constants.js";
import { handleResponse } from "./handlers/helper.js";

let userId = localStorage.getItem("userId");

const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
    userId: userId ? userId : "",
  },
});

socket.on("response", (data) => {
  if (data.handlerId) handleResponse(data);
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
  localStorage.setItem("userId", userId);
});

const sendEvent = (handlerId, payload) => {
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
