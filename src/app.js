import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
initSocket(server);

app.get("/", (req, res) => {
  return res.send("Hello, world!");
});

server.listen(PORT, async () => {
  console.log("Server is running on port: ", PORT);

  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log("Assets loaded successfully.");
  } catch (err) {
    console.log("Failed to load game assets: ", err);
  }
});
