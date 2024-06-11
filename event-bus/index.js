import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post("http://localhost:8080/events", event); //posts service
  axios.post("http://localhost:8081/events", event); //comment service
  axios.post("http://localhost:8086/events", event); // query service

  res.send({ status: "OK" });
});

app.listen(8085, () => {
  console.log("Listening on 8085");
});
