import { handlerMapping } from "./handlerMapping.js";

export const handleResponse = (data) => {
  const { handlerId, payload } = data;
  const handler = handlerMapping[handlerId];
  if (!handler) console.error(`No such handler found: ${handlerId}`);
  handler(payload);
};
