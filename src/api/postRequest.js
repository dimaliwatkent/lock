import { getRooms } from "./index.js";

const sendRequest = async () => {
  const data = await getRooms();
  console.log(data);
};

sendRequest();
