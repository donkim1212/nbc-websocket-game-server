import { handlerMapping, targetMapping } from "./handlerMapping.js";

export const handleResponse = (data) => {
  const { handlerId, payload } = data;
  const handler = handlerMapping[handlerId];
  if (!handler) console.error(`No such handler found: ${handlerId}`);
  // const target = targetMappings[handlerId];
  // if (!target) console.error(`No handler target found: ${handlerId}`);
  handler(payload);
};
