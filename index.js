const dotenv = require("dotenv");

dotenv.config();

const discord = require("./discord.js");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 49000;

const config = require("./config.js");

const channels = config.channels;
const sounds = config.sounds;

app.use(bodyParser.json());

app.post("/hook", async (req, res) => {
  let status = false;

  if (req.body.regionId == "9") {
    let dniproStatus = await fetch("https://api.ukrainealarm.com/api/v3/alerts/332", {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.ALERT_TOKEN,
      },
    });

    if (dniproStatus.status != 200) {
      console.error(dniproStatus);
      res.status(200).end();
      return;
    }

    dniproStatus = JSON.parse(await dniproStatus.text());

    if (dniproStatus[0].activeAlerts > 0) {
      status = true;
    }

    channels.forEach((channel) => {
      discord.connectToChannel(channel, sounds, status);
    });
  }

  res.status(200).end(); // Responding is important
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
