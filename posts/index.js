import express from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const posts = {};

app.use(bodyParser.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:8085/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("recieved Event", req.body.type);
  res.send("OK");
});

app.listen(8080, () => {
  console.log("Listening  on 8080");
});
