import { getSignedUrlForKeysAsync } from "./documentService.js";
export const subscribeEvents = async (payload) => {
  const { event, data } = payload;
  // parse data
  console.log("Received data for event", event, data);

  // manage event
  switch (event) {
    case "URL_FOR_KEYS":
      /**
       * {
       *  event:,
       *  data: ['keys']
       * }
       */
      return await getSignedUrlForKeysAsync(data);
    default:
      break;
  }
};
