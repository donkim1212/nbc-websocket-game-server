import { CLIENT_VERSION } from "./Constants.js";
import { handleResponse } from "./handlers/helper.js";

// const jobQueue = [];

const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on("response", (data) => {
  // pushEventData(data);
  if (data.handlerId) handleResponse(data);
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

// make a job queue?
// export this for index.js to poll data from job queue
// const pushEventData = (data) => {
//   const { status, message, ...keys } = data;
//   jobQueue.push(...keys);
// };

// const pollFromJobQueue = () => {
//   return jobQueue.shift();
// };

export { sendEvent };
