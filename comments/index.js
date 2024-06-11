import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";
import { type } from "os";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostID = {};

app.get("/posts/:id/comments", (req, res) => {
  console.log(commentsByPostID);
  res.send(commentsByPostID[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  console.log(req, req.body);
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostID[req.params.id] || [];

  comments.push({ id: commentId, content });
  commentsByPostID[req.params.id] = comments;
  console.log(commentsByPostID);

  await axios.post("http://localhost:8085/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Recieved Event", req.body.type);
  res.send("OK");
});

app.listen(8081, () => {
  console.log("Started server at post 8081");
});
