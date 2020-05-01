const express = require("express");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(express.static("Public"));

let data = [];
let globalVersion = 0;

app.get("/chat", async (req, res) => {
  try {
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/chat", async (req, res) => {
  try {
    data = [...data, { ...req.body, date: moment().format("YYYY/MM/d hh:mm") }];
    globalVersion++;
    res.status(200).send("Sccess");
  } catch (error) {
    console.log(error);
  }
});

app.get("/sse", (req, res) => {
  // Mandatory headers and http status to keep connection open
  let currentVersion = 0;

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  };

  res.writeHead(200, headers);

  setInterval(() => {
    //check the difference betwen versions each 0.5 second
    if (currentVersion < globalVersion) {
      res.write(`data:${JSON.stringify(data)}\n\n`);
      currentVersion = globalVersion;
      if (data.length > 10) {
        data.splice(0, 5);
      }
    }
  }, 1000);
});

//Lunch the server
const port = process.env.PORT || 5000;
app.listen(port, err => {
  err ? console.error(err) : console.log(`Server is running on port ${port}`);
});
